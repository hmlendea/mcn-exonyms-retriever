# Invariants

## System invariants

### Runtime invariants

| Invariant | Description | Enforced by |
|-----------|-------------|-------------|
| Single HTML page | Only `index.html` exists | File system |
| Script load order | jQuery → languages → exonyms-retriever | HTML order |
| `languages` global exists | Before `exonyms-retriever.js` executes | Load order |
| `$` global exists | Before any script uses it | jQuery loads first |
| No build step | Source files served directly | Deployment |
| No modules | All scripts global scope | No `type="module"` |

### Data invariants

| Invariant | Description | Enforced by |
|-----------|-------------|-------------|
| WikiData ID format | `Q` + digits (not validated) | Convention |
| `languages` object keys | BCP 47 codes (mostly) | Manual |
| `languages` object values | PascalCase with underscores | Manual |
| Exonyms API response | `{ defaultName, names: { code: { value } } }` | API contract |
| WikiData P1566 claim | Single string value | WikiData |
| GeoNames search result | Exactly 1 for valid ID | Logic check |
| Location ID | Lowercase, underscores, hyphens | `transformNameToId()` |
| XML output | Well-formed (except escaping) | String concatenation |

### Behavioural invariants

| Invariant | Description | Enforced by |
|-----------|-------------|-------------|
| `clearPage()` resets to default | Input = `Q20717572`, output = `` | Function logic |
| `retrieveExonyms()` reads current input | Uses `$('#wikiDataId').val()` | Function logic |
| `getGeoNamesId()` returns string or null | Never throws | Try/catch |
| `fetchData()` throws on non-200 | Explicit check | Function logic |
| `transformNameToId()` is pure | No side effects | Implementation |
| `getNameLines()` sorts alphabetically | `.sort()` call | Function logic |
| `copyLocation()` prepends newline | `'\n' + value` | Function logic |

### UI invariants

| Invariant | Description | Enforced by |
|-----------|-------------|-------------|
| Three buttons | Retrieve, Clear, Copy | HTML |
| Input field present | `#wikiDataId` | HTML |
| Output textarea present | `#location` | HTML |
| Bootstrap classes applied | `btn btn-* btn-xl` | HTML |
| Font Awesome icons | `<i class="fas fa-*">` | HTML |

## Invariant violations (known)

| Invariant | Violation | Impact |
|-----------|-----------|--------|
| XML well-formed | No escaping of `&`, `<`, `>`, `"` | Invalid XML |
| WikiData ID format | Not validated | API errors |
| `languages` keys unique | Duplicates in source | Last wins |
| `languages` values unique | Not required | Duplicate MCN IDs |
| Single-threaded | Sync XHR blocks UI | Poor UX |
| No build step | No minification, no bundling | Larger payload |
| No error handling | Uncaught exceptions | Silent failures |

## Invariant verification

**No automated verification.** Manual checks only:

| Check | Method |
|-------|--------|
| Script load order | View page source |
| Global existence | Console: `typeof languages`, `typeof $` |
| Function existence | Console: `typeof retrieveExonyms` |
| XML output | Visual inspection |
| Network calls | DevTools Network tab |
| Console logs | DevTools Console |

## Regression risks

| Change | Risk to invariants |
|--------|-------------------|
| Reorder script tags | Breaks dependency order |
| Add async to XHR | Breaks synchronous flow |
| Change `languages` format | Breaks `getNameLines()` |
| Modify `transformNameToId()` | Changes location IDs |
| Add build step | Breaks "no build" invariant |
| Add ES modules | Breaks global namespace |

## Design invariants (intentional)

| Invariant | Rationale |
|-----------|-----------|
| Static hosting | Zero server cost, simple deployment |
| Synchronous XHR | Simpler code, no callback hell |
| Global namespace | No module system needed |
| jQuery dependency | Bootstrap requires it |
| Hardcoded endpoints | Single-purpose tool |
| No configuration | Zero-config usage |
| Browser-only | No backend needed |