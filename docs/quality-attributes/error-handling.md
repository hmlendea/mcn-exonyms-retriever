# Error Handling

## Error handling strategy

**Minimal to non-existent.** Errors propagate as uncaught exceptions.

## Error sources

| Source | Error type | Handling |
|--------|------------|----------|
| `fetchData()` network | `Error` (thrown) | Uncaught in `retrieveExonyms()` |
| `fetchData()` non-200 | `Error` (thrown) | Uncaught in `retrieveExonyms()` |
| `fetchData()` invalid JSON | `SyntaxError` (thrown) | Uncaught in `retrieveExonyms()` |
| WikiData API 404 | `Error` (thrown) | Caught in `getGeoNamesId()` → returns `null` |
| WikiData API malformed | `Error` (thrown) | Caught in `getGeoNamesId()` → returns `null` |
| GeoNames API error | `Error` (thrown) | Caught in `getGeoNamesId()` → returns `null` |
| GeoNames 0 results | Logic | Returns `null` |
| GeoNames >1 results | Logic | Returns `null` |
| Exonyms API error | `Error` (thrown) | Uncaught in `retrieveExonyms()` |
| DOM element not found | `TypeError` | Not handled |
| `languages` undefined | `ReferenceError` | Not handled |

## Error propagation

```
retrieveExonyms()
    │
    ├─► getGeoNamesId()
    │       ├─► fetchData(WikiData) → throws
    │       │       └─► catch → return null
    │       │
    │       └─► fetchData(GeoNames) → throws
    │               └─► catch → return null
    │
    ├─► fetchData(Exonyms) → throws
    │       └─► UNCAUGHT → console.error → UI frozen
    │
    └─► transformNameToId() → pure, no errors
    └─► getNameLines() → pure, no errors
    └─► DOM update → may throw if element missing
```

## Try/catch coverage

| Function | Try/catch | Catches |
|----------|-----------|---------|
| `getGeoNamesId()` | Yes | All errors → returns `null` |
| `retrieveExonyms()` | No | — |
| `fetchData()` | No | — |
| `transformNameToId()` | No | — |
| `getNameLines()` | No | — |
| `copyLocation()` | No | — |
| `clearPage()` | No | — |

## Error logging

| Location | Method | Content |
|----------|--------|---------|
| `fetchData()` | `console.log` | URL being fetched |
| `getGeoNamesId()` | `console.log` | Found GeoNames ID (success) |
| `getGeoNamesId()` | `console.error` | Error object (caught) |
| Uncaught exceptions | Browser | Stack trace in console |

## User-facing errors

**None.** No error messages displayed to user.

| Error scenario | User sees |
|----------------|-----------|
| Network failure | Nothing (UI frozen, then nothing) |
| Invalid WikiData ID | Nothing (UI frozen, then nothing) |
| API rate limit | Nothing |
| CORS error | Nothing |
| Mixed content warning | Browser warning in console |
| Script error | Nothing (may break UI) |

## Recovery

| Error | Recovery method |
|-------|-----------------|
| Network error | Click Retrieve again |
| Invalid input | Correct input, click Retrieve |
| API error | Wait, click Retrieve |
| Script error | Refresh page |
| UI frozen | Wait or refresh |

## Error boundaries

**None.** No error boundaries, no try/catch in main flow.

## Input validation

| Input | Validation |
|-------|------------|
| WikiData ID | None |
| API responses | None (assumes structure) |
| Language codes | None (assumes in `languages`) |
| XML output | None (no escaping) |

## Defensive programming

| Practice | Status |
|----------|--------|
| Null checks | Partial (`getNameLine` checks for null) |
| Type checks | None |
| Bounds checks | None |
| Contract validation | None |
| Fail-fast | No (fails silently or uncaught) |

## Specific error scenarios

### Scenario: WikiData API returns 404

```javascript
// fetchData throws Error("Request failed with status 404")
// getGeoNamesId catches → returns null
// retrieveExonyms continues without GeoNamesId
// Exonyms API called with only WikiDataId
```

### Scenario: WikiData API returns malformed JSON

```javascript
// fetchData throws SyntaxError
// getGeoNamesId catches → returns null
// Same as above
```

### Scenario: GeoNames API returns 403 (invalid username)

```javascript
// fetchData throws Error("Request failed with status 403")
// getGeoNamesId catches → returns null
// Same as above
```

### Scenario: Exonyms API returns 500

```javascript
// fetchData throws Error("Request failed with status 500")
// retrieveExonyms does NOT catch
// Uncaught exception → console.error
// UI frozen, textarea unchanged
```

### Scenario: Exonyms API returns invalid JSON

```javascript
// fetchData throws SyntaxError
// retrieveExonyms does NOT catch
// Uncaught exception → console.error
```

### Scenario: `languages` not loaded

```javascript
// getNameLines() → for (var languageCode in languages)
// ReferenceError: languages is not defined
// Uncaught exception
```

### Scenario: DOM element missing

```javascript
// $('#wikiDataId').val() → returns empty jQuery object
// .val() on empty → undefined
// URL becomes "...wikiDataId=undefined"
// API returns error → fetchData throws
```

## Error handling gaps

| Gap | Impact |
|-----|--------|
| No try/catch in `retrieveExonyms()` | Uncaught exceptions freeze UI |
| No user feedback | User unaware of failures |
| No retry logic | Transient failures require manual retry |
| No timeout on XHR | Can hang indefinitely |
| No input validation | Garbage in → confusing errors |
| No XML escaping | Invalid XML output possible |
| No DOM existence checks | Silent failures if HTML changes |

## Recommended improvements

| Improvement | Priority |
|-------------|----------|
| Wrap `retrieveExonyms()` in try/catch | High |
| Show error message to user | High |
| Add XHR timeout | Medium |
| Validate WikiData ID format | Medium |
| Add XML escaping | Medium |
| Add loading indicator | Medium |
| Add retry with backoff | Low |
| Log errors to remote service | Low |