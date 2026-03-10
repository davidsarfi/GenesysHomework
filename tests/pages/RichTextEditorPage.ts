import { type Locator, type Page } from '@playwright/test';

export class RichTextEditorPage {
  private readonly editorArea: Locator;
  private readonly boldButton: Locator;
  private readonly underlineButton: Locator;

  constructor(private readonly page: Page) {
    this.editorArea = page.locator('.ck-editor__editable');
    this.boldButton = page.locator('button[data-cke-tooltip-text~="Bold"]');
    this.underlineButton = page.locator('button[data-cke-tooltip-text~="Underline"]');
  }

  async open() {
    await this.page.goto('https://onlinehtmleditor.dev');
  }

  async clickEditor() {
    await this.editorArea.click();
  }

  async toggleBold() {
    await this.boldButton.click();
  }

  async toggleUnderline() {
    await this.underlineButton.click();
  }

  async typeText(text: string) {
    await this.page.keyboard.type(text);
  }

  async getEditorText(): Promise<string> {
    const text = await this.editorArea.locator('p').innerText();
    return text.replace(/\u2060/g, '').trim();
  }

  getBoldText() {
    return this.editorArea.locator('strong');
  }

  getUnderlinedText() {
    return this.editorArea.locator('u');
  }
}
