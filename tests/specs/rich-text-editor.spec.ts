import { test, expect } from '@playwright/test';

test('rich text editor - type formatted text', async ({ page }) => {
  // 1. Open the rich text editor
  await page.goto('https://onlinehtmleditor.dev');

  // Click on the editor area (CKEditor 5 contenteditable div)
  const editor = page.locator('.ck-editor__editable');
  await editor.click();

  // Click Bold button, type "Automation", click Bold again to toggle off
  await page.locator('button[data-cke-tooltip-text~="Bold"]').click();
  await page.keyboard.type('Automation');
  await page.locator('button[data-cke-tooltip-text~="Bold"]').click();

  // Type space
  await page.keyboard.type(' ');

  // Click Underline button, type "Test", click Underline again to toggle off
  await page.locator('button[data-cke-tooltip-text~="Underline"]').click();
  await page.keyboard.type('Test');
  await page.locator('button[data-cke-tooltip-text~="Underline"]').click();

  await page.keyboard.type(' Example');

  // Validate the text is appearing in the editor
  // Strip invisible Unicode characters (zero-width spaces etc.) that CKEditor injects
  const editorText = await editor.locator('p').innerText();
  const cleanText = editorText.replace(/\u2060/g, '').trim();
  expect(cleanText).toBe('Automation Test Example');

  // Validate bold formatting on "Automation"
  await expect(editor.locator('strong')).toHaveText('Automation');

  // Validate underline formatting on "Test"
  await expect(editor.locator('u')).toHaveText('Test');
});
