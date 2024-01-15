import {authenticated} from '../support/stubs';

describe('/', () => {
  it('room without transaction shows message "Keine Transactionen vorhanden"', () => {
    authenticated(() => {
      cy.visit('http://localhost:5173/');

      cy.get('#rooms>div').eq(2).click();
      cy.get('#no-transaction-message').should('be.visible');
    });
  });
});
