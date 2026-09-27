# Step 5 Automation Execution and Healing Results

**Date:** 2026-09-27  
**Browser:** Chromium only  
**Command:** `npx playwright test tests/saucedemo-checkout --project=chromium --reporter=line`

## Initial Results

- Total tests: 10
- Passed: 6
- Failed: 4
- Failed tests: TC-01, TC-04, TC-09, TC-10

## Failure Classification and Healing

| Test | Classification | Action | Annotation |
|---|---|---|---|
| TC-01 | Real application defect | Preserved the missing-cart-total assertion and added `test.fail()` | BUG-01: Cart total missing, AC1 |
| TC-04 | Real application defect | Preserved AC5 invalid-data rejection assertions and added `test.fail()` | BUG-02: Invalid data accepted, AC5 |
| TC-09 | Low-severity observation, outside required acceptance criteria | Preserved the direct empty-cart overview redirect assertion and added `test.fail()` | OBS-01: Authenticated empty-cart direct overview remains accessible |
| TC-10 | Real application defect | Preserved the exact rounded subtotal assertion and added `test.fail()` | BUG-03: Floating-point subtotal is not rounded |

No selector or timing failures required healing. The four failing assertions were intentionally retained because they represent the required defect and observation checks. No assertions were weakened or rewritten.

## Final Results

- Total tests: 10
- Passed: 10
- Expected failures: 4, reported by Playwright as passing because of `test.fail()`
- Unexpected failures: 0
- Blocked: 0

Focused rerun of the four affected tests also passed as expected failures. The final full Chromium rerun completed in 11 seconds with `10 passed`.

## Defects

### BUG-01: Cart total missing

- Acceptance criterion: AC1
- The cart does not expose the expected total/subtotal element.
- Test: `tc-01-cart-review.spec.js`

### BUG-02: Invalid checkout data accepted

- Acceptance criterion: AC5
- Special-character names and non-numeric postal data advance to the overview instead of showing validation errors.
- Test: `tc-04-invalid-checkout-data.spec.js`

### BUG-03: Floating-point subtotal

- Multi-item subtotal renders as `Item total: $57.980000000000004` instead of `Item total: $57.98`.
- Test: `tc-10-boundary-multi-item.spec.js`

## Observation

### OBS-01: Empty-cart direct overview access

- Severity: Low
- Direct authenticated navigation to `/checkout-step-two.html` with an empty cart is not redirected as expected by the test, but this behavior is outside the stated acceptance criteria.
- Test: `tc-09-authentication-context.spec.js`

Step 6 was not started.
