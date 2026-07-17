import { BasePage } from "./BasePage";

/**
 * Login page.
 */
export class LoginPage extends BasePage {
  private get email() {
    return this.getByDataTest("email");
  }

  private get password() {
    return this.getByDataTest("password");
  }

  private get submit() {
    return this.getByDataTest("login-submit");
  }

  private get error() {
    return this.getByDataTest("login-error");
  }

  private get registerLink() {
    return this.getByDataTest("register-link");
  }

  /** Fill in credentials and submit. Assumes the login page is already shown. */
  login(email: string, password: string): void {
    this.email.should("be.visible").clear().type(email);
    this.password.should("be.visible").clear().type(password, { log: false });
    this.submit.should("be.visible").click();
  }

  goToRegister(): void {
    this.registerLink.should("be.visible").click();
  }

  assertError(message: string): void {
    this.error.should("be.visible").and("have.text", message);
  }
}

export const loginPage = new LoginPage();
