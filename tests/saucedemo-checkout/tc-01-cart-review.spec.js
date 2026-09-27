const { test, expect } = require('@playwright/test');

test.describe('SauceDemo checkout workflow', () => {
  test('TC-01 Cart review shows item details, total, and navigation controls', async ({ page }) => {
    test.fail();
    test.info().annotations.push({ type: 'bug', description: 'BUG-01: Cart total missing (AC1)' });

    // 1. Log in, add Sauce Labs Backpack, and verify the selected item is in the cart.
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/inventory\.html/);
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    // 2. Review the cart contents, price, total, and navigation controls.
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(/cart\.html/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Your Cart');
    const cartItem = page.locator('.cart_item');
    await expect(cartItem).toContainText('Sauce Labs Backpack');
    await expect(cartItem).toContainText('$29.99');
    await expect(cartItem.locator('.cart_quantity')).toHaveText('1');
    await expect(page.locator('[data-test="total-label"]')).toBeVisible();
    await expect(page.locator('[data-test="continue-shopping"]')).toBeEnabled();
    await expect(page.locator('[data-test="checkout"]')).toBeEnabled();

    // 3. Continue shopping and verify the cart item is preserved.
    await page.locator('[data-test="continue-shopping"]').click();
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    // 4. Reopen the cart and proceed to checkout information.
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Your Information');
  });
});
