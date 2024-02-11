import {authenticated} from '../support/stubs';

describe('/', () => {
  it('renders', () => {
    authenticated(() => {
      cy.intercept(
        {
          url: '/_matrix/client/v3/rooms/!AovfRJyqtfNuSlegxT:stub.pse.dsn.kastel.kit.edu/state/edu.kit.kastel.dsn.pse.transaction/*',
          method: 'PUT',
        },
        {
          fixture: 'transaction_event_put',
        }
      ).as('transactionEventPut');
      cy.visit('http://localhost:5173/');
      cy.get('#rooms>div').eq(0).children().eq(1).children().eq(1).click();
      cy.get('#addDebtorButton').click();
      cy.get('#debtorUserDropdown').children().eq(1).children().eq(1).click();
      cy.get('#inputFieldSum').type('42.42');
      cy.get('#inputFieldPurpose').type('Testzwecke');
      cy.get('#submitButton').click();
      cy.wait('@transactionEventPut').then(({request}) => {
        expect(request.body.purpose).to.eq('Testzwecke');
        expect(request.body.creditor).to.eq('@stub:stub.pse.dsn.kastel.kit.edu');
        expect(request.body.debtors[0].amount).to.eq(4242);
        expect(request.body.debtors[0].user).to.eq('@stub:stub.pse.dsn.kastel.kit.edu');
        expect(request.body.sum).to.eq(4242);
      });
    });
  });
  it('deletes the creditor by clicking on x next to avatar', () => {
    authenticated(() => {
      cy.visit('http://localhost:5173/');
      cy.get('#rooms>div').eq(0).children().eq(1).children().eq(1).click();
      cy.get('#toplevelCreditorDiv').should('contain', 'Testbenutzer');
      cy.get('#toplevelCreditorDiv').children().eq(0).children().eq(0).children().eq(0).click();
      cy.get('#toplevelCreditorDiv')
        .children()
        .eq(0)
        .children()
        .eq(0)
        .children()
        .eq(0)
        .should('not.contain', 'Testbenutzer');
      cy.get('#addCreditorButton').should('exist');
    });
  });
  it('deletes the debtor by clicking on avatar', () => {
    authenticated(() => {
      cy.visit('http://localhost:5173/');
      cy.get('#rooms>div').eq(0).children().eq(1).children().eq(1).click();
      cy.get('#addDebtorButton').click();
      cy.get('#debtorUserDropdown').children().eq(1).click();
      cy.get('#unevenSplitting')
        .children()
        .eq(0)
        .children()
        .eq(0)
        .should('contain', 'Testbenutzer');
      cy.get('#unevenSplitting').children().eq(0).children().eq(0).children().eq(1).click();
      cy.get('#noDebtorMessage').should('be.visible');
      cy.get('#addDebtorButton').should('exist');
    });
  });
  it('submit button disabled if no debtor selected', () => {
    authenticated(() => {
      cy.visit('http://localhost:5173/');
      cy.get('#rooms>div').eq(0).children().eq(1).children().eq(1).click();
      cy.get('#inputFieldSum').type('42.42');
      cy.get('#inputFieldPurpose').type('Testzwecke');
      cy.get('#submitButton').should('be.disabled');
    });
  });
  it('submit button disabled if no creditor selected', () => {
    authenticated(() => {
      cy.visit('http://localhost:5173/');
      cy.get('#rooms>div').eq(0).children().eq(1).children().eq(1).click();
      cy.get('#addDebtorButton').click();
      cy.get('#debtorUserDropdown').children().eq(1).children().eq(1).click();
      cy.get('#toplevelCreditorDiv').children().eq(0).children().eq(0).children().eq(0).click();
      cy.get('#inputFieldSum').type('42.42');
      cy.get('#inputFieldPurpose').type('Testzwecke');
      cy.get('#submitButton').should('be.disabled');
    });
  });
  it('submit button disabled if sum missing or invalid', () => {
    authenticated(() => {
      cy.visit('http://localhost:5173/');
      cy.get('#rooms>div').eq(0).children().eq(1).children().eq(1).click();
      cy.get('#addDebtorButton').click();
      cy.get('#debtorUserDropdown').children().eq(1).children().eq(1).click();
      cy.get('#inputFieldPurpose').type('Testzwecke');
      cy.get('#submitButton').should('be.disabled');
      cy.get('#unevenSplitting').children().eq(0).children().eq(1).should('exist');
      cy.get('#inputFieldSum').type('0.0uwu');
      cy.get('#submitButton').should('be.disabled');
      cy.get('#unevenSplitting').children().eq(0).children().eq(2).should('exist');
      cy.get('#inputFieldSum').type('42.424');
      cy.get('#submitButton').should('not.be.disabled');
      cy.get('#unevenSplitting').children().eq(0).children().eq(3).should('exist');
    });
  });
  it('submit button disabled if purpose empty', () => {
    authenticated(() => {
      cy.visit('http://localhost:5173/');
      cy.get('#rooms>div').eq(0).children().eq(1).children().eq(1).click();
      cy.get('#addDebtorButton').click();
      cy.get('#debtorUserDropdown').children().eq(1).children().eq(1).click();
      cy.get('#inputFieldSum').type('233.23');
      cy.get('#submitButton').should('be.disabled');
    });
  });
  it('shows user itself as standard creditor', () => {
    authenticated(() => {
      cy.visit('http://localhost:5173/');
      cy.get('#rooms>div').eq(3).children().eq(1).children().eq(1).click();
      cy.get('#toplevelCreditorDiv').should('contain', 'Testbenutzer');
      cy.get('#toplevelCreditorDiv').should('contain', '@stub:stub.pse.dsn.kastel.kit.edu');
    });
  });
  it('deletes the debtor from dropdown when already selected', () => {
    authenticated(() => {
      cy.visit('http://localhost:5173/');
      cy.get('#rooms>div').eq(4).children().eq(1).children().eq(1).click();
      cy.get('#addDebtorButton').click();
      cy.get('#debtorUserDropdown').children().eq(1).children().eq(1).click();
      cy.get('#debtorUserDropdown').click();
      cy.get('#debtorUserDropdown').should('not.contain', 'philipptest2');
      cy.get('#debtorUserDropdown').children().eq(1).children().eq(1).click();
      cy.get('#debtorUserDropdown').should('not.contain', 'philipptest3');
    });
  });
  it('distributes the debts equally to debtors', () => {
    authenticated(() => {
      cy.intercept(
        {
          url: '/_matrix/client/v3/rooms/!UwIPSjAeKraDVxRvWW:stub.pse.dsn.kastel.kit.edu/state/edu.kit.kastel.dsn.pse.transaction/*',
          method: 'PUT',
        },
        {
          fixture: 'transaction_event_put',
        }
      ).as('transactionEventPut');
      cy.visit('http://localhost:5173/');
      cy.get('#rooms>div').eq(4).children().eq(1).children().eq(1).click();
      cy.get('#addDebtorButton').click();
      cy.get('#debtorUserDropdown').children().eq(1).children().eq(1).click();
      cy.get('#addDebtorButton').click();
      cy.get('#debtorUserDropdown').children().eq(1).children().eq(2).click();
      cy.get('#addDebtorButton').click();
      cy.get('#debtorUserDropdown').children().eq(1).children().eq(1).click();
      cy.get('#inputFieldSum').type('333.33');
      cy.get('#inputFieldPurpose').type('Schulden Verteilen');
      cy.get('#submitButton').click();
      cy.wait('@transactionEventPut').then(({request}) => {
        expect(request.body.purpose).to.eq('Schulden Verteilen');
        expect(request.body.creditor).to.eq('@stub:stub.pse.dsn.kastel.kit.edu');
        expect(request.body.debtors[0].amount).to.eq(11111);
        expect(request.body.debtors[0].user).to.eq('@philipptest2:stub.pse.dsn.kastel.kit.edu');
        expect(request.body.debtors[1].amount).to.eq(11111);
        expect(request.body.debtors[1].user).to.eq('@stub:stub.pse.dsn.kastel.kit.edu');
        expect(request.body.debtors[2].amount).to.eq(11111);
        expect(request.body.debtors[2].user).to.eq('@philipptest3:stub.pse.dsn.kastel.kit.edu');
        expect(request.body.sum).to.eq(33333);
      });
    });
  });
  it('equal balance', () => {
    authenticated(() => {
      cy.intercept(
        {
          url: '/_matrix/client/v3/rooms/!UwIPSjAeKraDVxRvWW:stub.pse.dsn.kastel.kit.edu/state/edu.kit.kastel.dsn.pse.transaction/*',
          method: 'PUT',
        },
        {
          fixture: 'transaction_event_put',
        }
      ).as('transactionEventPut');
      cy.visit('http://localhost:5173/');
      cy.get('#rooms>div').eq(4).children().eq(1).children().eq(1).click();
      cy.get('#addDebtorButton').click();
      cy.get('#debtorUserDropdown>div').eq(1).children().eq(2).click();
      cy.get('#inputFieldSum').type('1523');
      cy.get('#inputFieldPurpose').type('testzwecke');
      cy.get('#submitButton').click();
      cy.wait('@transactionEventPut');
      cy.get('#newTransactionButton').click();
      cy.get('#removeCreditor').click();
      cy.get('#addCreditorButton').click();
      cy.get('#creditorUserDropdown>div').eq(1).children().eq(2).click();
      cy.get('#addDebtorButton').click();
      cy.get('#debtorUserDropdown>div').eq(1).children().eq(3).click();
      cy.get('#inputFieldSum').type('1523');
      cy.get('#inputFieldPurpose').type('testzwecke');
      cy.get('#submitButton').click();
      cy.wait('@transactionEventPut').then(({request}) => {
        expect(
          request.body.balances[
            '@philipptest3:stub.pse.dsn.kastel.kit.edu@stub:stub.pse.dsn.kastel.kit.edu'
          ]
        ).to.eq(0);
      });
    });
  });
  it('negative balance', () => {
    authenticated(() => {
      cy.intercept(
        {
          url: '/_matrix/client/v3/rooms/!UwIPSjAeKraDVxRvWW:stub.pse.dsn.kastel.kit.edu/state/edu.kit.kastel.dsn.pse.transaction/*',
          method: 'PUT',
        },
        {
          fixture: 'transaction_event_put',
        }
      ).as('transactionEventPut');
      cy.visit('http://localhost:5173/');
      cy.get('#rooms>div').eq(4).children().eq(1).children().eq(1).click();
      cy.get('#addDebtorButton').click();
      cy.get('#debtorUserDropdown>div').eq(1).children().eq(2).click();
      cy.get('#inputFieldSum').type('5020');
      cy.get('#inputFieldPurpose').type('testzwecke');
      cy.get('#submitButton').click();
      cy.wait('@transactionEventPut');
      cy.get('#newTransactionButton').click();
      cy.get('#removeCreditor').click();
      cy.get('#addCreditorButton').click();
      cy.get('#creditorUserDropdown>div').eq(1).children().eq(2).click();
      cy.get('#addDebtorButton').click();
      cy.get('#debtorUserDropdown>div').eq(1).children().eq(3).click();
      cy.get('#inputFieldSum').type('6900');
      cy.get('#inputFieldPurpose').type('testzwecke');
      cy.get('#submitButton').click();
      cy.wait('@transactionEventPut').then(({request}) => {
        expect(
          request.body.balances[
            '@philipptest3:stub.pse.dsn.kastel.kit.edu@stub:stub.pse.dsn.kastel.kit.edu'
          ]
        ).to.eq(-1880);
      });
    });
  });
  it('positive balance', () => {
    authenticated(() => {
      cy.intercept(
        {
          url: '/_matrix/client/v3/rooms/!UwIPSjAeKraDVxRvWW:stub.pse.dsn.kastel.kit.edu/state/edu.kit.kastel.dsn.pse.transaction/*',
          method: 'PUT',
        },
        {
          fixture: 'transaction_event_put',
        }
      ).as('transactionEventPut');
      cy.visit('http://localhost:5173/');
      cy.get('#rooms>div').eq(4).children().eq(1).children().eq(1).click();
      cy.get('#addDebtorButton').click();
      cy.get('#debtorUserDropdown>div').eq(1).children().eq(2).click();
      cy.get('#inputFieldSum').type('1500');
      cy.get('#inputFieldPurpose').type('testzwecke');
      cy.get('#submitButton').click();
      cy.wait('@transactionEventPut');
      cy.get('#newTransactionButton').click();
      cy.get('#removeCreditor').click();
      cy.get('#addCreditorButton').click();
      cy.get('#creditorUserDropdown>div').eq(1).children().eq(2).click();
      cy.get('#addDebtorButton').click();
      cy.get('#debtorUserDropdown>div').eq(1).children().eq(3).click();
      cy.get('#inputFieldSum').type('1000');
      cy.get('#inputFieldPurpose').type('testzwecke');
      cy.get('#submitButton').click();
      cy.wait('@transactionEventPut').then(({request}) => {
        expect(
          request.body.balances[
            '@philipptest3:stub.pse.dsn.kastel.kit.edu@stub:stub.pse.dsn.kastel.kit.edu'
          ]
        ).to.eq(500);
      });
    });
  });
  it('submit button disabled when creditor missing', () => {
    authenticated(() => {
      cy.visit('http://localhost:5173/');
      cy.get('#rooms>div').eq(4).children().eq(1).children().eq(1).click();
      cy.get('#addDebtorButton').click();
      cy.get('#debtorUserDropdown>div').eq(1).children().eq(1).click();
      cy.get('#addDebtorButton').click();
      cy.get('#debtorUserDropdown>div').eq(1).children().eq(2).click();
      cy.get('#inputFieldSum').type('2000');
      cy.get('#inputFieldPurpose').type('testzwecke');
      cy.get('#removeCreditor').click();
      cy.get('#submitButton').should(
        'have.class',
        'disabled h-12 w-12 inline-block rounded-full border border-gray-200 bg-gray-400 text-white transition'
      );
    });
  });
  it('submit button disabled when sum invalid', () => {
    authenticated(() => {
      cy.visit('http://localhost:5173/');
      cy.get('#rooms>div').eq(4).children().eq(1).children().eq(1).click();
      cy.get('#addDebtorButton').click();
      cy.get('#debtorUserDropdown>div').eq(1).children().eq(1).click();
      cy.get('#inputFieldPurpose').type('testzwecke');
      cy.get('#submitButton').should(
        'have.class',
        'disabled h-12 w-12 inline-block rounded-full border border-gray-200 bg-gray-400 text-white transition'
      );
      cy.get('#inputFieldSum').type('abc');
      cy.get('#submitButton').should(
        'have.class',
        'disabled h-12 w-12 inline-block rounded-full border border-gray-200 bg-gray-400 text-white transition'
      );
      cy.get('#inputFieldSum').type('{selectall}');
      cy.get('#inputFieldSum').type('abc');
      cy.get('#submitButton').should(
        'have.class',
        'disabled h-12 w-12 inline-block rounded-full border border-gray-200 bg-gray-400 text-white transition'
      );
    });
  });
  it('submit button disabled when purpose missing', () => {
    authenticated(() => {
      cy.visit('http://localhost:5173/');
      cy.get('#rooms>div').eq(4).children().eq(1).children().eq(1).click();
      cy.get('#addDebtorButton').click();
      cy.get('#debtorUserDropdown>div').eq(1).children().eq(1).click();
      cy.get('#addDebtorButton').click();
      cy.get('#debtorUserDropdown>div').eq(1).children().eq(2).click();
      cy.get('#inputFieldSum').type('2000');
      cy.get('#submitButton').should(
        'have.class',
        'disabled h-12 w-12 inline-block rounded-full border border-gray-200 bg-gray-400 text-white transition'
      );
    });
  });
  it('submit button disabled when no debtor selected', () => {
    authenticated(() => {
      cy.visit('http://localhost:5173/');
      cy.get('#rooms>div').eq(4).children().eq(1).children().eq(1).click();
      cy.get('#inputFieldSum').type('2000');
      cy.get('#inputFieldPurpose').type('testzwecke');
      cy.get('#noDebtorMessage').should('be.visible');
      cy.get('#submitButton').should(
        'have.class',
        'disabled h-12 w-12 inline-block rounded-full border border-gray-200 bg-gray-400 text-white transition'
      );
    });
  });
  it('add debtor button disabled when all room member selected', () => {
    authenticated(() => {
      cy.visit('http://localhost:5173/');
      cy.get('#rooms>div').eq(4).children().eq(1).children().eq(1).click();
      cy.get('#addDebtorButton').click();
      cy.get('#debtorUserDropdown>div').eq(1).children().eq(1).click();
      cy.get('#addDebtorButton').click();
      cy.get('#debtorUserDropdown>div').eq(1).children().eq(1).click();
      cy.get('#addDebtorButton').click();
      cy.get('#debtorUserDropdown>div').eq(1).children().eq(1).click();
      cy.get('#addDebtorButton').should(
        'have.class',
        'disabled h-12 w-12 inline-block rounded-full border border-gray-200 bg-gray-400 text-white transition'
      );
    });
  });
  it('does not show add creditor button if creditor already selected', () => {
    authenticated(() => {
      cy.visit('http://localhost:5173/');
      cy.get('#rooms>div').eq(4).children().eq(1).children().eq(1).click();
      cy.get('#removeCreditor').click();
      cy.get('#addCreditorButton').click();
      cy.get('#creditorUserDropdown>div').eq(1).children().eq(1).click();
      cy.get('#addCreditorButton').should('not.exist');
    });
  });
  it('shows error message if fixed amount greater as sum', () => {
    authenticated(() => {
      cy.visit('http://localhost:5173/');
      cy.get('#rooms>div').eq(4).children().eq(1).children().eq(1).click();
      cy.get('#addDebtorButton').click();
      cy.get('#debtorUserDropdown>div').eq(1).children().eq(1).click();
      cy.get('#addDebtorButton').click();
      cy.get('#debtorUserDropdown>div').eq(1).children().eq(2).click();
      cy.get('#inputFieldSum').type('2000');
      cy.get('#inputFieldPurpose').type('testzwecke');
      cy.get('#unevenSplitting>div').eq(1).children().eq(1).type('3000');
      cy.get('#unevenSplitting>div')
        .eq(0)
        .children()
        .eq(1)
        .children()
        .eq(2)
        .should(
          'contain',
          'Die Summe der festen Beträge darf nicht größer als der Gesamtbetrag sein'
        );
      cy.get('#unevenSplitting>div')
        .eq(1)
        .children()
        .eq(1)
        .children()
        .eq(2)
        .should(
          'contain',
          'Die Summe der festen Beträge darf nicht größer als der Gesamtbetrag sein'
        );
      cy.get('#unevenSplitting>div')
        .eq(3)
        .children()
        .eq(2)
        .should(
          'contain',
          'Die Summe der festen Beträge darf nicht größer als der Gesamtbetrag sein'
        );
      cy.get('#rest').should(
        'contain',
        'Die Summe der festen Beträge darf nicht größer als der Gesamtbetrag sein'
      );
    });
  });
  it('shows fixed amount', () => {
    authenticated(() => {
      cy.visit('http://localhost:5173/');
      cy.get('#rooms>div').eq(4).children().eq(1).children().eq(1).click();
      cy.get('#addDebtorButton').click();
      cy.get('#debtorUserDropdown>div').eq(1).children().eq(1).click();
      cy.get('#addDebtorButton').click();
      cy.get('#debtorUserDropdown>div').eq(1).children().eq(1).click();
      cy.get('#inputFieldSum').type('2000');
      cy.get('#unevenSplitting>div').eq(1).children().eq(1).type('350');
      cy.get('#unevenSplitting')
        .children()
        .eq(1) //TODO warum funktioniert das nicht, bitte schaus mal an
        .children()
        .eq(3)
        .children()
        .eq(1)
        .children('input')
        .eq(0)
        .should('have.value', '11,75');
    });
  });
  it('balance 1', () => {
    authenticated(() => {
      cy.intercept(
        {
          url: '/_matrix/client/v3/rooms/!UwIPSjAeKraDVxRvWW:stub.pse.dsn.kastel.kit.edu/state/edu.kit.kastel.dsn.pse.transaction/*',
          method: 'PUT',
        },
        {
          fixture: 'transaction_event_put',
        }
      ).as('transactionEventPut');
      cy.visit('http://localhost:5173/');
      cy.get('#rooms>div').eq(4).children().eq(1).children().eq(1).click();

      //20 von philipp2 an mich
      cy.get('#removeCreditor').click();
      cy.get('#addCreditorButton').click();
      cy.get('#creditorUserDropdown>div').eq(1).children().eq(1).click();
      cy.get('#addDebtorButton').click();
      cy.get('#debtorUserDropdown>div').eq(1).children().eq(3).click();
      cy.get('#inputFieldSum').type('2000');
      cy.get('#inputFieldPurpose').type('B -> A');
      cy.get('#submitButton').click();
      //10 von mich an philipp3
      cy.get('#newTransactionButton').click();
      cy.get('#addDebtorButton').click();
      cy.get('#debtorUserDropdown>div').eq(1).children().eq(2).click();
      cy.get('#inputFieldSum').type('1000');
      cy.get('#inputFieldPurpose').type('A -> C');
      cy.get('#submitButton').click();
      //10 von philip3 an philipp2
      cy.get('#newTransactionButton').click();
      cy.get('#removeCreditor').click();
      cy.get('#addCreditorButton').click();
      cy.get('#creditorUserDropdown>div').eq(1).children().eq(2).click();
      cy.get('#addDebtorButton').click();
      cy.get('#debtorUserDropdown>div').eq(1).children().eq(1).click();
      cy.get('#inputFieldSum').type('1000');
      cy.get('#inputFieldPurpose').type('C -> B');
      cy.get('#submitButton').click();

      cy.get('#toggleMemberListButton').click();
      cy.get('#userTiles>div')
        .eq(1)
        .children()
        .eq(0)
        .children()
        .eq(1)
        .should('contain', 'Du schuldest 10,00 €');
      cy.get('#userTiles>div')
        .eq(2)
        .children()
        .eq(0)
        .children()
        .eq(1)
        .should('contain', 'Ausgeglichen');
    });
  });
  it('balance 2', () => {
    authenticated(() => {
      cy.intercept(
        {
          url: '/_matrix/client/v3/rooms/!UwIPSjAeKraDVxRvWW:stub.pse.dsn.kastel.kit.edu/state/edu.kit.kastel.dsn.pse.transaction/*',
          method: 'PUT',
        },
        {
          fixture: 'transaction_event_put',
        }
      ).as('transactionEventPut');
      cy.visit('http://localhost:5173/');
      cy.get('#rooms>div').eq(4).children().eq(1).children().eq(1).click();

      //20 von mich an philipp2
      cy.get('#addDebtorButton').click();
      cy.get('#debtorUserDropdown>div').eq(1).children().eq(1).click();
      cy.get('#inputFieldSum').type('2000');
      cy.get('#inputFieldPurpose').type('B -> A');
      cy.get('#submitButton').click();
      //10 von philipp2 an philipp3
      cy.get('#newTransactionButton').click();
      cy.get('#removeCreditor').click();
      cy.get('#addCreditorButton').click();
      cy.get('#creditorUserDropdown>div').eq(1).children().eq(1).click();
      cy.get('#addDebtorButton').click();
      cy.get('#debtorUserDropdown>div').eq(1).children().eq(2).click();
      cy.get('#inputFieldSum').type('1000');
      cy.get('#inputFieldPurpose').type('A -> C');
      cy.get('#submitButton').click();
      //10 von philip3 an mich
      cy.get('#newTransactionButton').click();
      cy.get('#removeCreditor').click();
      cy.get('#addCreditorButton').click();
      cy.get('#creditorUserDropdown>div').eq(1).children().eq(2).click();
      cy.get('#addDebtorButton').click();
      cy.get('#debtorUserDropdown>div').eq(1).children().eq(3).click();
      cy.get('#inputFieldSum').type('1000');
      cy.get('#inputFieldPurpose').type('C -> B');
      cy.get('#submitButton').click();

      cy.get('#toggleMemberListButton').click();
      cy.get('#userTiles>div')
        .eq(1)
        .children()
        .eq(0)
        .children()
        .eq(1)
        .should('contain', 'Schuldet dir 10,00 €');
      cy.get('#userTiles>div')
        .eq(2)
        .children()
        .eq(0)
        .children()
        .eq(1)
        .should('contain', 'Ausgeglichen');
    });
  });
});
