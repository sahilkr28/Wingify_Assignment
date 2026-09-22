import { expect, Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;

  readonly loader;
  readonly mainContent;
  readonly dreamButton;

  constructor(page: Page) {
    this.page = page;

    this.loader = page.locator('#loadingAnimation');
    this.mainContent = page.locator('#mainContent');
    this.dreamButton = page.getByRole('button', { name: 'My Dreams' });
  }

async goto() {
  await this.page.goto('https://arjitnigam.github.io/myDreams/');
}

  async expectLoaderVisible() {
    await expect(this.loader).toBeVisible();
  }

  async expectLoaderHidden() {
    await expect(this.loader).toBeHidden();
  }

  async expectMainContentVisible() {
    await expect(this.mainContent).toBeVisible();
  }

  async expectDreamButtonVisible() {
    await expect(this.dreamButton).toBeVisible();
  }

  async expectDreamButtonEnabled() {
    await expect(this.dreamButton).toBeEnabled();
  }

  async clickMyDreams() {
    await this.dreamButton.click();
  }
}