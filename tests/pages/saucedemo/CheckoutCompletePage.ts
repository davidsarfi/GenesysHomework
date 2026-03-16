import { type Locator, type Page } from '@playwright/test';
import { AuthenticatedPage } from './AuthenticatedPage';
import { InventoryPage } from './InventoryPage';

export class CheckoutCompletePage extends AuthenticatedPage {
  private readonly completeHeader: Locator;
  private readonly completeText: Locator;
  private readonly backHomeButton: Locator;
  private readonly ponyExpressImage: Locator;

  constructor(page: Page) {
    super(page);
    this.completeHeader = page.getByRole('heading', { name: 'Thank you for your order!' });
    this.completeText = page.locator('[data-test="complete-text"]');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
    this.ponyExpressImage = page.locator('[data-test="pony-express"]');
  }

  getCompleteHeader() {
    return this.completeHeader;
  }

  getCompleteText() {
    return this.completeText;
  }

  getPonyExpressImage() {
    return this.ponyExpressImage;
  }

  async backHome(): Promise<InventoryPage> {
    await this.backHomeButton.click();
    return new InventoryPage(this.page);
  }
}
