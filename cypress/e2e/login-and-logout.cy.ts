/* eslint-disable cypress/no-unnecessary-waiting */

import {unauthenticated} from '../support/stubs';

describe('login and logout', () => {
  it('wrong password does not login', () => {
    unauthenticated(() => {
      cy.intercept({
        url: '/_matrix/client/v3/login',
        method: 'POST',
      });
      cy.visit('http://localhost:5173/login');
      cy.get('#username').type('account-multiple-filled-rooms1:pse.dsn.kastel.kit.edu');
      cy.get('#password').type('Dieses Passwort ist falsch!');
      cy.get('#loginbutton').click();
      cy.get('#login-form').children().eq(2).contains('Ungültiger Benutzername oder Passwort');
      cy.get('#login-form').children().eq(3).contains('Ungültiger Benutzername oder Passwort');
    });
  });
  it('correct password logs in', () => {
    unauthenticated(() => {
      cy.visit('http://localhost:5173/login');
      cy.get('#username').type('account-multiple-filled-rooms1:pse.dsn.kastel.kit.edu');
      cy.get('#password').type('Dieses Passwort ist richtig!');
      cy.get('#loginbutton').click();
      //TODO stub server
      //TODO check server request
      //TODO send back login success
      //TODO check front end
    });
  });
  it('user gets error-message if the homeserver is invalid', () => {
    unauthenticated(() => {
      cy.visit('http://localhost:5173/login');
      cy.get('#username').type('account-empty-room:pse.');
      cy.get('#homeserverWarning').should('be.visible');
      cy.get('#loginbutton').should('be.disabled');
      //TODO stub server
    });
  });
});
