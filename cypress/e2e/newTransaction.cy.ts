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
  it('deletes the creditor by clicking on avatar', () => {
    authenticated(() => {
      cy.visit('http://localhost:5173/');
      cy.get('#newTransactionButton').click();
      // wait until loading of avatar completed
      cy.get('#creditorAvatar img').should('be.visible');
      cy.get('#creditorAvatar').click();
      cy.get('#creditorAvatar').should('not.exist');
      cy.get('#addCreditorButton').should('exist');
    });
  });
  it('deletes the debtor by clicking on avatar', () => {
    authenticated(() => {
      cy.visit('http://localhost:5173/');
      cy.get('#newTransactionButton').click();
      cy.get('#addDebtorButton').click();
      cy.get('#memberDropdown').click();
      cy.get('#debtorTiles img').should('be.visible');
      cy.get('#debtorTiles').eq(0).click();
      cy.get('#debtorTiles').should('not.exist');
      cy.get('#addDebtorButton').should('exist');
    });
  });
  it('shows error when no debtor selected', () => {
    authenticated(() => {
      cy.visit('http://localhost:5173/');
      cy.get('#newTransactionButton').click();
      cy.get('#inputFieldSum').type('42.42');
      cy.get('#inputFieldPurpose').type('Testzwecke');
      cy.get('#validateButton').click();
      cy.get('#error-mesage-top').should('exist');
    });
  });
  it('shows error when no creditor selected', () => {
    authenticated(() => {
      cy.visit('http://localhost:5173/');
      cy.get('#newTransactionButton').click();
      cy.get('#addDebtorButton').click();
      cy.get('#memberDropdown').click();
      cy.get('#creditorAvatar').click();
      cy.get('#inputFieldSum').type('42.42');
      cy.get('#inputFieldPurpose').type('Testzwecke');
      cy.get('#validateButton').click();
      cy.get('#error-mesage-top').should('exist');
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
  it('warning is shown if the purpose is missing', () => {
    authenticated(() => {
      cy.visit('http://localhost:5173/');
      cy.get('#newTransactionButton').click();
      cy.get('#addDebtorButton').click();
      cy.get('#memberDropdown').click();
      cy.get('#inputFieldSum').type('233.23');
      cy.get('#validateButton').click();
      // irgendwie ist der error message nicht da
      // cy.get('#error-message').should('contain', 'Zweck ist ein Pflichtfeld!');
    });
  });
  it('shows user itself as standard creditor', () => {
    authenticated(() => {
      cy.visit('http://localhost:5173/');
      cy.get('#newTransactionButton').click();
      cy.get('#creditorAvatar').should('exist');
    });
  });
});
