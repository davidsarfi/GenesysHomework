import { test, expect } from '@playwright/test';

test('iFrame and tab handling', async ({ page, context }) => {
  // 1. Open the page (use domcontentloaded - page has many slow ads/iframes)
  await page.goto('http://demo.guru99.com/test/guru99home/', { waitUntil: 'domcontentloaded', timeout: 60000 });

  const iframeImage = await page.frameLocator("iframe[src='ads.html']").locator('img');

  // Click the image - expect a new tab to open
  const newPagePromise = context.waitForEvent('page');
  await iframeImage.click();
  const newPage = await newPagePromise;

  // 3. Verify new page title
  await newPage.waitForLoadState();
  await expect(newPage).toHaveTitle(/Selenium Live Project for Practice/);

  // 4. Close the new tab and switch back to main window
  await newPage.close();
  await page.bringToFront();

  // 5. Hover on Testing menu item and click Selenium link
  await page.locator('a', { hasText: 'Testing' }).first().hover();
  const seleniumLink = page.locator('#rt-header').getByRole('link', { name: 'Selenium', exact: true });
  await seleniumLink.waitFor({ state: 'visible' });
  await seleniumLink.click();

  // a click needed on the page for the submit button to load
  await page.locator('.desktop-only1').click();

  // 6. Verify the red Submit button near the bottom is visible
  const joinButton = page.locator('form span b').filter({ hasText: 'Submit' });
  await expect(joinButton).toBeVisible();
});
