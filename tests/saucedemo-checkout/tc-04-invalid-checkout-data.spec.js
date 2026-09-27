const { test, expect } = require('@playwright/test');

test.describe('SauceDemo checkout workflow', () => {
  test('TC-04 Invalid checkout data is rejected with appropriate validation', async ({ page }) => {
    test.fail();
    test.info().annotations.push({ type: 'bug', description: 'BUG-02: Invalid data accepted (AC5)' });

    // 1. Establish a cart and open checkout-step-one.
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/inventory\.html/);
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/checkout-step-one\.html/);

    // 2. AC5: invalid names and a non-numeric postal code must be rejected.
    await page.locator('[data-test="firstName"]').fill('!!!');
    await page.locator('[data-test="lastName"]').fill('###');
    await page.locator('[data-test="postalCode"]').fill('abc');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText(/invalid|format|valid/i);

    // 3. Whitespace-only values must also remain blocked with a field error.
    await page.locator('[data-test="firstName"]').fill('   ');
    await page.locator('[data-test="lastName"]').fill('A');
    await page.locator('[data-test="postalCode"]').fill('   ');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
    await expect(page.locator('[data-test="error"]')).toBeVisible();

    // 4. Valid values should clear validation and reach the overview.
    await page.locator('[data-test="firstName"]').fill('Test');
    await page.locator('[data-test="lastName"]').fill('Customer');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(/checkout-step-two\.html/);
  });
});
