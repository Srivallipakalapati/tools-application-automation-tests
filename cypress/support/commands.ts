// custom command to select dom element by data-test attribute
Cypress.Commands.add('findByDataTest', (value: string) => {
  return cy.get(`[data-test="${value}"]`)
})

declare global {
  namespace Cypress {
    interface Chainable {
      findByDataTest(value: string): Chainable<JQuery<HTMLElement>>
    }
  }
}

export {}