# Application Services

## File

`js/exonyms-retriever.js`

## Responsibility

Core application logic: API orchestration, data transformation, XML generation, and UI interaction.

## Exported API (global functions)

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `clearPage()` | — | `void` | Reset input to default WikiData ID, clear output |
| `retrieveExonyms()` | — | `void` | Main entry point: orchestrate full retrieval flow |
| `copyLocation()` | — | `void` | Copy textarea content to clipboard |
| `getGeoNamesId(wikiDataId)` | `string` | `string \| null` | Resolve WikiData ID → GeoNames ID |
| `transformNameToId(name)` | `string` | `string` | Convert default name to MCN-compatible location ID |
| `getName(response, languageCode)` | `object, string` | `string \| null` | Extract exonym name for language code |
| `getNameLine(response, mcnId, languageCode)` | `object, string, string` | `string \| null` | Generate single `<Name>` XML element |
| `getNameLine2variants(response, mcnId1, code1, mcnId2, code2)` | `object, string, string, string, string` | `string` | Generate XML for language variant pair |
| `getNameLines(response)` | `object` | `string` | Generate all `<Name>` elements for all languages |
| `fetchData(url)` | `string` | `object` | Synchronous XHR GET; throws on non-200 |
| `isSingleElementArray(obj, prop)` | `object, string` | `boolean` | Utility: check if property is single-element array |

## Internal constants

| Constant | Value | Description |
|----------|-------|-------------|
| `exonymsApiBaseUrl` | `'https://hmlendea.go.ro/apis/exonyms-api'` | Exonyms API base |
| `wikiDataBaseUrl` | `'https://www.wikidata.org'` | WikiData API base |
| `geoNamesBaseUrl` | `'http://api.geonames.org'` | GeoNames API base |
| `geoNamesUsername` | `'geonamesfreeaccountt'` | GeoNames demo account |

## Function details

### `clearPage()`

```javascript
function clearPage() {
    $('#wikiDataId').val('Q20717572');
    $('#location').val('');
}
```

- Called on `$(document).ready()`
- Called by Clear button
- Sets default WikiData ID (Minecraft-related location)
- Clears output textarea

### `retrieveExonyms()` — Main orchestration

```javascript
function retrieveExonyms() {
    let wikiDataId = $("#wikiDataId").val();
    let exonymsApiEndpoint = exonymsApiBaseUrl + "/Exonyms?wikiDataId=" + $("#wikiDataId").val();

    let geoNamesId = getGeoNamesId(wikiDataId);

    if (geoNamesId !== null) {
        exonymsApiEndpoint = exonymsApiEndpoint + '&geoNamesId=' + geoNamesId;
    }

    let exonymsApiResponse = fetchData(exonymsApiEndpoint);
    let mainDefaultName = exonymsApiResponse.defaultName;
    let locationId = transformNameToId(mainDefaultName);

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
    location += getNameLines(exonymsApiResponse);
    location +=
        "    </Names>\n" +
        "  </LocationEntity>"

    $("#location").val(location);
}
```

**Flow:**
1. Read WikiData ID from input
2. Build Exonyms API URL
3. Call `getGeoNamesId()` to resolve GeoNames ID
4. Append GeoNames ID to API URL if resolved
5. Call `fetchData()` for Exonyms API (synchronous XHR)
6. Extract `defaultName` from response
7. Generate `locationId` via `transformNameToId()`
8. Assemble XML header with Id, optional GeoNamesId, WikiDataId, empty GameIds
9. Generate name lines via `getNameLines()`
10. Close XML and set textarea value

**Error handling:** None — `fetchData()` throws on non-200, propagates to console.

### `getGeoNamesId(wikiDataId)`

```javascript
function getGeoNamesId(wikiDataId) {
    try {
        var wikiDataEndpoint = wikiDataBaseUrl + '/wiki/Special:EntityData/' + wikiDataId + '.json';
        var wikiDataResponse = fetchData(wikiDataEndpoint);
        var claims = wikiDataResponse.entities[wikiDataId].claims;

        if (isSingleElementArray(claims, 'P1566')) {
            var geoNamesId = claims['P1566'][0].mainsnak.datavalue.value;
            console.log('Found GeoNames ID by searching on WikiData: ' + geoNamesId);
            return geoNamesId;
        } else {
            var geoNamesEndpoint = geoNamesBaseUrl + '/searchJSON?username=' + geoNamesUsername + '&q=' + wikiDataId;
            var geoNamesResponse = fetchData(geoNamesEndpoint);

            if (geoNamesResponse.totalResultsCount.value === 1) {
                var geoNamesId = geoNamesResponse.geonames[0].geonameId;
                console.log('Found GeoNames ID by searching on GeoNames: ' + geoNamesId);
                return geoNamesId;
            }
        }

        return null;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}
```

