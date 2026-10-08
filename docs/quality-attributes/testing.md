# Testing

## Test strategy

The application has no formal test suite. All testing is manual and browser-based.

## Manual test procedures

### Test: Valid WikiData ID with GeoNames ID

| Step | Action | Expected |
|------|--------|----------|
| 1 | Open `index.html` in browser | Default WikiData ID: `Q20717572` |
| 2 | Verify input field shows `Q20717572` | ✓ |
| 3 | Click "Retrieve Exonyms" | Network requests visible |
| 4 | Wait for completion | XML output in textarea |
| 5 | Verify GeoNamesId present | ✓ (if P1566 exists) |
| 6 | Verify names present | ✓ (if API returns names) |

### Test: Valid WikiData ID without GeoNames ID

| Step | Action | Expected |
|------|--------|----------|
| 1 | Open `index.html` | Default WikiData ID |
| 2 | Find WikiData ID without P1566 claim | e.g., search for entity |
| 3 | Retrieve Exonyms | XML output without GeoNamesId |
| 4 | Verify GeoNamesId absent | ✓ |

### Test: Invalid WikiData ID

| Step | Action | Expected |
|------|--------|----------|
| 1 | Change input to `Q9999999` | Invalid entity |
| 2 | Click "Retrieve Exonyms" | Console error |
| 3 | Verify textarea unchanged or error | ✓ (uncaught exception) |

### Test: Empty input

| Step | Action | Expected |
|------|--------|----------|
| 1 | Clear input field | Empty |
| 2 | Click "Retrieve Exonyms" | Error (invalid URL) |

### Test: Copy to clipboard

| Step | Action | Expected |
|------|--------|----------|
| 1 | Retrieve exonyms (valid ID) | XML in textarea |
| 3 | Click "Copy" button | Copies content + newline |
| 4 | Paste into text editor | XML content present |

### Test: Clear button

| Step | Action | Expected |
|------|--------|----------|
| 1 | Any state | — |
| 2 | Click "Clear" | Input = `Q20717572`, output = `` |

## Test coverage

| Function | Tested? | Method |
|----------|---------|--------|
| `clearPage()` | Yes | Manual: click Clear |
| `retrieveExonyms()` | Yes | Manual: click Retrieve |
| `copyLocation()` | Yes | Manual: click Copy |
| `getGeoNamesId()` | Indirect | Via manual retrieval |
| `transformNameToId()` | Indirect | Via output inspection |
| `getName()` | Indirect | Via output inspection |
| `getNameLine()` | Indirect | Via output inspection |
| `getNameLines()` | Indirect | Via output inspection |
| `getNameLine2variants()` | Indirect | Via output inspection |
| `fetchData()` | No | No unit tests |
| `isSingleElementArray()` | No | No unit tests |

## Test environment

| Component | Requirement |
|-----------|-----------|
| Browser | Any modern browser |
| DevTools | Recommended for debugging |
| Network access | Required (API calls) |
| Internet connectivity | Required |
| No firewall/proxy blocking CDNs | Required |

## Automated testing (not implemented)

| Framework | Status |
|-----------|--------|
| Jest | Not configured |
| Mocha | Not configured |
| Jasmine | Not configured |
| Playwright | Not configured |
| Cypress | Not configured |
| Selenium | Not configured |

## Code quality checks

| Check | Status |
|-------|--------|
| Lint | None configured |
| Type checking | None (vanilla JS) |
| Unit tests | None |
| Integration tests | None |
| End-to-end tests | None |
| Code coverage | N/A |

## Known test limitations

1. **No test isolation** — Browser state persists between tests
2. **No mocking** — Real API calls made
3. **No CI/CD** — No automated test running
4. **No test runner** — No npm scripts for testing
5. **No assertions** — Manual verification only
6. **No test data** — No fixtures or mock data files

## Potential automated test scenarios

```javascript
// Example (not implemented): Jest + JSDOM
describe('exonyms-retriever', () => {
    beforeEach(() => {
        // Load scripts into JSDOM
    });

    test('clearPage sets default values', () => {
        clearPage();
        expect($('#wikiDataId').val()).toBe('Q20717572');
        expect($('#location').val()).toBe('');
    });

    test('transformNameToId converts correctly', () => {
        expect(transformNameToId('Bucharest')).toBe('bucharest');
    });
});
```

## Regression testing

**Not applicable.** No automated tests exist to regress.

## Test environment setup

1. Open workspace in VS Code
2. Open `index.html` in browser
3. Open DevTools (F12) for console monitoring
4. Click "Retrieve Exonyms" to test
5. Click "Clear" to reset
6. Click "Copy" to test clipboard

## Test metrics (estimated)

| Metric | Value |
|--------|-------|
| Test cases manual | ~15 |
| Test cases automated | 0 |
| Code coverage | 0% |
| Bugs found by testing | Unknown |
| Known issues | 7+ (see docs/known-issues) |

## Acceptance criteria

| Criteria | Status |
|----------|--------|
| Manual retrieval works | ✓ |
| XML output format correct | ✓ (structurally) |
| Copy to clipboard works | ✓ |
| Clear resets form | ✓ |
| No unit tests exist | ✓ |
| No automated testing | ✓ |