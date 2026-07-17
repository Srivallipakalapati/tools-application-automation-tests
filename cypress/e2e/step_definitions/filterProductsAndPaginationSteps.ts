import { When, Then } from "@badeball/cypress-cucumber-preprocessor";
import locators from "../../fixtures/productLocators.json";

function getProductIds(cards: HTMLElement[]): string[] {
    return cards.map((card) => card.getAttribute("data-test") as string);
}

Then("the product pagination is displayed", () => {
    cy.findByDataTest(locators.pagination_next_data_test).should("be.visible");
});

Then("I am on the first page with the previous control disabled", () => {
    cy.get(locators.pagination_active_page).should("contain.text", "1");
    cy.findByDataTest(locators.pagination_prev_data_test).parent().should("have.class", "disabled");
});

When("I go to the next page of products", () => {
    cy.get(locators.product_card).then(($cards) => {
        cy.wrap(getProductIds(Array.from($cards))).as("firstPageProducts");
    });
    cy.findByDataTest(locators.pagination_next_data_test).click();
});

Then("the second page of products is shown", () => {
    cy.get(locators.pagination_active_page).should("contain.text", "2");
    cy.get("@firstPageProducts").then((firstPage: string[]) => {
        cy.get(locators.product_card).should(($cards) => {
            expect(getProductIds(Array.from($cards))).to.not.have.members(firstPage);
        });
    });
});

Then("I can return to the first page", () => {
    cy.findByDataTest(locators.pagination_prev_data_test).click();
    cy.get(locators.pagination_active_page).should("contain.text", "1");
});

When("I search the catalogue for {string}", (searchTerm: string) => {
    cy.findByDataTest(locators.search_query_data_test).should("be.visible").clear().type(searchTerm);
    cy.findByDataTest(locators.search_submit_data_test).click();
});

Then("no products are shown and a no results message is displayed", () => {
    cy.findByDataTest(locators.no_results_data_test).should("be.visible");
    cy.get(locators.product_card).should("have.length", 0);
});
