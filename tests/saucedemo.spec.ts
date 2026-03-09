import { test, expect } from '@playwright/test';
import credentials from './resources/credential.json';

test('purchase items and validate checkout', async ({ page }) => {
  // Open sauce demo page
  await page.goto('https://www.saucedemo.com/');

  // Login
  await page.locator('#user-name').fill(credentials.username);
  await page.locator('#password').fill(credentials.password);
  await page.locator('#login-button').click();

  // inventory.html is loaded after login

  // Add Sauce Labs Backpack and Sauce Labs Fleece Jacket to cart
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click();

  // Validate cart badge shows 2 in top right corner
  const badge = page.locator('[data-test="shopping-cart-badge"]');
  await badge.waitFor({ state: 'visible' }); // this wait is needed
  await expect(badge).toContainText('2');

  // Go to cart and checkout
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.locator('[data-test="checkout"]').click();

  // checkout-step-one.html is loaded

  // Fill checkout info
  await page.locator('[data-test="firstName"]').fill('Test');
  await page.locator('[data-test="lastName"]').fill('User');
  await page.locator('[data-test="postalCode"]').fill('12345');
  await page.locator('[data-test="continue"]').click();

  // checkout-step-two.html is loaded

  // Finish checkout
  await page.locator('[data-test="finish"]').click();

  // checkout-complete.html is loaded

  // Validate thank you message
  await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
});

test('validate error messages, login and footer text', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  // Click login with both fields empty - validate username error
  await page.locator('#login-button').click();
  await expect(page.locator('[data-test="error"]')).toBeVisible();
  await expect(page.locator('[data-test="error"]')).toHaveText('Epic sadface: Username is required');

  // Fill only username, leave password empty - validate password error
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#login-button').click();
  await expect(page.locator('[data-test="error"]')).toHaveText('Epic sadface: Password is required');

  // Fill only password, leave username empty - validate username error
  await page.locator('#user-name').clear();
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();
  await expect(page.locator('[data-test="error"]')).toHaveText('Epic sadface: Username is required');

  // Login with standard_user
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#login-button').click();

  // inventory.html is loaded after login - validate URL contains inventory

  // Scroll down to the bottom of the page
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

  // Validate footer contains 2026 and Terms of Service
  const footer = page.locator('.footer_copy');
  await expect(footer).toContainText('2026');
  await expect(footer).toContainText('Terms of Service');
});
