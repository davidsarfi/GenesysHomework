import { type Locator, type Page } from '@playwright/test';
import { CheckoutCompletePage } from './CheckoutCompletePage';

export class CheckoutStepTwoPage {
  private readonly finishButton: Locator;

  constructor(private readonly page: Page) {
    this.finishButton = page.getByRole('button', { name: 'Finish' });
  }

  async finishCheckout(): Promise<CheckoutCompletePage> {
    await this.finishButton.click();
    await this.page.waitForURL('**/checkout-complete.html');
    return new CheckoutCompletePage(this.page);
  }
}
