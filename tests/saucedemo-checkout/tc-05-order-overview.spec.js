const { test, expect } = require('@playwright/test');

test.describe('SauceDemo checkout workflow', () => {
  test('TC-05 Order overview shows payment, shipping, item summary, totals, and actions', async ({ page }) => {
    // 1. Reach the overview using one Sauce Labs Backpack and valid checkout data.
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/inventory\.html/);
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(/cart\.html/);
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
    await page.locator('[data-test="firstName"]').fill('Test');
    await page.locator('[data-test="lastName"]').fill('Customer');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Overview');

    // 2. Inspect the item summary and payment and shipping information.
    const item = page.locator('.cart_item');
    await expect(item.locator('.cart_quantity')).toHaveText('1');
    await expect(item.locator('[data-test="item-4-title-link"]')).toHaveText('Sauce Labs Backpack');
    await expect(item.locator('[data-test="inventory-item-desc"]')).toHaveText(
      'carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.'
    );
    await expect(item.locator('[data-test="inventory-item-price"]')).toHaveText('$29.99');
    await expect(page.locator('[data-test="payment-info-value"]')).toHaveText('SauceCard #31337');
    await expect(page.locator('[data-test="shipping-info-value"]')).toHaveText('Free Pony Express Delivery!');

    // 3. Inspect price totals and verify that the total equals item total plus tax.
    await expect(page.locator('[data-test="total-info-label"]')).toHaveText('Price Total');
    const itemTotalText = await page.locator('[data-test="subtotal-label"]').textContent();
    const taxText = await page.locator('[data-test="tax-label"]').textContent();
    const totalText = await page.locator('[data-test="total-label"]').textContent();
    expect(itemTotalText).toContain('Item total: $29.99');
    expect(taxText).toContain('Tax: $2.40');
    expect(totalText).toContain('Total: $32.39');
    const itemTotal = Number(itemTotalText.replace(/[^0-9.]/g, ''));
    const tax = Number(taxText.replace(/[^0-9.]/g, ''));
    const total = Number(totalText.replace(/[^0-9.]/g, ''));
    expect(total).toBeCloseTo(itemTotal + tax, 2);

    // 4. Verify the overview actions are visible, enabled, and clearly labelled.
    await expect(page.locator('[data-test="cancel"]')).toHaveText('Cancel');
    await expect(page.locator('[data-test="cancel"]')).toBeEnabled();
    await expect(page.locator('[data-test="finish"]')).toHaveText('Finish');
    await expect(page.locator('[data-test="finish"]')).toBeEnabled();
  });
});
