# Integration Models

## Overview

The application integrates with three external HTTP APIs. All calls are synchronous XHR from the browser.

## 1. Exonyms API

### Base URL
```
https://hmlendea.go.ro/apis/exonyms-api
```

### Endpoint
```
GET /Exonyms?wikiDataId={wikiDataId}[&geoNamesId={geoNamesId}]
```

### Parameters

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| `wikiDataId` | Yes | string | WikiData entity ID (e.g., `Q20717572`) |
| `geoNamesId` | No | string | GeoNames ID (e.g., `683506`) |

### Request example
```
https://hmlendea.go.ro/apis/exonyms-api/Exonyms?wikiDataId=Q20717572&geoNamesId=683506
```

### Response schema

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

### Response example
```json
{
  "defaultName": "Bucharest",
  "names": {
    "en": { "value": "Bucharest" },
    "ro": { "value": "București" },
    "fr": { "value": "Bucarest" },
    "de": { "value": "Bukarest" },
    "hu": { "value": "Bukarest" },
    "tr": { "value": "Bükreş" }
  }
}
```

### Field details

| Field | Type | Description |
|-------|------|-------------|
| `defaultName` | string | Primary name (usually English or local) |
| `names` | object | Map of language code → name object |
| `names[code].value` | string | Exonym in that language |

### Error responses

| Status | Body | Handling |
|--------|------|----------|
| 200 | JSON above | Success |
| 400 | Error message | `fetchData()` throws |
| 404 | Error message | `fetchData()` throws |
| 5xx | Error message | `fetchData()` throws |

### Authentication
None (public API)

### Rate limits
Unknown (shared demo deployment)

### CORS
Assumed enabled (works from browser)

---

## 2. WikiData API

### Base URL
```
https://www.wikidata.org
```

### Endpoint
```
GET /wiki/Special:EntityData/{wikiDataId}.json
```

### Parameters

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| `wikiDataId` (path) | Yes | string | WikiData entity ID (e.g., `Q20717572`) |

### Request example
```
https://www.wikidata.org/wiki/Special:EntityData/Q20717572.json
```

### Response schema (simplified)

```json
{
  "entities": {
    "Q20717572": {
      "id": "Q20717572",
      "type": "item",
      "labels": { ... },
      "descriptions": { ... },
      "aliases": { ... },
      "claims": {
        "P1566": [
          {
            "mainsnak": {
              "snaktype": "value",
              "property": "P1566",
              "datavalue": {
                "value": "683506",
                "type": "string"
              }
            }
          }
        ]
      }
    }
  }
}
```

### Relevant claims

| Property | Name | Value type | Used by app |
|----------|------|------------|-------------|
| `P1566` | GeoNames ID | string | Yes |

### Extraction logic

```javascript
var claims = wikiDataResponse.entities[wikiDataId].claims;
if (isSingleElementArray(claims, 'P1566')) {
    var geoNamesId = claims['P1566'][0].mainsnak.datavalue.value;
    return geoNamesId;
}
```

- Requires exactly one P1566 claim
- Returns the string value directly

### Error responses

| Status | Handling |
|--------|----------|
| 200 | Parse JSON, extract claims |
| 404 | Entity not found; `fetchData()` throws |
| 5xx | `fetchData()` throws |

### Authentication
None

### Rate limits
Standard WikiData limits (generous for read)

### CORS
Enabled for `Special:EntityData`

---

## 3. GeoNames API

### Base URL
```
http://api.geonames.org
```

### Endpoint
```
GET /searchJSON
```

### Parameters

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| `username` | Yes | string | Demo account: `geonamesfreeaccountt` |
| `q` | Yes | string | Search query (WikiData ID used as query) |

### Request example
```
http://api.geonames.org/searchJSON?username=geonamesfreeaccountt&q=Q20717572
```

### Response schema

```json
{
  "totalResultsCount": 1,
  "geonames": [
    {
      "geonameId": 683506,
      "name": "Bucharest",
      "asciiname": "Bucharest",
      "alternatenames": [...],
      "latitude": 44.43225,
      "longitude": 26.10626,
      "featureClass": "P",
      "featureCode": "PPLC",
      "countryCode": "RO",
      "cc2": "",
      "admin1Code": "B",
      "admin2Code": "",
      "admin3Code": "",
      "admin4Code": "",
      "population": 1877155,
      "elevation": 0,
      "dem": 85,
      "timezone": "Europe/Bucharest",
      "modificationDate": "2019-09-05"
    }
  ]
}
```

### Extraction logic

```javascript
if (geoNamesResponse.totalResultsCount.value === 1) {
    var geoNamesId = geoNamesResponse.geonames[0].geonameId;
    return geoNamesId;
}
```

- Requires exactly one result (`totalResultsCount === 1`)
- Returns `geonameId` as number (coerced to string)

### Error responses

| Status | Handling |
|--------|----------|
| 200 | Parse JSON, check `totalResultsCount` |
| 400 | Invalid parameters; `fetchData()` throws |
| 403 | Invalid username; `fetchData()` throws |
| 5xx | `fetchData()` throws |

### Authentication
Username parameter (shared demo account)

### Rate limits
- Demo account: ~2000 credits/day
- 1 credit per request
- Shared across all users

### CORS
Enabled for `searchJSON`

### Protocol
**HTTP (not HTTPS)** — mixed content warning on HTTPS pages

---

## Integration flow

