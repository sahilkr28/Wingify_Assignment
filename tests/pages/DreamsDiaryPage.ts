import { expect, Page } from '@playwright/test';

export class DreamsDiaryPage {
    readonly page;
    readonly table;
    readonly rows;
    readonly headers;

    constructor(page: Page) {
        this.page = page;

        this.table = page.locator('#dreamsDiary');
        this.rows = this.table.locator('tbody > tr');
        this.headers = this.table.locator('thead > tr > th');
    }

    async goto() {
        await this.page.goto(
            'https://arjitnigam.github.io/myDreams/dreams-diary.html'
        );
    }

    async expectTableVisible() {
        await expect(this.table).toBeVisible();
    }

    async getRowCount() {
        return await this.rows.count();
    }

    async getRowValues(rowIndex: number) {
        const cells = this.rows.nth(rowIndex).locator('td');

        return {
            dreamName: (await cells.nth(0).innerText()).trim(),
            daysAgo: (await cells.nth(1).innerText()).trim(),
            dreamType: (await cells.nth(2).innerText()).trim(),
        };
    }

    async getAllDreams() {
        const rowCount = await this.getRowCount();
        const dreams = [];

        for (let i = 0; i < rowCount; i++) {
            dreams.push(await this.getRowValues(i));
        }

        return dreams;
    }
}