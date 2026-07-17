import { BasePage } from "./BasePage";

/**
 * Account profile page.
 */
export class ProfilePage extends BasePage {
  private get firstName() {
    return this.getByDataTest("first-name");
  }

  private get updateSubmit() {
    return this.getByDataTest("update-profile-submit");
  }

  open(): void {
    this.visit("/account/profile");
  }

  assertFirstName(value: string): void {
    this.firstName.should("have.value", value);
  }

  updateFirstName(firstName: string): void {
    this.firstName.clear().type(firstName);
    this.updateSubmit.should("be.visible").click();
  }

  assertUpdateSuccess(): void {
    this.updateSubmit.parent().find(".alert-success").should("be.visible");
  }
}

export const profilePage = new ProfilePage();
