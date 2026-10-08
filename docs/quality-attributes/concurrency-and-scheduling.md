# Concurrency and Scheduling

## Concurrency model

**Single-threaded, synchronous, blocking.**

| Aspect | Detail |
|--------|--------|
| JavaScript engine | Single-threaded event loop |
| Web Workers | Not used |
| Async/await | Not used |
| Promises | Not used |
| Callbacks | Only jQuery `$(document).ready()` |
| Event loop | Blocked during sync XHR |

## Execution timeline

```
Page load
    │
    ├─► Parse HTML (main thread)
    │
    ├─► Load scripts sequentially (main thread blocked)
    │       ├─► jQuery
    │       ├─► jQuery easing
    │       ├─► Bootstrap
    │       ├─► StartBootstrap
    │       ├─► languages.js
    │       └─► exonyms-retriever.js
    │
    ├─► DOMContentLoaded
    │
    ├─► $(document).ready() → clearPage() (main thread)
    │
    └─► Idle (waiting for user)
            │
            └─► User clicks Retrieve
                    │
                    ├─► retrieveExonyms() (main thread)
                    │       ├─► getGeoNamesId()
                    │       │       ├─► fetchData() → WikiData API (SYNC XHR - BLOCKS)
                    │       │       └─► fetchData() → GeoNames API (SYNC XHR - BLOCKS, fallback)
                    │       │
                    │       ├─► fetchData() → Exonyms API (SYNC XHR - BLOCKS)
                    │       │
                    │       ├─► transformNameToId() (main thread)
                    │       │
                    │       ├─► getNameLines() (main thread)
                    │       │
                    │       └─► DOM update (main thread)
                    │
                    └─► Return to idle
```

## Synchronous XHR blocking

```javascript
function fetchData(url) {
    const request = new XMLHttpRequest();
    request.open('GET', url, false);  // async = false
    request.send();  // BLOCKS HERE until response
    // ...
}
```

**During `request.send()` with `async: false`:**
- Main thread is completely blocked
- No UI updates
- No event handlers fire
- No timers execute
- No other JavaScript runs
- Browser may show "Page unresponsive" dialog

## Blocking duration

| API call | Typical duration | Max observed |
|----------|------------------|--------------|
| WikiData API | 100-500ms | 2000ms |
| GeoNames API | 100-500ms | 2000ms |
| Exonyms API | 200-1000ms | 5000ms |
| **Total (sequential)** | **400-2000ms** | **9000ms** |

## No scheduling

| Scheduling mechanism | Used? |
|---------------------|-------|
| `setTimeout` | No |
| `setInterval` | No |
| `requestAnimationFrame` | No |
| `requestIdleCallback` | No |
| `queueMicrotask` | No |
| Web Workers | No |
| Service Workers | No |

## No concurrency control

| Mechanism | Used? |
|-----------|-------|
| Mutex/lock | No |
| Semaphore | No |
| Atomic operations | No |
| Transaction | No |
| Optimistic locking | No |
| Pessimistic locking | No |

## Race conditions

| Scenario | Risk |
|----------|------|
| Double-click Retrieve | Two concurrent `retrieveExonyms()` calls |
| Click Retrieve during retrieval | Second call queued after first (but UI frozen) |
| Rapid Clear + Retrieve | Unpredictable state |

**No protection against any race condition.**

## Thread safety

**Not applicable** — single-threaded JavaScript.

However, DOM mutations during sync XHR are not visible until XHR completes.

## Memory during blocking

- No memory allocation during XHR wait (browser handles)
- Stack frames retained for all callers
- No garbage collection during block (browser-dependent)

## Cancellation

**Not supported.** Once `retrieveExonyms()` starts:
- Cannot cancel
- Cannot pause
- Cannot interrupt
- Must wait for all XHR to complete or timeout

## Timeout behaviour

| Timeout type | Behaviour |
|--------------|-----------|
| Browser XHR timeout | Default (no timeout set) — waits indefinitely |
| Browser script timeout | May trigger "Page unresponsive" dialog |
| Network timeout | OS/TCP level (typically minutes) |
| Application timeout | None |

## Parallelism opportunities (not exploited)

| Operation | Could be parallel? | Current |
|-----------|-------------------|---------|
| WikiData + GeoNames | Yes (independent) | Sequential (fallback) |
| Exonyms API | Independent of GeoNames | After GeoNames |
| Name generation | Independent of APIs | After Exonyms |
| DOM update | After all computation | Last step |

## Future concurrency improvements

| Improvement | Effort | Impact |
|-------------|--------|--------|
| Convert to `fetch()` + async/await | Medium | Non-blocking UI |
| Add loading indicator | Low | Better UX |
| Add cancellation (AbortController) | Medium | User control |
| Parallel WikiData + GeoNames | Low (with async) | Faster retrieval |
| Web Worker for transform | High | Offload main thread |
| Request queuing | Low | Prevent double-click |

## Current scheduling guarantees

| Guarantee | Status |
|-----------|--------|
| FIFO execution | Yes (single thread) |
| No starvation | Yes (no background work) |
| Bounded latency | No (unbounded XHR) |
| Priority inversion | N/A |
| Deadlock freedom | Yes (no locks) |
| Livelock freedom | Yes (no retries) |