import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import locators from "../../fixtures/productLocators.json";

Given("I navigate to the tool shop application", () => {
  cy.visit("");
});

When("I click on a product {string}", (productName: string) => {
  //  cy.findByText(productName,{exact: true}).click();
  cy.findByText(productName, { exact: true }).click();
});

Then("I should see the product details for {string} as expected", (expectedProductName: string) => {
  cy.fixture("productDetailsTestData.json").then((testData) => {
    const productDetails = testData[expectedProductName];
    cy.findByDataTest(locators.product_name_data_test).should("be.visible").should(($actualProductName) => {
      expect($actualProductName.text().trim()).to.equal(expectedProductName);
    });
    cy.findByDataTest(locators.product_description_data_test).should("be.visible").should(($actualDescription) => {
      expect($actualDescription.text().trim()).to.equal(productDetails.productDescription);
    });
    cy.findByDataTest(locators.unit_price_data_test).should("be.visible").should(($actualUnitPrice) => {
      expect(`$${$actualUnitPrice.text().trim()}`).to.equal(productDetails.unitPrice);
    });
  });

  cy.get('img').should('be.visible').should('have.attr', 'alt').and('include', expectedProductName);
});


Then("I should be redirected to the product details page", () => {
  cy.url().should("include", "/product/");
});

Then("I verify add to cart button is present and enabled", (productName: string) => {
  cy.findByDataTest(locators.add_to_cart_data_test).should("be.visible").and("be.enabled");
  // cy.findByDataTest(locators.add_to_cart_data_test).should("be.visible").and("not.have.attr", "disabled");
  // cy.findByDataTest("add-to-favorites").should("be.visible").and("be.enabled");
  // cy.findByDataTest("add-to-compare").should("be.visible").and("be.enabled");
  // cy.findByDataTest("specs-title").should("be.visible").and("contain.text", "Specifications");
  // cy.findByDataTest("product-specs").should("be.visible");
});