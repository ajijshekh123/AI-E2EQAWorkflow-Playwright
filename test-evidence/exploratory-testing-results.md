# Step 3 Exploratory Testing Results

**Application:** https://www.saucedemo.com  
**Date:** 2026-09-27  
**Browser:** Chromium only  
**Viewport:** 1280x720 throughout; no resize performed  
**Credentials:** `standard_user` / `secret_sauce`

## Summary

TC-01 through TC-10 were executed manually with Playwright MCP browser tools. No browser action exceeded 60 seconds, so no test case was marked BLOCKED.

| Test case | Status | Findings |
|---|---|---|
| TC-01 Cart review | PASS | Backpack displayed with quantity, description, price, cart navigation, Continue Shopping, and Checkout. |
| TC-02 Valid checkout information | PASS | Valid `Test` / `Customer` / `12345` reached `/checkout-step-two.html` with the selected item. |
| TC-03 Empty checkout fields | PASS | Empty submission stayed on checkout information and reported field-specific required errors for First Name, Last Name, and Postal Code. |
| TC-04 Invalid checkout data | FAIL | `!!!`, `###`, and `abc` were accepted and advanced to overview without format validation. This violates AC5. |
| TC-05 Order overview | PASS | Payment, shipping, item summary, subtotal `$29.99`, tax `$2.40`, total `$32.39`, Cancel, and Finish were present. |
| TC-06 Cancel controls | PASS | Cancel from information returned to cart; Cancel from overview returned to Products; cart remained available and order did not complete. |
| TC-07 Browser Back navigation | PASS | Browser Back from overview returned to checkout information; valid values could be re-entered and the overview reopened without duplicate items. |
| TC-08 Order completion | PASS | Finish reached confirmation, displayed success and Back Home, and cleared the cart. Back Home returned to Products with an empty cart. |
| TC-09 Authentication/cart context | PASS | Direct unauthenticated checkout redirected to login; authenticated direct overview with an empty cart redirected to login. |
| TC-10 Boundary and multi-item totals | PASS with observation | Onesie `$7.99` plus Fleece Jacket `$49.99` produced item total `$57.98` and completed successfully. One-character names and postal code `1` were accepted. |

## Working Selectors

- Login: `[data-test="username"]`, `[data-test="password"]`, `[data-test="login-button"]`
- Products and cart: `[data-test="add-to-cart-sauce-labs-backpack"]`, `[data-test="add-to-cart-sauce-labs-onesie"]`, `[data-test="add-to-cart-sauce-labs-fleece-jacket"]`, `[data-test="shopping-cart-link"]`
- Cart actions: `[data-test="continue-shopping"]`, `[data-test="checkout"]`
- Checkout form: `[data-test="firstName"]`, `[data-test="lastName"]`, `[data-test="postalCode"]`, `[data-test="continue"]`, `[data-test="cancel"]`
- Completion: `[data-test="finish"]`, `[data-test="back-to-products"]`
- Authentication/navigation: `#react-burger-menu-btn`, `#logout_sidebar_link`
- Useful assertions: `/inventory.html`, `/cart.html`, `/checkout-step-one.html`, `/checkout-step-two.html`, `/checkout-complete.html`; `.cart_item`; `.shopping_cart_badge`; `[data-test="error"]`

## Detailed Findings

### TC-01 PASS

The cart showed the Backpack with quantity 1, description, and `$29.99`. Continue Shopping returned to Products with the cart preserved. Checkout navigated to checkout information.

Evidence: [TC-01-cart-review.png](screenshots/TC-01-cart-review.png), [TC-01-cart-review.yml](screenshots/TC-01-cart-review.yml)

### TC-02 PASS

The checkout information form accepted `Test`, `Customer`, and `12345` and navigated to the overview with the selected item.

Evidence: [TC-02-valid-overview.png](screenshots/TC-02-valid-overview.png)

### TC-03 PASS

The application remained on checkout information for missing values and displayed the expected required-field messages in sequence.

Evidence: [TC-03-required-validation.png](screenshots/TC-03-required-validation.png)

### TC-04 FAIL: AC5 validation gap

Expected: special-character names and non-numeric postal code should be rejected.  
Actual: `!!!`, `###`, and `abc` advanced to `/checkout-step-two.html` with no format error.

Evidence: [TC-04-invalid-data-accepted.png](screenshots/TC-04-invalid-data-accepted.png)

### TC-05 PASS

The overview displayed SauceCard #31337, Free Pony Express Delivery!, Item total `$29.99`, Tax `$2.40`, Total `$32.39`, Cancel, and Finish.

Evidence: [TC-05-overview.png](screenshots/TC-05-overview.png), [TC-05-overview.yml](screenshots/TC-05-overview.yml)

### TC-06 PASS

Both Cancel paths avoided completion and preserved the cart. Information Cancel returned to `/cart.html`; overview Cancel returned to `/inventory.html`.

### TC-07 PASS

Browser Back returned from `/checkout-step-two.html` to `/checkout-step-one.html`. Re-entering valid information returned to the overview without duplicate cart items or corrupted totals.

### TC-08 PASS

Finish reached `/checkout-complete.html`; the confirmation message, dispatch text, Back Home control, and empty cart state were present. Back Home returned to `/inventory.html` with no cart badge.

Evidence: [TC-08-order-complete.png](screenshots/TC-08-order-complete.png)

### TC-09 PASS

Unauthenticated direct navigation to checkout information redirected to `/`. After login, direct navigation to checkout overview with an empty cart also redirected to `/`.

### TC-10 PASS with boundary observation

The Onesie and Fleece Jacket remained intact through cart and checkout. The overview showed item total `$57.98`, and Finish completed the order. Minimum non-empty values `A`, `B`, and `1` were accepted without format validation; this is an additional AC5 boundary observation.

Evidence: [TC-10-multi-item-overview.png](screenshots/TC-10-multi-item-overview.png)

## Defects and Observations

### DEF-AC5-001: Invalid checkout values are accepted

- **Severity:** Medium
- **Status:** FAIL
- **Steps:** Log in, add a product, open Checkout, enter `!!!`, `###`, and `abc`, then select Continue.
- **Expected:** Field-specific validation errors and no navigation.
- **Actual:** The app navigated to `/checkout-step-two.html` without a format error.
- **Acceptance criterion:** AC5
- **Evidence:** `TC-04-invalid-data-accepted.png`

### OBS-AC5-002: Minimum values are accepted without documented format rules

One-character names and postal code `1` were accepted. This may be valid if no minimum-length rule exists, but the behavior should be documented or validated consistently.

## Execution Notes

- Chrome/Chromium was the only browser used, per the general rules in `QA_E2E_Prompt.md`.
- The browser remained at 1280x720 for all checks.
- No action required the 60-second BLOCKED threshold.
- Console errors were observed during the session but did not prevent the tested UI flows; they are noted for later investigation.
- Step 4 was not started.
