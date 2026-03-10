import { test, expect } from '@playwright/test';
import { RichTextEditorPage } from '../pages/RichTextEditorPage';

test('rich text editor - type formatted text', async ({ page }) => {
  const editorPage = new RichTextEditorPage(page);

  await test.step('Open editor and focus on editable area', async () => {
    await editorPage.open();
    await editorPage.clickEditor();
  });

  await test.step('Type bold text "Automation"', async () => {
    await editorPage.toggleBold();
    await editorPage.typeText('Automation');
    await editorPage.toggleBold();
  });

  await test.step('Type underlined text "Test"', async () => {
    await editorPage.typeText(' ');
    await editorPage.toggleUnderline();
    await editorPage.typeText('Test');
    await editorPage.toggleUnderline();
  });

  await test.step('Type plain text "Example"', async () => {
    await editorPage.typeText(' Example');
  });

  await test.step('Verify full text content is "Automation Test Example"', async () => {
    const cleanText = await editorPage.getEditorText();
    expect(cleanText).toBe('Automation Test Example');
  });

  await test.step('Verify bold formatting on "Automation"', async () => {
    await expect(editorPage.getBoldText()).toHaveText('Automation');
  });

  await test.step('Verify underline formatting on "Test"', async () => {
    await expect(editorPage.getUnderlinedText()).toHaveText('Test');
  });
});
