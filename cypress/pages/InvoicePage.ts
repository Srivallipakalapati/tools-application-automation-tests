import { BasePage } from "./BasePage";
import { Product } from "../Framework/apiHelper";
import { navBar } from "./components/NavBar";

/**
 * Invoices list page.
 */
export class InvoicePage extends BasePage {
  private get pageTitle() {
    return this.getByDataTest("page-title");
  }

  /** Open the invoices page via the account menu, intercepting the invoices request. */
  open(): void {
    cy.intercept("GET", "**/invoices*").as("getInvoices");
    navBar.openAccountMenu();
    navBar.clickMyInvoices();
  }

  /** Assert the most recent invoice row matches the purchased product and billing. */
  assertInvoiceDetails(product: Product): void {
    cy.get("@invoiceId").then((invoiceId) => {
      cy.url().should("include", "account/invoices");
      cy.wait("@getInvoices").its("response.statusCode").should("eq", 200);
      this.pageTitle.should("be.visible").and("contain.text", "Invoices");

      const today = new Date().toISOString().slice(0, 10);
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
  }
}

export const invoicePage = new InvoicePage();
