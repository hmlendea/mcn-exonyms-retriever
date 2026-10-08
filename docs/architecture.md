# Architecture

This document complements the root [ARCHITECTURE.md](../ARCHITECTURE.md) with additional implementation detail.

## Architectural style

**Static single-page application (SPA)** — The entire application is a single HTML file with embedded JavaScript that executes entirely in the browser. There is no server-side rendering, no backend services, and no persistent storage owned by the project.

### Style characteristics

| Characteristic | Implementation |
|----------------|----------------|
| Rendering | Server-rendered static HTML; client-side DOM manipulation via jQuery |
| State management | Transient in-memory only; no localStorage, sessionStorage, IndexedDB, or cookies |
| Routing | None (single page) |
| Data fetching | Synchronous XMLHttpRequest (blocking) |
| Module system | Global namespace via script load order; no ES modules, no bundler |
| Build step | None (direct deployment of source files) |

### Consequences

- **Zero server infrastructure** — Deployable to any static host (GitHub Pages, Netlify, S3, etc.)
- **No build pipeline** — Source files are production files
- **Blocking UI during API calls** — Synchronous XHR freezes the browser until responses arrive
- **No offline support** — Requires network connectivity for all operations
- **CDN dependency** — UI framework and fonts loaded from third-party CDNs

## System context (detailed)

```mermaid
flowchart TD
    User[User] -->|Interacts with| Browser[Browser]
    Browser -->|Loads| HTML[index.html]
    HTML -->|Loads| jQuery[jQuery CDN]
    HTML -->|Loads| Bootstrap[Bootstrap CDN]
    HTML -->|Loads| FontAwesome[Font Awesome CDN]
    HTML -->|Loads| GoogleFonts[Google Fonts CDN]
    HTML -->|Loads| StartBootstrap[StartBootstrap CDN]
    HTML -->|Loads| Languages[js/languages.js]
    HTML -->|Loads| App[js/exonyms-retriever.js]
    App -->|GET /Exonyms| ExonymsAPI[Exonyms API]
    App -->|GET /EntityData| WikiData[WikiData API]
    App -->|GET /searchJSON| GeoNames[GeoNames API]
```

### Trust boundaries

| Boundary | Trust level | Data exchanged |
|----------|-------------|----------------|
| User ↔ Browser | Full trust | User input (WikiData ID), displayed output |
| Browser ↔ Exonyms API | Partial trust | WikiData ID, GeoNames ID (public); receives exonym names |
| Browser ↔ WikiData API | Public API | WikiData ID (public); receives entity claims |
| Browser ↔ GeoNames API | Low trust (HTTP, shared demo account) | WikiData ID (public); receives GeoNames ID |
| Browser ↔ CDNs | Partial trust | Static assets (JS, CSS, fonts); no user data |

## Component architecture

### Presentation layer (`index.html`)

**Responsibility:** Render UI, wire event handlers, load dependencies

**Structure:**
- Navigation bar with GitHub link and More Cultural Names link
- Input section: WikiData ID text field (pre-filled with `Q20717572`)
- Output section: Read-only textarea for XML (24 rows)
- Action buttons: Retrieve, Clear, Copy

**Event wiring:** Inline `onclick` attributes on button spans:
- `onclick="retrieveExonyms()"`
- `onclick="clearPage()"`
- `onclick="copyLocation()"`

**No business logic** — All processing delegated to `exonyms-retriever.js`

### Application logic (`js/exonyms-retriever.js`)

**Responsibility:** API orchestration, data transformation, XML generation

**Exported functions (global scope):**

| Function | Purpose |
|----------|---------|
| `clearPage()` | Reset input to default WikiData ID, clear output |
| `retrieveExonyms()` | Main entry point: orchestrate GeoNames resolution → Exonyms API → XML generation |
| `copyLocation()` | Copy textarea content to clipboard |
| `getGeoNamesId(wikiDataId)` | Resolve WikiData ID → GeoNames ID via WikiData claims or GeoNames search |
| `transformNameToId(name)` | Convert default name to MCN-compatible location ID |
| `getName(response, languageCode)` | Extract exonym name for a language code |
| `getNameLine(response, mcnId, languageCode)` | Generate single `<Name>` XML element |
| `getNameLine2variants(...)` | Generate XML for language variant pairs |
| `getNameLines(response)` | Generate all `<Name>` elements for all languages |
| `fetchData(url)` | Synchronous XHR GET with error throwing |
| `isSingleElementArray(obj, prop)` | Utility: check if property is single-element array |

