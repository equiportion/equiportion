//import {authenticated} from '../support/stubs';

describe('/', () => {
  // it('renders', () => {
  //   authenticated(() => {
  //     cy.intercept(
  //       {
  //         url: '/_matrix/client/v3/rooms/!AovfRJyqtfNuSlegxT:stub.pse.dsn.kastel.kit.edu/send/edu.kit.kastel.dsn.pse.transaction/*',
  //         method: 'PUT',
  //       },
  //       {
  //         fixture: 'transaction_event_put',
  //       }
  //     ).as('transactionEventPut');
  //     cy.visit('http://localhost:5173/');
  //     cy.get('#rooms>div').eq(0).children().eq(1).children().eq(1).click();
  //     cy.get('#addDebtorButton').click();
  //     cy.get('#memberDropdown').click();
  //     cy.get('#inputFieldSum').type('42.42');
  //     cy.get('#inputFieldPurpose').type('Testzwecke');
  //     cy.get('#validateButton').click();
  //     cy.wait('@transactionEventPut').then(({request}) => {
  //       expect(request.body.purpose).to.eq('Testzwecke');
  //       expect(request.body.creditor).to.eq('@stub:stub.pse.dsn.kastel.kit.edu');
  //       expect(request.body.debtors[0].amount).to.eq('42.42');
  //       expect(request.body.debtors[0].user).to.eq('@stub:stub.pse.dsn.kastel.kit.edu');
  //       expect(request.body.sum).to.eq('42.42');
  //     });
  //   });
  // });
  // it('deletes the creditor by clicking on avatar', () => {
  //   authenticated(() => {
  //     cy.visit('http://localhost:5173/');
  //     cy.get('#rooms>div').eq(0).children().eq(1).children().eq(1).click();
  //     // wait until loading of avatar completed
  //     cy.get('#creditorAvatar img').should('be.visible');
  //     cy.get('#creditorAvatar').click();
  //     cy.get('#creditorAvatar').should('not.exist');
  //     cy.get('#addCreditorButton').should('exist');
  //   });
  // });
  // it('deletes the debtor by clicking on avatar', () => {
  //   authenticated(() => {
  //     cy.visit('http://localhost:5173/');
  //     cy.get('#rooms>div').eq(0).children().eq(1).children().eq(1).click();
  //     cy.get('#addDebtorButton').click();
  //     cy.get('#memberDropdown').click();
  //     cy.get('#debtorTiles img').should('be.visible');
  //     cy.get('#debtorTiles').eq(0).click();
  //     cy.get('#debtorTiles').should('not.exist');
  //     cy.get('#addDebtorButton').should('exist');
  //   });
  // });
  // it('shows error message if no debtor selected', () => {
  //   authenticated(() => {
  //     cy.visit('http://localhost:5173/');
  //     cy.get('#rooms>div').eq(0).children().eq(1).children().eq(1).click();
  //     cy.get('#inputFieldSum').type('42.42');
  //     cy.get('#inputFieldPurpose').type('Testzwecke');
  //     cy.get('#validateButton').click();
  //     cy.get('#error-message-top').should('be.visible');
  //   });
  // });
  // it('shows error message if no creditor selected', () => {
  //   authenticated(() => {
  //     cy.visit('http://localhost:5173/');
  //     cy.get('#rooms>div').eq(0).children().eq(1).children().eq(1).click();
  //     cy.get('#addDebtorButton').click();
  //     cy.get('#memberDropdown').click();
  //     cy.get('#creditorAvatar').click();
  //     cy.get('#inputFieldSum').type('42.42');
  //     cy.get('#inputFieldPurpose').type('Testzwecke');
  //     cy.get('#validateButton').click();
  //     cy.get('#error-message-top').should('be.visible');
  //   });
  // });
  // it('shows error message if sum missing or invalid', () => {
  //   authenticated(() => {
  //     cy.visit('http://localhost:5173/');
  //     cy.get('#rooms>div').eq(0).children().eq(1).children().eq(1).click();
  //     cy.get('#addDebtorButton').click();
  //     cy.get('#memberDropdown').click();
  //     cy.get('#inputFieldPurpose').type('Testzwecke');
  //     cy.get('#validateButton').click();
  //     cy.get('#inputFields>div').eq(0).children().eq(2).should('contain', 'Ungültige Summe!');
  //     cy.get('#inputFieldSum').type('0.0uwu');
  //     cy.get('#validateButton').click();
  //     cy.get('#inputFields>div').eq(0).children().eq(2).should('contain', 'Ungültige Summe!');
  //     cy.get('#inputFieldSum').clear();
  //     cy.get('#inputFieldSum').type('42.424');
  //     cy.get('#validateButton').click();
  //     cy.get('#inputFields>div').eq(0).children().eq(2).should('contain', 'Ungültige Summe!');
  //     cy.get('#error-message-top').should('be.visible');
  //   });
  // });
  // it('shows error message if purpose missing', () => {
  //   authenticated(() => {
  //     cy.visit('http://localhost:5173/');
  //     cy.get('#rooms>div').eq(0).children().eq(1).children().eq(1).click();
  //     cy.get('#addDebtorButton').click();
  //     cy.get('#memberDropdown').click();
  //     cy.get('#inputFieldSum').type('233.23');
  //     cy.get('#validateButton').click();
  //     cy.get('#inputFields>div')
  //       .eq(1)
  //       .children()
  //       .eq(2)
  //       .should('contain', 'Zweck ist ein Pflichtfeld!');
  //     cy.get('#error-message-top').should('be.visible');
  //   });
  // });
  // it('shows user itself as standard creditor', () => {
  //   authenticated(() => {
  //     cy.visit('http://localhost:5173/');
  //     cy.get('#rooms>div').eq(3).children().eq(1).children().eq(1).click();
  //     cy.get('#creditorAvatar').should('exist');
  //     cy.get('#creditorDisplayName').should('contain', 'Testbenutzer');
  //     cy.get('#creditorUserId').should('contain', '@stub:stub.pse.dsn.kastel.kit.edu');
  //   });
  // });
  // it('deletes the debtor from dropdown when already selected', () => {
  //   authenticated(() => {
  //     cy.visit('http://localhost:5173/');
  //     cy.get('#rooms>div').eq(4).children().eq(1).children().eq(1).click();
  //     cy.get('#addDebtorButton').click();
  //     cy.get('#memberDropdown>div').eq(1).click();
  //     cy.get('#addDebtorButton').click();
  //     cy.get('#memberDropdown').should('not.contain', 'philipptest3');
  //     cy.get('#memberDropdown>div').eq(2).click();
  //     cy.get('#addDebtorButton').click();
  //     cy.get('#memberDropdown').should('not.contain', 'Testbenutzer');
  //   });
  // });
  // it('distributes the debts equally to debtors', () => {
  //   authenticated(() => {
  //     cy.intercept(
  //       {
  //         url: '/_matrix/client/v3/rooms/!UwIPSjAeKraDVxRvWW:stub.pse.dsn.kastel.kit.edu/send/edu.kit.kastel.dsn.pse.transaction/*',
  //         method: 'PUT',
  //       },
  //       {
  //         fixture: 'transaction_event_put',
  //       }
  //     ).as('transactionEventPut');
  //     cy.visit('http://localhost:5173/');
  //     cy.get('#rooms>div').eq(4).children().eq(1).children().eq(1).click();
  //     cy.get('#addDebtorButton').click();
  //     cy.get('#memberDropdown>div').eq(0).click();
  //     cy.get('#addDebtorButton').click();
  //     cy.get('#memberDropdown>div').eq(1).click();
  //     cy.get('#addDebtorButton').click();
  //     cy.get('#memberDropdown>div').eq(2).click();
  //     cy.get('#inputFieldSum').type('333.33');
  //     cy.get('#inputFieldPurpose').type('Schulden Verteilen');
  //     cy.get('#validateButton').click();
  //     cy.wait('@transactionEventPut').then(({request}) => {
  //       expect(request.body.purpose).to.eq('Schulden Verteilen');
  //       expect(request.body.creditor).to.eq('@stub:stub.pse.dsn.kastel.kit.edu');
  //       expect(request.body.debtors[0].amount).to.eq('111.11');
  //       expect(request.body.debtors[0].user).to.eq('@philipptest2:stub.pse.dsn.kastel.kit.edu');
  //       expect(request.body.debtors[1].amount).to.eq('111.11');
  //       expect(request.body.debtors[1].user).to.eq('@philipptest3:stub.pse.dsn.kastel.kit.edu');
  //       expect(request.body.debtors[2].amount).to.eq('111.11');
  //       expect(request.body.debtors[2].user).to.eq('@stub:stub.pse.dsn.kastel.kit.edu');
  //       expect(request.body.sum).to.eq('333.33');
  //     });
  //   });
  // });
});
