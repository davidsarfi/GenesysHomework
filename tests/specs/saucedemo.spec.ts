import { test, expect } from '@playwright/test';
import credentials from '../resources/credential.json';
import { LoginPage } from '../pages/saucedemo/LoginPage';
import { InventoryPage } from '../pages/saucedemo/InventoryPage';

test.describe('SauceDemo', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.open();
  });

  // ─── LOGIN TESTS ───────────────────────────────────────────────

  test.describe('Login', () => {
    test('login with standard_user', async () => {
      const inventoryPage = await loginPage.login('standard_user', 'secret_sauce');
      await expect(inventoryPage.getTitle()).toHaveText('Products');
    });

    test('login with locked_out_user shows error', async () => {
      await loginPage.loginExpectingError('locked_out_user', 'secret_sauce');
      await expect(loginPage.getErrorMessage()).toHaveText(
        'Epic sadface: Sorry, this user has been locked out.'
      );
    });

    test('login with performance_glitch_user', async () => {
      const inventoryPage = await loginPage.login(credentials.username, credentials.password);
      await expect(inventoryPage.getTitle()).toHaveText('Products');
    });

    test('login with problem_user', async () => {
      const inventoryPage = await loginPage.login('problem_user', 'secret_sauce');
      await expect(inventoryPage.getTitle()).toHaveText('Products');
    });

    test('login with visual_user', async () => {
      const inventoryPage = await loginPage.login('visual_user', 'secret_sauce');
      await expect(inventoryPage.getTitle()).toHaveText('Products');
    });

    test('login with error_user', async () => {
      const inventoryPage = await loginPage.login('error_user', 'secret_sauce');
      await expect(inventoryPage.getTitle()).toHaveText('Products');
    });

    test('login with invalid credentials shows error', async () => {
      await loginPage.loginExpectingError('invalid_user', 'wrong_password');
      await expect(loginPage.getErrorMessage()).toHaveText(
        'Epic sadface: Username and password do not match any user in this service'
      );
    });

    test('login with valid username and wrong password shows error', async () => {
      await loginPage.loginExpectingError('standard_user', 'wrong_password');
      await expect(loginPage.getErrorMessage()).toHaveText(
        'Epic sadface: Username and password do not match any user in this service'
      );
    });

    test('submit empty form shows username required error', async () => {
      await loginPage.clickLogin();
      await expect(loginPage.getErrorMessage()).toHaveText('Epic sadface: Username is required');
    });

    test('submit with only username shows password required error', async () => {
      await loginPage.loginExpectingError('standard_user', '');
      await expect(loginPage.getErrorMessage()).toHaveText('Epic sadface: Password is required');
    });

    test('submit with only password shows username required error', async () => {
      await loginPage.loginExpectingError('', 'secret_sauce');
      await expect(loginPage.getErrorMessage()).toHaveText('Epic sadface: Username is required');
    });

    test('error message can be dismissed', async () => {
      await loginPage.clickLogin();
      await expect(loginPage.getErrorMessage()).toBeVisible();
      await loginPage.dismissError();
      await expect(loginPage.getErrorMessage()).not.toBeVisible();
    });
  });

  // ─── INVENTORY TESTS ──────────────────────────────────────────

  test.describe('Inventory', () => {
    let inventoryPage: InventoryPage;

    test.beforeEach(async () => {
      inventoryPage = await loginPage.login('standard_user', 'secret_sauce');
    });

    test('displays 6 products', async () => {
      expect(await inventoryPage.getProductCount()).toBe(6);
    });

    test('page title shows Products', async () => {
      await expect(inventoryPage.getTitle()).toHaveText('Products');
    });

    test('sort products by name A to Z', async () => {
      await inventoryPage.sortBy('az');
      const names = await inventoryPage.getProductNames();
      const sorted = [...names].sort();
      expect(names).toEqual(sorted);
    });

    test('sort products by name Z to A', async () => {
      await inventoryPage.sortBy('za');
      const names = await inventoryPage.getProductNames();
      const sorted = [...names].sort().reverse();
      expect(names).toEqual(sorted);
    });

    test('sort products by price low to high', async () => {
      await inventoryPage.sortBy('lohi');
      const prices = await inventoryPage.getProductPrices();
      const sorted = [...prices].sort((a, b) => a - b);
      expect(prices).toEqual(sorted);
    });

    test('sort products by price high to low', async () => {
      await inventoryPage.sortBy('hilo');
      const prices = await inventoryPage.getProductPrices();
      const sorted = [...prices].sort((a, b) => b - a);
      expect(prices).toEqual(sorted);
    });

    test('add item to cart and badge shows 1', async () => {
      await inventoryPage.addItemToCart('Sauce Labs Backpack');
      await expect(inventoryPage.getCartBadge()).toHaveText('1');
    });

    test('add multiple items and badge updates correctly', async () => {
      await inventoryPage.addItemToCart('Sauce Labs Backpack');
      await inventoryPage.addItemToCart('Sauce Labs Bike Light');
      await inventoryPage.addItemToCart('Sauce Labs Bolt T-Shirt');
      await expect(inventoryPage.getCartBadge()).toHaveText('3');
    });

    test('remove item from cart and badge disappears', async () => {
      await inventoryPage.addItemToCart('Sauce Labs Backpack');
      await inventoryPage.removeItemFromCart('Sauce Labs Backpack');
      await expect(inventoryPage.getCartBadge()).not.toBeVisible();
    });

    test('navigate to product detail page', async () => {
      const itemPage = await inventoryPage.clickProduct('Sauce Labs Backpack');
      await expect(itemPage.getItemName()).toHaveText('Sauce Labs Backpack');
      await expect(itemPage.getItemPrice()).toBeVisible();
      await expect(itemPage.getItemDescription()).toBeVisible();
    });

    test('navigate to product detail and back to products', async () => {
      const itemPage = await inventoryPage.clickProduct('Sauce Labs Backpack');
      const returnedInventory = await itemPage.backToProducts();
      await expect(returnedInventory.getTitle()).toHaveText('Products');
    });

    test('add to cart from product detail page', async () => {
      const itemPage = await inventoryPage.clickProduct('Sauce Labs Backpack');
      await itemPage.addToCart();
      await expect(itemPage.getRemoveButton()).toBeVisible();
    });

    test('remove from cart on product detail page', async () => {
      const itemPage = await inventoryPage.clickProduct('Sauce Labs Backpack');
      await itemPage.addToCart();
      await itemPage.removeFromCart();
      await expect(itemPage.getAddToCartButton()).toBeVisible();
    });
  });

  // ─── CART TESTS ────────────────────────────────────────────────

  test.describe('Cart', () => {
    test('added items appear in cart with correct names', async () => {
      const inventoryPage = await loginPage.login('standard_user', 'secret_sauce');
      await inventoryPage.addItemToCart('Sauce Labs Backpack');
      await inventoryPage.addItemToCart('Sauce Labs Bike Light');
      const cartPage = await inventoryPage.goToCart();
      const names = await cartPage.getItemNames();
      expect(names).toContain('Sauce Labs Backpack');
      expect(names).toContain('Sauce Labs Bike Light');
      expect(await cartPage.getItemCount()).toBe(2);
    });

    test('remove item from cart page', async () => {
      const inventoryPage = await loginPage.login('standard_user', 'secret_sauce');
      await inventoryPage.addItemToCart('Sauce Labs Backpack');
      await inventoryPage.addItemToCart('Sauce Labs Bike Light');
      const cartPage = await inventoryPage.goToCart();
      await cartPage.removeItem('Sauce Labs Backpack');
      const names = await cartPage.getItemNames();
      expect(names).not.toContain('Sauce Labs Backpack');
      expect(await cartPage.getItemCount()).toBe(1);
    });

    test('continue shopping returns to inventory', async () => {
      const inventoryPage = await loginPage.login('standard_user', 'secret_sauce');
      const cartPage = await inventoryPage.goToCart();
      const returnedInventory = await cartPage.continueShopping();
      await expect(returnedInventory.getTitle()).toHaveText('Products');
    });

    test('cart shows correct quantities', async () => {
      const inventoryPage = await loginPage.login('standard_user', 'secret_sauce');
      await inventoryPage.addItemToCart('Sauce Labs Backpack');
      const cartPage = await inventoryPage.goToCart();
      const quantities = await cartPage.getItemQuantities();
      expect(quantities[0]).toBe('1');
    });

    test('empty cart shows no items', async () => {
      const inventoryPage = await loginPage.login('standard_user', 'secret_sauce');
      const cartPage = await inventoryPage.goToCart();
      expect(await cartPage.getItemCount()).toBe(0);
    });

    test('cart prices match inventory prices', async () => {
      const inventoryPage = await loginPage.login('standard_user', 'secret_sauce');
      await inventoryPage.addItemToCart('Sauce Labs Backpack');
      const cartPage = await inventoryPage.goToCart();
      const prices = await cartPage.getItemPrices();
      expect(prices[0]).toBe('$29.99');
    });
  });

  // ─── CHECKOUT TESTS ───────────────────────────────────────────

  test.describe('Checkout', () => {
    test('checkout validation - all fields empty', async () => {
      const inventoryPage = await loginPage.login('standard_user', 'secret_sauce');
      await inventoryPage.addItemToCart('Sauce Labs Backpack');
      const cartPage = await inventoryPage.goToCart();
      const checkoutStepOne = await cartPage.proceedToCheckout();
      await checkoutStepOne.clickContinue();
      await expect(checkoutStepOne.getErrorMessage()).toHaveText('Error: First Name is required');
    });

    test('checkout validation - missing last name', async () => {
      const inventoryPage = await loginPage.login('standard_user', 'secret_sauce');
      await inventoryPage.addItemToCart('Sauce Labs Backpack');
      const cartPage = await inventoryPage.goToCart();
      const checkoutStepOne = await cartPage.proceedToCheckout();
      await checkoutStepOne.fillCheckoutInfo('Test', '', '');
      await checkoutStepOne.clickContinue();
      await expect(checkoutStepOne.getErrorMessage()).toHaveText('Error: Last Name is required');
    });

    test('checkout validation - missing postal code', async () => {
      const inventoryPage = await loginPage.login('standard_user', 'secret_sauce');
      await inventoryPage.addItemToCart('Sauce Labs Backpack');
      const cartPage = await inventoryPage.goToCart();
      const checkoutStepOne = await cartPage.proceedToCheckout();
      await checkoutStepOne.fillCheckoutInfo('Test', 'User', '');
      await checkoutStepOne.clickContinue();
      await expect(checkoutStepOne.getErrorMessage()).toHaveText('Error: Postal Code is required');
    });

    test('cancel checkout returns to cart', async () => {
      const inventoryPage = await loginPage.login('standard_user', 'secret_sauce');
      await inventoryPage.addItemToCart('Sauce Labs Backpack');
      const cartPage = await inventoryPage.goToCart();
      const checkoutStepOne = await cartPage.proceedToCheckout();
      const returnedCart = await checkoutStepOne.cancel();
      expect(await returnedCart.getItemCount()).toBe(1);
    });

    test('checkout overview shows correct items', async () => {
      const inventoryPage = await loginPage.login('standard_user', 'secret_sauce');
      await inventoryPage.addItemToCart('Sauce Labs Backpack');
      await inventoryPage.addItemToCart('Sauce Labs Bike Light');
      const cartPage = await inventoryPage.goToCart();
      const checkoutStepOne = await cartPage.proceedToCheckout();
      await checkoutStepOne.fillCheckoutInfo('Test', 'User', '12345');
      const checkoutStepTwo = await checkoutStepOne.continue();
      const items = await checkoutStepTwo.getItemNames();
      expect(items).toContain('Sauce Labs Backpack');
      expect(items).toContain('Sauce Labs Bike Light');
    });

    test('checkout overview displays subtotal, tax and total', async () => {
      const inventoryPage = await loginPage.login('standard_user', 'secret_sauce');
      await inventoryPage.addItemToCart('Sauce Labs Backpack');
      const cartPage = await inventoryPage.goToCart();
      const checkoutStepOne = await cartPage.proceedToCheckout();
      await checkoutStepOne.fillCheckoutInfo('Test', 'User', '12345');
      const checkoutStepTwo = await checkoutStepOne.continue();
      await expect(checkoutStepTwo.getSubtotal()).toContainText('$29.99');
      await expect(checkoutStepTwo.getTax()).toBeVisible();
      await expect(checkoutStepTwo.getTotal()).toBeVisible();
    });

    test('cancel on checkout overview returns to inventory', async () => {
      const inventoryPage = await loginPage.login('standard_user', 'secret_sauce');
      await inventoryPage.addItemToCart('Sauce Labs Backpack');
      const cartPage = await inventoryPage.goToCart();
      const checkoutStepOne = await cartPage.proceedToCheckout();
      await checkoutStepOne.fillCheckoutInfo('Test', 'User', '12345');
      const checkoutStepTwo = await checkoutStepOne.continue();
      const returnedInventory = await checkoutStepTwo.cancel();
      await expect(returnedInventory.getTitle()).toHaveText('Products');
    });
  });

  // ─── COMPLETE PURCHASE FLOW ────────────────────────────────────

  test.describe('Complete Purchase Flow', () => {
    test('purchase single item and validate checkout', async () => {
      const inventoryPage = await loginPage.login('standard_user', 'secret_sauce');
      await inventoryPage.addItemToCart('Sauce Labs Backpack');
      const cartPage = await inventoryPage.goToCart();
      const checkoutStepOne = await cartPage.proceedToCheckout();
      await checkoutStepOne.fillCheckoutInfo('Test', 'User', '12345');
      const checkoutStepTwo = await checkoutStepOne.continue();
      const checkoutComplete = await checkoutStepTwo.finishCheckout();
      await expect(checkoutComplete.getCompleteHeader()).toHaveText('Thank you for your order!');
      await expect(checkoutComplete.getCompleteText()).toBeVisible();
      await expect(checkoutComplete.getPonyExpressImage()).toBeVisible();
    });

    test('purchase multiple items and validate checkout', async () => {
      const inventoryPage = await loginPage.login('standard_user', 'secret_sauce');
      await inventoryPage.addItemToCart('Sauce Labs Backpack');
      await inventoryPage.addItemToCart('Sauce Labs Fleece Jacket');
      await expect(inventoryPage.getCartBadge()).toContainText('2');
      const cartPage = await inventoryPage.goToCart();
      const checkoutStepOne = await cartPage.proceedToCheckout();
      await checkoutStepOne.fillCheckoutInfo('Test', 'User', '12345');
      const checkoutStepTwo = await checkoutStepOne.continue();
      const checkoutComplete = await checkoutStepTwo.finishCheckout();
      await expect(checkoutComplete.getCompleteHeader()).toHaveText('Thank you for your order!');
    });

    test('back home after order returns to inventory', async () => {
      const inventoryPage = await loginPage.login('standard_user', 'secret_sauce');
      await inventoryPage.addItemToCart('Sauce Labs Backpack');
      const cartPage = await inventoryPage.goToCart();
      const checkoutStepOne = await cartPage.proceedToCheckout();
      await checkoutStepOne.fillCheckoutInfo('Test', 'User', '12345');
      const checkoutStepTwo = await checkoutStepOne.continue();
      const checkoutComplete = await checkoutStepTwo.finishCheckout();
      const returnedInventory = await checkoutComplete.backHome();
      await expect(returnedInventory.getTitle()).toHaveText('Products');
    });

    test('cart is empty after completing purchase', async () => {
      const inventoryPage = await loginPage.login('standard_user', 'secret_sauce');
      await inventoryPage.addItemToCart('Sauce Labs Backpack');
      const cartPage = await inventoryPage.goToCart();
      const checkoutStepOne = await cartPage.proceedToCheckout();
      await checkoutStepOne.fillCheckoutInfo('Test', 'User', '12345');
      const checkoutStepTwo = await checkoutStepOne.continue();
      const checkoutComplete = await checkoutStepTwo.finishCheckout();
      const returnedInventory = await checkoutComplete.backHome();
      await expect(returnedInventory.getCartBadge()).not.toBeVisible();
    });
  });

  // ─── MENU & NAVIGATION TESTS ──────────────────────────────────

  test.describe('Menu & Navigation', () => {
    test('logout returns to login page', async ({ page }) => {
      const inventoryPage = await loginPage.login('standard_user', 'secret_sauce');
      await inventoryPage.logout();
      await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    });

    test('reset app state clears cart', async ({ page }) => {
      const inventoryPage = await loginPage.login('standard_user', 'secret_sauce');
      await inventoryPage.addItemToCart('Sauce Labs Backpack');
      await inventoryPage.addItemToCart('Sauce Labs Bike Light');
      await expect(inventoryPage.getCartBadge()).toHaveText('2');
      await inventoryPage.resetAppState();
      await page.reload();
      const refreshedInventory = new InventoryPage(page);
      await expect(refreshedInventory.getCartBadge()).not.toBeVisible();
    });
  });

  // ─── FOOTER TESTS ─────────────────────────────────────────────

  test.describe('Footer', () => {
    test('footer contains copyright text', async ({ page }) => {
      await loginPage.login('standard_user', 'secret_sauce');
      await expect(page.getByRole('contentinfo')).toContainText('Terms of Service');
    });

    test('twitter social link is visible', async ({ page }) => {
      await loginPage.login('standard_user', 'secret_sauce');
      await expect(page.locator('[data-test="social-twitter"]')).toBeVisible();
    });

    test('facebook social link is visible', async ({ page }) => {
      await loginPage.login('standard_user', 'secret_sauce');
      await expect(page.locator('[data-test="social-facebook"]')).toBeVisible();
    });

    test('linkedin social link is visible', async ({ page }) => {
      await loginPage.login('standard_user', 'secret_sauce');
      await expect(page.locator('[data-test="social-linkedin"]')).toBeVisible();
    });
  });

  // ─── PURCHASE FLOW WITH DIFFERENT USERS ────────────────────────

  test.describe('Purchase flow with different users', () => {
    const purchasableUsers = [
      'standard_user',
      'performance_glitch_user',
      'visual_user',
    ];

    for (const username of purchasableUsers) {
      test(`complete purchase flow with ${username}`, async () => {
        const inventoryPage = await loginPage.login(username, 'secret_sauce');
        await inventoryPage.addItemToCart('Sauce Labs Backpack');
        const cartPage = await inventoryPage.goToCart();
        const checkoutStepOne = await cartPage.proceedToCheckout();
        await checkoutStepOne.fillCheckoutInfo('Test', 'User', '12345');
        const checkoutStepTwo = await checkoutStepOne.continue();
        const checkoutComplete = await checkoutStepTwo.finishCheckout();
        await expect(checkoutComplete.getCompleteHeader()).toHaveText('Thank you for your order!');
      });
    }
  });
});
