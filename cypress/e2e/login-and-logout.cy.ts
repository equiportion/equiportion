import { login } from "../support/e2e";

describe('login-and-logout', () => {
    it('wrong-password-does-not-log-in', () => {
      login("wrong-password")
      cy.get('#error-message').should('contain.text', 'Ungültiger Benutzername oder Passwort')
    })
    it('correct-login-data-logs-in', () => {
      login('no-rooms')
      cy.get('#rooms').should('exist')
    })
    it('logout-works', () => {
      login('no-rooms')
      cy.get('#profile-picture').click()
      cy.get('#logout-button').click()
      cy.get('#loginButton').should('exist')
    })
  })