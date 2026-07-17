import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import locators from "../../fixtures/productLocators.json";
import { findInStockProduct, findOutOfStockProduct, Product } from "../../Framework/apiHelper";

Given("I navigate to the tool shop application", () => {
  cy.visit("");
});

Given("I get an in stock product from the catalogue", () => {
  findInStockProduct();
});

When("I search for the in stock product", () => {
  cy.get("@inStockProduct").then((product) => {
    cy.findByDataTest(locators.nav_home_data_test).should("be.visible").click();
    cy.findByDataTest(locators.search_query_data_test).clear().type(product.name);
    cy.findByDataTest(locators.search_submit_data_test).click();
  });
});

When("I click on the in stock product from the search results", () => {
  cy.get<Product>("@inStockProduct").then((product) => {
    cy.findByDataTest(locators.product_name_data_test)
      .filter((_, result) => result.textContent?.trim() === product.name)
      .should("have.length", 1)
      .closest("a")
      .then(($link) => {
        cy.wrap($link.attr("href")).as("productHref");
        cy.wrap($link).click();
      });
  });
});

Then("I should see the in stock product details as expected", () => {
  cy.get("@inStockProduct").then((product) => {
    cy.findByDataTest(locators.product_name_data_test).should("be.visible").should(($name) => {
      expect($name.contents().first().text().trim()).to.equal(product.name);
    });
    cy.findByDataTest(locators.product_description_data_test).should("be.visible").should(($description) => {
      expect($description.text().trim()).to.equal(product.description.trim());
    });
    cy.findByDataTest(locators.unit_price_data_test).should("be.visible").should(($price) => {
      expect($price.text().trim()).to.equal(product.price.toFixed(2));
    });
    cy.get("img.figure-img").should("be.visible").and("have.attr", "alt").and("include", product.name);
  });
});


Then("I should be redirected to the product details page", () => {
  cy.get("@productHref").then((productHref) => {
    cy.url().should("include", productHref);
  });
});

When("I open an out of stock product", () => {
  findOutOfStockProduct();
  cy.get("@outOfStockProduct").then((product) => {
    cy.visit(`/product/${product.id}`);
  });
});

Then("I should see an out of stock message", () => {
  cy.findByDataTest(locators.out_of_stock_data_test).should("be.visible");
});

Then("I verify add to cart button is present but disabled", () => {
  cy.findByDataTest(locators.add_to_cart_data_test).should("be.visible").and("be.disabled");
});

Then("I verify add to cart button is present and enabled", () => {
  cy.findByDataTest(locators.add_to_cart_data_test).should("be.visible").and("be.enabled");
});