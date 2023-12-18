import {authenticated} from '../support/stubs';

describe('/', () => {
  it('renders', () => {
    authenticated(() => {
      cy.visit('http://localhost:5173/');

      cy.get('#main-layout').should('be.visible');
      cy.get('#no-rooms-message').should('not.be.visible');
      cy.get('#main-layout').get('#rooms').children().should('have.length', 7);
    });
  });

  it('renders without rooms', () => {
    authenticated(
      () => {
        cy.visit('http://localhost:5173/');

        cy.get('#main-layout').should('be.visible');
        cy.get('#no-rooms-message').should('be.visible');
      },
      {
        syncOption: 'norooms',
      }
    );
  });
});
