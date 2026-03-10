import { test, expect } from '@playwright/test';
import credentials from '../resources/credential.json';
import { LoginPage } from '../pages/LoginPage';

test.describe('SauceDemo', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.open();
  });

  test('purchase items and validate checkout', async () => {
    const inventoryPage = await test.step('Login with valid credentials', async () => {
      return await loginPage.login(credentials.username, credentials.password);
    });

    await test.step('Add Backpack and Fleece Jacket to cart', async () => {
      await inventoryPage.addItemToCart('Sauce Labs Backpack');
      await inventoryPage.addItemToCart('Sauce Labs Fleece Jacket');
    });

    await test.step('Verify cart badge shows 2 items', async () => {
      const badge = await inventoryPage.getCartBadge();
      await expect(badge).toContainText('2');
    });

    const checkoutStepOne = await test.step('Navigate to checkout', async () => {
      const cartPage = await inventoryPage.goToCart();
      return await cartPage.proceedToCheckout();
    });

    const checkoutStepTwo = await test.step('Fill in checkout information', async () => {
      await checkoutStepOne.fillCheckoutInfo('Test', 'User', '12345');
      return await checkoutStepOne.continue();
    });

    const checkoutComplete = await test.step('Finish checkout', async () => {
      return await checkoutStepTwo.finishCheckout();
    });

    await test.step('Verify order confirmation message', async () => {
      await expect(checkoutComplete.getCompleteHeader()).toHaveText('Thank you for your order!');
    });
  });

  test('validate error messages, login and footer text', async () => {
    await test.step('Submit empty form and verify username is required', async () => {
      await loginPage.clickLogin();
      await expect(loginPage.getErrorMessage()).toBeVisible();
      await expect(loginPage.getErrorMessage()).toHaveText('Epic sadface: Username is required');
    });

    await test.step('Submit with only username and verify password is required', async () => {
      await loginPage.fillUsername('standard_user');
      await loginPage.clickLogin();
      await expect(loginPage.getErrorMessage()).toHaveText('Epic sadface: Password is required');
    });

    await test.step('Submit with only password and verify username is required', async () => {
      await loginPage.clearUsername();
      await loginPage.fillPassword('secret_sauce');
      await loginPage.clickLogin();
      await expect(loginPage.getErrorMessage()).toHaveText('Epic sadface: Username is required');
    });

    const inventoryPage = await test.step('Login with valid credentials', async () => {
      return await loginPage.login('standard_user', 'secret_sauce');
    });

    await test.step('Verify footer contains copyright year and Terms of Service', async () => {
      await inventoryPage.scrollToBottom();
      await expect(inventoryPage.getFooter()).toContainText('2026');
      await expect(inventoryPage.getFooter()).toContainText('Terms of Service');
    });
  });
});
