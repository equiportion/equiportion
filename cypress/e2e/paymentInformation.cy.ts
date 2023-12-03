/* eslint-disable cypress/no-unnecessary-waiting */

import { login, logout, loginCookiesActive } from "../support/e2e";

describe('payment information editing and displaying', () => {
  it('edit PayPal information', { defaultCommandTimeout: 5000 }, () => {
    const paypalAccount: string = 'mypaypaladress@gamil.com'
    login("two-filled-rooms")
    cy.get('#profile-picture').click()
    cy.wait(1000) // eslint-disable-line cypress/no-unnecessary-waiting
    cy.get('#profil-ansicht', {timeout: 1000}).should('be.visible')
    cy.get('#profil-ansicht').click()
    cy.get('#PayPal').type(paypalAccount)
    cy.get('#button-to-safe').click()
    cy.wait(1000) // eslint-disable-line cypress/no-unnecessary-waiting
    logout()
    loginCookiesActive('two-filled-rooms')
    cy.get('#profile-picture').click()
    cy.wait(1000) // eslint-disable-line cypress/no-unnecessary-waiting
    cy.get('#profil-ansicht', {timeout: 1000}).should('be.visible')
    cy.get('#profil-ansicht', {timeout: 1000}).click()
    cy.get('#PayPal').should('have.value', paypalAccount)
    cy.get('#PayPal').clear()
    cy.get('#button-to-safe').click()
    logout()
    loginCookiesActive('two-filled-rooms')
    cy.get('#profile-picture').click()
    cy.wait(1000) // eslint-disable-line cypress/no-unnecessary-waiting
    cy.get('#profil-ansicht').click()
    cy.get('#PayPal').should('have.value', "")
  })
  it('edit IBAN information', () => {
    const internationalBankAccountNumber: string = 'DE42 1234 4242 5678 4242 42'
    login("two-filled-rooms")
    cy.get('#profile-picture').click()
    cy.wait(1000) // eslint-disable-line cypress/no-unnecessary-waiting
    cy.get('#profil-ansicht').click()
    cy.get('#IBAN').type(internationalBankAccountNumber)
    cy.get('#button-to-safe').click()
    cy.wait(1000) // eslint-disable-line cypress/no-unnecessary-waiting
    logout()
    loginCookiesActive('two-filled-rooms')
    cy.get('#profile-picture').click()
    cy.wait(1000) // eslint-disable-line cypress/no-unnecessary-waiting
    cy.get('#profil-ansicht').click()
    cy.get('#IBAN').should('have.value', internationalBankAccountNumber)
    cy.get('#IBAN').clear()
    cy.get('#button-to-safe').click()
    logout()
    loginCookiesActive('two-filled-rooms')
    cy.get('#profile-picture').click()
    cy.wait(1000) // eslint-disable-line cypress/no-unnecessary-waiting
    cy.get('#profil-ansicht').click()
    cy.get('#IBAN').should('have.value', "")
  })
})