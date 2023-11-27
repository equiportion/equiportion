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

// Alternatively you can use CommonJS syntax:
// require('./commands')

beforeEach('logs in', () => {
  login('name', 'passwd');
})

function login(userName: string, password: string) {
    cy.visit('http://localhost:5173/welcome')
    cy.get('#loginButton').click()
    cy.get('#homeserver').type('https://matrix.org')
    cy.get('#goToLoginButton').click()
    cy.get('#username').type(userName)
    cy.get('#homeserver').type(password)
}