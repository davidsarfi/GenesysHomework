import { test, expect } from '@playwright/test';
import { Guru99HomePage } from '../pages/guru99/Guru99HomePage';

test('iFrame and tab handling', async ({ page, context }) => {
  const homePage = new Guru99HomePage(page);

  await test.step('Open Guru99 home page', async () => {
    await homePage.open();
  });

  const liveProjectPage = await test.step('Click iframe image and verify new tab opens', async () => {
    const newPage = await homePage.clickIframeImage(context);
    //Here I changed the text to check, because I believe it has changed since the homework was created
    await expect(newPage.getPage()).toHaveTitle(/Selenium Live Project for Practice/);
    return newPage;
  });

  await test.step('Close new tab and switch back to main window', async () => {
    await liveProjectPage.close();
    await page.bringToFront();
  });

  const tutorialPage = await test.step('Navigate to Selenium tutorial via Testing menu', async () => {
    return await homePage.navigateToSeleniumTutorial();
  });

  // Here I changed the check for the submit button instead of "Join now" because I could only find a red button with submit text
  await test.step('Verify Submit button is visible on tutorial page', async () => {
    await tutorialPage.clickPageBody();
    await expect(tutorialPage.getSubmitButton()).toBeVisible();
  });
});
