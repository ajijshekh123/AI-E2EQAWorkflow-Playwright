const { test, expect } = require('@playwright/test');

test.describe('SauceDemo checkout workflow', () => {
  test('TC-10 Boundary and multi-item totals remain consistent through checkout', async ({ page }) => {
    test.fail();
    test.info().annotations.push({ type: 'bug', description: 'BUG-03: Floating-point total (subtotal is not rounded)' });

    // 1. Log in and add Sauce Labs Onesie and Sauce Labs Fleece Jacket.
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
    await page.locator('[data-test="add-to-cart-sauce-labs-onesie"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

    // 2. Open the cart and verify both products, quantities, and prices.
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(/cart\.html/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Your Cart');
    await expect(page.locator('.cart_item')).toHaveCount(2);
    await expect(page.locator('[data-test="item-2-title-link"]')).toHaveText('Sauce Labs Onesie');
    await expect(page.locator('[data-test="item-5-title-link"]')).toHaveText('Sauce Labs Fleece Jacket');
    await expect(page.locator('.cart_item').nth(0).locator('.cart_quantity')).toHaveText('1');
    await expect(page.locator('.cart_item').nth(1).locator('.cart_quantity')).toHaveText('1');
    await expect(page.getByText('$7.99')).toBeVisible();
    await expect(page.getByText('$49.99')).toBeVisible();

    // 2. Proceed through checkout with valid information.
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
    await page.locator('[data-test="firstName"]').fill('Test');
    await page.locator('[data-test="lastName"]').fill('Customer');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Overview');
    await expect(page.locator('.cart_item')).toHaveCount(2);
    await expect(page.locator('[data-test="item-2-title-link"]')).toHaveText('Sauce Labs Onesie');
    await expect(page.locator('[data-test="item-5-title-link"]')).toHaveText('Sauce Labs Fleece Jacket');
    await expect(page.locator('[data-test="subtotal-label"]')).toHaveText('Item total: $57.98');
    await expect(page.locator('[data-test="tax-label"]')).toHaveText('Tax: $4.64');
    await expect(page.locator('[data-test="total-label"]')).toHaveText('Total: $62.62');
    expect(57.98 + 4.64).toBe(62.62);

    // 3. Finish and verify completion clears the cart.
    await page.locator('[data-test="finish"]').click();
    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Complete!');
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);

    // 4. Start a fresh cart for the boundary-value checkout.
    await page.locator('[data-test="back-to-products"]').click();
    await expect(page).toHaveURL(/inventory\.html/);
    await page.locator('[data-test="add-to-cart-sauce-labs-onesie"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();

    // 5. Submit one-character names and the shortest non-empty postal code.
    await page.locator('[data-test="firstName"]').fill('A');
    await page.locator('[data-test="lastName"]').fill('B');
    await page.locator('[data-test="postalCode"]').fill('1');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Overview');
    await expect(page.locator('[data-test="subtotal-label"]')).toHaveText('Item total: $57.98');

    // 5. Complete the boundary-value order and verify the cart is empty.
    await page.locator('[data-test="finish"]').click();
    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
    await page.locator('[data-test="back-to-products"]').click();
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  });
});