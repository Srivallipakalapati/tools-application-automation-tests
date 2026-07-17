import { BasePage } from "./BasePage";
import { Product } from "../Framework/apiHelper";

/**
 * Home / product listing page, including the product grid shown after a search.
 */
export class HomePage extends BasePage {
  private get productName() {
    return this.getByDataTest("product-name");
  }

  /**
   * Click the product card matching the given product by name, aliasing its
   * href as `@productHref` for later URL assertions.
   */
  openProductFromResults(product: Product): void {
    this.productName
      .filter((_, result) => result.textContent?.trim() === product.name)
      .closest("a")
      .then(($link) => {
        cy.wrap($link.attr("href")).as("productHref");
        cy.wrap($link).click();
      });
  }
}

export const homePage = new HomePage();
