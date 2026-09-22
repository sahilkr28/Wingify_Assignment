import { test, expect } from '@playwright/test';
import { DreamsDiaryPage } from '../pages/DreamsDiaryPage';
import { GeminiDreamClassifier } from '../services/GeminiDreamClassifier';

test.describe('AI Dream Classification Bonus', () => {
  test('TC-AI-01: Gemini classifications match the Dream Diary', async ({ page }) => {
    const diaryPage = new DreamsDiaryPage(page);
    const classifier = new GeminiDreamClassifier();

    await diaryPage.goto();
    await diaryPage.expectTableVisible();

    const dreams = await diaryPage.getAllDreams();

    expect(dreams).toHaveLength(10);

    const uniqueDreamNames = [
      ...new Set(dreams.map(dream => dream.dreamName)),
    ];

    console.log(`Unique dreams to classify: ${uniqueDreamNames.length}`);

    const classifications = await classifier.classifyDreams(
      uniqueDreamNames
    );

    for (const dreamName of uniqueDreamNames) {
      console.log(
        `Gemini classification: "${dreamName}" → ${classifications[dreamName]}`
      );
    }

    for (const dream of dreams) {
      const aiClassification = classifications[dream.dreamName];

      console.log(
        `Dream: "${dream.dreamName}" | ` +
        `Table: ${dream.dreamType} | ` +
        `Gemini: ${aiClassification}`
      );

      expect(aiClassification).toBe(dream.dreamType);
    }
  });
});