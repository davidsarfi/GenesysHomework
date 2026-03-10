import { type Locator, type Page } from '@playwright/test';
import { CheckoutStepOnePage } from './CheckoutStepOnePage';

export class CartPage {
  private readonly checkoutButton: Locator;

  constructor(private readonly page: Page) {
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  async proceedToCheckout(): Promise<CheckoutStepOnePage> {
    await this.checkoutButton.click();
    await this.page.waitForURL('**/checkout-step-one.html');
    return new CheckoutStepOnePage(this.page);
  }
}
