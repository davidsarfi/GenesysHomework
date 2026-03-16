import { type Locator, type Page } from '@playwright/test';

export abstract class AuthenticatedPage {
  private readonly cartBadge: Locator;
  private readonly cartLink: Locator;
  private readonly menuButton: Locator;
  private readonly logoutLink: Locator;
  private readonly resetAppLink: Locator;
  private readonly closeMenuButton: Locator;
  private readonly pageTitle: Locator;

  constructor(protected readonly page: Page) {
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
    this.resetAppLink = page.locator('[data-test="reset-sidebar-link"]');
    this.closeMenuButton = page.locator('[data-test="close-menu"]');
    this.pageTitle = page.locator('[data-test="title"]');
  }

  // ─── Header ────────────────────────────────────────────────────

  getCartBadge() {
    return this.cartBadge;
  }

  getCartLink() {
    return this.cartLink;
  }

  getTitle() {
    return this.pageTitle;
  }

  // ─── Hamburger Menu ────────────────────────────────────────────

  async openMenu() {
    await this.menuButton.click();
    await this.closeMenuButton.waitFor({ state: 'visible' });
  }

  async logout() {
    await this.openMenu();
    await this.logoutLink.click();
    await this.page.waitForURL('**/');
  }

  async resetAppState() {
    await this.openMenu();
    await this.resetAppLink.click();
  }

  // ─── Utilities ─────────────────────────────────────────────────

  protected toKebabCase(name: string): string {
    return name.toLowerCase().replace(/ /g, '-');
  }
}
