import { type Locator, type Page } from '@playwright/test';
import { CheckoutStepTwoPage } from './CheckoutStepTwoPage';

export class CheckoutStepOnePage {
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;
  private readonly continueButton: Locator;

  constructor(private readonly page: Page) {
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
    this.postalCodeInput = page.getByRole('textbox', { name: 'Zip/Postal Code' });
    this.continueButton = page.getByRole('button', { name: 'Continue' });
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