**Strategy:**
1. Query WikiData for entity data
2. Check for P1566 (GeoNames ID) claim with exactly one value
3. If found, return it
4. Otherwise, fallback to GeoNames search API
5. If exactly one search result, return its `geonameId`
6. Otherwise return `null`

**Error handling:** Catches all errors, logs to console, returns `null`.

### `transformNameToId(name)`

Converts a place name to an MCN-compatible location ID.

**Algorithm (20+ transformation steps):**
1. `æ` → `ae`
2. `ČčŠšŽž` → add `h` after each (`ČhčhŠhšhŽhžh`)
3. `Ǧǧ` → `j`
4. NFD normalization + strip combining diacritics (U+0300–U+036F)
5. Lowercase
6. Space → `_`
7. `'` → `-`
8. Trim leading/trailing `-`
9. Collapse multiple `-` → single `-`
10. `central` → `centre`
11. Directional suffixes: `northern`→`north`, `western`→`west`, `southern`→`south`, `eastern`→`east`
12. Latin directionals: `borealis`→`north`, `occidentalis`→`west`, `australis`→`south`, `orientalis`→`east`
13. Repeat twice: move directional prefixes to suffix (`north_x` → `x_north`), same for `lower/upper/inferior/superior`, `minor/maior/lesser/greater`, `centre`

**Example:** `"Bucharest"` → `"bucharest"`

### `getName(response, languageCode)`

```javascript
function getName(exonymsApiResponse, languageCode) {
    if (exonymsApiResponse.names.hasOwnProperty(languageCode)) {
        return exonymsApiResponse.names[languageCode].value;
    }
    return null;
}
```

Simple property lookup in `response.names`.

### `getNameLine(response, mcnId, languageCode)`

```javascript
function getNameLine(exonymsApiResponse, languageMcnId, languageCode) {
    var name = getName(exonymsApiResponse, languageCode);
    if (name === null) {
        return null;
    }
    return "      <Name language=\"" + languageMcnId + "\" value=\"" + name + "\" />"
}
```

Generates a single `<Name>` XML element with proper indentation (6 spaces).

### `getNameLine2variants(response, mcnId1, code1, mcnId2, code2)`

Handles language variant pairs where two codes may map to related MCN identifiers.

**Logic:**
- Get name for both codes
- If name1 exists and differs from name2, include name1 with mcnId1
- If name2 exists, include name2 with mcnId2 (always, even if same as name1)
- Join with newline if both present

### `getNameLines(response)`

```javascript
function getNameLines(exonymsApiResponse) {
    let nameLinesArray = [];
    let nameLines = "";

    // 1. Generate line for every language in languages object
    for (var languageCode in languages) {
        nameLinesArray.push(getNameLine(exonymsApiResponse, languages[languageCode], languageCode));
    }

    // 2. Add explicit variant pairs (10 pairs)
    nameLinesArray.push(getNameLine2variants(exonymsApiResponse, "Belarussian_Before1933", "be-tarask", "Belarussian", "be"));
    nameLinesArray.push(getNameLine2variants(exonymsApiResponse, "Bosnian", "bs", "SerboCroatian", "sh"));
    nameLinesArray.push(getNameLine2variants(exonymsApiResponse, "Chinese", "zh-hans", "Chinese", "zh"));
    nameLinesArray.push(getNameLine2variants(exonymsApiResponse, "Croatian", "hr", "SerboCroatian", "sh"));
    nameLinesArray.push(getNameLine2variants(exonymsApiResponse, "Kurdish", "ku", "Kurdish", "ckd"));
    nameLinesArray.push(getNameLine2variants(exonymsApiResponse, "Norwegian_Nynorsk", "nn", "Norwegian", "nb"));
    nameLinesArray.push(getNameLine2variants(exonymsApiResponse, "Portuguese_Brazilian", "pt-br", "Portuguese", "pt"));
    nameLinesArray.push(getNameLine2variants(exonymsApiResponse, "Serbian", "sr-el", "SerboCroatian", "sh"));
    nameLinesArray.push(getNameLine2variants(exonymsApiResponse, "Serbian", "sr", "SerboCroatian", "sh"));

    // 3. Sort alphabetically
    nameLinesArray.sort();

    // 4. Filter and join
    for (let i = 0; i < nameLinesArray.length; i++) {
        let nameLine = nameLinesArray[i];
        if (nameLine !== null && typeof nameLine !== 'undefined' && !/^\s*$/.test(nameLine) && nameLine.length > 3) {
            nameLines += nameLine + "\n";
        }
    }

    return nameLines;
}
```

