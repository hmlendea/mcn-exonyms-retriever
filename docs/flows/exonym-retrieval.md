# Exonym Retrieval Flow

## Entry point

```javascript
function retrieveExonyms() {
    // Called by: onclick="retrieveExonyms()" on "Retrieve Exonyms" button
}
```

## Complete flow diagram

```
retrieveExonyms()
    │
    ├─► Read input
    │       └─► wikiDataId = $('#wikiDataId').val()
    │
    ├─► Build Exonyms API URL
    │       └─► exonymsApiEndpoint = exonymsApiBaseUrl + "/Exonyms?wikiDataId=" + wikiDataId
    │
    ├─► Resolve GeoNames ID
    │       └─► geoNamesId = getGeoNamesId(wikiDataId)
    │               │
    │               ├─► WikiData API call
    │               │       └─► GET wikiDataBaseUrl + '/wiki/Special:EntityData/' + wikiDataId + '.json'
    │               │       └─► Parse JSON
    │               │       └─► claims = response.entities[wikiDataId].claims
    │               │       └─► if isSingleElementArray(claims, 'P1566'):
    │               │               └─► return claims['P1566'][0].mainsnak.datavalue.value
    │               │
    │               └─► Fallback: GeoNames API call
    │                       └─► GET geoNamesBaseUrl + '/searchJSON?username=' + geoNamesUsername + '&q=' + wikiDataId
    │                       └─► Parse JSON
    │                       └─► if response.totalResultsCount === 1:
    │                               └─► return response.geonames[0].geonameId
    │                       └─► else: return null
    │
    ├─► Append GeoNames ID to Exonyms URL (if resolved)
    │       └─► if (geoNamesId !== null): exonymsApiEndpoint += '&geoNamesId=' + geoNamesId
    │
    ├─► Call Exonyms API
    │       └─► exonymsApiResponse = fetchData(exonymsApiEndpoint)
    │               └─► Synchronous XHR GET
    │               └─► Throw on non-200
    │               └─► Return JSON.parse(responseText)
    │
    ├─► Extract default name
    │       └─► mainDefaultName = exonymsApiResponse.defaultName
    │
    ├─► Generate location ID
    │       └─► locationId = transformNameToId(mainDefaultName)
    │
    ├─► Build XML header
    │       └─► location = "  <LocationEntity>\n" +
    │                       "    <Id>" + locationId + "</Id>\n" +
    │                       (geoNamesId ? "    <GeoNamesId>" + geoNamesId + "</GeoNamesId>\n" : "") +
    │                       "    <WikiDataId>" + wikiDataId + "</WikiDataId>\n" +
    │                       "    <GameIds>\n    </GameIds>\n" +
    │                       "    <Names>\n"
    │
    ├─► Generate name lines
    │       └─► location += getNameLines(exonymsApiResponse)
    │               │
    │               ├─► For each languageCode in languages object:
    │               │       └─► getNameLine(response, languages[languageCode], languageCode)
    │               │               └─► name = getName(response, languageCode)
    │               │               └─► if name: return '      <Name language="..." value="..." />'
    │               │
    │               ├─► Add 9 explicit variant pairs:
    │               │       └─► getNameLine2variants(response, mcnId1, code1, mcnId2, code2)
    │               │
    │               ├─► Sort all lines alphabetically
    │               │
    │               └─► Filter: non-null, defined, non-whitespace, length > 3
    │
    ├─► Close XML
    │       └─► location += "    </Names>\n  </LocationEntity>"
    │
    └─► Set output
            └─► $('#location').val(location)
```

## Detailed step analysis

### Step 1: Read input

```javascript
let wikiDataId = $("#wikiDataId").val();
```

- No validation
- No trimming
- No format checking (should be `Q` + digits)
- Direct use in URL construction

### Step 2: Build base Exonyms API URL

```javascript
let exonymsApiEndpoint = exonymsApiBaseUrl + "/Exonyms?wikiDataId=" + $("#wikiDataId").val();
```

- `exonymsApiBaseUrl` = `'https://hmlendea.go.ro/apis/exonyms-api'`
- WikiData ID interpolated directly (no encoding)

### Step 3: Resolve GeoNames ID

```javascript
let geoNamesId = getGeoNamesId(wikiDataId);
```

**Sub-flow: WikiData lookup**

```javascript
var wikiDataEndpoint = wikiDataBaseUrl + '/wiki/Special:EntityData/' + wikiDataId + '.json';
var wikiDataResponse = fetchData(wikiDataEndpoint);
var claims = wikiDataResponse.entities[wikiDataId].claims;

if (isSingleElementArray(claims, 'P1566')) {
    var geoNamesId = claims['P1566'][0].mainsnak.datavalue.value;
    return geoNamesId;
}
```

