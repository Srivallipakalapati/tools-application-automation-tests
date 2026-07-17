import { BasePage } from "../BasePage";

/**
 * Top navigation bar, shared across every page.
 */
export class NavBar extends BasePage {
  private get home() {
    return this.getByDataTest("nav-home");
  }

  private get categories() {
    return this.getByDataTest("nav-categories");
  }

  private get signIn() {
    return this.getByDataTest("nav-sign-in");
  }

  private get signOut() {
    return this.getByDataTest("nav-sign-out");
  }

  private get myProfile() {
    return this.getByDataTest("nav-my-profile");
  }

  private get myInvoices() {
    return this.getByDataTest("nav-my-invoices");
  }

  /** The account dropdown, which shows the logged-in user's name. */
  private get accountMenu() {
    return this.getByDataTest("nav-menu");
  }

  /** The cart badge / quantity indicator in the nav. */
  private get cartQuantity() {
    return this.getByDataTest("cart-quantity");
  }

  clickHome(): void {
    this.home.should("be.visible").click();
  }

  clickSignIn(): void {
    this.signIn.should("be.visible").click();
  }

  clickSignOut(): void {
    this.signOut.should("be.visible").click();
  }

  clickMyProfile(): void {
    this.myProfile.should("be.visible").click();
  }

  clickMyInvoices(): void {
    this.myInvoices.should("be.visible").click();
  }

  clickCategories(): void {
    this.categories.should("be.visible").click();
  }

  openAccountMenu(): void {
    this.accountMenu.should("be.visible").click();
  }

  /** Assert the account menu is visible and shows the given text (e.g. a name). */
  assertAccountMenuContains(text: string): void {
    this.accountMenu.should("be.visible").and("contain.text", text);
  }

  assertCartCount(count: string): void {
    this.cartQuantity.should("be.visible").and("contain.text", count);
  }

  /** Open the cart by clicking the cart badge. */
  openCart(): void {
    this.cartQuantity.should("be.visible").click();
  }
}

export const navBar = new NavBar();
