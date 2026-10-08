# Configuration

## Configuration schema

The application has **no formal configuration system**. All configurable values are hardcoded constants in source files.

## Configuration sources

| Source | Location | Precedence | Modifiable at runtime? |
|--------|----------|------------|------------------------|
| Hardcoded constants | `js/exonyms-retriever.js` | Only source | No (requires code change + redeploy) |
| HTML default attributes | `index.html` | Only source | Yes (user can edit input field) |
| Browser defaults | Browser | Fallback | N/A |

## Hardcoded constants in `js/exonyms-retriever.js`

| Constant | Value | Description | Change impact |
|----------|-------|-------------|---------------|
| `exonymsApiBaseUrl` | `'https://hmlendea.go.ro/apis/exonyms-api'` | Exonyms API base URL | All exonym requests redirect |
| `wikiDataBaseUrl` | `'https://www.wikidata.org'` | WikiData API base URL | GeoNames resolution via WikiData redirects |
| `geoNamesBaseUrl` | `'http://api.geonames.org'` | GeoNames API base URL | Fallback GeoNames lookup redirects |
| `geoNamesUsername` | `'geonamesfreeaccountt'` | GeoNames API username | Rate limits / auth changes affect fallback |

## HTML defaults in `index.html`

| Element | Attribute | Default value | Description |
|---------|-----------|---------------|-------------|
| `#wikiDataId` | `value` | `'Q20717572'` | Default WikiData ID (Minecraft-related location) |
| `#wikiDataId` | `placeholder` | `'Q20717572'` | Placeholder text |
| `#location` | `rows` | `24` | Textarea height |

## Environment-specific configuration

**None.** The application has no concept of environments (development, staging, production). The same source files are deployed to GitHub Pages.

## Override mechanisms

| Mechanism | Supported? | Notes |
|-----------|------------|-------|
| Environment variables | No | No build process to inject them |
| Config file (JSON/YAML) | No | No config loader |
| Query parameters | No | Not read by application |
| localStorage | No | Not used |
| URL hash/fragment | No | Not parsed |
| Browser devtools | Yes | User can manually override globals in console |

## Runtime modification (via browser console)

Since all functions and constants are global, a user can override behaviour at runtime:

```javascript
// Override API endpoints
exonymsApiBaseUrl = 'https://custom-api.example.com/exonyms';
wikiDataBaseUrl = 'https://custom-wikidata.example.org';
geoNamesBaseUrl = 'https://custom-geonames.example.org';
geoNamesUsername = 'myaccount';

// Override default WikiData ID
$('#wikiDataId').val('Q123456');

// Call functions directly
retrieveExonyms();
clearPage();
copyLocation();
```

## Secret management

**No secrets exist in the application.**

- GeoNames username (`geonamesfreeaccountt`) is a public shared demo account
- No API keys, tokens, or credentials
- No database passwords
- No encryption keys

## Configuration validation

**None.** No validation of constants or user input.

## Migration path for adding configuration

If configuration were needed, the recommended approach:

1. Create `js/config.js` with a `Config` object
2. Load `config.js` before `exonyms-retriever.js` in `index.html`
3. Replace hardcoded constants with `Config.exonymsApiBaseUrl` etc.
4. For environment-specific values, use a build step or GitHub Actions to generate `config.js` from secrets
5. Add schema validation (e.g., JSON Schema) if complexity grows