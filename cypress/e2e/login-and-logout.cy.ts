/* eslint-disable cypress/no-unnecessary-waiting */

import { standard } from "../support/stubs";

describe('login and logout', () => {
  // it('wrong password does not login', () => {
  //   login('wrong-password');
  //   cy.get('#login-form>div').eq(2).should('contain.text', 'Ungültiger Benutzername oder Passwort');
  //   cy.get('#login-form>div').eq(3).should('contain.text', 'Ungültiger Benutzername oder Passwort');
  // });
  // it('correct login data logs in', () => {
  //   login('no-rooms');
  //   cy.get('#rooms').should('exist');
  //   cy.get('#welcome-message-user', {timeout: 7000}).should('exist');
  // });
  // it('logout works', () => {
  //   login('no-rooms');
  //   logout();
  //   cy.get('#login-button-on-landing-page').should('exist');
  // });

  it('login', () => {
    standard();
    cy.intercept(
      {
        url: '/_matrix/client/v3/login',
        method: 'POST',
      },
    ).as('loginPost');
    cy.visit('http://localhost:5173/login');
    cy.get('#username').type('@psetest:mtrx.cz');
    cy.get('#homeserver').type('testpassword321');
    cy.get('#loginbutton').click();
    cy.wait('@matrix_client_versions').then(({response}) => {
      expect(response?.body.versions.length).to.eq(14);
    });
    cy.wait('@loginPost').then(({request}) => {
      expect(request.body.password).to.eq('testpassword321');
      expect(request.body.identifier.user).to.eq('@psetest:mtrx.cz');
      expect(request.body.type).to.eq('m.login.password');
    });
  });
  it('shows error message if homerserver invalid', () => {
    cy.visit('http://localhost:5173/login');
    cy.get('#username').type('@psetest:invalidhomeserver');
    cy.get('#homeserver').type('testpassword321');
    cy.get('#homeserverWarning').should('be.visible');
    cy.get('#loginbutton').should(
      'have.class',
      'w-full disabled inline-block shrink-0 rounded-md border border-gray-200 bg-gray-400 px-12 py-3 text-sm font-medium text-white transition'
    );
  });
});
