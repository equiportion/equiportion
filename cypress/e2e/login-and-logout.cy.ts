/* eslint-disable cypress/no-unnecessary-waiting */

import * as any from '../fixtures/test-accounts.json';

const testAccounts: any = any;

describe('login and logout', () => {
  it('wrong password does not login', () => {
    login('wrong-password');
    cy.get('#login-form>div').eq(2).should('contain.text', 'Ungültiger Benutzername oder Passwort');
    cy.get('#login-form>div').eq(3).should('contain.text', 'Ungültiger Benutzername oder Passwort');
  });
  it('correct login data logs in', () => {
    login('no-rooms');
    cy.get('#rooms').should('exist');
    cy.get('#welcome-message-user', {timeout: 7000}).should('exist');
  });
  it('logout works', () => {
    login('no-rooms');
    logout();
    cy.get('#login-button-on-landing-page').should('exist');
  });
});

function login(userType: string) {
  cy.visit('http://localhost:5173/welcome');
  cy.wait(1000); // eslint-disable-line cypress/no-unnecessary-waiting
  cy.get('#login-button-on-landing-page').click();
  cy.wait(1000); // eslint-disable-line cypress/no-unnecessary-waiting
  cy.get('#homeserver').type(testAccounts[userType]['homeserver']);
  cy.get('#goToLoginButton').click();
  cy.get('#username', {timeout: 10000}).type(testAccounts[userType]['username']);
  cy.get('#homeserver').type(testAccounts[userType]['password']);
  cy.get('#loginbutton').click();
}

function logout() {
  cy.get('#profile-picture').click();
  cy.get('#logout-button').click();
}
