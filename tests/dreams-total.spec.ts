import { test, expect } from '@playwright/test';
import { DreamsTotalPage } from './pages/DreamsTotalPage';

test.describe('Dreams Total', () => {
  let totalPage: DreamsTotalPage;

  test.beforeEach(async ({ page }) => {
    totalPage = new DreamsTotalPage(page);
    await totalPage.goto();
    await totalPage.expectTableVisible();
  });

  test('TC-11: Good Dreams count should be 6', async () => {
    const row = await totalPage.getRowValues(0);

    expect(row.dreamType).toBe('Good Dreams');
    expect(row.totalCount).toBe('6');
  });

  test('TC-12: Bad Dreams count should be 4', async () => {
    const row = await totalPage.getRowValues(1);

    expect(row.dreamType).toBe('Bad Dreams');
    expect(row.totalCount).toBe('4');
  });

  test('TC-13: Total Dreams count should be 10', async () => {
    const row = await totalPage.getRowValues(2);

    expect(row.dreamType).toBe('Total Dreams');
    expect(row.totalCount).toBe('10');
  });

  test('TC-14: Recurring Dreams count should be 2', async () => {
    const row = await totalPage.getRowValues(4);

    expect(row.dreamType).toBe('Recurring Dreams');
    expect(row.totalCount).toBe('2');
  });
});