import { type Locator, type Page } from '@playwright/test';

export class CheckoutCompletePage {
  private readonly completeHeader: Locator;

  constructor(private readonly page: Page) {
    this.completeHeader = page.getByRole('heading', { name: 'Thank you for your order!' });
  }

  getCompleteHeader() {
    return this.completeHeader;
  }
}
