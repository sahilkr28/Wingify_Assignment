import { test, expect } from '@playwright/test';
import { HomePage } from './pages/HomePage';

test.describe('Dream Portal - Home Page', () => {
    let homePage: HomePage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        await homePage.goto();
    });

    test('TC-01: Loader should be visible when the page starts loading', async () => {
        await homePage.expectLoaderVisible();
    });

    test('TC-02: Loader should disappear after approximately 3 seconds', async () => {
        const startTime = Date.now();

        await homePage.expectLoaderVisible();
        await homePage.expectLoaderHidden();

        const elapsedTime = Date.now() - startTime;

        expect(
            elapsedTime,
            `Loader disappeared too early. Actual time: ${elapsedTime}ms`
        ).toBeGreaterThanOrEqual(2500);

        expect(
            elapsedTime,
            `Loader took too long to disappear. Actual time: ${elapsedTime}ms`
        ).toBeLessThan(5000);
    });

    test('TC-03: Main content should become visible after loading', async () => {
        await homePage.expectMainContentVisible();
    });

    test('TC-04: My Dreams button should be visible and enabled', async () => {
        await homePage.expectDreamButtonVisible();
        await homePage.expectDreamButtonEnabled();
    });

    test('TC-05: My Dreams should open the Dreams Diary page', async ({ page, context }) => {
        const homePage = new HomePage(page);

        await homePage.goto();
        await homePage.expectDreamButtonVisible();

        const newPagePromise = context.waitForEvent('page');

        await homePage.clickMyDreams();

        const newPage = await newPagePromise;

        await newPage.waitForLoadState('domcontentloaded');

        expect(newPage.url()).toContain('dreams-diary.html');
    });

    test('TC-06: My Dreams should open the Dreams Total page', async () => {
        const context = homePage.page.context();
        const initialPages = context.pages();

        await homePage.clickMyDreams();

        await expect
            .poll(() => context.pages().length, {
                timeout: 5000,
                message: 'Expected My Dreams to open two new tabs',
            })
            .toBe(initialPages.length + 2);

        const newPages = context.pages().slice(initialPages.length);

        const urls = await Promise.all(
            newPages.map(async (page) => {
                await page.waitForLoadState();
                return page.url();
            })
        );

        expect(urls.some(url => url.includes('dreams-diary.html'))).toBe(true);

        expect(urls.some(url => url.includes('dreams-total.html'))).toBe(true);
    });
});