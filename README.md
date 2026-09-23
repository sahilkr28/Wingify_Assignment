# Wingify QA Automation Assignment

## Overview

This project contains automated functional tests for the **Dream Portal** application. The automation covers the main user flow of the application, validation of the Dream Diary, validation of the Dream Totals page, cross-page data consistency, and an AI-based dream classification validation using the Gemini API.

## Application Under Test

- **URL:** [https://arjitnigam.github.io/myDreams/](https://arjitnigam.github.io/myDreams/)

## Tech Stack

- **Framework:** Playwright (TypeScript)
- **Runtime:** Node.js
- **AI Integration:** Google Gemini API (`@google/genai`)
- **Reporting:** Playwright HTML Reporter & Allure Report
- **CI/CD:** GitHub Actions

## Project Structure

```text
Wingify_Assignment/
├── .github/
│   └── workflows/
│       └── playwright.yml
├── screenshots/
│   ├── 01-home-loader.png
│   ├── 02-home-loaded.png
│   ├── 03-dreams-diary.png
│   ├── 04-dreams-total.png
│   ├── 05-playwright-report(1).png
│   ├── 05-playwright-report(2).png
│   ├── 06-allure-report.png
│   └── 07-github-actions.png
├── tests/
│   ├── ai/
│   │   └── ai-dream-classification.spec.ts
│   ├── pages/
│   │   ├── DreamsDiaryPage.ts
│   │   ├── DreamsTotalPage.ts
│   │   └── HomePage.ts
│   ├── services/
│   │   └── GeminiDreamClassifier.ts
│   ├── cross-page.spec.ts
│   ├── dreams-diary.spec.ts
│   ├── dreams-total.spec.ts
│   └── home.spec.ts
├── .gitignore
├── package-lock.json
├── package.json
├── playwright.config.ts
└── README.md
```

## Test Coverage

The test suite consists of **18 automated tests**:

### 1. Home Page
- Loading animation appears on initial page load.
- Loading animation disappears after ~3 seconds.
- Main portal content becomes visible.
- "My Dreams" button is visible and enabled.
- Clicking "My Dreams" opens both Dream Diary and Dream Totals pages.

### 2. Dream Diary
- Exactly 10 dream entries are displayed in the table.
- Dream types are strictly limited to `Good` and `Bad`.
- Every row contains valid `Dream Name`, `Days Ago`, and `Dream Type`.
- `Days Ago` values are valid non-negative numbers.

### 3. Dream Totals
- Good Dreams count = `6`
- Bad Dreams count = `4`
- Total Dreams count = `10`
- Recurring Dreams count = `2`

### 4. Cross-page Validation
- Compares individual entries from the **Dream Diary** with summary metrics on the **Dream Totals** page.
- Dynamically calculates recurring dreams from the diary data and verifies it matches the displayed `Recurring Dreams` metric (`2`).
- Validates specific recurring dream names required by the application:
  - *"Flying over mountains"*
  - *"Lost in maze"*

## Page Object Model (POM)

The repository follows the Page Object Model pattern to decouple UI selectors and page actions from test assertions:
- `HomePage`: Interacts with loading screen and entry buttons.
- `DreamsDiaryPage`: Interacts with the dreams table DOM elements.
- `DreamsTotalPage`: Reads summary metrics and card components.

## AI Bonus Test

The AI bonus module leverages the Gemini API to classify dream names automatically:
- **Service Location:** `tests/services/GeminiDreamClassifier.ts`
- **Spec Location:** `tests/ai/ai-dream-classification.spec.ts`

### Logic Flow:
1. Reads all dream entries from the live web application.
2. Extracts unique dream names to optimize API usage.
3. Sends names to Gemini in a structured prompt requiring strict JSON response (`Good` | `Bad`).
4. Compares Gemini's classification response with the type listed in the application table and asserts correctness.

## Gemini API Setup

Create a `.env` file in the root directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

> Note: The `.env` file is ignored by git and should not be committed.

## Running the Project

### Installation

```bash
# Install dependencies
npm install

# Install Playwright Chromium browser
npx playwright install chromium
```

### Execution Commands

```bash
# Run complete core test suite
npx playwright test tests/home.spec.ts tests/dreams-diary.spec.ts tests/dreams-total.spec.ts tests/cross-page.spec.ts

# Run AI bonus test
npx playwright test tests/ai/ai-dream-classification.spec.ts --project=chrome

# Run all tests (including AI)
npx playwright test

# Run tests in headed mode
npx playwright test --headed
```

## Reporting

### Playwright HTML Report
```bash
npx playwright show-report
```

### Allure Report
```bash
# Generate and open Allure report
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report
```

## CI/CD Pipeline

A GitHub Actions workflow (`.github/workflows/playwright.yml`) runs on every push and pull request to `main`/`master`:
1. Checks out repository and sets up Node.js.
2. Installs dependencies and Playwright Chromium browser.
3. Executes core Playwright test suite.
4. Uploads Playwright HTML report as a build artifact.

> Note: The AI test is kept separate from standard CI runs as it requires an external API key.

## Test Results Summary

- **Core Functional Tests:** 17 Passed
- **AI Bonus Test:** 1 Passed
- **Total Tests:** 18 Passed

## Notes

- The Dream Portal application is hosted as a static site on GitHub Pages.
- Test artifacts (screenshots, video recordings, traces) are automatically captured on test failure.
