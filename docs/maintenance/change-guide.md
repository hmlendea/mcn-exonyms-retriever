# Change Guide

## Purpose

Guide for making changes to the codebase safely and consistently.

## Change categories

| Category | Examples | Risk |
|----------|----------|------|
| UI text | Button labels, placeholders | Low |
| Styling | Colors, spacing, layout | Low |
| Language mappings | Add/remove/modify `languages.js` | Medium |
| API endpoints | Change base URLs | Medium |
| Transform algorithm | Modify `transformNameToId()` | High |
| Core logic | Modify `retrieveExonyms()`, `getGeoNamesId()` | High |
| Script load order | Reorder `<script>` tags | High |
| Dependencies | Add/remove CDN scripts | Medium |

## Pre-change checklist

- [ ] Understand current behaviour (read relevant docs)
- [ ] Identify affected files
- [ ] Check for tests (none exist)
- [ ] Plan manual verification steps
- [ ] Consider backward compatibility

## Making changes

### 1. UI text changes

**Files:** `index.html`

```html
<!-- Before -->
<button onclick="retrieveExonyms()">Retrieve Exonyms</button>

<!-- After -->
<button onclick="retrieveExonyms()">Get Exonyms</button>
```

**Verification:** Open in browser, verify text.

### 2. Styling changes

**Files:** `css/custom.css`

```css
/* Before */
.btn-xl { padding: 1rem 2rem; }

/* After */
.btn-xl { padding: 0.75rem 1.5rem; }
```

**Verification:** Open in browser, check layout at all breakpoints.

### 3. Language mapping changes

**Files:** `js/languages.js`

```javascript
// Add new language
"new-code": "New_Language",

// Remove language
// delete languages["old-code"];  // or just remove line

// Modify mapping
"existing-code": "New_Identifier",
```

**Verification:**
1. Reload page
2. Console: `languages["new-code"]` → `"New_Language"`
3. Retrieve exonyms for known ID
4. Verify new language appears in output

**Risks:**
- Duplicate keys → last wins silently
- Code not in Exonyms API → no output (silent)
- Value format mismatch → MCN may reject

### 4. API endpoint changes

**Files:** `js/exonyms-retriever.js`

```javascript
// Before
const exonymsApiBaseUrl = 'https://hmlendea.go.ro/apis/exonyms-api';

// After
const exonymsApiBaseUrl = 'https://new-api.example.com';
```

**Verification:**
1. Reload page
2. Retrieve exonyms
3. Check Network tab for new URL
4. Verify output format unchanged

**Risks:**
- CORS may block new domain
- Response format may differ
- Rate limits may differ

### 5. Transform algorithm changes

**Files:** `js/exonyms-retriever.js` → `transformNameToId()`

```javascript
// Add new rule
name = name.replace(/newpattern/g, 'replacement');
```

**Verification:**
1. Create test cases for known inputs
2. Console: `transformNameToId('Test Input')`
3. Compare with expected output
4. Full retrieval test

**Risks:**
- Changes all location IDs
- May break MCN compatibility
- Order of transformations matters

### 6. Core logic changes

**Files:** `js/exonyms-retriever.js`

**High-risk functions:**
- `retrieveExonyms()` — main flow
- `getGeoNamesId()` — dual API fallback
- `getNameLines()` — output generation
- `fetchData()` — network primitive

**Process:**
1. Read function documentation
2. Make minimal change
3. Test each code path manually
4. Test error scenarios

### 7. Script load order changes

**Files:** `index.html`

**Current order (must maintain):**
1. jQuery
2. jQuery Easing
3. Bootstrap JS
4. StartBootstrap JS
5. languages.js
6. exonyms-retriever.js

**Rules:**
- jQuery before everything that uses `$`
- languages.js before exonyms-retriever.js
- CSS before JS that depends on styles
- Bootstrap JS after jQuery

### 8. Adding new dependencies

**Files:** `index.html`

```html
<!-- Add before scripts that need it -->
<script src="https://cdn.example.com/new-lib.js"></script>
```

**Verification:**
1. Reload page
2. Console: `typeof NewLib` → `'function'` or `'object'`
3. Check for console errors

## Post-change verification

### Minimum verification

- [ ] Page loads without console errors
- [ ] Default WikiData ID retrieves successfully
- [ ] Output XML is well-formed (visual check)
- [ ] Copy button works
- [ ] Clear button works

### Extended verification

- [ ] Test with 3+ different WikiData IDs
- [ ] Test with ID that has P1566 claim
- [ ] Test with ID without P1566 (GeoNames fallback)
- [ ] Test with invalid ID
- [ ] Test at mobile breakpoint
- [ ] Check Network tab for failed requests

## Common pitfalls

| Pitfall | Prevention |
|---------|------------|
| Breaking script order | Read host-and-composition.md first |
| Forgetting `languages` dependency | Check getNameLines() usage |
| Invalid XML output | Add escaping for `&`, `<`, `>`, `"` |
| Sync XHR timeout | Test slow network (throttle in DevTools) |
| Mixed content (HTTP GeoNames) | Check console for warnings |
| Duplicate language keys | Search for duplicates before adding |

## Rollback procedure

```bash
# Revert single file
git checkout HEAD -- js/exonyms-retriever.js

# Revert commit
git revert <commit-hash>

# Hard reset (dangerous)
git reset --hard HEAD~1
git push --force
```

## Versioning

**No formal versioning.** Changes deployed on push to main.

**Recommended:** Tag significant changes
```bash
git tag -a v1.1.0 -m "Add XML escaping"
git push origin v1.1.0
```

## Code review (self-review)

Since no team, self-review checklist:

- [ ] Change is minimal and focused
- [ ] No console errors on load
- [ ] Core functionality works
- [ ] Edge cases considered
- [ ] Documentation updated if needed
- [ ] No secrets committed

## Emergency fixes

For production issues:

1. Identify minimal fix
2. Apply directly to `main`
3. Push immediately
4. Verify live site
5. Document in commit message