import { login } from "../support/e2e";

describe('room overview', () => {
  it('account-with-no-rooms-has-no-rooms-displayed', () => {
    login("no-rooms")
    cy.get('#main-layout').should('be.visible')
    cy.get('#no-rooms-message').should('be.visible')
  })
})