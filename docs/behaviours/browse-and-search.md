# Browse and Search

## Overview

The application does not implement traditional browse or search functionality. It is a single-purpose tool: given a WikiData ID, retrieve exonyms and generate MCN-compatible XML.

## User workflow

```
1. User opens index.html
2. User sees default WikiData ID (Q20717572) in input field
3. User optionally changes WikiData ID
4. User clicks "Retrieve Exonyms" button
5. Application fetches data (blocking)
6. XML output appears in textarea
7. User optionally clicks "Copy" to copy XML to clipboard
8. User optionally clicks "Clear" to reset
```

## Input handling

### WikiData ID input (`#wikiDataId`)

| Aspect | Behaviour |
|--------|-----------|
| Type | `<input type="text">` |
| Default value | `Q20717572` (set by `clearPage()`) |
| Validation | None |
| Sanitization | None |
| Encoding | None (direct URL interpolation) |
| Max length | None (browser default) |
| Placeholder | None |
| Autocomplete | Browser default |

### Accepted formats

| Format | Example | Works? |
|--------|---------|--------|
| Standard WikiData ID | `Q20717572` | Yes |
| Lowercase | `q20717572` | Yes (WikiData accepts) |
| With prefix | `wd:Q20717572` | No (invalid URL) |
| URL | `https://www.wikidata.org/wiki/Q20717572` | No (invalid URL) |
| Empty | `` | No (invalid URL) |
| Invalid | `ABC123` | No (API returns error) |

## Button behaviours

### Retrieve Exonyms button

```html
<button type="button" class="btn btn-primary btn-xl" onclick="retrieveExonyms()">
    Retrieve Exonyms
</button>
```

| Event | Behaviour |
|-------|-----------|
| Click | Calls `retrieveExonyms()` |
| During execution | UI frozen (sync XHR) |
| Success | Textarea populated with XML |
| Failure | Console error; textarea unchanged |
| Double-click | Two concurrent executions (race condition) |
| Enter key in input | No (not wired) |

### Clear button

```html
<button type="button" class="btn btn-secondary btn-xl" onclick="clearPage()">
    Clear
</button>
```

| Event | Behaviour |
|-------|-----------|
| Click | Calls `clearPage()` |
| Effect | `#wikiDataId` = `Q20717572`, `#location` = `` |
| During retrieval | No effect (UI frozen) |

### Copy button

```html
<button type="button" class="btn btn-success btn-xl" onclick="copyLocation()">
    Copy
</button>
```

| Event | Behaviour |
|-------|-----------|
| Click | Calls `copyLocation()` |
| Effect | Textarea content + newline copied to clipboard |
| Empty textarea | Copies newline only |
| During retrieval | No effect (UI frozen) |
| Success feedback | None |
| Failure feedback | None (silent) |

## Output handling

### Output textarea (`#location`)

| Aspect | Behaviour |
|--------|-----------|
| Type | `<textarea>` |
| Read-only | No (user can edit) |
| Rows | 20 (HTML attribute) |
| Cols | Not specified |
| Wrap | Browser default (soft) |
| Scroll | Browser default |
| Selection | Standard textarea selection |
| Context menu | Browser default |

### XML output format

```xml
  <LocationEntity>
    <Id>location_id</Id>
    <GeoNamesId>123456</GeoNamesId>  <!-- optional -->
    <WikiDataId>Q20717572</WikiDataId>
    <GameIds>
    </GameIds>
    <Names>
      <Name language="English" value="Name" />
      <!-- ... -->
    </Names>
  </LocationEntity>
```

- Indentation: 2 spaces per level
- No XML declaration
- No DTD/schema reference
- Self-closing `<Name />` elements
- Attributes double-quoted
- No escaping of `&`, `<`, `>`, `"` in values

## Keyboard navigation

