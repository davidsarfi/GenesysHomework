import { type Locator, type Page } from '@playwright/test';
import { AuthenticatedPage } from './AuthenticatedPage';
import { CheckoutStepOnePage } from './CheckoutStepOnePage';
import { InventoryPage } from './InventoryPage';

export class CartPage extends AuthenticatedPage {
  private readonly checkoutButton: Locator;
  private readonly continueShoppingButton: Locator;
  private readonly cartItems: Locator;
  private readonly cartItemNames: Locator;
  private readonly cartItemPrices: Locator;
  private readonly cartItemQuantities: Locator;

  constructor(page: Page) {
    super(page);
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.cartItemNames = page.locator('[data-test="inventory-item-name"]');
    this.cartItemPrices = page.locator('[data-test="inventory-item-price"]');
    this.cartItemQuantities = page.locator('[data-test="item-quantity"]');
  }

  async proceedToCheckout(): Promise<CheckoutStepOnePage> {
    await this.checkoutButton.click();
    await this.page.waitForURL('**/checkout-step-one.html');
    return new CheckoutStepOnePage(this.page);
  }

  async continueShopping(): Promise<InventoryPage> {
    await this.continueShoppingButton.click();
    await this.page.waitForURL('**/inventory.html');
    return new InventoryPage(this.page);
  }

  async removeItem(itemName: string) {
    await this.page.locator(`[data-test="remove-${this.toKebabCase(itemName)}"]`).click();
  }

  async getItemNames(): Promise<string[]> {
    return await this.cartItemNames.allTextContents();
  }

  async getItemPrices(): Promise<string[]> {
    return await this.cartItemPrices.allTextContents();
  }

  getItemCount() {
    return this.cartItems.count();
  }

  getCartItems() {
    return this.cartItems;
  }

  async getItemQuantities(): Promise<string[]> {
    return await this.cartItemQuantities.allTextContents();
  }
}
