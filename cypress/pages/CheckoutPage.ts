import { BasePage } from "./BasePage";
import { Product } from "../Framework/apiHelper";

/** Billing address fixture shape. */
export interface BillingAddress {
  country: string;
  postalCode: string;
  houseNumber: string;
  state: string;
}

/** Bank transfer payment fixture shape. */
export interface BankTransferDetails {
  paymentMethod: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
}

/**
 * Multi-step checkout flow: cart review, sign-in confirmation, billing address
 * and payment.
 */
export class CheckoutPage extends BasePage {
  // Cart review step
  private get productTitle() {
    return this.getByDataTest("product-title");
  }

  private get productQuantity() {
    return this.getByDataTest("product-quantity");
  }

  private get productPrice() {
    return this.getByDataTest("product-price");
  }

  private get linePrice() {
    return this.getByDataTest("line-price");
  }

  private get cartTotal() {
    return this.getByDataTest("cart-total");
  }

  private get proceedFromCart() {
    return this.getByDataTest("proceed-1");
  }

  // Sign-in step
  private get proceedFromSignIn() {
    return this.getByDataTest("proceed-2");
  }

  // Billing address step
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

  private get state() {
    return this.getByDataTest("state");
  }

  private get proceedFromBilling() {
    return this.getByDataTest("proceed-3");
  }

  // Payment step
  private get paymentMethod() {
    return this.getByDataTest("payment-method");
  }

  private get bankName() {
    return this.getByDataTest("bank_name");
  }

  private get accountName() {
    return this.getByDataTest("account_name");
  }

  private get accountNumber() {
    return this.getByDataTest("account_number");
  }

  private get finish() {
    return this.getByDataTest("finish");
  }

  private get paymentConfirmation() {
    return this.getByDataTest("payment-success-message");
  }

  private get orderConfirmation() {
    return cy.get("#order-confirmation");
  }

  assertOnCheckoutUrl(): void {
    cy.url().should("include", "/checkout");
  }

  /** Verify the cart line reflects the product, then proceed past the cart. */
  reviewCartAndProceed(product: Product): void {
    const unitPrice = product.price.toFixed(2);
    this.productTitle.should("be.visible").and("contain.text", product.name);
    cy.get("@productQuantity").then((productQuantity) => {
      this.productQuantity.should("be.visible").and("contain.value", productQuantity as unknown as string);
    });
    this.productPrice.should("be.visible").and("contain.text", unitPrice);
    this.linePrice.should("be.visible").and("contain.text", unitPrice);
    this.cartTotal.should("be.visible").and("contain.text", unitPrice);
    this.proceedFromCart.should("be.visible").and("be.enabled").click();
  }

  /** Confirm the already-logged-in message and proceed past the sign-in step. */
  confirmLoggedInAndProceed(): void {
    cy.findByText("Hello test user, you are already logged in. You can proceed to checkout.").should("be.visible");
    this.proceedFromSignIn.should("be.visible").and("be.enabled").click();
  }

  /** Fill in the billing address (aliasing the looked-up street as `@billingStreet`) and proceed. */
  fillBillingAddressAndProceed(billing: BillingAddress): void {
    cy.intercept("GET", "**/postcode-lookup*").as("postcodeLookup");

    cy.contains("h3", "Billing Address").should("be.visible");
    this.country.should("be.visible").select(billing.country);
    this.postalCode.should("be.visible").clear().type(billing.postalCode).type("{enter}");
    this.houseNumber.should("be.visible").clear().type(billing.houseNumber);
    cy.wait("@postcodeLookup").its("response.statusCode").should("eq", 200);

    this.street.invoke("val").then((street) => {
      cy.wrap(String(street).trim()).as("billingStreet");
    });

    this.state.should("be.visible").wait(1000).clear().type(billing.state);
    this.proceedFromBilling.should("be.visible").and("be.enabled").click();
  }

  assertOnPaymentStep(): void {
    cy.contains("h3", "Payment").should("be.visible");
  }

  /** Fill in bank transfer payment details. */
  fillBankTransferDetails(bank: BankTransferDetails): void {
    this.paymentMethod.should("be.visible").select(bank.paymentMethod);
    this.bankName.should("be.visible").clear().type(bank.bankName);
    this.accountName.should("be.visible").clear().type(bank.accountName);
    this.accountNumber.should("be.visible").clear().type(bank.accountNumber);
  }

  assertInvalidAccountNumberError(): void {
    cy.findByText("Account number must be numeric.").should("be.visible");
  }

  assertConfirmDisabled(): void {
    this.finish.should("be.visible").and("be.disabled");
  }

  /**
   * Confirm payment, wait for success, finalise the order and alias the invoice
   * number as `@invoiceId`.
   */
  confirmPaymentAndFinish(): void {
    cy.intercept("POST", "**/payment/check").as("checkPayment");
    cy.intercept("POST", "**/invoices").as("createInvoice");

    this.finish.should("be.visible").and("be.enabled").click();
    cy.wait("@checkPayment").its("response.statusCode").should("eq", 200);
    this.paymentConfirmation.should("be.visible").and("contain.text", "Payment was successful");

    this.finish.should("be.visible").and("be.enabled").click();
    cy.wait("@createInvoice").its("response.statusCode").should("eq", 201);
    this.orderConfirmation
      .should("be.visible")
      .and("contain.text", "Thanks for your order! Your invoice number is ");
    this.orderConfirmation
      .find("span")
      .invoke("text")
      .then((invoiceId) => {
        cy.wrap(invoiceId.trim()).as("invoiceId");
      });
  }
}

export const checkoutPage = new CheckoutPage();
