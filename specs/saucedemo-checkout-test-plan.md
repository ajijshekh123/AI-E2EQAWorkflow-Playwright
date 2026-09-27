# SauceDemo Checkout Test Plan

## Application Overview

Test plan for SCRUM-101 SauceDemo checkout flow. Execute in Chromium only against https://www.saucedemo.com using standard_user / secret_sauce. Start each test from a fresh application state unless the steps explicitly establish cart contents. The plan covers AC1-AC5, cart review, checkout information, validation, overview totals, completion, navigation, browser back behavior, UI controls, access rules, and order cart clearing. Browser exploration observed routes cart.html, checkout-step-one.html, checkout-step-two.html, and checkout-complete.html. The live application accepted special-character names and a non-numeric postal code, so the invalid-data scenarios retain the required AC5 expectation and should expose that defect if reproduced.

## Test Scenarios

### 1. SauceDemo checkout workflow

**Seed:** `tests/seed.spec.ts`

#### 1.1. TC-01 Cart review shows item details, total, and navigation controls

**File:** `specs/saucedemo-checkout-test-plan.md`

**Test Data Requirements:** `standard_user` / `secret_sauce`; Sauce Labs Backpack.

**Steps:**
  1. Open https://www.saucedemo.com, log in with username standard_user and password secret_sauce, and add Sauce Labs Backpack from the products page.
    - expect: Login succeeds and the products page is displayed.
    - expect: The selected product changes to a remove state and the cart badge shows 1.
  2. Open the cart.
    - expect: The URL is cart.html and the page heading is Your Cart.
    - expect: The cart contains Sauce Labs Backpack with quantity 1, product description, and price $29.99.
    - expect: A cart total/subtotal is displayed and is mathematically consistent with the item price and quantity; if absent, record a UI defect against AC1.
    - expect: Continue Shopping and Checkout buttons are visible, enabled, and have clear labels.
  3. Select Continue Shopping.
    - expect: The user returns to the products page and the cart still contains the selected item.
  4. Open the cart again and select Checkout.
    - expect: The user is redirected to checkout-step-one.html and sees the Checkout: Your Information heading.

#### 1.2. TC-02 Valid checkout information advances to order overview

**File:** `specs/saucedemo-checkout-test-plan.md`

**Test Data Requirements:** `standard_user` / `secret_sauce`; Sauce Labs Backpack; First Name `Test`; Last Name `Customer`; Zip/Postal Code `12345`.

**Steps:**
  1. From a fresh state, log in, add Sauce Labs Backpack, open the cart, and select Checkout.
    - expect: checkout-step-one.html is displayed with a Checkout information form.
  2. Verify the form UI.
    - expect: First Name, Last Name, and Zip/Postal Code textboxes are present, identifiable, and usable.
    - expect: Cancel and Continue buttons are present and enabled.
    - expect: The cart badge still shows 1.
  3. Enter First Name Test, Last Name Customer, and Zip/Postal Code 12345, then select Continue.
    - expect: The browser navigates to checkout-step-two.html.
    - expect: The Checkout: Overview heading is displayed.
    - expect: The overview contains the selected item and its quantity, description, and price.

#### 1.3. TC-03 Empty checkout fields show required validation and block progress

**File:** `specs/saucedemo-checkout-test-plan.md`

**Test Data Requirements:** `standard_user` / `secret_sauce`; one cart product; empty fields; First Name `Test`; Last Name `Customer`.

**Steps:**
  1. From a fresh state, log in, add one product, open the cart, and select Checkout.
    - expect: The checkout information form is displayed.
  2. Leave all fields empty and select Continue.
    - expect: The URL remains checkout-step-one.html.
    - expect: An alert/error states Error: First Name is required.
    - expect: The overview is not opened.
  3. Enter Test in First Name, leave Last Name and Zip/Postal Code empty, and select Continue.
    - expect: The URL remains checkout-step-one.html.
    - expect: An error states Last Name is required.
    - expect: The overview is not opened.
  4. Enter Customer in Last Name, leave Zip/Postal Code empty, and select Continue.
    - expect: The URL remains checkout-step-one.html.
    - expect: An error states Zip/Postal Code is required.
    - expect: The overview is not opened.
  5. Dismiss the error and verify the form controls and entered values.
    - expect: The error can be dismissed with its dismiss control.
    - expect: Previously entered values remain available for correction and the user can submit again.

#### 1.4. TC-04 Invalid checkout data is rejected with appropriate validation

**File:** `specs/saucedemo-checkout-test-plan.md`

**Test Data Requirements:** `standard_user` / `secret_sauce`; one cart product; invalid values `!!!`, `###`, `abc`; whitespace-only values; valid fallback values `Test`, `Customer`, `12345`.

**Steps:**
  1. From a fresh state, reach checkout-step-one.html with one item in the cart.
    - expect: The checkout information form is displayed.
  2. Enter !!! as First Name, ### as Last Name, and abc as Zip/Postal Code, then select Continue.
    - expect: Special-character names and a non-numeric postal code are rejected with appropriate validation errors.
    - expect: The user remains on checkout-step-one.html and cannot reach the overview.
  3. Replace the fields with incomplete boundary values: a whitespace-only first name, a one-character last name, and a postal code containing only spaces; select Continue.
    - expect: Whitespace-only values are treated as empty or invalid.
    - expect: The user remains on the information page with a clear field-specific error.
  4. Replace the fields with valid values Test, Customer, and 12345 and select Continue.
    - expect: Validation clears and the user reaches checkout-step-two.html.

#### 1.5. TC-05 Order overview shows payment, shipping, item summary, totals, and actions

**File:** `specs/saucedemo-checkout-test-plan.md`

