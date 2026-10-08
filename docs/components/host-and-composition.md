# Host and Composition

## Composition root

The composition root is `index.html` — the single HTML file that loads all dependencies and wires them together.

## Script load order (critical)

```html
<!-- 1. jQuery (required by Bootstrap, exonyms-retriever.js) -->
<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.12.1/jquery.easing.min.js"></script>

<!-- 2. Bootstrap CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- 3. Bootstrap JS (requires jQuery) -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js"></script>

<!-- 4. StartBootstrap template CSS -->
<link href="https://startbootstrap.github.io/startbootstrap-freelancer/css/styles.css" rel="stylesheet">

<!-- 5. Custom CSS -->
<link href="css/custom.css" rel="stylesheet">

<!-- 6. Font Awesome -->
<script src="https://use.fontawesome.com/releases/v6.4.0/js/all.js" crossorigin="anonymous"></script>

<!-- 7. Google Fonts -->
<link href="https://fonts.googleapis.com/css?family=Montserrat:400,700" rel="stylesheet">
<link href="https://fonts.googleapis.com/css?family=Lato:400,700,400italic,700italic" rel="stylesheet">

<!-- 8. Application: language data (MUST be before exonyms-retriever.js) -->
<script src="js/languages.js"></script>

<!-- 9. Application: logic (MUST be after jQuery and languages.js) -->
<script src="js/exonyms-retriever.js"></script>

<!-- 10. StartBootstrap template JS (requires jQuery) -->
<script src="https://startbootstrap.github.io/startbootstrap-freelancer/js/scripts.js"></script>
```

## Dependency graph at load time

```
index.html
    │
    ├──► jQuery (CDN)
    │       └──► jQuery Easing (CDN, extends jQuery)
    │
    ├──► Bootstrap CSS (CDN)
    │
    ├──► Bootstrap JS (CDN) ──────────────────► requires jQuery
    │
    ├──► StartBootstrap CSS (CDN)
    │
    ├──► Custom CSS (local)
    │
    ├──► Font Awesome (CDN)
    │
    ├──► Google Fonts (CDN)
    │
    ├──► languages.js (local) ────────────────► no dependencies
    │
    ├──► exonyms-retriever.js (local) ───────► requires jQuery, languages.js
    │
    └──► StartBootstrap JS (CDN) ────────────► requires jQuery
```

## Global namespace composition

After all scripts load, the following globals are available:

| Global | Source | Type |
|--------|--------|------|
| `$` / `jQuery` | jQuery CDN | Function/Object |
| `bootstrap` | Bootstrap JS | Object (via jQuery plugin) |
| `FontAwesome` | Font Awesome CDN | Object |
| `languages` | `languages.js` | Object (~200 entries) |
| `clearPage` | `exonyms-retriever.js` | Function |
| `retrieveExonyms` | `exonyms-retriever.js` | Function |
| `copyLocation` | `exonyms-retriever.js` | Function |
| `getGeoNamesId` | `exonyms-retriever.js` | Function |
| `transformNameToId` | `exonyms-retriever.js` | Function |
| `getName` | `exonyms-retriever.js` | Function |
| `getNameLine` | `exonyms-retriever.js` | Function |
| `getNameLine2variants` | `exonyms-retriever.js` | Function |
| `getNameLines` | `exonyms-retriever.js` | Function |
| `fetchData` | `exonyms-retriever.js` | Function |
| `isSingleElementArray` | `exonyms-retriever.js` | Function |
| `exonymsApiBaseUrl` | `exonyms-retriever.js` | String (constant) |
| `wikiDataBaseUrl` | `exonyms-retriever.js` | String (constant) |
| `geoNamesBaseUrl` | `exonyms-retriever.js` | String (constant) |
| `geoNamesUsername` | `exonyms-retriever.js` | String (constant) |

## Initialisation sequence

```javascript
// In exonyms-retriever.js
$(document).ready(function() {
    clearPage();
});
```

1. Browser parses HTML
2. Scripts load in order (blocking for `<script>`, async for `<link rel="stylesheet">`)
3. `DOMContentLoaded` fires
4. jQuery's `$(document).ready()` callbacks execute
5. `clearPage()` runs:
   - Sets `#wikiDataId.value = 'Q20717572'`
   - Sets `#location.value = ''`

## Host environment

| Aspect | Detail |
|--------|--------|
| Host | Any static file server (GitHub Pages, Netlify, Apache, Nginx, S3, etc.) |
| Protocol | HTTPS (GitHub Pages) or HTTP |
| MIME types | `text/html`, `application/javascript`, `text/css` |
| Compression | gzip/br (handled by host) |
| Caching | Standard HTTP caching headers |
| CSP | None |
| Feature Policy | None |

## No build-time composition

- No bundler (webpack, rollup, esbuild, etc.)
- No transpiler (Babel, TypeScript, etc.)
- No minification
- No dead code elimination
- No asset hashing/fingerprinting
- Source files served directly

## Runtime composition

- All composition happens at load time in the browser
- Script execution order = dependency order
- No dynamic imports (`import()`)
- No module loaders (RequireJS, SystemJS, etc.)
- No service worker

## Modifying composition

| Change | Action |
|--------|--------|
| Add new local script | Add `<script src="js/new-script.js"></script>` in correct position |
| Add new CDN script | Add `<script src="..."></script>` before scripts that depend on it |
| Change load order | Reorder `<script>` tags in `index.html` |
| Remove dependency | Remove `<script>`/`<link>` tag; verify no runtime errors |
| Add ES module | Change to `<script type="module">`; refactor all dependencies |
| Add build step | Create `package.json`, configure bundler, update `index.html` to load bundle |