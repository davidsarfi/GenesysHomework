import { type Locator, type Page } from '@playwright/test';
import { AuthenticatedPage } from './AuthenticatedPage';
import { CheckoutStepTwoPage } from './CheckoutStepTwoPage';
import { CartPage } from './CartPage';

export class CheckoutStepOnePage extends AuthenticatedPage {
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;
  private readonly continueButton: Locator;
  private readonly cancelButton: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
    this.postalCodeInput = page.getByRole('textbox', { name: 'Zip/Postal Code' });
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');
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

  async clickContinue() {
    await this.continueButton.click();
  }

  async cancel(): Promise<CartPage> {
    await this.cancelButton.click();
    await this.page.waitForURL('**/cart.html');
    return new CartPage(this.page);
  }

  getErrorMessage() {
    return this.errorMessage;
  }
}
