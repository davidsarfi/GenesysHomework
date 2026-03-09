import { type Locator, type Page } from '@playwright/test';
import { InventoryPage } from './InventoryPage';

export class LoginPage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;

  constructor(private readonly page: Page) {
    this.usernameInput = page.locator('#user-name');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-button');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async open() {
    await this.page.goto('https://www.saucedemo.com/');
  }

  async login(username: string, password: string): Promise<InventoryPage> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForURL('**/inventory.html');
    return new InventoryPage(this.page);
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async fillUsername(username: string) {
    await this.usernameInput.fill(username);
  }

  async clearUsername() {
    await this.usernameInput.clear();
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  getErrorMessage() {
    return this.errorMessage;
  }
}
