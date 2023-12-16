import {authenticated} from '../support/stubs';

describe('/', () => {
  it('renders', () => {
    authenticated(() => {
      cy.visit('http://localhost:5173/');
      cy.get('#newTransactionButton').click();
      cy.get('#addDebtorButton').click();
      cy.get('#memberDropdown').click();
      cy.get('#inputFieldSum').type('42.42');
      cy.get('#inputFieldPurpose').type('Testzwecke');
      cy.get('#validateButton').click();
      //TODO philipp fragen, warum der button nicht funktionier (liegt eventuell am stubbing)
    });
  });
  it('warning is shown if the sum is missing', () => {
    authenticated(() => {
      cy.visit('http://localhost:5173/');
      cy.get('#newTransactionButton').click();
      cy.get('#addDebtorButton').click();
      cy.get('#memberDropdown').click();
      cy.get('#inputFieldPurpose').type('Testzwecke');
      cy.get('#validateButton').click();
      cy.get('#error-message').should('contain', 'ungültige Eingabe');
    });
  });
});
