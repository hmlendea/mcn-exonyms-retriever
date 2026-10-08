# Startup and Rendering

## Startup sequence

```
Browser loads index.html
    │
    ├─► Parse HTML (blocking)
    │       │
    │       ├─► <link> CSS tags → fetch CSS (async, non-blocking)
    │       │
    │       ├─► <script> tags → fetch + execute (blocking, in order)
    │       │       1. jQuery slim
    │       │       2. jQuery easing
    │       │       3. Bootstrap bundle (CSS already loaded)
    │       │       4. StartBootstrap scripts.js
    │       │       5. languages.js
    │       │       6. exonyms-retriever.js
    │       │
    │       └─► DOM fully parsed
    │
    ├─► DOMContentLoaded fires
    │
    └─► jQuery $(document).ready() callbacks execute
            │
            └─► clearPage()
                    ├─► $('#wikiDataId').val('Q20717572')
                    └─► $('#location').val('')
```

## Detailed startup steps

### Step 1: HTML parsing begins

Browser starts parsing `index.html` top-to-bottom.

### Step 2: CSS loading (async)

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="https://startbootstrap.github.io/startbootstrap-freelancer/css/styles.css" rel="stylesheet">
<link href="css/custom.css" rel="stylesheet">
<link href="https://fonts.googleapis.com/css?family=Montserrat:400,700" rel="stylesheet">
<link href="https://fonts.googleapis.com/css?family=Lato:400,700,400italic,700italic" rel="stylesheet">
```

- CSS loads asynchronously (non-blocking)
- Render may be delayed until CSS is available
- No `media` attributes — all apply immediately

### Step 3: Script loading (blocking, sequential)

Each `<script>` tag blocks HTML parsing until fetched and executed.

#### Script 1: jQuery slim
```html
<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
```
- Defines global `$` and `jQuery`
- Required by all subsequent scripts

#### Script 2: jQuery easing
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.12.1/jquery.easing.min.js"></script>
```
- Extends jQuery with easing functions
- Required by StartBootstrap `scripts.js`

#### Script 3: Bootstrap bundle
```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js"></script>
```
- Defines Bootstrap JS components (dropdowns, modals, etc.)
- Requires jQuery (already loaded)

#### Script 4: StartBootstrap scripts
```html
<script src="https://startbootstrap.github.io/startbootstrap-freelancer/js/scripts.js"></script>
```
- Freelancer theme custom JS
- Requires jQuery and jQuery easing

#### Script 5: languages.js
```html
<script src="js/languages.js"></script>
```
- Defines global `languages` object
- No dependencies

#### Script 6: exonyms-retriever.js
```html
<script src="js/exonyms-retriever.js"></script>
```
- Defines all application functions
- Requires jQuery and `languages`

### Step 4: DOMContentLoaded

Fires when HTML is fully parsed and all blocking scripts executed.

### Step 5: Document ready

```javascript
$(document).ready(function() {
    clearPage();
});
```

- `clearPage()` sets default values
- No other initialization occurs

## Rendering

### Initial render

- HTML is rendered as parsed (progressive rendering)
- CSS applied as it loads
- Scripts block rendering until executed
- No explicit render step — browser handles it

### Post-ready state

| Element | State |
|---------|-------|
| `#wikiDataId` input | Value = `Q20717572` |
| `#location` textarea | Empty |
| All other elements | As defined in HTML |

### No SPA framework

- No virtual DOM
- No component re-rendering
- No state management library
- Direct DOM manipulation via jQuery

## User interaction flow

```
User enters WikiData ID
    │
    └─► (no validation)
          │
          └─► User clicks "Retrieve Exonyms" button
                  │
                  └─► retrieveExonyms() called
                          │
                          ├─► Read #wikiDataId value
                          ├─► getGeoNamesId(wikiDataId)
                          │       ├─► WikiData API (sync XHR)
                          │       └─► GeoNames API (sync XHR, fallback)
                          │
                          ├─► Exonyms API (sync XHR)
                          │
                          ├─► transformNameToId(defaultName)
                          │
                          ├─► Build XML string
                          │
                          └─► Set #location textarea value
                                  │
                                  └─► User sees XML output
                                          │
                                          └─► User clicks "Copy" button
                                                  │
                                                  └─► copyLocation()
                                                          └─► Copy to clipboard
```

## UI state transitions

| State | Trigger | Action | Next state |
|-------|---------|--------|------------|
| Initial | Page load | `clearPage()` | Ready |
| Ready | User edits input | (no action) | Ready |
| Ready | Click Retrieve | `retrieveExonyms()` | Loading (blocked) |
| Loading | XHR complete | Set textarea | Ready |
| Ready | Click Clear | `clearPage()` | Ready |
| Ready | Click Copy | `copyLocation()` | Ready |

## Loading state

**No loading indicator.** During `retrieveExonyms()`:

- Browser is blocked (synchronous XHR)
- UI is frozen
- No visual feedback
- User cannot interact

## Error display

**No error display.** Errors are:

- Logged to console (`console.error`)
- Not shown to user
- Not caught in `retrieveExonyms()` (propagates as uncaught exception)

## Performance characteristics

| Phase | Duration | Blocking |
|-------|----------|----------|
| HTML parse | ~10ms | Yes |
| CSS fetch | ~100ms | No |
| jQuery load | ~50ms | Yes |
| Bootstrap load | ~100ms | Yes |
| languages.js load | ~5ms | Yes |
| exonyms-retriever.js load | ~5ms | Yes |
| Document ready | ~1ms | Yes |
| `retrieveExonyms()` | ~500-2000ms | Yes (3 sync XHR) |

## Memory usage

| Component | Approximate size |
|-----------|-----------------|
| jQuery | ~80KB (minified) |
| Bootstrap JS | ~60KB (minified) |
| languages.js | ~10KB |
| exonyms-retriever.js | ~10KB |
| DOM | ~50KB |
| Total JS heap | ~200KB |

## No lazy loading

- All scripts loaded eagerly
- All CSS loaded eagerly
- No code splitting
- No dynamic imports

## No pre-rendering

- No server-side rendering
- No static site generation
- No prerendered HTML content (beyond initial HTML)

## No caching strategy

- No service worker
- No HTTP caching headers (host-dependent)
- No in-memory caching of API responses
- No localStorage/sessionStorage

## Startup failure modes

| Failure | Symptom |
|---------|---------|
| jQuery CDN fails | All scripts fail; `languages.js` and `exonyms-retriever.js` still load but `$` is undefined |
| languages.js fails | `retrieveExonyms()` throws `ReferenceError: languages is not defined` |
| exonyms-retriever.js fails | No functions defined; buttons do nothing |
| CSS fails | Unstyled HTML (degraded but functional) |
| Font Awesome fails | Icons missing |
| Google Fonts fail | Fallback fonts used |

## Environment requirements

| Requirement | Minimum |
|-------------|---------|
| Browser | Any modern browser (ES5+) |
| JavaScript | ES5 (no ES6+ features used) |
| XMLHttpRequest | Required |
| jQuery | Loaded via CDN |
| Internet | Required (CDN + API calls) |
| HTTPS | Recommended (GitHub Pages) |
| Console | Required for debugging |