import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { findInStockProduct, findOutOfStockProduct, Product } from "../../Framework/apiHelper";
import { navBar, searchBar, homePage, productDetailsPage } from "../../pages";

Given("I navigate to the tool shop application", () => {
  homePage.visit();
});

Given("I get an in stock product from the catalogue", () => {
  findInStockProduct();
});

When("I click on home button", () => {
  navBar.clickHome();
});

When("I search for the in stock product", () => {
  cy.get("@inStockProduct").then((product) => {
    searchBar.search(product.name);
  });
});

When("I click on the in stock product from the search results", () => {
  cy.get("@inStockProduct").then((product) => {
    homePage.openProductFromResults(product);
  });
});

Then("I should see the in stock product details as expected", () => {
  cy.get("@inStockProduct").then((product) => {
    productDetailsPage.assertMatchesProduct(product);
  });
});

Then("I should be redirected to the product details page", () => {
  productDetailsPage.assertOnDetailsUrl();
});

When("I open an out of stock product", () => {
  findOutOfStockProduct();
  cy.get("@outOfStockProduct").then((product) => {
    searchBar.search(product.name);
    homePage.openProductFromResults(product);
  });
});

Then("I should see an out of stock message", () => {
  productDetailsPage.assertOutOfStock();
});

Then("I verify add to cart button is present but disabled", () => {
  productDetailsPage.assertAddToCartDisabled();
});

Then("I verify add to cart button is present and enabled", () => {
  productDetailsPage.assertAddToCartEnabled();
});
