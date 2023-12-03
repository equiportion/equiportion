// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import testAccounts from "../fixtures/test-accounts.json"

// Alternatively you can use CommonJS syntax:
// require('./commands')

beforeEach('logs in', () => {
  //login('https://matrix.org', 'schatzileinheini', 'v6x1e4jgnf');
})

export function login(userType: string) {
    cy.visit('http://localhost:5173/welcome')
    cy.get('#loginButton').click()
    cy.get('#homeserver').type(testAccounts[userType]["homeserver"])
    cy.get('#goToLoginButton').click()
    cy.get('#username', {timeout: 10000}).type(testAccounts[userType]["username"])
    cy.get('#homeserver').type(testAccounts[userType]["password"])
    cy.get('#loginbutton').click()
}

export function logout() {
  cy.get('#profile-picture').click()
  cy.get('#logout-button').click()
}

export function loginCookiesActive(userType: string) {
  cy.get('#loginButton').click()
  cy.get('#username', {timeout: 10000}).type(testAccounts[userType]["username"])
  cy.get('#homeserver').type(testAccounts[userType]["password"])
  cy.get('#loginbutton').click()
}