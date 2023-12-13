import { login } from "../support/e2e";

describe('main layout: profile dropdown', () => {
  it('click outside dropdown menu closes it', () => {
    login("no-rooms")
    cy.get('#profile-picture').click()
    cy.get('#logout-button').should('be.visible')
    cy.get('#home-button').click()
    cy.get('#logout-button').should('not.be.visible')
  })
  it('logout button visible after click on profile picture', () => {
    login("no-rooms")
    cy.get('#profile-picture').click()
    cy.get('#logout-button').should('be.visible')
  })
})