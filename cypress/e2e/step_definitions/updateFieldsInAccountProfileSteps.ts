import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import locators from "../../fixtures/productLocators.json";
import { UserPayload } from "../../Framework/apiHelper";

Given("I register a new user account", () => {
  cy.fixture("createNewUserTestData.json").then((newUser) => {
    const email = `testuser_${Date.now()}@example.com`;
    cy.wrap(newUser).as("newUser");
    cy.wrap(email).as("userEmail");
    cy.wrap(newUser.password).as("userPassword");

   cy.findByDataTest(locators.nav_sign_in_data_test).click();
    cy.url().should("include" ,"auth/login");
    cy.findByDataTest(locators.register_link_data_test).click();
    cy.url().should("include" ,"auth/register");
    cy.intercept("GET", "**/postcode-lookup*").as("postcodeLookup");

    cy.findByDataTest(locators.first_name_input_data_test).type(newUser.first_name);
    cy.findByDataTest(locators.last_name_input_data_test).type(newUser.last_name);
    cy.findByDataTest(locators.dob_input_data_test).type(newUser.dob);
    cy.findByDataTest(locators.phone_input_data_test).type(newUser.phone);
    cy.findByDataTest(locators.email_input_data_test).type(email);
    cy.findByDataTest(locators.password_input_data_test).type(newUser.password, { log: false });

    cy.findByDataTest(locators.country_select_data_test).select(newUser.address.country);
    cy.findByDataTest(locators.postal_code_input_data_test).type(newUser.address.postal_code);

    cy.findByDataTest(locators.house_number_input_data_test).type(newUser.address.houseNumber);
    cy.wait("@postcodeLookup");

    cy.findByDataTest(locators.street_input_data_test).clear().type(newUser.address.street);
    cy.findByDataTest(locators.city_input_data_test).clear().type(newUser.address.city);
    cy.findByDataTest(locators.state_input_data_test).clear().type(newUser.address.state);
    cy.findByDataTest(locators.state_input_data_test).should("have.value", newUser.address.state);

    cy.findByDataTest(locators.register_submit_data_test).click();

    cy.url().should("include", "/auth/login");
  });
});

function submitLogin(email: string, password: string) {
  cy.findByDataTest(locators.nav_sign_in_data_test).click();
  cy.findByDataTest(locators.email_input_data_test).should("be.visible").clear().type(email);
  cy.findByDataTest(locators.password_input_data_test).should("be.visible").clear().type(password, { log: false });
  cy.findByDataTest(locators.login_button_data_test).should("be.visible").click();
}

When("I log in with my new account", () => {
  cy.get<string>("@userEmail").then((email) => {
    cy.get<string>("@userPassword").then((password) => {
      submitLogin(email, password);
    });
  });
  cy.get<UserPayload>("@newUser").then((user) => {
    cy.findByDataTest(locators.nav_menu_data_test)
      .should("be.visible")
      .and("contain.text", `${user.first_name} ${user.last_name}`);
  });
});

When("I log in with email {string} and password {string}", (email: string, password: string) => {
  submitLogin(email, password);
});

When("I update my account first name to {string}", (firstName: string) => {
  cy.visit("/account/profile");
  cy.get<UserPayload>("@newUser").then((user) => {
    cy.findByDataTest(locators.first_name_input_data_test).should("have.value", user.first_name);
  });
  cy.findByDataTest(locators.first_name_input_data_test).clear().type(firstName);
  cy.findByDataTest(locators.update_profile_submit_data_test).should("be.visible").click();
});

Then("I should see the profile updated successfully message", () => {
  cy.findByDataTest(locators.update_profile_submit_data_test)
    .parent()
    .find(".alert-success")
    .should("be.visible");
});

Then("the account menu should display my updated name {string}", (expectedName: string) => {
  cy.visit("");
  cy.findByDataTest(locators.nav_menu_data_test).should("be.visible").and("contain.text", expectedName);
});

Then("I should see a login error message", () => {
  cy.findByDataTest(locators.login_error_data_test).should("be.visible").and('have.text', "Invalid email or password");
});