| Key | Context | Behaviour |
|-----|---------|-----------|
| Tab | Any | Standard focus order |
| Enter | Input field | No action (form not submitted) |
| Enter | Button focused | Activates button |
| Escape | Any | Browser default |
| Ctrl+C | Textarea focused | Copy selection |
| Ctrl+A | Textarea focused | Select all |
| Ctrl+V | Input focused | Paste |

## Mouse interaction

| Action | Element | Behaviour |
|--------|---------|-----------|
| Click | Input | Focus, place cursor |
| Click | Retrieve button | Execute retrieval |
| Click | Clear button | Reset form |
| Click | Copy button | Copy to clipboard |
| Click | Textarea | Focus, place cursor |
| Drag-select | Textarea | Select text |
| Right-click | Textarea | Browser context menu |
| Double-click | Textarea | Select word |
| Triple-click | Textarea | Select line |

## Touch interaction

| Gesture | Element | Behaviour |
|---------|---------|-----------|
| Tap | Input | Focus, show keyboard |
| Tap | Button | Execute action |
| Tap | Textarea | Focus, show keyboard |
| Long press | Textarea | Selection handles |
| Pinch zoom | Any | Browser zoom |

## Responsive behaviour

| Breakpoint | Layout changes |
|------------|----------------|
| <576px (xs) | Stacked buttons, full-width inputs |
| ≥576px (sm) | Inline buttons |
| ≥768px (md) | Standard layout |
| ≥992px (lg) | Standard layout |
| ≥1200px (xl) | Standard layout |

Bootstrap 4 grid handles responsiveness automatically.

## Accessibility

| Feature | Status |
|---------|--------|
| Semantic HTML | Partial (buttons, inputs, labels) |
| Label association | `<label for="wikiDataId">` present |
| ARIA attributes | None |
| Focus indicators | Bootstrap default |
| Colour contrast | Bootstrap default |
| Keyboard operable | Yes |
| Screen reader tested | No |
| Alt text | N/A (no images) |

## Internationalisation

| Aspect | Status |
|--------|--------|
| UI language | English only |
| RTL support | No |
| Number formatting | N/A |
| Date formatting | N/A |
| Currency | N/A |
| Language names | Used only as XML attribute values |

## Error states

| Error | User visible? | Recovery |
|-------|---------------|----------|
| Network error | No (console only) | Retry button click |
| Invalid WikiData ID | No (console only) | Correct input, retry |
| API rate limit | No (console only) | Wait, retry |
| CORS error | No (console only) | Cannot recover |
| Mixed content (GeoNames HTTP) | Browser warning | Cannot fix (API limitation) |
| XML special chars in name | Invalid XML output | Manual edit |

## Edge cases

| Scenario | Behaviour |
|----------|-----------|
| Very long WikiData ID | Sent as-is; API likely returns 404 |
| Unicode in WikiData ID | Sent as-is; URL encoding issues possible |
| Rapid button clicks | Multiple concurrent sync XHRs (race) |
| Browser back/forward | No state restoration |
| Page refresh | Resets to default |
| Multiple tabs | Independent (no shared state) |
| Offline | All requests fail; console errors |
| Large response | Textarea handles (tested ~100KB) |

## Performance perception

| Metric | Value |
|--------|-------|
| Time to interactive | ~300ms (after scripts load) |
| Retrieval latency | 400-2000ms (blocking) |
| UI responsiveness during retrieval | Frozen |
| Copy latency | <10ms |
| Clear latency | <1ms |

## Known UX issues

1. **No loading indicator** — User doesn't know if request is in progress
2. **No error display** — User doesn't know if request failed
3. **UI freeze** — Cannot cancel or interact during retrieval
4. **No input validation** — Invalid IDs cause confusing failures
5. **No progress feedback** — No indication of which API is being called
6. **Copy has no feedback** — User doesn't know if copy succeeded
7. **Enter key doesn't trigger retrieval** — Must click button
8. **No keyboard shortcut for copy** — Must click button
9. **Textarea not read-only** — User can accidentally modify output
10. **No copy confirmation** — No toast, no button state change