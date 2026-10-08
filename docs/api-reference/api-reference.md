# API Reference

## Overview

This is a static browser application with no traditional REST API or controllers. The "API" consists of global functions and objects exposed on `window` after script load.

## Global Objects

### `languages`

**Source:** `js/languages.js`

**Type:** `Record<string, string>`

**Description:** Maps BCP 47 language codes to MCN language identifiers.

**Example:**
```javascript
languages["en"]    // "English"
languages["ro"]    // "Romanian"
languages["zh-hans"] // "Chinese"
languages["be-tarask"] // "Belarussian_Before1933"
```

**Entry count:** ~200

---

### `exonymsApiBaseUrl`

**Source:** `js/exonyms-retriever.js`

**Type:** `string`

**Value:** `"https://hmlendea.go.ro/apis/exonyms-api"`

**Description:** Base URL for the Exonyms API.

---

### `wikiDataBaseUrl`

**Source:** `js/exonyms-retriever.js`

**Type:** `string`

**Value:** `"https://www.wikidata.org"`

**Description:** Base URL for the WikiData API.

---

### `geoNamesBaseUrl`

**Source:** `js/exonyms-retriever.js`

**Type:** `string`

**Value:** `"http://api.geonames.org"`

**Description:** Base URL for the GeoNames API. **Note: HTTP, not HTTPS.**

---

### `geoNamesUsername`

**Source:** `js/exonyms-retriever.js`

**Type:** `string`

**Value:** `"geonamesfreeaccountt"`

**Description:** Demo account username for GeoNames API.

---

## Global Functions

### `clearPage()`

**Source:** `js/exonyms-retriever.js`

**Signature:** `() => void`

**Description:** Resets the UI to initial state.

**Behaviour:**
- Sets `#wikiDataId` value to `"Q20717572"`
- Sets `#location` value to `""`

**Called by:**
- `$(document).ready()` on page load
- Clear button `onclick`

**Side effects:** DOM mutations

---

### `retrieveExonyms()`

**Source:** `js/exonyms-retriever.js`

**Signature:** `() => void`

**Description:** Main entry point. Orchestrates the full exonym retrieval flow.

**Behaviour:**
1. Reads WikiData ID from `#wikiDataId`
2. Calls `getGeoNamesId()` to resolve GeoNames ID
3. Calls Exonyms API with WikiData ID (and GeoNames ID if resolved)
4. Generates location ID via `transformNameToId()`
5. Builds XML output via `getNameLines()`
6. Sets `#location` textarea value

**Side effects:**
- 2-3 synchronous XHR requests
- DOM mutation (textarea)
- Console logs

**Errors:** Uncaught exceptions propagate to console

---

### `copyLocation()`

**Source:** `js/exonyms-retriever.js`

**Signature:** `() => void`

**Description:** Copies textarea content to clipboard with prepended newline.

**Behaviour:**
1. Creates temporary `<textarea>`
2. Sets value to `'\n' + $('#location').val()`
3. Appends to body, selects, calls `document.execCommand('copy')`
4. Removes temporary element

**Side effects:**
- DOM mutation (temporary element)
- Clipboard write

**Errors:** Silent (no feedback)

**Note:** Uses deprecated `execCommand('copy')`

---

### `getGeoNamesId(wikiDataId)`

**Source:** `js/exonyms-retriever.js`

**Signature:** `(wikiDataId: string) => string | null`

**Parameters:**
- `wikiDataId` — WikiData entity ID (e.g., `"Q20717572"`)

**Returns:** GeoNames ID as string, or `null` if not found

**Behaviour:**
1. Queries WikiData API for entity data
2. Checks for exactly one P1566 (GeoNames ID) claim
3. If found, returns it
4. Otherwise, falls back to GeoNames search API
5. If exactly one search result, returns its `geonameId`
6. Otherwise returns `null`

**Errors:** Caught internally, logged to console, returns `null`

---

### `transformNameToId(name)`

**Source:** `js/exonyms-retriever.js`

**Signature:** `(name: string) => string`

**Parameters:**
- `name` — Place name (e.g., `"Bucharest"`)

**Returns:** MCN-compatible location ID (e.g., `"bucharest"`)

**Algorithm (20+ steps):**
1. `æ` → `ae`
2. `ČčŠšŽž` → add `h` after each
3. `Ǧǧ` → `j`
4. NFD normalize + strip diacritics (U+0300–U+036F)
5. Lowercase
6. Space → `_`
7. `'` → `-`
8. Trim leading/trailing `-`
9. Collapse multiple `-` → single `-`
10. `central` → `centre`
11. Directional suffixes: `northern`→`north`, `western`→`west`, `southern`→`south`, `eastern`→`east`
12. Latin directionals: `borealis`→`north`, `occidentalis`→`west`, `australis`→`south`, `orientalis`→`east`
13. Repeat twice: move directional prefixes to suffix

**Pure function:** No side effects

---

### `getName(exonymsApiResponse, languageCode)`

**Source:** `js/exonyms-retriever.js`

**Signature:** `(response: object, languageCode: string) => string | null`

**Parameters:**
- `exonymsApiResponse` — Response from Exonyms API
- `languageCode` — BCP 47 code (e.g., `"ro"`)

**Returns:** Exonym name string, or `null` if not present

**Behaviour:** Returns `response.names[languageCode].value` if exists

**Pure function:** No side effects

---

### `getNameLine(exonymsApiResponse, languageMcnId, languageCode)`

**Source:** `js/exonyms-retriever.js`

**Signature:** `(response: object, languageMcnId: string, languageCode: string) => string | null`

