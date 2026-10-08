# State and Persistence

## State management overview

The application maintains **no persistent state**. All state is transient and exists only in browser memory during the page session.

## State categories

### User input state

| State | Location | Lifetime | Persistence |
|-------|----------|----------|-------------|
| WikiData ID input | `#wikiDataId` input element | Page session | Lost on reload/navigation |
| XML output | `#location` textarea | Page session | Lost on reload/navigation |

### Application state

| State | Location | Lifetime | Persistence |
|-------|----------|----------|-------------|
| Language mapping | `languages` global object | Page session | Reloaded from `languages.js` on each load |
| API endpoints | Constants in `exonyms-retriever.js` | Page session | Reloaded from source on each load |
| In-flight XHR | `XMLHttpRequest` objects | Request duration | N/A (synchronous) |

### Browser state

| State | Location | Lifetime | Persistence |
|-------|----------|----------|-------------|
| Console logs | Browser DevTools console | Browser session | Per browser settings |
| Network cache | Browser HTTP cache | Per cache headers | Standard browser caching |
| CDN resources | Browser cache | Per cache headers | Standard browser caching |

## No persistence mechanisms used

| Mechanism | Used? | Notes |
|-----------|-------|-------|
| `localStorage` | No | Not accessed |
| `sessionStorage` | No | Not accessed |
| `IndexedDB` | No | Not accessed |
| Cookies | No | Not set or read |
| Cache API / Service Workers | No | Not registered |
| File System Access API | No | Not used |
| URL state (hash/query) | No | Not parsed or updated |

## State transitions

### Page load

```
Initial state (empty)
    │
    ▼
Load index.html
    │
    ▼
Load all scripts (CDN + local)
    │
    ▼
$(document).ready() fires
    │
    ▼
clearPage() called
    │
    ├── #wikiDataId.value = 'Q20717572'
    │
    └── #location.value = ''
    │
    ▼
Ready state (awaiting user input)
```

### Retrieve exonyms

```
Ready state
    │
    ▼
User enters WikiData ID, clicks Retrieve
    │
    ▼
retrieveExonyms() called
    │
    ├── getGeoNamesId() ──────────────────► WikiData API (sync XHR)
    │       │
    │       └── (fallback) GeoNames API (sync XHR)
    │       │
    │       ▼
    │   geoNamesId (string or null)
    │
    ├── Exonyms API (sync XHR) ──────────► exonymsApiResponse
    │       │
    │       ▼
    │   transformNameToId(defaultName) ──► locationId
    │
    ├── getNameLines(exonymsApiResponse) ─► nameLines (XML string)
    │
    ├── Assemble full XML
    │
    └── #location.value = XML string
    │
    ▼
Output state (XML displayed)
```

### Clear page

```
Any state
    │
    ▼
clearPage() called
    │
    ├── #wikiDataId.value = 'Q20717572'
    │
    └── #location.value = ''
    │
    ▼
Ready state
```

### Copy to clipboard

```
Output state
    │
    ▼
copyLocation() called
    │
    ├── Create temporary <textarea>
    │
    ├── Set value = '\n' + #location.value
    │
    ├── Append to body, select, execCommand('copy')
    │
    ├── Remove temporary element
    │
    ▼
Output state (unchanged)
```

## Data lifecycle

| Data | Created | Modified | Destroyed |
|------|---------|----------|-----------|
| WikiData ID input | Page load (default) / User typing | User typing / `clearPage()` | Page unload |
| GeoNames ID | `getGeoNamesId()` | N/A (single assignment) | Function return |
| Exonyms response | `fetchData()` in `retrieveExonyms()` | N/A | Function return |
| Location ID | `transformNameToId()` | N/A | Function return |
| Name lines | `getNameLines()` | N/A | Function return |
| XML output | `retrieveExonyms()` | `clearPage()` | Page unload |
| Console logs | `console.log/error` | N/A | Browser-controlled |

## Cache behaviour

### Browser HTTP cache

- **CDN resources:** Cached per `Cache-Control` headers from CDNs (typically long-term with versioned URLs)
- **Local scripts (`js/*.js`):** Cached per GitHub Pages headers (typically `max-age=600` or similar)
- **API responses:** No explicit cache control; browser may cache GET responses

### No application-level caching

- No in-memory cache of API responses
- No deduplication of repeated requests for same WikiData ID
- Each "Retrieve" click triggers full API call sequence

## Migration and versioning

**No data migration needed** — no persistent data exists.

**No versioning** — no schema version for output XML or internal data structures.

## Recovery

| Failure scenario | Recovery |
|------------------|----------|
| Page reload | Full reset to initial state |
| Network failure during API call | Error logged to console; output unchanged |
| Invalid WikiData ID | API returns error; thrown exception logged to console |
| Browser crash | No data loss (no persistent state) |

## Testing implications

- No state to reset between tests (page reload suffices)
- No persistence layer to mock
- Pure functions (`transformNameToId`, `getName`, `getNameLine`, `getNameLine2variants`, `isSingleElementArray`) are testable in isolation
- Functions with side effects (`fetchData`, `getGeoNamesId`, `retrieveExonyms`, `copyLocation`, `clearPage`) require DOM and network mocking