import { type Locator, type Page } from '@playwright/test';

export class SeleniumTutorialPage {
  private readonly pageBody: Locator;
  private readonly submitButton: Locator;

  constructor(private readonly page: Page) {
    this.pageBody = page.locator('.desktop-only1');
    this.submitButton = page.locator('form span b').filter({ hasText: 'Submit' });
  }

  //This step was only needed for the submit button to be loaded.
  async clickPageBody() {
    await this.pageBody.click();
  }

  getSubmitButton() {
    return this.submitButton;
  }
}