**Test Data Requirements:** `standard_user` / `secret_sauce`; Sauce Labs Backpack at `$29.99`; First Name `Test`; Last Name `Customer`; Zip/Postal Code `12345`.

**Steps:**
  1. Reach the overview using one Sauce Labs Backpack and valid data Test / Customer / 12345.
    - expect: The URL is checkout-step-two.html and the Checkout: Overview heading is visible.
  2. Inspect the item summary and information sections.
    - expect: The item summary shows quantity 1, Sauce Labs Backpack, its description, and $29.99.
    - expect: Payment Information displays SauceCard #31337.
    - expect: Shipping Information displays Free Pony Express Delivery!.
  3. Inspect price totals.
    - expect: Price Total is visible with Item total $29.99, Tax $2.40, and Total $32.39.
    - expect: The total equals item total plus tax.
  4. Verify overview actions.
    - expect: Cancel and Finish buttons are visible, enabled, and clearly labelled.

#### 1.6. TC-06 Cancel controls return the user without completing an order

**File:** `specs/saucedemo-checkout-test-plan.md`

**Test Data Requirements:** `standard_user` / `secret_sauce`; Sauce Labs Backpack; valid checkout values `Test` / `Customer` / `12345`.

**Steps:**
  1. Reach checkout-step-one.html with one item and select Cancel.
    - expect: The user returns to the cart or products page according to the application navigation contract.
    - expect: No order confirmation is shown and no order is completed.
  2. Repeat setup with valid information and reach checkout-step-two.html, then select Cancel.
    - expect: The user leaves the overview without seeing checkout-complete.html.
    - expect: The cart remains available for review and the item is not silently treated as a completed order.

#### 1.7. TC-07 Browser back navigation preserves safe flow boundaries

**File:** `specs/saucedemo-checkout-test-plan.md`

**Test Data Requirements:** `standard_user` / `secret_sauce`; Sauce Labs Backpack; valid checkout values `Test` / `Customer` / `12345`.

**Steps:**
  1. Reach checkout-step-two.html with valid checkout information and note the displayed overview values.
    - expect: The overview is displayed with the item and totals.
  2. Use the browser Back button once.
    - expect: The user returns to checkout-step-one.html.
    - expect: The information form is displayed and the overview is not displayed.
    - expect: Previously entered values are either retained or cleared consistently; exploration observed that values were cleared, so record unexpected loss if the product requirement expects retention.
  3. Use the browser Forward button or re-enter valid information and continue again.
    - expect: The user can return to checkout-step-two.html without duplicate items or corrupted totals.
  4. From checkout-step-two.html, use the browser Back button again and then navigate back to the cart using the visible Cancel control.
    - expect: Navigation remains within the checkout/cart flow and does not create a completed order.

#### 1.8. TC-08 Finish completes the order, shows confirmation, and clears the cart

**File:** `specs/saucedemo-checkout-test-plan.md`

**Test Data Requirements:** `standard_user` / `secret_sauce`; Sauce Labs Backpack; valid checkout values `Test` / `Customer` / `12345`.

**Steps:**
  1. Reach checkout-step-two.html with one item and valid checkout information, then select Finish.
    - expect: The URL is checkout-complete.html.
    - expect: The page heading is Checkout: Complete!.
  2. Inspect the confirmation content and UI.
    - expect: Thank you for your order! is displayed.
    - expect: The dispatch/delivery confirmation text is displayed.
    - expect: A Back Home button is visible and enabled.
    - expect: The cart badge is empty, confirming the order cleared the cart.
  3. Select Back Home.
    - expect: The user returns to inventory.html/products.
    - expect: The cart remains empty and no prior order item is present.

#### 1.9. TC-09 Checkout requires authentication and a valid cart context

**File:** `specs/saucedemo-checkout-test-plan.md`

**Test Data Requirements:** Fresh unauthenticated context; `standard_user` / `secret_sauce`; empty cart and one-product cart states; Sauce Labs Backpack.

**Steps:**
  1. In a fresh browser context, navigate directly to checkout-step-one.html without logging in.
    - expect: The application prevents unauthenticated checkout access and redirects to login or an equivalent protected state.
  2. Log in as standard_user but attempt to navigate directly to checkout-step-two.html with an empty cart.
    - expect: The application prevents an invalid direct overview flow or returns to a valid cart/checkout start state.
    - expect: No order can be completed without cart contents and checkout information.
  3. Log in, add an item, and verify the normal cart-to-checkout path works.
    - expect: The authenticated user can access checkout through the intended UI flow.

#### 1.10. TC-10 Boundary and multi-item totals remain consistent through checkout

**File:** `specs/saucedemo-checkout-test-plan.md`

**Test Data Requirements:** `standard_user` / `secret_sauce`; Sauce Labs Onesie at `$7.99`; Sauce Labs Fleece Jacket at `$49.99`; valid values `Test` / `Customer` / `12345`; one-character names; shortest non-empty postal code.

**Steps:**
  1. From a fresh state, log in and add two different products, for example Sauce Labs Onesie at $7.99 and Sauce Labs Fleece Jacket at $49.99.
    - expect: The cart badge shows 2 and both products appear once in the cart with their correct quantities and prices.
  2. Review the cart and proceed through checkout with valid data.
    - expect: The cart and overview contain both products without loss, duplication, or quantity changes.
    - expect: The overview item total equals $57.98 before tax.
  3. Inspect the overview total and then use Finish.
    - expect: Tax and total are displayed, total is greater than item total by the displayed tax, and the order completes with the cart empty.
  4. Repeat with the smallest valid-looking values that the application accepts: single-character names and the shortest non-empty postal code, then verify whether validation matches the documented data rules.
    - expect: The application either clearly accepts documented minimum lengths or shows field-specific validation; record any undocumented acceptance as a boundary defect.
