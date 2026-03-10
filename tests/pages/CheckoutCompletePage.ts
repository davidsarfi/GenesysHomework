import { type Locator, type Page } from '@playwright/test';

export class CheckoutCompletePage {
  private readonly completeHeader: Locator;

  constructor(private readonly page: Page) {
    this.completeHeader = page.locator('[data-test="complete-header"]');
  }

  getCompleteHeader() {
    return this.completeHeader;
  }
}
