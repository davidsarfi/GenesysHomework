import { type Locator, type Page } from '@playwright/test';
import { AuthenticatedPage } from './AuthenticatedPage';
import { CartPage } from './CartPage';
import { InventoryItemPage } from './InventoryItemPage';

export class InventoryPage extends AuthenticatedPage {
  private readonly sortDropdown: Locator;
  private readonly inventoryItems: Locator;

  constructor(page: Page) {
    super(page);
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
  }

  async addItemToCart(itemName: string) {
    await this.page.locator(`[data-test="add-to-cart-${this.toKebabCase(itemName)}"]`).click();
  }

  async removeItemFromCart(itemName: string) {
    await this.page.locator(`[data-test="remove-${this.toKebabCase(itemName)}"]`).click();
  }

  async goToCart(): Promise<CartPage> {
    await this.getCartLink().click();
    await this.page.waitForURL('**/cart.html');
    return new CartPage(this.page);
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortDropdown.selectOption(option);
  }

  async getProductNames(): Promise<string[]> {
    return await this.page.locator('[data-test="inventory-item-name"]').allTextContents();
  }

  async getProductPrices(): Promise<number[]> {
    const priceTexts = await this.page.locator('[data-test="inventory-item-price"]').allTextContents();
    return priceTexts.map(p => parseFloat(p.replace('$', '')));
  }

  getProductCount() {
    return this.inventoryItems.count();
  }

  async clickProduct(productName: string): Promise<InventoryItemPage> {
    await this.page.locator('[data-test="inventory-item-name"]').filter({ hasText: productName }).click();
    return new InventoryItemPage(this.page);
  }
}
