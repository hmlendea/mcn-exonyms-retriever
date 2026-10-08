# Data Model

## Domain entities

### WikiData Entity

**Source:** WikiData API (`/wiki/Special:EntityData/{id}.json`)

**Relevant fields:**
- `entities.{id}.claims.P1566[]` — GeoNames ID claim (property P1566)
  - `mainsnak.datavalue.value` — GeoNames ID (string)

**Usage:** Resolved to GeoNames ID for enriching Exonyms API request.

### Exonyms API Response

**Source:** Exonyms API (`/Exonyms?wikiDataId=Q...&geoNamesId=...`)

**Schema:**
```json
{
  "defaultName": "string",
  "names": {
    "<languageCode>": {
      "value": "string"
    }
  }
}
```

**Fields:**
- `defaultName` — Primary name (used for location ID generation)
- `names` — Object mapping language codes to name objects with `value` property

**Example:**
```json
{
  "defaultName": "Bucharest",
  "names": {
    "en": { "value": "Bucharest" },
    "ro": { "value": "București" },
    "hu": { "value": "Bukarest" }
  }
}
```

### GeoNames Search Response

**Source:** GeoNames API (`/searchJSON?username=...&q=Q...`)

**Schema:**
```json
{
  "totalResultsCount": { "value": "number" },
  "geonames": [
    {
      "geonameId": "number",
      "name": "string",
      "countryCode": "string",
      ...
    }
  ]
}
```

**Usage:** Fallback when WikiData has no P1566 claim. Only used when `totalResultsCount.value === 1`.

## Output XML schema

The application generates a `<LocationEntity>` XML element compatible with MCN (More Cultural Names) configuration.

### Root element

```xml
<LocationEntity>
  <Id>string</Id>
  <GeoNamesId>string</GeoNamesId>  <!-- optional -->
  <WikiDataId>string</WikiDataId>
  <GameIds>
    <!-- empty in current implementation -->
  </GameIds>
  <Names>
    <Name language="string" value="string" />
    ...
  </Names>
</LocationEntity>
```

### Element details

| Element | Required | Type | Description |
|---------|----------|------|-------------|
| `LocationEntity` | Yes | Container | Root element for one location |
| `Id` | Yes | String | MCN-compatible location identifier (generated from `defaultName`) |
| `GeoNamesId` | No | String | GeoNames identifier (only if resolved) |
| `WikiDataId` | Yes | String | Original WikiData ID from user input |
| `GameIds` | Yes | Container | Always empty in current implementation |
| `Names` | Yes | Container | Collection of `Name` elements |
| `Name` | Yes (0+) | Element | Localized name with attributes |

### `Name` element attributes

| Attribute | Required | Type | Description |
|-----------|----------|------|-------------|
| `language` | Yes | String | MCN language identifier (from `languages.js` mapping) |
| `value` | Yes | String | Exonym name in that language |

### Example output

```xml
<LocationEntity>
  <Id>bucharest</Id>
  <GeoNamesId>683506</GeoNamesId>
  <WikiDataId>Q20717572</WikiDataId>
  <GameIds>
  </GameIds>
  <Names>
    <Name language="English" value="Bucharest" />
    <Name language="Romanian" value="București" />
    <Name language="Hungarian" value="Bukarest" />
    <Name language="German" value="Bukarest" />
    <Name language="French" value="Bucarest" />
    ...
  </Names>
</LocationEntity>
```

## Location ID generation algorithm

**Function:** `transformNameToId(name)` in `exonyms-retriever.js`

**Input:** `defaultName` from Exonyms API response (e.g., "Bucharest")

**Steps:**
1. Replace `æ` → `ae`
2. Replace `ČčŠšŽž` → `ČhčhŠhšhŽhžh` (add `h` after each)
3. Replace `Ǧǧ` → `j`
4. Unicode NFD normalization + remove combining diacritics (U+0300–U+036F)
5. Lowercase
6. Replace spaces → `_`
7. Replace `'` → `-`
8. Trim leading/trailing `-`
9. Collapse multiple `-` → single `-`
10. Replace `central` → `centre`
11. Replace directional suffixes: `northern`→`north`, `western`→`west`, `southern`→`south`, `eastern`→`east`
12. Replace Latin directional: `borealis`→`north`, `occidentalis`→`west`, `australis`→`south`, `orientalis`→`east`
13. Repeat twice: move directional prefixes to suffix (e.g., `north_x` → `x_north`), same for `lower/upper/inferior/superior`, `minor/maior/lesser/greater`, `centre`

**Output:** MCN-compatible location ID (e.g., `bucharest`)

## Language mapping

**Source:** `js/languages.js` — `languages` object

**Structure:** `Map<languageCode, mcnLanguageIdentifier>`

**Size:** ~200 entries

**Language codes:** ISO 639-1/2/3 codes, some with region subtags (e.g., `zh-hans`, `pt-br`, `sr-el`)

**MCN identifiers:** Human-readable names with underscores (e.g., `English`, `Romanian`, `Portuguese_Brazilian`)

### Special variant handling

`getNameLines()` explicitly handles 10 variant pairs where multiple language codes map to related MCN identifiers:

| Variant 1 (code → MCN) | Variant 2 (code → MCN) | Logic |
|------------------------|------------------------|-------|
| `be-tarask` → `Belarussian_Before1933` | `be` → `Belarussian` | Include both if names differ |
| `bs` → `Bosnian` | `sh` → `SerboCroatian` | Include both if names differ |
| `zh-hans` → `Chinese` | `zh` → `Chinese` | Include both if names differ |
| `hr` → `Croatian` | `sh` → `SerboCroatian` | Include both if names differ |
| `ku` → `Kurdish` | `ckd` → `Kurdish` | Include both if names differ |
| `nn` → `Norwegian_Nynorsk` | `nb` → `Norwegian` | Include both if names differ |
| `pt-br` → `Portuguese_Brazilian` | `pt` → `Portuguese` | Include both if names differ |
| `sr-el` → `Serbian` | `sh` → `SerboCroatian` | Include both if names differ |
| `sr` → `Serbian` | `sh` → `SerboCroatian` | Include both if names differ |

**Deduplication:** After generating all name lines, the array is sorted alphabetically, then filtered for non-empty, non-whitespace lines.

## Data flow summary

```
User Input (WikiData ID: "Q20717572")
         │
         ▼
getGeoNamesId()
         │
         ├── WikiData API ──► P1566 claim ──► GeoNames ID ("683506")
         │
         └── GeoNames API (fallback) ──► searchJSON ──► GeoNames ID
         │
         ▼
Exonyms API (wikiDataId + geoNamesId)
         │
         ▼
Exonyms Response
         │
         ├── defaultName ──► transformNameToId() ──► "bucharest"
         │
         └── names[langCode] ──► getNameLines() ──► [<Name> elements]
         │
         ▼
XML Assembly ──► <LocationEntity>
         │
         ▼
DOM (#location textarea)
```

## Invariants

1. **WikiData ID format** — Input should match `^Q\d+$` (not validated)
2. **GeoNames ID** — Numeric string when present
3. **Location ID** — Lowercase, underscores, hyphens only (per `transformNameToId`)
4. **Name elements** — At least one `<Name>` element generated (defaultName always exists)
5. **XML well-formedness** — No escaping; assumes exonym names contain no `&`, `<`, `>`, `"`
6. **Language coverage** — All 200+ language codes attempted; only those with names in response produce output