**Key behaviours:**
- Iterates all ~200 language codes from `languages.js`
- Adds 10 explicit variant pairs (some duplicate codes from main loop)
- Sorts all lines alphabetically by MCN identifier
- Filters: non-null, defined, non-whitespace, length > 3

### `fetchData(url)`

```javascript
function fetchData(url) {
    console.log('Fetching ' + url + ' ...');
    const request = new XMLHttpRequest();
    request.open('GET', url, false);  // SYNCHRONOUS
    request.send();

    if (request.status === 200) {
        return JSON.parse(request.responseText);
    } else {
        throw new Error(`Request failed with status ${request.status}`);
    }
}
```

- **Synchronous XHR** (`async: false`) — blocks main thread
- Logs URL to console
- Throws on non-200 status
- Returns parsed JSON on success

### `isSingleElementArray(obj, prop)`

```javascript
function isSingleElementArray(jsonObject, propertyName) {
    if (jsonObject.hasOwnProperty(propertyName) && Array.isArray(jsonObject[propertyName])) {
        return jsonObject[propertyName].length === 1;
    } else {
        return false;
    }
}
```

Utility to check if an object property exists, is an array, and has exactly one element.

### `copyLocation()`

```javascript
function copyLocation() {
    const clipboardContent = '\n' + $('#location').val();

    const tempTextarea = $('<textarea>');
    tempTextarea.val(clipboardContent);

    $('body').append(tempTextarea);
    tempTextarea.select();
    document.execCommand('copy');

    tempTextarea.remove();
}
```

- Prepends newline to clipboard content
- Creates temporary textarea, sets value, appends to body
- Selects content, calls deprecated `document.execCommand('copy')`
- Removes temporary element

## Dependencies

| Dependency | Access pattern |
|------------|----------------|
| `languages` (global) | `languages[languageCode]` in `getNameLines()` |
| jQuery (`$`) | `$('#wikiDataId')`, `$('#location')`, `$('<textarea>')`, `$.ready()` |
| `XMLHttpRequest` | `fetchData()` |
| `console` | Logging in `fetchData()`, `getGeoNamesId()` |
| `document.execCommand` | `copyLocation()` |
| `normalize()` / `replace()` | `transformNameToId()` |

## Side effects

| Function | Side effects |
|----------|--------------|
| `clearPage()` | DOM mutation (input, textarea values) |
| `retrieveExonyms()` | Network requests (3 sync XHR), DOM mutation (textarea), console logs |
| `getGeoNamesId()` | Network requests (1-2 sync XHR), console logs |
| `fetchData()` | Network request (sync XHR), console log |
| `copyLocation()` | DOM mutation (temp element), clipboard write |
| `transformNameToId()` | None (pure) |
| `getName()` | None (pure) |
| `getNameLine()` | None (pure) |
| `getNameLine2variants()` | None (pure) |
| `getNameLines()` | None (pure, but reads global `languages`) |
| `isSingleElementArray()` | None (pure) |

## Testing considerations

**Pure functions (easily testable):**
- `transformNameToId`
- `getName`
- `getNameLine`
- `getNameLine2variants`
- `getNameLines` (with mocked `languages`)
- `isSingleElementArray`

**Functions requiring mocks:**
- `fetchData` — needs XHR mock
- `getGeoNamesId` — needs `fetchData` mock, WikiData/GeoNames response mocks
- `retrieveExonyms` — needs DOM mock (`$`), `getGeoNamesId` mock, `fetchData` mock
- `copyLocation` — needs DOM mock, `execCommand` mock
- `clearPage` — needs DOM mock

## Known issues

1. **No XML escaping** — Names with `&`, `<`, `>`, `"` produce invalid XML
2. **Synchronous XHR** — Blocks UI, deprecated
3. **No input validation** — WikiData ID used directly in URLs
4. **Error handling** — `retrieveExonyms()` doesn't catch `fetchData()` errors
5. **Variant duplication** — Variant pairs may duplicate codes from main loop
6. **Sorting after variants** — Alphabetical sort may not match desired output order
7. **Hardcoded constants** — No configuration system