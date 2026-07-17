import { BasePage } from "./BasePage";
import { Product } from "../Framework/apiHelper";

/**
 * Product detail page: name, description, price, image and cart controls.
 */
export class ProductDetailsPage extends BasePage {
  private get name() {
    return this.getByDataTest("product-name");
  }

  private get description() {
    return this.getByDataTest("product-description");
  }

  private get unitPrice() {
    return this.getByDataTest("unit-price");
  }

  private get outOfStock() {
    return this.getByDataTest("out-of-stock");
  }

  private get addToCartButton() {
    return this.getByDataTest("add-to-cart");
  }

  private get image() {
    return cy.get("img.figure-img");
  }

  /** Assert the displayed details match the given product. */
  assertMatchesProduct(product: Product): void {
    this.name.should("be.visible").should(($name) => {
      expect($name.contents().first().text().trim()).to.equal(product.name);
    });
    this.description.should("be.visible").should(($description) => {
      expect($description.text().trim()).to.equal(product.description.trim());
    });
    this.unitPrice.should("be.visible").should(($price) => {
      expect($price.text().trim()).to.equal(product.price.toFixed(2));
    });
    this.image
      .should("be.visible")
      .and("have.attr", "alt")
      .and("include", product.name);
  }

  assertOnDetailsUrl(): void {
    cy.get<string>("@productHref").then((productHref) => {
      cy.url().should("include", productHref);
    });
  }

  assertOutOfStock(): void {
    this.outOfStock.should("be.visible");
  }

  assertAddToCartDisabled(): void {
    this.addToCartButton.should("be.visible").and("be.disabled");
  }

  assertAddToCartEnabled(): void {
    this.addToCartButton.should("be.visible").and("be.enabled");
  }

  addToCart(): void {
    this.addToCartButton.should("be.visible").and("be.enabled").click();
  }
}

export const productDetailsPage = new ProductDetailsPage();
