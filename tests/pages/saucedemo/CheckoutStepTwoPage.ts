import { type Locator, type Page } from '@playwright/test';
import { AuthenticatedPage } from './AuthenticatedPage';
import { CheckoutCompletePage } from './CheckoutCompletePage';
import { InventoryPage } from './InventoryPage';

export class CheckoutStepTwoPage extends AuthenticatedPage {
  private readonly finishButton: Locator;
  private readonly cancelButton: Locator;
  private readonly itemNames: Locator;
  private readonly itemPrices: Locator;
  private readonly subtotalLabel: Locator;
  private readonly taxLabel: Locator;
  private readonly totalLabel: Locator;

  constructor(page: Page) {
    super(page);
    this.finishButton = page.getByRole('button', { name: 'Finish' });
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.itemPrices = page.locator('[data-test="inventory-item-price"]');
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
  }

  async finishCheckout(): Promise<CheckoutCompletePage> {
    await this.finishButton.click();
    await this.page.waitForURL('**/checkout-complete.html');
    return new CheckoutCompletePage(this.page);
  }

  async cancel(): Promise<InventoryPage> {
    await this.cancelButton.click();
    await this.page.waitForURL('**/inventory.html');
    return new InventoryPage(this.page);
  }

  async getItemNames(): Promise<string[]> {
    return await this.itemNames.allTextContents();
  }

  async getItemPrices(): Promise<string[]> {
    return await this.itemPrices.allTextContents();
  }

  getSubtotal() {
    return this.subtotalLabel;
  }

  getTax() {
    return this.taxLabel;
  }

  getTotal() {
    return this.totalLabel;
  }
}
