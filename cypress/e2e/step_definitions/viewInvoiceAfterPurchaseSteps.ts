import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import locators from "../../fixtures/productLocators.json";
import checkoutData from "../../fixtures/checkoutTestData.json";
import { createUserAccountViaAPI, Product } from "../../Framework/apiHelper";

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
            cy.findByDataTest(locators.sign_in_link_data_test).should("be.visible").and('have.text', 'Sign in').click();
            cy.findByDataTest(locators.email_input_data_test).should("be.visible").type(email);
            cy.findByDataTest(locators.password_input_data_test).should("be.visible").type(password, { log: false });
            cy.findByDataTest(locators.login_button_data_test).should("be.visible").click();
            cy.findByDataTest(locators.nav_menu_data_test).should("be.visible").and("contain.text", "test user");
        });
    });
});

When("I add the in stock product to the cart", () => {
    cy.get<Product>("@inStockProduct").then((product) => {
        cy.wrap(product.name).as("productName");
        cy.wrap("1").as("productQuantity");
        cy.findByDataTest(locators.add_to_cart_data_test).should("be.visible").and("be.enabled").click();
        cy.findByDataTest(locators.cart_quantity_data_test).should("be.visible").and("contain.text", "1");
    });
});

When("I proceed to checkout and complete the purchase", () => {
    proceedToPaymentStep();
    selectPaymentMethodAndConfirm();
});

When("I proceed to checkout up to the payment step", () => {
    proceedToPaymentStep();
});

When("I enter bank transfer details with an invalid account number", () => {
    const bank = checkoutData.invalidBankTransfer;
    cy.findByDataTest(locators.payment_method_data_test).should("be.visible").select(bank.paymentMethod);
    cy.findByDataTest(locators.bank_name_data_test).should("be.visible").clear().type(bank.bankName);
    cy.findByDataTest(locators.account_name_data_test).should("be.visible").clear().type(bank.accountName);
    cy.findByDataTest(locators.account_number_data_test).should("be.visible").clear().type(bank.accountNumber);
});

Then("I should see an invalid account number error", () => {
    cy.findByText("Account number must be numeric.").should("be.visible");
});

Then("the confirm payment button should be disabled", () => {
    cy.findByDataTest(locators.finish_checkout_data_test).should("be.visible").and("be.disabled");
});

When("I navigate to the invoice page", () => {
    cy.intercept("GET", "**/invoices*").as("getInvoices");
    cy.findByDataTest(locators.nav_menu_data_test).should('be.visible').click();
    cy.findByDataTest(locators.nav_invoices_data_test).should("be.visible").click();
});

Then("I verify that invoice details are correct", () => {
    cy.get("@invoiceId").then((invoiceId) => {
        cy.log(`Invoice ID: ${invoiceId}`);
        cy.url().should('include', "account/invoices");
        cy.wait("@getInvoices").its("response.statusCode").should("eq", 200);
        cy.findByDataTest(locators.page_title_data_test).should('be.visible').and('contain.text', "Invoices");

        const today = new Date().toISOString().slice(0, 10); 
        cy.get<Product>("@inStockProduct").then((product) => {
            const unitPrice = `$${product.price.toFixed(2)}`;
            cy.get("@billingStreet").then((billingStreet) => {
                cy.get("table tbody tr").should("have.length", 1).within(() => {
                    cy.get("td").eq(0).should("contain.text", `${invoiceId}`);
                    cy.get("td").eq(1).should("contain.text", `${billingStreet}`);
                    cy.get("td").eq(2).should("contain.text", today);
                    cy.get("td").eq(3).should("contain.text", unitPrice);
                });
            });
        });
    });
});

export function proceedToPaymentStep() {
    cy.findByDataTest(locators.cart_quantity_data_test).should("be.visible").click();
    cy.url().should("include", "/checkout");
    cy.get<Product>('@inStockProduct').then((product) => {
        verifyProductDetailsonCartPage(product);
    });
    checkoutAsLoggedinUser();
    AddBillingAddressDetailsAndProccedToCheckout();
    cy.contains("h3", "Payment").should("be.visible");
}

