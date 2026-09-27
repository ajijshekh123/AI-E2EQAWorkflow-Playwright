const { test, expect } = require('@playwright/test');

test.describe('SauceDemo checkout workflow', () => {
  test('TC-08 Finish completes the order, shows confirmation, and clears the cart', async ({ page }) => {
    // 1. Open the application and log in with the required credentials.
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/inventory\.html/);

    // 1. Add Sauce Labs Backpack, open the cart, and select Checkout.
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(/cart\.html/);
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/checkout-step-one\.html/);

    // 1. Enter valid checkout information and continue to the overview.
    await page.locator('[data-test="firstName"]').fill('Test');
    await page.locator('[data-test="lastName"]').fill('Customer');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Overview');

    // 1. Select Finish to complete the order.
    await page.locator('[data-test="finish"]').click();
    await expect(page).toHaveURL(/checkout-complete\.html/);

    // 2. Verify the completion heading, success message, dispatch text, Back Home, and empty cart.
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Complete!');
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
    await expect(page.locator('[data-test="complete-text"]')).toHaveText(
      'Your order has been dispatched, and will arrive just as fast as the pony can get there!'
    );
    await expect(page.locator('[data-test="back-to-products"]')).toBeVisible();
    await expect(page.locator('[data-test="back-to-products"]')).toBeEnabled();
    await expect(page.locator('[data-test="shopping-cart-link"]')).toHaveAttribute('data-test', 'shopping-cart-link');
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);

    // 3. Select Back Home and verify Products has no prior order item and the cart is empty.
    await page.locator('[data-test="back-to-products"]').click();
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
    await expect(page.locator('.cart_item')).toHaveCount(0);
  });
});
