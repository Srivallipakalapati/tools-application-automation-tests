import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import locators from "../../fixtures/productLocators.json";
import { createUserAccountViaAPI } from "../../Framework/apiHelper";

Given("I create a new user account using API", () => {
    cy.fixture("createNewUserApiTestData.json").then((userData) => {
        const email = `testuser_${Date.now()}@example.com`;
        cy.wrap(email).as("userEmail");
        cy.wrap(userData.password).as("userPassword");
        createUserAccountViaAPI({ ...userData, email });
    });
});

When("I login with the user email {string} and password {string}", (email: string, password: string) => {
    cy.findByDataTest(locators.sign_in_link_data_test).should("be.visible").and('have.text', 'Sign in').click();
    cy.findByDataTest(locators.email_input_data_test).should("be.visible").type(email);
    cy.findByDataTest(locators.password_input_data_test).should("be.visible").type(password, { log: false });
    cy.findByDataTest(locators.login_button_data_test).should("be.visible").click();
    cy.findByDataTest(locators.nav_menu_data_test).should("be.visible").and("contain.text", "Jack Howe");
});

When("I login with the newly created user account", () => {
    // cy.get("@userEmail").then((email) => {
    //     cy.get("@userPassword").then((password) => {
    //         cy.log(`Logging in with email: ${email}`);
    cy.findByDataTest(locators.sign_in_link_data_test).should("be.visible").and('have.text', 'Sign in').click();
    // cy.findByDataTest(locators.email_input_data_test).should("be.visible").type(email);
    //  cy.findByDataTest(locators.password_input_data_test).should("be.visible").type(password, { log: false });
    cy.findByDataTest(locators.email_input_data_test).should("be.visible").type("testuser_1784149354249@example.com");
    cy.findByDataTest(locators.password_input_data_test).should("be.visible").type("Autocypresstest2@", { log: false });
    cy.findByDataTest(locators.login_button_data_test).should("be.visible").click();
    cy.findByDataTest(locators.nav_menu_data_test).should("be.visible").and("contain.text", "test user");
    //     });
    // });
});

When("I Add a product {string}  {string}to the cart", (productName: string, productQuantity: string) => {
    gotoHandTools();
    cy.findByText(productName, { exact: true }).click();
    cy.wrap(productName).as("productName");
    cy.wrap(productQuantity).as("productQuantity");
    cy.findByDataTest(locators.add_to_cart_data_test).should("be.visible").and("be.enabled").click();
    cy.findByDataTest(locators.cart_quantity_data_test).should("be.visible").and("contain.text", productQuantity);
});

When("I proceed to checkout and complete the purchase", () => {
    cy.findByDataTest(locators.cart_quantity_data_test).should("be.visible").click();
    cy.url().should("include", "/checkout");
    cy.get('@productName').then((productName) => {
        verifyProductDetailsonCartPage(productName);
    });
    cy.findByDataTest(locators.proceed_to_checkout_data_test).should("be.visible").and("be.enabled").click();
});

export function gotoHandTools() {
    cy.findByDataTest(locators.nav_categeory_data_test).should("be.visible").click();
    cy.findByDataTest(locators.nav_hand_tools_data_test).contains("Hand Tools").click();
}

export function verifyProductDetailsonCartPage(expectedProductName: string) {
    cy.fixture("productDetailsTestData.json").then((testData) => {
        const productDetails = testData[expectedProductName];
        cy.findByDataTest(locators.product_title_data_test).should("be.visible").should('contain.text', expectedProductName);
        cy.get('@productQuantity').then((productQuantity) => {
            cy.findByDataTest(locators.product_quantity_data_test).should("be.visible").should('contain.value', productQuantity);
        });
        cy.findByDataTest(locators.product_price_data_test).should("be.visible").and('contain.text', productDetails.unitPrice);
        cy.findByDataTest(locators.line_price_data_test).should("be.visible").and('contain.text', productDetails.unitPrice);
        cy.findByDataTest(locators.cart_total_data_test).should("be.visible").and('contain.text', productDetails.unitPrice);
    });
};

// export function checkoutAsLoggedinUser()
// {
//     cy.
// }