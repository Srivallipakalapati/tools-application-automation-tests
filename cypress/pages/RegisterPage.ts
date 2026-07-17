import { BasePage } from "./BasePage";

/** Shape of the registration fixture data. */
export interface RegisterFormData {
  first_name: string;
  last_name: string;
  dob: string;
  phone: string;
  password: string;
  address: {
    country: string;
    postal_code: string;
    houseNumber: string;
    street: string;
    city: string;
    state: string;
  };
}

/**
 * User registration page.
 */
export class RegisterPage extends BasePage {
  private get firstName() {
    return this.getByDataTest("first-name");
  }

  private get lastName() {
    return this.getByDataTest("last-name");
  }

  private get dob() {
    return this.getByDataTest("dob");
  }

  private get phone() {
    return this.getByDataTest("phone");
  }

  private get email() {
    return this.getByDataTest("email");
  }

  private get password() {
    return this.getByDataTest("password");
  }

  private get country() {
    return this.getByDataTest("country");
  }

  private get postalCode() {
    return this.getByDataTest("postal_code");
  }

  private get houseNumber() {
    return this.getByDataTest("house_number");
  }

  private get street() {
    return this.getByDataTest("street");
  }

  private get city() {
    return this.getByDataTest("city");
  }

  private get state() {
    return this.getByDataTest("state");
  }

  private get submit() {
    return this.getByDataTest("register-submit");
  }

  /** Fill in the registration form with the given data and submit it. */
  register(data: RegisterFormData, email: string): void {
    cy.intercept("GET", "**/postcode-lookup*").as("postcodeLookup");

    this.firstName.type(data.first_name);
    this.lastName.type(data.last_name);
    this.dob.type(data.dob);
    this.phone.type(data.phone);
    this.email.type(email);
    this.password.type(data.password, { log: false });

    this.country.select(data.address.country);
    this.postalCode.type(data.address.postal_code);
    this.houseNumber.type(data.address.houseNumber);
    cy.wait("@postcodeLookup");

    this.street.clear().type(data.address.street);
    this.city.clear().type(data.address.city);
    this.state.clear().type(data.address.state);
    this.state.should("have.value", data.address.state);

    this.submit.click();
  }
}

export const registerPage = new RegisterPage();
