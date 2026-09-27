# SauceDemo Checkout Test Execution Report

**Workflow:** SCRUM-101 SauceDemo checkout  
**Date:** 2026-09-27  
**Application:** https://www.saucedemo.com  
**Environment:** Chromium, 1280x720, `standard_user`  
**Automation command:** `npx playwright test tests/saucedemo-checkout --project=chromium --reporter=line`

## 1. Executive Summary

The test plan contains 10 scenarios, TC-01 through TC-10. All 10 scenarios were executed manually during Step 3 and all 10 were executed automatically during Step 5.

| Measure | Result |
|---|---:|
| Test cases planned | 10 |
| Manual cases executed | 10 |
| Automated cases executed | 10 |
| Manual PASS | 9 PASS, 1 FAIL |
| Automated initial result | 6 passed, 4 failed |
| Automated final result | 10 reported passed, including 4 expected failures |
| Unexpected automated failures | 0 |
| Blocked cases | 0 |
| Overall status | **FAIL / Conditional release** |

The overall status is FAIL because BUG-01, BUG-02, and BUG-03 remain open. The automated suite reports 10 passed only because the four known failure/observation tests use `test.fail()`; the assertions and defect checks remain active and tracked.

## 2. Manual Test Results

Manual exploratory testing used Chromium at 1280x720. No browser action exceeded 60 seconds and no case was blocked.

| Test case | Manual status | Result |
|---|---|---|
| TC-01 | PASS with defect | Cart item details and navigation worked; the required cart total was missing. |
| TC-02 | PASS | Valid checkout data reached the overview. |
| TC-03 | PASS | Required-field errors blocked incomplete submissions. |
| TC-04 | FAIL | Special-character names and non-numeric postal data were accepted and reached the overview. |
| TC-05 | PASS | Overview payment, shipping, item details, and totals were displayed. |
| TC-06 | PASS | Cancel from information and overview preserved the cart and avoided completion. |
| TC-07 | PASS | Browser Back returned from overview to checkout information and the flow could continue. |
| TC-08 | PASS | Order confirmation displayed and completion cleared the cart. |
| TC-09 | PASS with observation | Unauthenticated checkout was protected; direct empty-cart overview behavior was tracked separately as OBS-01 during automation. |
| TC-10 | PASS with observation | Multi-item checkout completed; one-character names and postal code `1` were accepted. |

### Manual evidence

- [TC-01 cart review](../test-evidence/screenshots/TC-01-cart-review.png)
- [TC-02 valid overview](../test-evidence/screenshots/TC-02-valid-overview.png)
- [TC-03 required validation](../test-evidence/screenshots/TC-03-required-validation.png)
- [TC-04 invalid data accepted](../test-evidence/screenshots/TC-04-invalid-data-accepted.png)
- [TC-05 overview](../test-evidence/screenshots/TC-05-overview.png)
- [TC-08 order completion](../test-evidence/screenshots/TC-08-order-complete.png)
- [TC-10 multi-item overview](../test-evidence/screenshots/TC-10-multi-item-overview.png)

Working selectors and detailed manual observations are recorded in [exploratory-testing-results.md](../test-evidence/exploratory-testing-results.md).

## 3. Automated Test Results

Automation covers TC-01 through TC-10 in [tests/saucedemo-checkout](../tests/saucedemo-checkout/), using the selectors discovered during exploration.

### Initial execution

The initial Chromium run produced:

- 10 total tests
- 6 passed
- 4 failed: TC-01, TC-04, TC-09, and TC-10

### Healing and final execution

The healer classified the four failures as three application defects and one low-severity observation. The original assertions were preserved. `test.fail()` and annotations were added to the affected tests:

- TC-01: BUG-01
- TC-04: BUG-02
- TC-09: OBS-01
- TC-10: BUG-03

No selector or timing failures required healing. The final Chromium rerun completed with:

- 10 reported passed
- 4 expected failures handled by `test.fail()`
- 0 unexpected failures
- 0 blocked

The suite is therefore automation-stable, but the product defects remain visible through the expected-failure annotations. Details are in [automation-healing-results.md](../test-evidence/automation-healing-results.md).

### Automated suite mapping

| Suite files | Cases | Final result |
|---|---|---|
| `tc-01-cart-review.spec.js` | TC-01 | Expected failure: BUG-01 |
| `tc-02-valid-checkout.spec.js` | TC-02 | PASS |
| `tc-03-empty-validation.spec.js` | TC-03 | PASS |
| `tc-04-invalid-checkout-data.spec.js` | TC-04 | Expected failure: BUG-02 |
| `tc-05-order-overview.spec.js` | TC-05 | PASS |
| `tc-06-cancel-controls.spec.js` | TC-06 | PASS |
| `tc-07-browser-back.spec.js` | TC-07 | PASS |
| `tc-08-order-completion.spec.js` | TC-08 | PASS |
| `tc-09-authentication-context.spec.js` | TC-09 | Expected failure: OBS-01 |
| `tc-10-boundary-multi-item.spec.js` | TC-10 | Expected failure: BUG-03 |

## 4. Defects Log