- `wikiDataBaseUrl` = `'https://www.wikidata.org'`
- Synchronous XHR
- Expects exact structure: `entities[wikiDataId].claims.P1566[0].mainsnak.datavalue.value`
- Requires exactly one P1566 claim

**Sub-flow: GeoNames fallback**

```javascript
var geoNamesEndpoint = geoNamesBaseUrl + '/searchJSON?username=' + geoNamesUsername + '&q=' + wikiDataId;
var geoNamesResponse = fetchData(geoNamesEndpoint);

if (geoNamesResponse.totalResultsCount.value === 1) {
    var geoNamesId = geoNamesResponse.geonames[0].geonameId;
    return geoNamesId;
}
```

- `geoNamesBaseUrl` = `'http://api.geonames.org'` (HTTP!)
- `geoNamesUsername` = `'geonamesfreeaccountt'`
- Search query = WikiData ID (not a place name)
- Requires exactly one result

### Step 4: Append GeoNames ID

```javascript
if (geoNamesId !== null) {
    exonymsApiEndpoint = exonymsApiEndpoint + '&geoNamesId=' + geoNamesId;
}
```

### Step 5: Call Exonyms API

```javascript
let exonymsApiResponse = fetchData(exonymsApiEndpoint);
```

- Synchronous XHR
- Full URL includes both WikiData ID and optional GeoNames ID
- Throws on non-200 (uncaught)

### Step 6: Extract default name

```javascript
let mainDefaultName = exonymsApiResponse.defaultName;
```

- Assumes property exists
- Used for location ID generation

### Step 7: Generate location ID

```javascript
let locationId = transformNameToId(mainDefaultName);
```

**Transform algorithm (20+ steps):**

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

### Step 8: Build XML header

```javascript
let location =
    "  <LocationEntity>\n" +
    "    <Id>" + locationId + "</Id>\n";
if (geoNamesId !== null) {
    location += "    <GeoNamesId>" + geoNamesId + "</GeoNamesId>\n";
}
location +=
    "    <WikiDataId>" + wikiDataId + "</WikiDataId>\n" +
    "    <GameIds>\n" +
    "    </GameIds>\n" +
    "    <Names>\n";
```

- 2-space indentation for root elements
- 4-space indentation for children
- Empty `<GameIds>` element (always present, always empty)

### Step 9: Generate name lines

```javascript
location += getNameLines(exonymsApiResponse);
```

**getNameLines() sub-flow:**

```javascript
let nameLinesArray = [];

// Main loop: all ~200 languages
for (var languageCode in languages) {
    nameLinesArray.push(getNameLine(exonymsApiResponse, languages[languageCode], languageCode));
}

// Explicit variant pairs (9 pairs)
nameLinesArray.push(getNameLine2variants(exonymsApiResponse, "Belarussian_Before1933", "be-tarask", "Belarussian", "be"));
nameLinesArray.push(getNameLine2variants(exonymsApiResponse, "Bosnian", "bs", "SerboCroatian", "sh"));
nameLinesArray.push(getNameLine2variants(exonymsApiResponse, "Chinese", "zh-hans", "Chinese", "zh"));
nameLinesArray.push(getNameLine2variants(exonymsApiResponse, "Croatian", "hr", "SerboCroatian", "sh"));
nameLinesArray.push(getNameLine2variants(exonymsApiResponse, "Kurdish", "ku", "Kurdish", "ckd"));
nameLinesArray.push(getNameLine2variants(exonymsApiResponse, "Norwegian_Nynorsk", "nn", "Norwegian", "nb"));
nameLinesArray.push(getNameLine2variants(exonymsApiResponse, "Portuguese_Brazilian", "pt-br", "Portuguese", "pt"));
nameLinesArray.push(getNameLine2variants(exonymsApiResponse, "Serbian", "sr-el", "SerboCroatian", "sh"));
nameLinesArray.push(getNameLine2variants(exonymsApiResponse, "Serbian", "sr", "SerboCroatian", "sh"));

// Sort alphabetically
nameLinesArray.sort();

// Filter and join
for (let i = 0; i < nameLinesArray.length; i++) {
    let nameLine = nameLinesArray[i];
    if (nameLine !== null && typeof nameLine !== 'undefined' && !/^\s*$/.test(nameLine) && nameLine.length > 3) {
        nameLines += nameLine + "\n";
    }
}
```

