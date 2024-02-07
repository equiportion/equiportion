/* eslint-disable cypress/no-unnecessary-waiting */

import {standard, unauthenticated} from '../support/stubs';

describe('login and logout', () => {
  it('no error bombardement when homeserver is invalid', () => {
    unauthenticated(() => {
      cy.visit('http://localhost:5173/login');

      cy.get('#username').type('account-empty-room:pse.');
    });
  });
  it('wrong password does not login', () => {
    unauthenticated(() => {
      cy.visit('http://localhost:5173/login');

      cy.get('#username').type('account-empty-room:pse.dsn.kastel.kit.edu');
      cy.get('#password').type('Dieses Passwort ist falsch!');

      //TODO
    });
  });
  // it('correct login data logs in', () => {
  //   login('no-rooms');
  //   cy.get('#rooms').should('exist');
  //   cy.get('#welcome-message-user', {timeout: 7000}).should('exist');
  // });
  // it('shows error message if homerserver invalid', () => {
  //   cy.visit('http://localhost:5173/login');
  //   cy.get('#username').type('@psetest:invalidhomeserver');
  //   cy.get('#homeserver').type('testpassword321');
  //   cy.get('#homeserverWarning').should('be.visible');
  //   cy.get('#loginbutton').should(
  //     'have.class',
  //     'w-full disabled inline-block shrink-0 rounded-md border border-gray-200 bg-gray-400 px-12 py-3 text-sm font-medium text-white transition'
  //   );
  // });
});
