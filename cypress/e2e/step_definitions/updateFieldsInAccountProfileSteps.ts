import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { UserPayload } from "../../Framework/apiHelper";
import { navBar, loginPage, registerPage, profilePage } from "../../pages";
import { RegisterFormData } from "../../pages/RegisterPage";

Given("I register a new user account", () => {
  cy.fixture("createNewUserTestData.json").then((newUser: RegisterFormData) => {
    const email = `testuser_${Date.now()}@example.com`;
    cy.wrap(newUser).as("newUser");
    cy.wrap(email).as("userEmail");
    cy.wrap(newUser.password).as("userPassword");

    navBar.clickSignIn();
    cy.url().should("include", "auth/login");
    loginPage.goToRegister();
    cy.url().should("include", "auth/register");

    registerPage.register(newUser, email);

    cy.url().should("include", "/auth/login");
  });
});

When("I log in with my new account", () => {
  cy.get<string>("@userEmail").then((email) => {
    cy.get<string>("@userPassword").then((password) => {
      navBar.clickSignIn();
      loginPage.login(email, password);
    });
  });
  cy.get<UserPayload>("@newUser").then((user) => {
    navBar.assertAccountMenuContains(`${user.first_name} ${user.last_name}`);
  });
});

When("I log in with email {string} and password {string}", (email: string, password: string) => {
  navBar.clickSignIn();
  loginPage.login(email, password);
});

When("I update my account first name to {string}", (firstName: string) => {
  profilePage.open();
  cy.get<UserPayload>("@newUser").then((user) => {
    profilePage.assertFirstName(user.first_name);
  });
  profilePage.updateFirstName(firstName);
});

Then("I should see the profile updated successfully message", () => {
  profilePage.assertUpdateSuccess();
});

Then("the account menu should display my updated name {string}", (expectedName: string) => {
  navBar.visit("");
  navBar.assertAccountMenuContains(expectedName);
});

Then("I should see a login error message", () => {
  loginPage.assertError("Invalid email or password");
});
