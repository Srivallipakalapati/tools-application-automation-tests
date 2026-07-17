import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import checkoutData from "../../fixtures/checkoutTestData.json";
import { createUserAccountViaAPI, Product } from "../../Framework/apiHelper";
import { navBar, loginPage, productDetailsPage, checkoutPage, invoicePage } from "../../pages";

Given("I create a new user account using API", () => {
    cy.fixture("createNewUserTestData.json").then((userData) => {
        const email = `testuser_${Date.now()}@example.com`;
        cy.wrap(email).as("userEmail");
        cy.wrap(userData.password).as("userPassword");
        createUserAccountViaAPI({ ...userData, email });
    });
});

When("I login with the newly created user account", () => {
    cy.get("@userEmail").then((email) => {
        cy.get("@userPassword").then((password) => {
            cy.log(`Logging in with email: ${email}`);
            navBar.clickSignIn();
            loginPage.login(email, password);
            navBar.assertAccountMenuContains("test user");
        });
    });
});

When("I add the in stock product to the cart", () => {
    cy.get("@inStockProduct").then((product) => {
        cy.wrap(product.name).as("productName");
        cy.wrap("1").as("productQuantity");
        productDetailsPage.assertAddToCartEnabled();
        productDetailsPage.addToCart();
        navBar.assertCartCount("1");
    });
});

When("I proceed to checkout and complete the purchase", () => {
    proceedToPaymentStep();
    checkoutPage.fillBankTransferDetails(checkoutData.bankTransfer);
    checkoutPage.confirmPaymentAndFinish();
});

When("I proceed to checkout up to the payment step", () => {
    proceedToPaymentStep();
});

When("I enter bank transfer details with an invalid account number", () => {
    checkoutPage.fillBankTransferDetails(checkoutData.invalidBankTransfer);
});

Then("I should see an invalid account number error", () => {
    checkoutPage.assertInvalidAccountNumberError();
});

Then("the confirm payment button should be disabled", () => {
    checkoutPage.assertConfirmDisabled();
});

When("I navigate to the invoice page", () => {
    invoicePage.open();
});

Then("I verify that invoice details are correct", () => {
    cy.get<Product>("@inStockProduct").then((product) => {
        invoicePage.assertInvoiceDetails(product);
    });
});

function proceedToPaymentStep() {
    navBar.openCart();
    checkoutPage.assertOnCheckoutUrl();
    cy.get<Product>("@inStockProduct").then((product) => {
        checkoutPage.reviewCartAndProceed(product);
    });
    checkoutPage.confirmLoggedInAndProceed();
    checkoutPage.fillBillingAddressAndProceed(checkoutData.billingAddress);
    checkoutPage.assertOnPaymentStep();
}
