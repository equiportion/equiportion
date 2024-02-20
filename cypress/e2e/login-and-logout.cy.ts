import {unauthenticated, wellknownSearchFailing} from '../support/stubs';

describe('login and logout', () => {
  it('wrong password does not login', () => {
    unauthenticated(() => {
      cy.intercept(
        {
          url: '/_matrix/client/v3/login',
          method: 'POST',
        },
        {
          fixure: 'login_not_successfull.json',
        }
      ).as('loginEventPost');
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
      cy.intercept(
        {
          url: '/_matrix/client/v3/login',
          method: 'POST',
        },
        {
          fixture: 'login_successfull.json',
        }
      ).as('loginEventPost');
      cy.visit('http://localhost:5173/login');
      cy.get('#username').type('account-multiple-filled-rooms1:pse.dsn.kastel.kit.edu');
      cy.get('#password').type('Dieses Passwort ist richtig!');
      cy.get('#loginbutton').click();
      cy.get('#toolBar').should('exist');
    });
  });
  it('user gets error-message if the homeserver is invalid', () => {
    wellknownSearchFailing(() => {
      cy.visit('http://localhost:5173/login');
      cy.get('#username').type('account-empty-room:pse.');
      cy.get('#homeserverWarning').should('be.visible');
      cy.get('#loginbutton').should('be.disabled');
    });
  });
});
