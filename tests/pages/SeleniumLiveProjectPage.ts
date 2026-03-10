import { type Page } from '@playwright/test';

export class SeleniumLiveProjectPage {
  constructor(private readonly page: Page) {}

  getPage() {
    return this.page;
  }

  async close() {
    await this.page.close();
  }
}
