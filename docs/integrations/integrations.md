# Integrations

## Overview

The application integrates with three external HTTP APIs and several CDN-hosted libraries.

## External API integrations

| API | Purpose | Integration point |
|-----|---------|-------------------|
| Exonyms API | Retrieve exonym names for a WikiData ID | `retrieveExonyms()` → `fetchData()` |
| WikiData API | Resolve WikiData ID → GeoNames ID (P1566) | `getGeoNamesId()` → `fetchData()` |
| GeoNames API | Fallback: resolve WikiData ID → GeoNames ID via search | `getGeoNamesId()` → `fetchData()` |

## CDN library integrations

| Library | Version | Purpose | Integration point |
|---------|---------|---------|-------------------|
| jQuery | 3.5.1 slim | DOM manipulation, AJAX | All scripts |
| jQuery Easing | 1.12.1 | Animation easing | StartBootstrap scripts.js |
| Bootstrap | 4.5.3 | UI components, styling | HTML, StartBootstrap scripts.js |
| Font Awesome | 6.4.0 | Icons | HTML |
| Google Fonts | Montserrat, Lato | Typography | HTML |
| StartBootstrap Freelancer CSS | - | Template styling | HTML |
| StartBootstrap Freelancer JS | - | Template scripts | HTML |

## Integration risks

| Risk | Source | Mitigation |
|------|--------|------------|
| API downtime | External APIs | None (manual retry) |
| API breaking change | External APIs | None (monitoring) |
| CDN downtime | CDNs | None (fallback to self-host not implemented) |
| CDN version change | CDNs | None (pinned versions) |
| License change | CDNs | None (monitoring) |
| Mixed content | GeoNames API (HTTP) | None (browser warning) |
| Rate limiting | External APIs | None (shared demo accounts) |

## Integration test points

| Point | Test method |
|-------|-------------|
| Exonyms API URL | Network tab: `Exonyms?wikiDataId=...` |
| WikiData API URL | Network tab: `Special:EntityData/...json` |
| GeoNames API URL | Network tab: `searchJSON?username=...&q=...` |
| jQuery loaded | Console: `typeof $ === 'function'` |
| Bootstrap loaded | Console: `typeof $.fn.modal === 'function'` |
| Font Awesome loaded | Console: `typeof FontAwesome !== 'undefined'` |
| Google Fonts loaded | Computed font of body |
| StartBootstrap CSS loaded | Presence of template styles |
| StartBootstrap JS loaded | Console: `typeof template_scripts_loaded !== 'undefined'` |

## Data flow between integrations

```
User input (WikiData ID)
        │
        ▼
getGeoNamesId() ────┐
        │           │
        ▼           ▼
WikiData API   GeoNames API
        │           │
        └───────┬───┘
                ▼
        GeoNames ID (or null)
                │
                ▼
Exonyms API ◄─────┘
        │
        ▼
{ defaultName, names }
        │
        ▼
transformNameToId() → locationId
        │
        ▼
XML assembly
        │
        ▼
Output textarea
```

## Future integration considerations

| Consideration | Effort |
|---------------|--------|
| Add caching for WikiData/GeoNames lookups | Medium |
| Add retry logic for transient API failures | Medium |
| Add user-configurable API endpoints | Low |
| Migrate to HTTPS for GeoNames (if available) | Low |
| Add fallback for CDN failures (self-host) | High |
| Add Subresource Integrity (SRI) hashes | Low |
| Add API key support (if APIs add auth) | Low |