All defects were observed against `https://www.saucedemo.com` using `standard_user` in Chromium at 1280x720.

### BUG-01: Cart total missing

- **Severity:** Medium
- **Test / criterion:** TC-01 / AC1
- **Steps to reproduce:** Log in, add Sauce Labs Backpack, open the cart, and inspect the cart summary.
- **Expected:** Cart shows item price and a total/subtotal calculation consistent with the item price and quantity.
- **Actual:** Item details and `$29.99` are shown, but the expected cart total element is absent.
- **Evidence:** [TC-01-cart-review.png](../test-evidence/screenshots/TC-01-cart-review.png)
- **Environment:** Chromium, 1280x720, https://www.saucedemo.com, `standard_user`

### BUG-02: Invalid checkout data is accepted

- **Severity:** Medium
- **Test / criterion:** TC-04 / AC5
- **Steps to reproduce:** Log in, add a product, open Checkout, enter First Name `!!!`, Last Name `###`, and Zip/Postal Code `abc`, then select Continue.
- **Expected:** Format validation errors identify invalid fields and navigation remains on checkout information.
- **Actual:** The application navigates to `/checkout-step-two.html` without a format validation error.
- **Evidence:** [TC-04-invalid-data-accepted.png](../test-evidence/screenshots/TC-04-invalid-data-accepted.png)
- **Environment:** Chromium, 1280x720, https://www.saucedemo.com, `standard_user`

### BUG-03: Floating-point multi-item subtotal

- **Severity:** Low
- **Test / criterion:** TC-10 / multi-item totals under AC3
- **Steps to reproduce:** Log in, add Sauce Labs Onesie (`$7.99`) and Sauce Labs Fleece Jacket (`$49.99`), open Checkout, enter valid information, and inspect the overview.
- **Expected:** Item total is displayed as `$57.98`, with currency rounded to two decimal places.
- **Actual:** The application renders `Item total: $57.980000000000004`.
- **Evidence:** [TC-10-multi-item-overview.png](../test-evidence/screenshots/TC-10-multi-item-overview.png)
- **Environment:** Chromium, 1280x720, https://www.saucedemo.com, `standard_user`

### OBS-01: Authenticated empty-cart direct overview remains accessible

This is an observation, not a defect against the stated acceptance criteria.

- **Severity:** Low
- **Test:** TC-09
- **Steps to reproduce:** Log in with an empty cart and navigate directly to `/checkout-step-two.html`.
- **Expected in the test:** Redirect to a valid login/cart/checkout state.
- **Actual:** The page remains accessible at the overview route.
- **Why separate:** The user story requires authentication for checkout but does not explicitly require blocking authenticated direct access to the overview route with an empty cart.
- **Environment:** Chromium, 1280x720, https://www.saucedemo.com, `standard_user`

## 5. Test Coverage Analysis

| Requirement | Covered by test cases | Manual coverage | Automated coverage |
|---|---|---|---|
| AC1: Cart review, item details, total, navigation | TC-01, TC-10 | Yes; missing cart total recorded as BUG-01 | Yes; TC-01 expected failure, TC-10 multi-item coverage |
| AC2: Checkout information and required fields | TC-02, TC-03 | Yes | Yes |
| AC3: Overview items, payment, shipping, subtotal, tax, total, actions | TC-02, TC-05, TC-07, TC-10 | Yes | Yes; TC-10 expected failure for floating-point formatting |
| AC4: Finish, confirmation, Back Home | TC-08, TC-10 | Yes | Yes |
| AC5: Invalid and incomplete data validation | TC-03, TC-04, TC-10 | Yes; invalid format gap found | Yes; TC-04 expected failure preserves rejection assertion |
| Business rule 1: Users must be logged in to access checkout | TC-09 | Yes | Yes |
| Business rule 2: Order confirmation clears the cart | TC-08, TC-10 | Yes | Yes |
| Navigation and browser Back behavior | TC-06, TC-07 | Yes | Yes |

### Coverage gaps and recommendations

- Only Chromium was executed, as required by the workflow rules; Firefox and WebKit coverage is not included.
- Cart total calculation is not available on the cart page, limiting direct AC1 verification.
- Invalid-data validation needs product-level fixes and additional cases for whitespace, length, and postal-code formats.
- Add an explicit automated assertion for the empty-cart cart-page Checkout control if the product team decides OBS-01 should become a requirement.
- Investigate console errors observed during manual exploration.
- After defect fixes, remove or update the expected-failure annotations and rerun the full suite.

## 6. Summary and Recommendations

The primary checkout workflow is functional: users can review products, enter required information, inspect the order overview, cancel safely, navigate backward, complete an order, and return home with the cart cleared. Authentication protection for the normal checkout entry point also works.

Release risk remains in three areas:

1. AC1 does not provide the required cart total.
2. AC5 accepts clearly invalid checkout values.
3. Multi-item currency formatting exposes an unrounded floating-point value.

Recommended next steps are to fix and retest BUG-01 through BUG-03, decide whether OBS-01 should become an explicit business requirement, and rerun the Chromium suite. The automation suite should continue tracking these conditions with expected failures until the product behavior is corrected.

Step 7 has not been started.