export function verifyProductDetailsonCartPage(product: Product) {
    const unitPrice = product.price.toFixed(2);
    cy.findByDataTest(locators.product_title_data_test).should("be.visible").and('contain.text', product.name);
    cy.get('@productQuantity').then((productQuantity) => {
        cy.findByDataTest(locators.product_quantity_data_test).should("be.visible").and('contain.value', productQuantity);
    });
    cy.findByDataTest(locators.product_price_data_test).should("be.visible").and('contain.text', unitPrice);
    cy.findByDataTest(locators.line_price_data_test).should("be.visible").and('contain.text', unitPrice);
    cy.findByDataTest(locators.cart_total_data_test).should("be.visible").and('contain.text', unitPrice);
    cy.findByDataTest(locators.proceed_to_checkout_data_test).should("be.visible").and("be.enabled").click();
};

export function checkoutAsLoggedinUser() {
    cy.findByText("Hello test user, you are already logged in. You can proceed to checkout.").should("be.visible");
    cy.findByDataTest(locators.proceed_to_checkout_signin_data_test).should("be.visible").and("be.enabled").click();
}

export function AddBillingAddressDetailsAndProccedToCheckout() {
    const billing = checkoutData.billingAddress;
    cy.intercept("GET", "**/postcode-lookup*").as("postcodeLookup");

    cy.contains("h3", "Billing Address").should("be.visible");
    cy.findByDataTest(locators.country).should("be.visible").select(billing.country);
    cy.findByDataTest(locators.postal_code_data_test).should("be.visible").clear().type(billing.postalCode).type("{enter}");
    cy.findByDataTest(locators.house_number_data_test).should("be.visible").clear().type(billing.houseNumber);
    cy.wait("@postcodeLookup").its("response.statusCode").should("eq", 200);

    cy.findByDataTest(locators.street_data_test).invoke("val").then((street) => {
        cy.wrap(String(street).trim()).as("billingStreet");
    });

    cy.findByDataTest(locators.state_data_test).should("be.visible").clear().type(billing.state);
    cy.findByDataTest(locators.proceed_to_checkout_billing_address_data_test).should("be.visible").and("be.enabled").click();
}

export function selectPaymentMethodAndConfirm() {
    const bank = checkoutData.bankTransfer;
    cy.intercept("POST", "**/payment/check").as("checkPayment");
    cy.intercept("POST", "**/invoices").as("createInvoice");

    cy.contains("h3", "Payment").should("be.visible");
    cy.findByDataTest(locators.payment_method_data_test).should("be.visible").select(bank.paymentMethod);
    cy.findByDataTest(locators.bank_name_data_test).should("be.visible").clear().type(bank.bankName);
    cy.findByDataTest(locators.account_name_data_test).should("be.visible").clear().type(bank.accountName);
    cy.findByDataTest(locators.account_number_data_test).should("be.visible").clear().type(bank.accountNumber);

    cy.findByDataTest(locators.finish_checkout_data_test).should("be.visible").and("be.enabled").click();
    cy.wait("@checkPayment").its("response.statusCode").should("eq", 200);
    cy.findByDataTest(locators.payment_confirmation_data_test).should("be.visible").and("contain.text", "Payment was successful");

    cy.findByDataTest(locators.finish_checkout_data_test).should("be.visible").and("be.enabled").click();
    cy.wait("@createInvoice").its("response.statusCode").should("eq", 201);
    cy.get(locators.order_confirmation_id).should("be.visible").and("contain.text", "Thanks for your order! Your invoice number is ");
    cy.get(locators.order_confirmation_id).find("span").invoke("text").then((invoiceId) => {
        cy.wrap(invoiceId.trim()).as("invoiceId");
        cy.log(`Invoice ID: ${invoiceId}`);
    });
}
