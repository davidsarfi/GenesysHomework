import { test, expect } from '@playwright/test';
import { RichTextEditorPage } from '../pages/RichTextEditorPage';

test('rich text editor - type formatted text', async ({ page }) => {
  const editorPage = new RichTextEditorPage(page);
  await editorPage.open();
  await editorPage.clickEditor();

  // Type bold "Automation"
  await editorPage.toggleBold();
  await editorPage.typeText('Automation');
  await editorPage.toggleBold();

  await editorPage.typeText(' ');

  // Type underlined "Test"
  await editorPage.toggleUnderline();
  await editorPage.typeText('Test');
  await editorPage.toggleUnderline();

  await editorPage.typeText(' Example');

  // Validate full text
  const cleanText = await editorPage.getEditorText();
  expect(cleanText).toBe('Automation Test Example');

  // Validate formatting
  await expect(editorPage.getBoldText()).toHaveText('Automation');
  await expect(editorPage.getUnderlinedText()).toHaveText('Test');
});
