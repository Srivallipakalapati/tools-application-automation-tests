import { BasePage } from "./BasePage";

const PRODUCT_CARD = "a[data-test^='product-']";
const ACTIVE_PAGE = "ul.pagination li.active";

/**
 * Product listing page: the product grid, pagination controls and no-results state.
 */
export class ProductListPage extends BasePage {
  private get next() {
    return this.getByDataTest("pagination-next");
  }

  private get prev() {
    return this.getByDataTest("pagination-prev");
  }

  private get noResults() {
    return this.getByDataTest("no-results");
  }

  private get productCards() {
    return cy.get(PRODUCT_CARD);
  }

  private get activePage() {
    return cy.get(ACTIVE_PAGE);
  }

  private static getProductIds(cards: HTMLElement[]): string[] {
    return cards.map((card) => card.getAttribute("data-test") as string);
  }

  assertPaginationVisible(): void {
    this.next.should("be.visible");
  }

  assertOnFirstPageWithPrevDisabled(): void {
    this.activePage.should("contain.text", "1");
    this.prev.parent().should("have.class", "disabled");
  }

  /** Capture the current page's product ids as `@firstPageProducts`, then go next. */
  goToNextPage(): void {
    this.productCards.then(($cards) => {
      cy.wrap(ProductListPage.getProductIds(Array.from($cards))).as("firstPageProducts");
    });
    this.next.click();
  }

  assertOnSecondPageWithNewProducts(): void {
    this.activePage.should("contain.text", "2");
    cy.get<string[]>("@firstPageProducts").then((firstPage) => {
      this.productCards.should(($cards) => {
        expect(ProductListPage.getProductIds(Array.from($cards))).to.not.have.members(firstPage);
      });
    });
  }

  returnToFirstPage(): void {
    this.prev.click();
    this.activePage.should("contain.text", "1");
  }

  assertNoProductsWithMessage(): void {
    this.noResults.should("be.visible");
    this.productCards.should("have.length", 0);
  }
}

export const productListPage = new ProductListPage();