**Parameters:**
- `exonymsApiResponse` — Response from Exonyms API
- `languageMcnId` — MCN language identifier (e.g., `"Romanian"`)
- `languageCode` — BCP 47 code (e.g., `"ro"`)

**Returns:** XML string for one `<Name>` element, or `null`

**Output format:**
```xml
      <Name language="Romanian" value="București" />
```

**Indentation:** 6 spaces

**Pure function:** No side effects

**Note:** No XML escaping

---

### `getNameLine2variants(exonymsApiResponse, mcnId1, code1, mcnId2, code2)`

**Source:** `js/exonyms-retriever.js`

**Signature:** `(response: object, mcnId1: string, code1: string, mcnId2: string, code2: string) => string`

**Parameters:**
- `exonymsApiResponse` — Response from Exonyms API
- `mcnId1` — MCN identifier for first variant
- `code1` — BCP 47 code for first variant
- `mcnId2` — MCN identifier for second variant
- `code2` — BCP 47 code for second variant

**Returns:** XML string for one or two `<Name>` elements joined by newline

**Logic:**
- Gets name for both codes
- Includes name1 with mcnId1 only if different from name2
- Always includes name2 with mcnId2 if present
- Joins with newline if both present

**Pure function:** No side effects

---

### `getNameLines(exonymsApiResponse)`

**Source:** `js/exonyms-retriever.js`

**Signature:** `(response: object) => string`

**Parameters:**
- `exonymsApiResponse` — Response from Exonyms API

**Returns:** All `<Name>` elements joined by newlines

**Behaviour:**
1. Iterates all keys in `languages` object
2. Calls `getNameLine()` for each
3. Adds 9 explicit variant pairs via `getNameLine2variants()`
4. Sorts all lines alphabetically
5. Filters: non-null, defined, non-whitespace, length > 3
6. Joins with newlines

**Variant pairs:**
| MCN ID 1 | Code 1 | MCN ID 2 | Code 2 |
|----------|--------|----------|--------|
| `Belarussian_Before1933` | `be-tarask` | `Belarussian` | `be` |
| `Bosnian` | `bs` | `SerboCroatian` | `sh` |
| `Chinese` | `zh-hans` | `Chinese` | `zh` |
| `Croatian` | `hr` | `SerboCroatian` | `sh` |
| `Kurdish` | `ku` | `Kurdish` | `ckd` |
| `Norwegian_Nynorsk` | `nn` | `Norwegian` | `nb` |
| `Portuguese_Brazilian` | `pt-br` | `Portuguese` | `pt` |
| `Serbian` | `sr-el` | `SerboCroatian` | `sh` |
| `Serbian` | `sr` | `SerboCroatian` | `sh` |

**Pure function:** No side effects (reads global `languages`)

---

### `fetchData(url)`

**Source:** `js/exonyms-retriever.js`

**Signature:** `(url: string) => object`

**Parameters:**
- `url` — Full URL to fetch

**Returns:** Parsed JSON response object

**Behaviour:**
1. Logs URL to console
2. Creates synchronous `XMLHttpRequest` (`async: false`)
3. Sends GET request
4. On status 200: returns `JSON.parse(responseText)`
5. On other status: throws `Error`

**Side effects:**
- Network request (blocking)
- Console log

**Errors:** Throws on non-200 or invalid JSON

---

### `isSingleElementArray(obj, prop)`

**Source:** `js/exonyms-retriever.js`

**Signature:** `(obj: object, prop: string) => boolean`

**Parameters:**
- `obj` — Object to check
- `prop` — Property name

**Returns:** `true` if property exists, is array, and has exactly one element

**Pure function:** No side effects

---

## DOM Elements (by ID)

| ID | Type | Purpose |
|----|------|---------|
| `wikiDataId` | `<input type="text">` | WikiData ID input |
| `location` | `<textarea>` | XML output |

---

## Event Handlers (inline)

| Element | Event | Handler |
|---------|-------|---------|
| Retrieve button | `onclick` | `retrieveExonyms()` |
| Clear button | `onclick` | `clearPage()` |
| Copy button | `onclick` | `copyLocation()` |

---

## External API Contracts

### Exonyms API

**Endpoint:** `GET {exonymsApiBaseUrl}/Exonyms?wikiDataId={id}[&geoNamesId={id}]`

**Response:**
```json
{
  "defaultName": "string",
  "names": {
    "languageCode": { "value": "string" }
  }
}
```

### WikiData API

**Endpoint:** `GET {wikiDataBaseUrl}/wiki/Special:EntityData/{wikiDataId}.json`

**Response (relevant part):**
```json
{
  "entities": {
    "Q20717572": {
      "claims": {
        "P1566": [
          {
            "mainsnak": {
              "datavalue": { "value": "683506" }
            }
          }
        ]
      }
    }
  }
}
```

### GeoNames API

**Endpoint:** `GET {geoNamesBaseUrl}/searchJSON?username={username}&q={wikiDataId}`

**Response:**
```json
{
  "totalResultsCount": 1,
  "geonames": [
    { "geonameId": 683506, "name": "Bucharest", ... }
  ]
}
```

---

## Output Format

### MCN Location XML

```xml
  <LocationEntity>
    <Id>location_id</Id>
    <GeoNamesId>123456</GeoNamesId>  <!-- optional -->
    <WikiDataId>Q20717572</WikiDataId>
    <GameIds>
    </GameIds>
    <Names>
      <Name language="English" value="Name" />
      <!-- ... -->
    </Names>
  </LocationEntity>
```

**Indentation:** 2 spaces per level
**No XML declaration**
**No escaping** of special characters in values