**Internal constants:**
- `exonymsApiBaseUrl` — `https://hmlendea.go.ro/apis/exonyms-api`
- `wikiDataBaseUrl` — `https://www.wikidata.org`
- `geoNamesBaseUrl` — `http://api.geonames.org`
- `geoNamesUsername` — `geonamesfreeaccountt`

### Language data (`js/languages.js`)

**Responsibility:** Static mapping of language codes to MCN language identifiers

**Export:** `languages` object with ~200 entries mapping ISO 639 codes to MCN identifiers

**Special handling in `getNameLines()`:** 10 explicit variant pairs for languages with multiple codes:
- Belarussian (be-tarask / be)
- Bosnian / SerboCroatian (bs / sh)
- Chinese (zh-hans / zh)
- Croatian / SerboCroatian (hr / sh)
- Kurdish (ku / ckd)
- Norwegian Nynorsk / Norwegian (nn / nb)
- Portuguese Brazilian / Portuguese (pt-br / pt)
- Serbian Latin / SerboCroatian (sr-el / sh)
- Serbian Cyrillic / SerboCroatian (sr / sh)

## Runtime flow (detailed)

### Startup sequence

```mermaid
sequenceDiagram
    participant Browser
    participant HTML
    participant jQuery
    participant App
    participant Languages

    Browser->>HTML: GET index.html
    HTML-->>Browser: HTML document
    Browser->>jQuery: Load jQuery from CDN
    Browser->>Bootstrap: Load Bootstrap from CDN
    Browser->>Fonts: Load Font Awesome, Google Fonts, StartBootstrap
    Browser->>Languages: Load js/languages.js
    Browser->>App: Load js/exonyms-retriever.js
    Browser->>Browser: Parse and execute scripts
    Browser->>App: $(document).ready() fires
    App->>App: clearPage()
    App->>Browser: Set #wikiDataId value, clear #location
```

### Exonym retrieval sequence

```mermaid
sequenceDiagram
    participant User
    participant UI
    participant App
    participant WikiData
    participant Exonyms
    participant GeoNames

    User->>UI: Enter WikiData ID, click Retrieve
    UI->>App: retrieveExonyms()
    App->>App: getGeoNamesId(wikiDataId)
    App->>WikiData: GET /EntityData/Q....json
    WikiData-->>App: Entity claims JSON
    alt P1566 claim exists (single)
        App->>App: Extract GeoNames ID from claims
    else No P1566 claim
        App->>GeoNames: GET /searchJSON?q=Q...
        GeoNames-->>App: Search results
        alt Exactly 1 result
            App->>App: Extract GeoNames ID
        else 0 or >1 results
            App->>App: Return null
        end
    end
    App->>Exonyms: GET /Exonyms?wikiDataId=Q...&geoNamesId=...
    Exonyms-->>App: Exonyms response JSON
    App->>App: transformNameToId(defaultName)
    App->>App: getNameLines(response)
    App->>UI: Set #location textarea value
    UI-->>User: Display XML output
```

## Data flow

```
User Input (WikiData ID)
        │
        ▼
getGeoNamesId()
        │
        ├── WikiData API ───► Entity claims (P1566) ───► GeoNames ID
        │
        └── GeoNames API ───► Search results ───► GeoNames ID (fallback)
        │
        ▼
Exonyms API (with WikiData ID + optional GeoNames ID)
        │
        ▼
Exonyms Response JSON
        │
        ├── defaultName ──► transformNameToId() ──► locationId
        │
        └── names[languageCode] ──► getNameLines() ──► XML <Name> elements
        │
        ▼
XML Assembly ──► <LocationEntity> with Id, GeoNamesId, WikiDataId, GameIds, Names
        │
        ▼
DOM Update ──► #location textarea
```

## Deployment architecture

| Aspect | Detail |
|--------|--------|
| Deployment model | Static files served via GitHub Pages |
| Build process | None (source = production) |
| CI/CD | GitHub Actions (if configured) |
| Environments | Single production environment (GitHub Pages) |
| Scaling | Handled by GitHub Pages CDN |
| Rollback | Git revert + push |
| Monitoring | None (static hosting) |

## Security architecture

- **No server-side attack surface** — Static files only
- **Content Security Policy** — Not currently implemented (would require `script-src` for inline event handlers)
- **Mixed content** — GeoNames API uses HTTP; page served via HTTPS on GitHub Pages
- **No authentication** — All APIs are public
- **No secrets in code** — GeoNames username is a public demo account
- **XSS risk** — User input (WikiData ID) directly interpolated into API URLs; no validation/sanitisation
- **Supply chain** — 5 CDN dependencies with no integrity hashes

See [SECURITY.md](../SECURITY.md) and [PRIVACY.md](../PRIVACY.md) for policies.