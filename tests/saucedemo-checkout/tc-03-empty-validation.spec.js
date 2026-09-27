const { test, expect } = require('@playwright/test');

test.describe('SauceDemo checkout workflow', () => {
  test('TC-03 Empty checkout fields show required validation and block progress', async ({ page }) => {
    // 1. Establish a cart and open the checkout information form.
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/inventory\.html/);
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/checkout-step-one\.html/);

    // 2. Empty submission must remain on checkout-step-one.
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
    await expect(page.locator('[data-test="error"]')).toContainText('Error: First Name is required');

    // 3. First name alone should produce the last-name validation.
    await page.locator('[data-test="firstName"]').fill('Test');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
    await expect(page.locator('[data-test="error"]')).toContainText('Error: Last Name is required');

    // 4. First and last names without postal code should be rejected.
    await page.locator('[data-test="lastName"]').fill('Customer');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
    await expect(page.locator('[data-test="error"]')).toContainText('Error: Postal Code is required');

    // 5. Dismiss the error and confirm values remain available for correction.
    await page.locator('[data-test="error-button"]').click();
    await expect(page.locator('[data-test="firstName"]')).toHaveValue('Test');
    await expect(page.locator('[data-test="lastName"]')).toHaveValue('Customer');
  });
});
