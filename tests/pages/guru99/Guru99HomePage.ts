import { type BrowserContext, type Locator, type Page } from '@playwright/test';
import { SeleniumLiveProjectPage } from './SeleniumLiveProjectPage';
import { SeleniumTutorialPage } from './SeleniumTutorialPage';

export class Guru99HomePage {
  private readonly iframeImage: Locator;
  private readonly testingMenu: Locator;
  private readonly seleniumLink: Locator;

  constructor(private readonly page: Page) {
    this.iframeImage = page.frameLocator("iframe[src='ads.html']").locator('img');
    this.testingMenu = page.locator('a', { hasText: 'Testing' }).first();
    this.seleniumLink = page.locator('#rt-header').getByRole('link', { name: 'Selenium', exact: true });
  }

  async open() {
    await this.page.goto('http://demo.guru99.com/test/guru99home/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  }

  async clickIframeImage(context: BrowserContext): Promise<SeleniumLiveProjectPage> {
    const newPagePromise = context.waitForEvent('page');
    await this.iframeImage.click();
    const newPage = await newPagePromise;
    await newPage.waitForLoadState();
    return new SeleniumLiveProjectPage(newPage);
  }

  async navigateToSeleniumTutorial(): Promise<SeleniumTutorialPage> {
    await this.testingMenu.hover();
    await this.seleniumLink.waitFor({ state: 'visible' });
    await this.seleniumLink.click();
    await this.page.waitForURL('**/selenium-tutorial.html');
    return new SeleniumTutorialPage(this.page);
  }
}
