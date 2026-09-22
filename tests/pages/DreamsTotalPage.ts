import { expect, Page } from '@playwright/test';

export class DreamsTotalPage {
    readonly page;
    readonly table;
    readonly rows;

    constructor(page: Page) {
        this.page = page;

        this.table = page.locator('#dreamsTotal');
        this.rows = this.table.locator('tbody > tr');
    }

    async goto() {
        await this.page.goto(
            'https://arjitnigam.github.io/myDreams/dreams-total.html'
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
            dreamType: (await cells.nth(0).innerText()).trim(),
            totalCount: (await cells.nth(1).innerText()).trim(),
        };
    }

    async getSummaryByType(dreamType: string) {
        const row = this.rows.filter({ hasText: dreamType }).first();
        const cells = row.locator('td');

        return {
            dreamType: (await cells.nth(0).innerText()).trim(),
            totalCount: (await cells.nth(1).innerText()).trim(),
        };
    }
}