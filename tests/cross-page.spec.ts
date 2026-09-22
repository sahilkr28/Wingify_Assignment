import { test, expect } from '@playwright/test';
import { DreamsDiaryPage } from './pages/DreamsDiaryPage';
import { DreamsTotalPage } from './pages/DreamsTotalPage';

test.describe('Cross-page Business Validation', () => {

    test('TC-15: Diary Good/Bad counts should match Dreams Total summary', async ({ page }) => {
        const diaryPage = new DreamsDiaryPage(page);

        await diaryPage.goto();
        await diaryPage.expectTableVisible();

        const dreams = await diaryPage.getAllDreams();

        const goodCount = dreams.filter(
            dream => dream.dreamType === 'Good'
        ).length;

        const badCount = dreams.filter(
            dream => dream.dreamType === 'Bad'
        ).length;

        const totalCount = dreams.length;

        const totalPage = new DreamsTotalPage(page);

        await totalPage.goto();
        await totalPage.expectTableVisible();

        const goodSummary = await totalPage.getSummaryByType('Good Dreams');
        const badSummary = await totalPage.getSummaryByType('Bad Dreams');
        const totalSummary = await totalPage.getSummaryByType('Total Dreams');

        expect(Number(goodSummary.totalCount)).toBe(goodCount);
        expect(Number(badSummary.totalCount)).toBe(badCount);
        expect(Number(totalSummary.totalCount)).toBe(totalCount);
    });

    test('TC-16: Recurring dream names should match the Diary data', async ({ page }) => {
        const diaryPage = new DreamsDiaryPage(page);

        await diaryPage.goto();
        await diaryPage.expectTableVisible();

        const dreams = await diaryPage.getAllDreams();

        const dreamNames = dreams.map(dream => dream.dreamName);

        const flyingOverMountainsCount = dreamNames.filter(
            name => name === 'Flying over mountains'
        ).length;

        const lostInMazeCount = dreamNames.filter(
            name => name === 'Lost in maze'
        ).length;

        expect(flyingOverMountainsCount).toBe(3);
        expect(lostInMazeCount).toBe(2);
    });

    test('TC-17: Recurring Dreams summary should match the number of recurring dream names', async ({ page }) => {
        const diaryPage = new DreamsDiaryPage(page);

        await diaryPage.goto();
        await diaryPage.expectTableVisible();

        const dreams = await diaryPage.getAllDreams();

        const dreamNames = dreams.map(dream => dream.dreamName);

        const dreamFrequency = new Map<string, number>();

        for (const name of dreamNames) {
            dreamFrequency.set(
                name,
                (dreamFrequency.get(name) ?? 0) + 1
            );
        }

        const recurringDreamNames = [...dreamFrequency.entries()]
            .filter(([, count]) => count > 1)
            .map(([name]) => name);

        const totalPage = new DreamsTotalPage(page);

        await totalPage.goto();
        await totalPage.expectTableVisible();

        const recurringSummary =
            await totalPage.getSummaryByType('Recurring Dreams');

        expect(Number(recurringSummary.totalCount)).toBe(
            recurringDreamNames.length
        );

        expect(recurringDreamNames).toEqual(
            expect.arrayContaining([
                'Flying over mountains',
                'Lost in maze',
            ])
        );
    });
});