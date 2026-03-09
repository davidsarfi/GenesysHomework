import { test, expect } from '@playwright/test';
import credentials from './resources/credential.json';
import { LoginPage } from './pages/LoginPage';

test('purchase items and validate checkout', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();

  const inventoryPage = await loginPage.login(credentials.username, credentials.password);

  await inventoryPage.addItemToCart('Sauce Labs Backpack');
  await inventoryPage.addItemToCart('Sauce Labs Fleece Jacket');

  const badge = await inventoryPage.getCartBadge();
  await expect(badge).toContainText('2');

  const cartPage = await inventoryPage.goToCart();
  const checkoutStepOne = await cartPage.proceedToCheckout();

  await checkoutStepOne.fillCheckoutInfo('Test', 'User', '12345');
  const checkoutStepTwo = await checkoutStepOne.continue();

  const checkoutComplete = await checkoutStepTwo.finishCheckout();

  await expect(checkoutComplete.getCompleteHeader()).toHaveText('Thank you for your order!');
});

test('validate error messages, login and footer text', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();

  // Click login with both fields empty - validate username error
  await loginPage.clickLogin();
  await expect(loginPage.getErrorMessage()).toBeVisible();
  await expect(loginPage.getErrorMessage()).toHaveText('Epic sadface: Username is required');

  // Fill only username, leave password empty - validate password error
  await loginPage.fillUsername('standard_user');
  await loginPage.clickLogin();
  await expect(loginPage.getErrorMessage()).toHaveText('Epic sadface: Password is required');

  // Fill only password, leave username empty - validate username error
  await loginPage.clearUsername();
  await loginPage.fillPassword('secret_sauce');
  await loginPage.clickLogin();
  await expect(loginPage.getErrorMessage()).toHaveText('Epic sadface: Username is required');

  // Login with standard_user
  const inventoryPage = await loginPage.login('standard_user', 'secret_sauce');

  await inventoryPage.scrollToBottom();

  await expect(inventoryPage.getFooter()).toContainText('2026');
  await expect(inventoryPage.getFooter()).toContainText('Terms of Service');
});
