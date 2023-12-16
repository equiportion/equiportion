import {authenticated} from '../support/stubs';

describe('/', () => {
  it('transaction tile without purpose renders', () => {
    authenticated(() => {
      cy.visit('http://localhost:5173/');

      cy.get('#rooms>div').eq(0).click();
      cy.get('#transactions>div')
        .eq(1)
        .should(
          'contain.text',
          '347587€, gezahlt von @stub:stub.pse.dsn.kastel.kit.edu@stub:stub.pse.dsn.kastel.kit.edu schuldet 347587€'
        );
    });
  });
  it('all transactions are beeing shown', () => {
    authenticated(() => {
      cy.visit('http://localhost:5173/');

      cy.get('#rooms>div').eq(0).click();
      cy.get('#transactions').children().should('have.length', 11);
      cy.get('#no-transaction-message').should('not.exist');
    });
  });
  it('message is shown if no transactions exist in the room', () => {
    authenticated(() => {
      cy.visit('http://localhost:5173/');

      cy.get('#rooms>div').eq(1).click();
      cy.get('#transactions').should('not.exist');
      cy.get('#no-transaction-message').should('be.visible');
    });
  });
});
