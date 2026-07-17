import { BasePage } from "../BasePage";

/**
 * Product search bar and its result-related affordances.
 */
export class SearchBar extends BasePage {
  private get query() {
    return this.getByDataTest("search-query");
  }

  private get submit() {
    return this.getByDataTest("search-submit");
  }

  private get reset() {
    return this.getByDataTest("search-reset");
  }

  private get noResults() {
    return this.getByDataTest("no-results");
  }

  /** Search for a term and wait for the search request to complete. */
  search(term: string): void {
    cy.intercept("**/search*").as("searchProducts");
    this.query.clear().type(term);
    this.submit.click();
    cy.wait("@searchProducts").its("response.statusCode").should("eq", 200);
  }

  /** Search for a term without waiting on the network (used for edge cases). */
  searchImmediate(term: string): void {
    this.query.should("be.visible").clear().type(term);
    this.submit.click();
  }

  clickReset(): void {
    this.reset.should("be.visible").click();
  }

  assertNoResults(): void {
    this.noResults.should("be.visible");
  }
}

export const searchBar = new SearchBar();