**getNameLine():**

```javascript
function getNameLine(exonymsApiResponse, languageMcnId, languageCode) {
    var name = getName(exonymsApiResponse, languageCode);
    if (name === null) {
        return null;
    }
    return "      <Name language=\"" + languageMcnId + "\" value=\"" + name + "\" />"
}
```

- 6-space indentation
- No XML escaping

**getNameLine2variants():**

```javascript
function getNameLine2variants(exonymsApiResponse, languageMcnId1, languageCode1, languageMcnId2, languageCode2) {
    var name1 = getName(exonymsApiResponse, languageCode1);
    var name2 = getName(exonymsApiResponse, languageCode2);
    var nameLine = "";

    if (name1 !== null && name1 !== name2) {
        nameLine += "      <Name language=\"" + languageMcnId1 + "\" value=\"" + name1 + "\" />";
    }
    if (name2 !== null) {
        if (nameLine !== "") {
            nameLine += "\n";
        }
        nameLine += "      <Name language=\"" + languageMcnId2 + "\" value=\"" + name2 + "\" />";
    }
    return nameLine;
}
```

- Includes name1 only if different from name2
- Always includes name2 if present
- Joins with newline

### Step 10: Close XML

```javascript
location +=
    "    </Names>\n" +
    "  </LocationEntity>"
```

### Step 11: Set output

```javascript
$("#location").val(location);
```

## Timing breakdown

| Step | API calls | Approximate time |
|------|-----------|------------------|
| Read input | 0 | <1ms |
| Build URL | 0 | <1ms |
| WikiData API | 1 sync XHR | 100-500ms |
| GeoNames API (fallback) | 0-1 sync XHR | 100-500ms |
| Exonyms API | 1 sync XHR | 200-1000ms |
| Transform name | 0 | <1ms |
| Build XML | 0 | <1ms |
| Generate names | 0 | 1-5ms |
| Set output | 0 | <1ms |
| **Total** | **2-3 sync XHR** | **400-2000ms** |

## Error propagation

```
fetchData() throws
    │
    ├─► In getGeoNamesId(): caught → return null
    │
    └─► In retrieveExonyms(): UNCAUGHT
            │
            ├─► Browser console shows error
            ├─► UI frozen (sync XHR)
            └─► No user feedback
```

## Success criteria

| Condition | Result |
|-----------|--------|
| All 2-3 XHR succeed | XML output in textarea |
| WikiData has P1566 | GeoNamesId included in XML |
| WikiData no P1566, GeoNames 1 result | GeoNamesId included in XML |
| WikiData no P1566, GeoNames 0 or >1 results | No GeoNamesId in XML |
| Exonyms API returns names | Names appear in XML (filtered) |
| Exonyms API returns empty names | Only header in XML |

## Output example

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
      <Name language="French" value="Bucarest" />
      <Name language="German" value="Bukarest" />
      <Name language="Hungarian" value="Bukarest" />
      <Name language="Turkish" value="Bükreş" />
      <!-- ... ~100 more lines ... -->
    </Names>
  </LocationEntity>
```

## Concurrency

- **No concurrency** — all operations synchronous
- **Single-threaded** — blocks main thread entirely
- **No cancellation** — cannot abort once started
- **No progress** — no intermediate updates

## Retry logic

**None.** Failed requests are not retried.

## Idempotency

- `retrieveExonyms()` is idempotent for same input (read-only APIs)
- `getGeoNamesId()` is idempotent
- `transformNameToId()` is pure
- `getNameLines()` is pure (given same response and languages)

## Side effects

| Operation | Side effect |
|-----------|-------------|
| WikiData API call | Network request |
| GeoNames API call | Network request |
| Exonyms API call | Network request |
| `console.log` in fetchData | Console output |
| `console.log` in getGeoNamesId | Console output |
| `$('#location').val()` | DOM mutation |

## Testing scenarios

| Scenario | Expected |
|----------|----------|
| Valid WikiData ID with P1566 | GeoNamesId in output |
| Valid WikiData ID without P1566, GeoNames 1 result | GeoNamesId in output |
| Valid WikiData ID without P1566, GeoNames 0 results | No GeoNamesId |
| Valid WikiData ID without P1566, GeoNames >1 results | No GeoNamesId |
| Invalid WikiData ID | Error (uncaught) |
| Exonyms API error | Error (uncaught) |
| Network offline | Error (uncaught) |
| Empty input | Error (invalid URL) |
| Special chars in input | URL encoding issues |