# Repository Structure

## Source tree layout

```
mcn-exonyms-retriever/
├── .github/
│   ├── FUNDING.yml
│   └── workflows/
│       └── (GitHub Actions workflows)
├── docs/
│   ├── INDEX.md
│   ├── architecture.md
│   ├── repository-overview.md
│   ├── repository-structure.md
│   ├── design-decisions.md
│   ├── dependencies.md
│   ├── configuration.md
│   ├── data-model.md
│   ├── state-and-persistence.md
│   ├── components/
│   │   ├── presentation.md
│   │   ├── host-and-composition.md
│   │   ├── application-services.md
│   │   ├── browser-state-and-localisation.md
│   │   └── integration-models.md
│   ├── flows/
│   │   ├── startup-and-rendering.md
│   │   └── exonym-retrieval.md
│   ├── behaviour/
│   │   ├── browse-and-search.md
│   │   └── inspect-edit-delete.md
│   ├── integrations.md
│   ├── testing.md
│   ├── concurrency-and-scheduling.md
│   ├── error-handling.md
│   ├── logging.md
│   ├── invariants.md
│   ├── build-and-deployment.md
│   ├── ambiguities-and-open-questions.md
│   ├── change-guide.md
│   └── documentation-maintenance.md
├── js/
│   ├── exonyms-retriever.js
│   └── languages.js
├── css/
│   └── custom.css
├── index.html
├── ARCHITECTURE.md
├── LICENSE
├── PRIVACY.md
├── README.md
└── SECURITY.md
```

## Module organisation

### Root-level files

| File | Purpose |
|------|---------|
| `index.html` | Main HTML entry point; defines UI structure, loads all scripts and styles |
| `ARCHITECTURE.md` | High-level architecture documentation (root) |
| `README.md` | Project overview, usage, contributing |
| `LICENSE` | GPL v3 license text |
| `PRIVACY.md` | Data-handling policy |
| `SECURITY.md` | Vulnerability reporting policy |

### `js/` — Application logic

| File | Exports | Dependencies | Description |
|------|---------|--------------|-------------|
| `exonyms-retriever.js` | `clearPage`, `retrieveExonyms`, `copyLocation`, `getGeoNamesId`, `transformNameToId`, `getName`, `getNameLine`, `getNameLine2variants`, `getNameLines`, `fetchData`, `isSingleElementArray` | `languages.js` (global `languages`), jQuery (`$`) | Core application logic: API orchestration, data transformation, XML generation |
| `languages.js` | `languages` (object) | None | Static mapping of 200+ language codes to MCN language identifiers |

### `css/` — Stylesheets

| File | Purpose |
|------|---------|
| `custom.css` | Project-specific CSS customisations (currently minimal/empty) |

### `.github/` — GitHub configuration

| File | Purpose |
|------|---------|
| `FUNDING.yml` | GitHub Sponsors / funding links |
| `workflows/` | CI/CD workflows (if any) |

### `docs/` — Detailed documentation

See [INDEX.md](./INDEX.md) for the complete documentation catalogue.

## Dependency graph

```
index.html
  ├── js/exonyms-retriever.js
  │     └── js/languages.js (global `languages`)
  ├── js/languages.js
  ├── CDN: jQuery (code.jquery.com)
  ├── CDN: Bootstrap (cdn.jsdelivr.net)
  ├── CDN: Font Awesome (use.fontawesome.com)
  ├── CDN: Google Fonts (fonts.googleapis.com)
  ├── CDN: StartBootstrap (startbootstrap.github.io)
  └── css/custom.css
```

## Naming conventions

- **Files**: kebab-case (`exonyms-retriever.js`, `custom.css`)
- **JavaScript functions**: camelCase (`retrieveExonyms`, `getGeoNamesId`)
- **JavaScript constants**: camelCase with descriptive names (`exonymsApiBaseUrl`, `geoNamesUsername`)
- **Global variables**: camelCase (`languages`)
- **HTML IDs**: camelCase (`wikiDataId`, `location`)
- **CSS classes**: Bootstrap conventions (`form-control`, `btn`, `btn-lg`)

## Module boundaries

1. **Presentation layer** (`index.html`) — Owns DOM structure, loads scripts, wires event handlers via inline `onclick` attributes
2. **Application logic** (`js/exonyms-retriever.js`) — Owns all business logic, API calls, data transformation, XML generation
3. **Reference data** (`js/languages.js`) — Owns language code mapping; no dependencies
4. **External APIs** — Three independent HTTP endpoints called via synchronous XHR

## Composition root

The composition root is `index.html` script loading order:
1. jQuery (CDN)
2. jQuery Easing (CDN)
3. Bootstrap bundle (CDN)
4. StartBootstrap scripts (CDN)
5. Font Awesome (CDN)
6. Google Fonts (CDN)
7. `js/languages.js` (local)
8. `js/exonyms-retriever.js` (local)

The `$(document).ready()` handler in `exonyms-retriever.js` initialises the page by calling `clearPage()`.