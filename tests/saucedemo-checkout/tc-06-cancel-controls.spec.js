const { test, expect } = require('@playwright/test');

test.describe('SauceDemo checkout workflow', () => {
  test('TC-06 Cancel controls return the user without completing an order', async ({ page }) => {
    // 1. Open the application, log in, add Sauce Labs Backpack, open the cart, select Checkout, then select Cancel from checkout information.
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/inventory\.html/);
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(/cart\.html/);
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
    await page.locator('[data-test="cancel"]').click();

    // Verify the user returns to cart.html and no order confirmation is shown.
    await expect(page).toHaveURL(/cart\.html/);
    await expect(page).not.toHaveURL(/checkout-complete\.html/);
    await expect(page.locator('[data-test="item-4-title-link"]')).toBeVisible();

    // 2. Repeat setup with valid information and reach checkout-step-two.html, then select Cancel.
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
    await page.locator('[data-test="firstName"]').fill('Test');
    await page.locator('[data-test="lastName"]').fill('Customer');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();

    // Verify checkout-step-two.html and Checkout: Overview are displayed.
    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Overview');

    // Select Cancel from the overview and leave checkout without completing the order.
    await page.locator('[data-test="cancel"]').click();

    // Verify the user leaves the overview without reaching checkout-complete.html.
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page).not.toHaveURL(/checkout-complete\.html/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');

    // Verify the cart remains available for review and Sauce Labs Backpack remains in the cart.
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(/cart\.html/);
    await expect(page.locator('[data-test="item-4-title-link"]')).toHaveText('Sauce Labs Backpack');
  });
});
