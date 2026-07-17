# Tools Application Automation Tests

End-to-end UI tests written with Cypress and Cucumber (BDD) in TypeScript.

## Packages

- `cypress` — the test runner and browser automation.
- `@badeball/cypress-cucumber-preprocessor` — lets Cypress run `.feature` files and maps them to the step definitions.
- `@bahmutov/cypress-esbuild-preprocessor` — bundles the TypeScript step definitions with esbuild so the Cucumber preprocessor can load them.
- `@testing-library/cypress` — adds user-facing queries such as `cy.findByRole` and `cy.findByText`.
- `cypress-mochawesome-reporter` — generates the HTML test report.
- `typescript` — type checking for the tests and helpers.

## Setup

```bash
npm install
```

## Running the tests

The suite runs against two environments: the **main** site (expected to pass) and the **buggy** site (expected to fail).

```bash
npm run cy:open        # interactive runner, main site
npm run cy:open:bugs   # interactive runner, buggy site
npm run test:main      # headless, main site
npm run test:bugs      # headless, buggy site
```

### Switching environments

Each script passes `--env envFile=main` or `--env envFile=bugenv`. At startup `cypress.config.ts` reads the matching file in `config/`, which holds the `baseUrl` (the site) and `apiUrl` (the backend) for that environment. To point the tests somewhere else, edit those JSON files rather than the specs.

### Test report

The Mochawesome reporter writes results to `cypress/reports/test-report` after a headless run, with charts and embedded screenshots for any failures. Note that `cypress.config.ts` currently sets `html: false`, so only the JSON is produced — flip that to `true` if you want the HTML report generated automatically.

## Known bugs on the buggy site

These are the defects the `bugs` environment reproduces, which is why `npm run test:bugs` is expected to fail.

### View product details

- The product details page doesn't include the product name in the image description.
- The Home button takes the user to the Contact page instead of the home page.

### Update fields in account profile

- The postal code field differs from the one on the main site.

### API failures

- User registration API `/users/register` has a different payload in the `bugs` environment and failing to register the user.

## How we use the API in these tests

The tests are UI tests, but a few steps call the backend directly with `cy.request()`. The helpers live in [cypress/Framework/apiHelper.ts](cypress/Framework/apiHelper.ts).

**Why:** the site's catalogue changes, so hard-coding a product name or a "Out of stock" item makes tests flaky. Asking the API what exists right now keeps them reliable. The API is also much faster than clicking through the UI for setup work that isn't the thing under test.

**Where:**

- `findInStockProduct` / `findOutOfStockProduct` — pick a real product before a test opens its detail page or tries to add it to the cart, instead of guessing one. Both page through `/products` until a suitable item is found, skipping rentals.
- `createUserAccountViaAPI` — register the user for the account-profile tests in one `POST /users/register` call, so the test can go straight to logging in and updating fields.

Each helper stores its result as a Cypress alias (`@inStockProduct` and so on) for the step definitions to pick up.

## Layout

- `cypress/e2e/features/` — Gherkin `.feature` files
- `cypress/e2e/step_definitions/` — step implementations; these are thin and delegate to page objects
- `cypress/pages/` — Page Object Model: one class per page (plus `components/` for shared UI like the nav bar and search bar). Each page owns its own `data-test` selectors as private getters and exposes actions/assertions. Import the ready-made singletons from `cypress/pages` (barrel export).
- `cypress/fixtures/` — test data only (users, checkout data)
- `cypress/Framework/` — shared helpers (e.g. API calls)
- `cypress/support/` — custom commands and global setup

### Page Object Model

Locators used to live in a single flat `fixtures/productLocators.json`. They now live next to the behaviour that uses them, inside the relevant page class in `cypress/pages/`. To add or change a selector, edit the private getter on its page — step definitions never reference raw selectors.

## Note

- Due to time restrictions, I am unable to complete `filter` products test in scenarion 3 as the test more time than anticipated. 