# Repository Overview

## Purpose

The MCN Exonyms Retriever is a static, browser-only web application that enables users to retrieve exonym names (localized place names) for a given WikiData location ID and generate an XML snippet compatible with MCN (More Cultural Names) Minecraft configuration files.

The tool serves the MCN modding community by providing a simple web interface to query the public Exonyms API and enrich results with GeoNames identifiers from WikiData or the GeoNames service.

## Scope

**In scope:**
- Single-page HTML interface with WikiData ID input and XML output
- Client-side JavaScript for API orchestration and XML generation
- Static language code mapping (200+ languages)
- Integration with three external public APIs (Exonyms, WikiData, GeoNames)
- CDN-loaded UI framework (Bootstrap, jQuery, Font Awesome, Google Fonts)

**Out of scope:**
- Server-side processing or persistence
- User authentication or accounts
- Database or local storage
- Offline functionality
- API rate limiting or caching

## Entry points

| Entry point | Type | Description |
|-------------|------|-------------|
| `index.html` | HTML page | Main application entry; loads all resources and initialises UI |
| `js/exonyms-retriever.js` | JavaScript module | Application logic; exports functions to global scope |
| `js/languages.js` | JavaScript module | Language code mapping; exports `languages` object to global scope |

## Runtime topology

```
Browser (user)
  └── index.html (static)
        ├── js/exonyms-retriever.js (application logic)
        ├── js/languages.js (reference data)
        ├── CDN: jQuery, Bootstrap, Font Awesome, Google Fonts, StartBootstrap
        ├── Exonyms API (https://hmlendea.go.ro/apis/exonyms-api)
        ├── WikiData API (https://www.wikidata.org)
        └── GeoNames API (http://api.geonames.org)
```

## Key capabilities

1. **Exonym retrieval** — Query Exonyms API with WikiData ID (and optional GeoNames ID)
2. **GeoNames resolution** — Resolve WikiData ID to GeoNames ID via WikiData claims (P1566) or GeoNames search fallback
3. **XML generation** — Transform API response into MCN-compatible `<LocationEntity>` XML
4. **Language mapping** — Map 200+ language codes to MCN language identifiers
5. **Clipboard copy** — Copy generated XML to clipboard

## Audience

- MCN mod users needing localized place names
- Contributors extending language support or API integration
- Security reviewers assessing client-side attack surface
- Maintainers deploying to GitHub Pages