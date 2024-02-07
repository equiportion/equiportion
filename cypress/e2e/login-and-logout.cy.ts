/* eslint-disable cypress/no-unnecessary-waiting */

import {standard, unauthenticated} from '../support/stubs';

describe('login and logout', () => {
  it('wrong password does not login', () => {
    unauthenticated(() => {
      cy.visit('http://localhost:5173/login');

      cy.get('#username').type('account-empty-room:pse.dsn.kastel.kit.edu');
      cy.get('#password').type('Dieses Passwort ist falsch!');

      //TODO stub server
      //TODO click login button
      //TODO check server request
      //TODO send back login failiure
      //TODO check front end
    });
  });
  it('correct password logs in', () => {
    unauthenticated(() => {
      cy.visit('http://localhost:5173/login');

      cy.get('#username').type('account-empty-room:pse.dsn.kastel.kit.edu');
      cy.get('#password').type('Dieses Passwort ist richtig!');

      //TODO stub server
      //TODO click login button
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
