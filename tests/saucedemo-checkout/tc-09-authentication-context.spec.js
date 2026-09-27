const { test, expect } = require('@playwright/test');

test.describe('SauceDemo checkout workflow', () => {
  test('TC-09 Checkout requires authentication and a valid cart context', async ({ browser }) => {
    test.fail();
    test.info().annotations.push({ type: 'observation', description: 'OBS-01: Authenticated empty-cart direct checkout remains on overview (low severity)' });

    // 1. In a fresh browser context, navigate directly to checkout-step-one.html without logging in.
    const unauthenticatedContext = await browser.newContext();
    const unauthenticatedPage = await unauthenticatedContext.newPage();
    await unauthenticatedPage.goto('https://www.saucedemo.com/checkout-step-one.html');
    await expect(unauthenticatedPage).toHaveURL('https://www.saucedemo.com/');
    await expect(unauthenticatedPage.locator('[data-test="login-button"]')).toBeVisible();
    await unauthenticatedContext.close();

    // 2. Log in as standard_user, then navigate directly to checkout-step-two.html with an empty cart.
    const emptyCartContext = await browser.newContext();
    const emptyCartPage = await emptyCartContext.newPage();
    await emptyCartPage.goto('https://www.saucedemo.com/');
    await emptyCartPage.locator('[data-test="username"]').fill('standard_user');
    await emptyCartPage.locator('[data-test="password"]').fill('secret_sauce');
    await emptyCartPage.locator('[data-test="login-button"]').click();
    await expect(emptyCartPage).toHaveURL(/inventory\.html/);
    await emptyCartPage.goto('https://www.saucedemo.com/checkout-step-two.html');
    await expect(emptyCartPage).toHaveURL('https://www.saucedemo.com/');
    await expect(emptyCartPage.locator('[data-test="login-button"]')).toBeVisible();
    await expect(emptyCartPage).not.toHaveURL(/checkout-step-two\.html|checkout-complete\.html/);
    await emptyCartContext.close();

    // 3. Log in, add an item, and verify the normal cart-to-checkout path works.
    const validCartContext = await browser.newContext();
    const validCartPage = await validCartContext.newPage();
    await validCartPage.goto('https://www.saucedemo.com/');
    await validCartPage.locator('[data-test="username"]').fill('standard_user');
    await validCartPage.locator('[data-test="password"]').fill('secret_sauce');
    await validCartPage.locator('[data-test="login-button"]').click();
    await expect(validCartPage).toHaveURL(/inventory\.html/);
    await validCartPage.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(validCartPage.locator('.shopping_cart_badge')).toHaveText('1');
    await validCartPage.locator('[data-test="shopping-cart-link"]').click();
    await expect(validCartPage).toHaveURL(/cart\.html/);
    await validCartPage.locator('[data-test="checkout"]').click();
    await expect(validCartPage).toHaveURL(/checkout-step-one\.html/);
    await expect(validCartPage.getByText('Checkout: Your Information')).toBeVisible();
    await expect(validCartPage.locator('[data-test="firstName"]')).toBeVisible();
    await expect(validCartPage.locator('[data-test="lastName"]')).toBeVisible();
    await expect(validCartPage.locator('[data-test="postalCode"]')).toBeVisible();
    await validCartContext.close();
  });
});
