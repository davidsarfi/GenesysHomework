import { test, expect } from '@playwright/test';
import { Guru99HomePage } from '../pages/Guru99HomePage';

test('iFrame and tab handling', async ({ page, context }) => {
  const homePage = new Guru99HomePage(page);
  await homePage.open();

  // Click iframe image - opens new tab with Selenium Live Project page
  const liveProjectPage = await homePage.clickIframeImage(context);
  //Here I changed the text to check, because I believe it has changed since the homework was created
  await expect(liveProjectPage.getPage()).toHaveTitle(/Selenium Live Project for Practice/);

  // Close new tab and switch back to main window
  await liveProjectPage.close();
  await page.bringToFront();

  // Hover Testing menu and click Selenium link
  const tutorialPage = await homePage.navigateToSeleniumTutorial();

  // Click on the page for the submit button to load
  await tutorialPage.clickPageBody();

  // Here I changed the check for the submit button instead of "Join now" because I could only find a red button with submint text
  await expect(tutorialPage.getSubmitButton()).toBeVisible();
});
