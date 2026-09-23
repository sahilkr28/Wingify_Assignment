Wingify QA Automation Assignment

Overview:- This project contains automated functional tests for the Dream Portal application.
The automation covers the main user flow of the application, validation of the Dream Diary, validation of the Dream Totals page, and cross-page data consistency.
An additional AI-based test uses the Gemini API to classify dream names as Good or Bad and compares the AI classification with the classification displayed by the application.

Application Under Test:
https://arjitnigam.github.io/myDreams/

Tech Stack:
•	Playwright 
•	TypeScript 
•	Node.js 
•	Gemini API 
•	Allure 
•	GitHub Actions

Project Structure: 
Wingify_Assignment/
│
├── .github/
│   └── workflows/
│       └── playwright.yml
│
├── tests/
│   ├── pages/
│   │   ├── HomePage.ts
│   │   ├── DreamsDiaryPage.ts
│   │   └── DreamsTotalPage.ts
│   │
│   ├── services/
│   │   └── GeminiDreamClassifier.ts
│   │
│   ├── ai/
│   │   └── ai-dream-classification.spec.ts
│   │
│   ├── home.spec.ts
│   ├── dreams-diary.spec.ts
│   ├── dreams-total.spec.ts
│   └── cross-page.spec.ts
│
├── playwright.config.ts
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
Test Coverage:- The test suite currently contains 18 tests.
•	Home Page: The Home Page tests verify: The loading animation appears when the page loads. The loading animation disappears after approximately three seconds. The main content becomes visible. The My Dreams button is visible. The My Dreams button is enabled. Clicking My Dreams opens the Dream Diary and Dream Totals pages.
•	Dream Diary: The Dream Diary tests verify: Exactly 10 dream entries are displayed. Dream types are limited to Good and Bad. Every dream row contains a dream name, days ago value, and dream type. The Days Ago value contains a valid non-negative number.
•	Dream Totals: The Dream Totals tests verify: Good Dreams = 6 Bad Dreams = 4 Total Dreams = 10 Recurring Dreams = 2

Cross-page Validation:- The cross-page tests compare the data displayed on the Dream Diary page with the summary displayed on the Dream Totals page. They also calculate recurring dreams from the diary data and compare the result with the Recurring Dreams value.
The recurring dream names required by the application are also verified: Flying over mountains Lost in maze

Page Object Model:- The tests use the Page Object Model to keep page-specific locators and actions separate from the test cases.
The page objects are: 
•	HomePage 
•	DreamsDiaryPage 
•	DreamsTotalPage
This keeps the test cases focused on what is being tested instead of how individual elements are located.

AI Bonus:- The AI bonus uses the Gemini API to classify the unique dream names from the Dream Diary as either Good or Bad. The test first reads the actual dream data from the application and removes duplicate dream names. The unique names are then sent to Gemini in a single request. The returned classifications are validated and compared with the Dream Type displayed by the application.
The AI logic is separated into: tests/services/GeminiDreamClassifier.ts The API key is stored in a local .env file and is not committed to the repository.

Reporting:- Playwright HTML reporting is enabled in the project. Allure reporting is also configured for the test suite.
To open the Playwright HTML report: npx playwright show-report
To generate and open the Allure report: npx allure generate allure-results --clean -o allure-report npx allure open allure-report
Test artifacts such as screenshots, videos, and traces are retained for failed tests according to the Playwright configuration.

Running the Project:- 
Install the dependencies: npm install
Install the required Playwright browser: npx playwright install chromium
Run the complete core test suite: npx playwright test tests/home.spec.ts tests/dreams-diary.spec.ts tests/dreams-total.spec.ts tests/cross-page.spec.ts
Run the AI bonus test: npx playwright test tests/ai/ai-dream-classification.spec.ts --project=chrome
Run a specific test file: npx playwright test tests/home.spec.ts
Run tests with the browser visible: npx playwright test --headed

Gemini API Setup:-
Create a .env file in the project root: GEMINI_API_KEY=your_api_key_here
The .env file is included in .gitignore and should not be committed to the repository.
The AI test requires a valid Gemini API key and internet access.

CI/CD:-
GitHub Actions is configured to run the core Playwright tests whenever code is pushed to or a pull request is created against the main or master branch.
The CI workflow:
1.	Checks out the repository. 
2.	Sets up Node.js. 
3.	Installs project dependencies. 
4.	Installs Chromium and its dependencies. 
5.	Runs the core Playwright test suite. 
6.	Uploads the Playwright HTML report as a workflow artifact.
The Gemini AI test is kept separate from the core CI suite because it depends on an external API and API credentials.

Current Test Result:-
The current local test results are: 
•	Core functional tests: 17 passed 
•	AI bonus test: 1 passed 
•	Total: 18 passed

Notes:-
The Dream Portal application is a static web application hosted on GitHub Pages. The tests validate the application's current UI, navigation, displayed data, and relationships between the different pages.
The AI test is an additional validation layer and is not required for the core functional test suite.
