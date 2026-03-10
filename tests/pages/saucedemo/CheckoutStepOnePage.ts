import { type Locator, type Page } from '@playwright/test';
import { CheckoutStepTwoPage } from './CheckoutStepTwoPage';

export class CheckoutStepOnePage {
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;
  private readonly continueButton: Locator;

  constructor(private readonly page: Page) {
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
  }

  async fillCheckoutInfo(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continue(): Promise<CheckoutStepTwoPage> {
    await this.continueButton.click();
    await this.page.waitForURL('**/checkout-step-two.html');
    return new CheckoutStepTwoPage(this.page);
  }
}
