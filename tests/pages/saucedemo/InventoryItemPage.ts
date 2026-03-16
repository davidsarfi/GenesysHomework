import { type Locator, type Page } from '@playwright/test';
import { AuthenticatedPage } from './AuthenticatedPage';
import { InventoryPage } from './InventoryPage';

export class InventoryItemPage extends AuthenticatedPage {
  private readonly itemName: Locator;
  private readonly itemDescription: Locator;
  private readonly itemPrice: Locator;
  private readonly itemImage: Locator;
  private readonly addToCartButton: Locator;
  private readonly removeButton: Locator;
  private readonly backButton: Locator;

  constructor(page: Page) {
    super(page);
    this.itemName = page.locator('[data-test="inventory-item-name"]');
    this.itemDescription = page.locator('[data-test="inventory-item-desc"]');
    this.itemPrice = page.locator('[data-test="inventory-item-price"]');
    this.itemImage = page.locator('img.inventory_details_img');
    this.addToCartButton = page.getByRole('button', { name: 'Add to cart' });
    this.removeButton = page.getByRole('button', { name: 'Remove' });
    this.backButton = page.locator('[data-test="back-to-products"]');
  }

  getItemName() {
    return this.itemName;
  }

  getItemDescription() {
    return this.itemDescription;
  }

  getItemPrice() {
    return this.itemPrice;
  }

  getItemImage() {
    return this.itemImage;
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  getRemoveButton() {
    return this.removeButton;
  }

  getAddToCartButton() {
    return this.addToCartButton;
  }

  async removeFromCart() {
    await this.removeButton.click();
  }

  async backToProducts(): Promise<InventoryPage> {
    await this.backButton.click();
    await this.page.waitForURL('**/inventory.html');
    return new InventoryPage(this.page);
  }
}
