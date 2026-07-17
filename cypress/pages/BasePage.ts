/**
 * Base class for all page objects. Provides shared, low-level helpers so page
 * classes stay focused on their own elements and actions.
 */
export abstract class BasePage {
  /** Select an element by its `data-test` attribute. */
  protected getByDataTest(value: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.findByDataTest(value);
  }

  /** Visit a path relative to the configured baseUrl. */
  visit(path = ""): void {
    cy.visit(path);
  }
}
