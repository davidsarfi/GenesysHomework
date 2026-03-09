import { type Locator, type Page } from '@playwright/test';
import { CartPage } from './CartPage';

export class InventoryPage {
  private readonly cartBadge: Locator;
  private readonly cartLink: Locator;
  private readonly footer: Locator;

  constructor(private readonly page: Page) {
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.footer = page.locator('.footer_copy');
  }

  async addItemToCart(itemName: string) {
    const dataTestValue = `add-to-cart-${itemName.toLowerCase().replace(/ /g, '-')}`;
    await this.page.locator(`[data-test="${dataTestValue}"]`).click();
  }

  async getCartBadge() {
    await this.cartBadge.waitFor({ state: 'visible' });
    return this.cartBadge;
  }

  async goToCart(): Promise<CartPage> {
    await this.cartLink.click();
    await this.page.waitForURL('**/cart.html');
    return new CartPage(this.page);
  }

  async scrollToBottom() {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  getFooter() {
    return this.footer;
  }
}