```
retrieveExonyms()
    │
    ├─► getGeoNamesId(wikiDataId)
    │       │
    │       ├─► WikiData API: GET /wiki/Special:EntityData/{id}.json
    │       │       └─► Extract P1566 claim (if exactly 1)
    │       │
    │       └─► (fallback) GeoNames API: GET /searchJSON?q={wikiDataId}
    │               └─► Use result if exactly 1 match
    │
    ├─► Exonyms API: GET /Exonyms?wikiDataId={id}[&geoNamesId={id}]
    │       └─► Returns { defaultName, names: { code: { value } } }
    │
    ├─► transformNameToId(defaultName) → locationId
    │
    ├─► Build XML header with Id, GeoNamesId?, WikiDataId
    │
    └─► getNameLines(response) → all <Name> elements
            │
            ├─► Iterate languages object (~200 codes)
            │       └─► getNameLine(response, mcnId, code)
            │
            └─► Add 9 explicit variant pairs
                    └─► getNameLine2variants(...)
```

---

## Data contracts (TypeScript-style)

### ExonymsApiResponse
```typescript
interface ExonymsApiResponse {
    defaultName: string;
    names: Record<string, { value: string }>;
}
```

### WikiDataEntityResponse
```typescript
interface WikiDataEntityResponse {
    entities: Record<string, WikiDataEntity>;
}

interface WikiDataEntity {
    id: string;
    claims: Record<string, WikiDataClaim[]>;
}

interface WikiDataClaim {
    mainsnak: {
        snaktype: string;
        property: string;
        datavalue: {
            value: string;
            type: string;
        };
    };
}
```

### GeoNamesSearchResponse
```typescript
interface GeoNamesSearchResponse {
    totalResultsCount: number;
    geonames: GeoNamesEntry[];
}

interface GeoNamesEntry {
    geonameId: number;
    name: string;
    // ... other fields ignored
}
```

### MCN Location XML (output)
```xml
<LocationEntity>
  <Id>string</Id>
  <GeoNamesId>string</GeoNamesId>  <!-- optional -->
  <WikiDataId>string</WikiDataId>
  <GameIds>
  </GameIds>
  <Names>
    <Name language="string" value="string" />
    <!-- ... -->
  </Names>
</LocationEntity>
```

---

## Failure modes

| Scenario | Behaviour |
|----------|-----------|
| WikiData API timeout | `fetchData()` throws → `getGeoNamesId()` catches → returns `null` |
| WikiData entity not found | `fetchData()` throws → returns `null` |
| WikiData P1566 missing | Returns `null` |
| WikiData P1566 multiple values | Returns `null` (requires exactly 1) |
| GeoNames API timeout | `fetchData()` throws → returns `null` |
| GeoNames 0 results | Returns `null` |
| GeoNames >1 results | Returns `null` (requires exactly 1) |
| GeoNames username invalid | `fetchData()` throws → returns `null` |
| Exonyms API timeout | `fetchData()` throws → uncaught → console error, UI frozen |
| Exonyms API 404 | `fetchData()` throws → uncaught |
| Exonyms API invalid JSON | `JSON.parse()` throws → uncaught |
| Network offline | All `fetchData()` throw → uncaught in `retrieveExonyms()` |

---

## Security considerations

| Aspect | Detail |
|--------|--------|
| API keys | None (GeoNames uses shared demo username in URL) |
| PII in requests | WikiData ID only (public identifier) |
| PII in responses | Place names only (public data) |
| Transport | WikiData/Exonyms: HTTPS; GeoNames: HTTP (mixed content) |
| CORS | All endpoints support browser access |
| CSP | None configured |

---

## Testing integration points

### Mock responses needed

**Exonyms API:**
```json
{
  "defaultName": "Test City",
  "names": {
    "en": { "value": "Test City" },
    "ro": { "value": "Oraș Test" }
  }
}
```

**WikiData API (with P1566):**
```json
{
  "entities": {
    "Q12345": {
      "claims": {
        "P1566": [{ "mainsnak": { "datavalue": { "value": "987654" } } }]
      }
    }
  }
}
```

**WikiData API (no P1566):**
```json
{
  "entities": {
    "Q12345": { "claims": {} }
  }
}
```

**GeoNames API (single result):**
```json
{
  "totalResultsCount": 1,
  "geonames": [{ "geonameId": 987654, "name": "Test City" }]
}
```

**GeoNames API (zero results):**
```json
{
  "totalResultsCount": 0,
  "geonames": []
}
```

**GeoNames API (multiple results):**
```json
{
  "totalResultsCount": 2,
  "geonames": [
    { "geonameId": 111, "name": "Test City" },
    { "geonameId": 222, "name": "Test City" }
  ]
}
```

---

## Versioning and stability

| API | Versioning | Stability |
|-----|------------|-----------|
| Exonyms API | None (custom) | Unknown; single maintainer |
| WikiData API | Stable (Special:EntityData) | High; Wikimedia commitment |
| GeoNames API | Stable (searchJSON) | High; but demo account unreliable |

---

## Future integration considerations

| Change | Impact |
|--------|--------|
| Exonyms API migration | Update `exonymsApiBaseUrl` constant |
| WikiData API change | Modify claim extraction logic |
| GeoNames account upgrade | Change `geoNamesUsername` constant |
| HTTPS for GeoNames | Change `geoNamesBaseUrl` to `https://` |
| Async XHR / fetch | Refactor `fetchData()` and all callers |
| Error handling | Add try/catch in `retrieveExonyms()` |
| XML escaping | Add escaping in `getNameLine()` |
| Rate limiting | Add retry/backoff logic |
| Caching | Add client-side cache for WikiData/GeoNames lookups |