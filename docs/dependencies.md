# Dependencies

## External dependencies

### Runtime dependencies (loaded in browser)

| Dependency | Version | Source | Purpose | Integration |
|------------|---------|--------|---------|-------------|
| jQuery | 3.5.1 | `code.jquery.com` | DOM manipulation, event handling, utilities | Global `$` via `<script>` |
| jQuery Easing | 1.12.1 | `cdnjs.cloudflare.com` | Animation easing functions | jQuery plugin |
| Bootstrap | 4.5.3 | `cdn.jsdelivr.net` | CSS framework, JS components | Requires jQuery; global `bootstrap` |
| Font Awesome | 6.4.0 | `use.fontawesome.com` | Icon font | Global `FontAwesome` |
| Google Fonts | — | `fonts.googleapis.com` | Web fonts (Montserrat, Lato) | CSS `@import` via `<link>` |
| StartBootstrap Freelancer | — | `startbootstrap.github.io` | Template CSS/JS | CSS + JS via `<link>`/`<script>` |

### API dependencies (called at runtime)

| API | Endpoint | Protocol | Auth | Purpose |
|-----|----------|----------|------|---------|
| Exonyms API | `https://hmlendea.go.ro/apis/exonyms-api/Exonyms` | HTTPS | None | Retrieve exonym names for WikiData ID |
| WikiData | `https://www.wikidata.org/wiki/Special:EntityData/{id}.json` | HTTPS | None | Resolve WikiData ID to GeoNames ID via P1566 claim |
| GeoNames | `http://api.geonames.org/searchJSON` | HTTP | Username (`geonamesfreeaccountt`) | Fallback GeoNames ID lookup |

## Internal dependencies

### Module dependency graph

```
index.html
  ├── js/languages.js (loads first)
  │     └── (no dependencies)
  │
  └── js/exonyms-retriever.js (loads second)
        ├── js/languages.js (global `languages`)
        ├── jQuery (global `$`)
        └── Browser APIs: XMLHttpRequest, console, document.execCommand
```

### `js/exonyms-retriever.js` → `js/languages.js`

- **Type:** Runtime global dependency
- **Access pattern:** `languages[languageCode]` in `getNameLines()`
- **Load order:** `languages.js` must load before `exonyms-retriever.js` (enforced by `index.html` script order)
- **Coupling:** Tight — `exonyms-retriever.js` assumes `languages` object exists with specific keys

### `js/exonyms-retriever.js` → jQuery

- **Type:** Runtime global dependency
- **Access pattern:** `$('#wikiDataId')`, `$('#location')`, `$('<textarea>')`, `$.ready()`
- **Load order:** jQuery CDN script must load before `exonyms-retriever.js`
- **Coupling:** Tight — all DOM manipulation uses jQuery

## Dependency direction rules

```
index.html (composition root)
    │
    ├──► js/languages.js (no deps)
    │
    └──► js/exonyms-retriever.js
              │
              ├──► js/languages.js (global)
              │
              └──► jQuery (global)
```

**Rules:**
1. `index.html` depends on all scripts and stylesheets
2. `exonyms-retriever.js` depends on `languages.js` and jQuery
3. `languages.js` has no dependencies
4. No circular dependencies
5. No dynamic imports or lazy loading

## Version management

| Dependency | Version pinning | Update strategy |
|------------|-----------------|-----------------|
| jQuery | Exact version in URL (3.5.1) | Manual URL update |
| jQuery Easing | Exact version in URL (1.12.1) | Manual URL update |
| Bootstrap | Exact version in URL (4.5.3) | Manual URL update |
| Font Awesome | Exact version in URL (6.4.0) | Manual URL update |
| Google Fonts | No version (latest) | Automatic |
| StartBootstrap | No version (latest on GitHub Pages) | Automatic |
| Exonyms API | No version (stable endpoint) | Monitor for breaking changes |
| WikiData API | Stable (no versioning) | Monitor for breaking changes |
| GeoNames API | Stable (no versioning) | Monitor for breaking changes |

## Supply chain risks

| Risk | Affected dependencies | Mitigation |
|------|----------------------|------------|
| CDN compromise | All CDN-loaded assets | None (no SRI hashes, no CSP) |
| CDN downtime | All CDN-loaded assets | None (no local fallbacks) |
| API breaking change | Exonyms, WikiData, GeoNames | None (no version pinning) |
| GeoNames rate limit | GeoNames API | Shared demo account; no dedicated quota |
| Mixed content | GeoNames (HTTP) on HTTPS page | None (browser blocks or warns) |
| Deprecated APIs | `execCommand`, sync XHR | None (no migration plan) |

## License compatibility

| Dependency | License | Compatible with GPL v3? |
|------------|---------|------------------------|
| jQuery | MIT | Yes |
| jQuery Easing | BSD | Yes |
| Bootstrap | MIT | Yes |
| Font Awesome | CC BY 4.0 / SIL OFL | Yes (with attribution) |
| Google Fonts | SIL OFL | Yes |
| StartBootstrap | MIT | Yes |
| Exonyms API | Unknown (maintainer-operated) | Assumed compatible |
| WikiData | CC0 | Yes |
| GeoNames | Creative Commons Attribution | Yes (with attribution) |

## Missing dependency management

- No `package.json`, `bower.json`, or similar manifest
- No lockfile
- No automated vulnerability scanning (Dependabot, etc.)
- No integrity hashes (Subresource Integrity) for CDN resources
- No local vendoring of critical dependencies