const { test, expect } = require('@playwright/test');

test.describe('SauceDemo checkout workflow', () => {
  test('TC-02 Valid checkout information advances to order overview', async ({ page }) => {
    // 1. Establish a fresh cart and open checkout information.
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/inventory\.html/);
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/checkout-step-one\.html/);

    // 2. Verify the checkout form and cart context.
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Your Information');
    await expect(page.locator('[data-test="firstName"]')).toBeVisible();
    await expect(page.locator('[data-test="lastName"]')).toBeVisible();
    await expect(page.locator('[data-test="postalCode"]')).toBeVisible();
    await expect(page.locator('[data-test="cancel"]')).toBeEnabled();
    await expect(page.locator('[data-test="continue"]')).toBeEnabled();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    // 3. Submit valid data and verify the overview item.
    await page.locator('[data-test="firstName"]').fill('Test');
    await page.locator('[data-test="lastName"]').fill('Customer');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Overview');
    const overviewItem = page.locator('.cart_item');
    await expect(overviewItem).toContainText('Sauce Labs Backpack');
    await expect(overviewItem.locator('.cart_quantity')).toHaveText('1');
    await expect(overviewItem).toContainText('$29.99');
  });
});
