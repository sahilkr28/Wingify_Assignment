import { test, expect } from '@playwright/test';
import { DreamsDiaryPage } from './pages/DreamsDiaryPage';

test.describe('Dreams Diary', () => {
  let diaryPage: DreamsDiaryPage;

  test.beforeEach(async ({ page }) => {
    diaryPage = new DreamsDiaryPage(page);
    await diaryPage.goto();
    await diaryPage.expectTableVisible();
  });

  test('TC-07: Dreams Diary should contain exactly 10 dream entries', async () => {
    const rowCount = await diaryPage.getRowCount();

    expect(
      rowCount,
      `Expected exactly 10 dream entries, but found ${rowCount}`
    ).toBe(10);
  });

  test('TC-08: Every dream should have a valid Good or Bad dream type', async () => {
    const rowCount = await diaryPage.getRowCount();

    for (let i = 0; i < rowCount; i++) {
      const dream = await diaryPage.getRowValues(i);

      expect(
        ['Good', 'Bad'],
        `Invalid dream type for "${dream.dreamName}": "${dream.dreamType}"`
      ).toContain(dream.dreamType);
    }
  });

  test('TC-09: Every dream row should have all required fields filled', async () => {
    const rowCount = await diaryPage.getRowCount();

    for (let i = 0; i < rowCount; i++) {
      const dream = await diaryPage.getRowValues(i);

      expect(
        dream.dreamName,
        `Dream Name is empty in row ${i + 1}`
      ).not.toBe('');

      expect(
        dream.daysAgo,
        `Days Ago is empty for "${dream.dreamName}"`
      ).not.toBe('');

      expect(
        dream.dreamType,
        `Dream Type is empty for "${dream.dreamName}"`
      ).not.toBe('');
    }
  });

  test('TC-10: Days Ago should contain a valid non-negative number', async () => {
    const rowCount = await diaryPage.getRowCount();

    for (let i = 0; i < rowCount; i++) {
      const dream = await diaryPage.getRowValues(i);

      const match = dream.daysAgo.match(/\d+/);

      expect(
        match,
        `Days Ago does not contain a number for "${dream.dreamName}": "${dream.daysAgo}"`
      ).not.toBeNull();

      if (match) {
        const days = Number(match[0]);

        expect(
          days,
          `Days Ago should not be negative for "${dream.dreamName}"`
        ).toBeGreaterThanOrEqual(0);
      }
    }
  });
});