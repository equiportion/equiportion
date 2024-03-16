import {authenticated, unauthenticated} from '../support/stubs';

describe('login and logout', () => {
  it('wrong password does not login', () => {
    unauthenticated(() => {
      cy.intercept(
        {
          url: '/_matrix/client/v3/login',
          method: 'POST',
        },
        {
          fixure: 'matrix_client_v3_login_post_fail.json',
          statusCode: 403,
        }
      ).as('loginEventPost');
      cy.visit('http://localhost:5173/login');
      cy.get('#username').type('@steffan-stub:stub.pse.dsn.kastel.kit.edu');
      cy.get('#password').type('Dieses Passwort ist falsch!');
      cy.get('#loginbutton').click();
      cy.get('#login-form').contains('Ungültiger Benutzername oder Passwort');
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
          fixture: 'matrix_client_v3_login_post_success.json',
        }
      ).as('loginEventPost');
      cy.visit('http://localhost:5173/login');
      cy.get('#username').type('@steffan-stub:stub.pse.dsn.kastel.kit.edu');
      cy.get('#password').type('Dieses Passwort ist richtig!');
    });
    authenticated(() => {
      cy.get('#loginbutton').click();
      cy.get('#toolBar').should('exist');
    });
  });

  it('user gets error-message if the homeserver is invalid', () => {
    cy.visit('http://localhost:5173/login');
    cy.get('#username').type('steffan-stub:example.org');
    cy.get('#homeserverWarning').should('be.visible');
    cy.get('#loginbutton').should('be.disabled');
  });
});
