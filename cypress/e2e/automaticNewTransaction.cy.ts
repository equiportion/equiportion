import {authenticated} from '../support/stubs';

describe('/', () => {
  it('no button for user with equal balance', () => {
    authenticated(() => {
      cy.visit('http://localhost:5173/');
      cy.get('#rooms>div').eq(4).children().eq(1).children().eq(0).click();
      cy.get('#toggleMemberListButton').click();
      cy.get('#userTiles>div').eq(2).children().eq(1).click();
      cy.get('#userTiles>div').eq(2).children().eq(1).children().eq(1).should('have.length', 1);
    });
  });
  it('automatic transaction positive balance', () => {
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
      //2 von mich an philipp3
      cy.get('#addDebtorButton').click();
      cy.get('#debtorUserDropdown>div').eq(1).children().eq(2).click();
      cy.get('#inputFieldSum').type('200');
      cy.get('#inputFieldPurpose').type('testzwecke');
      cy.get('#submitButton').click();

      cy.get('#toggleMemberListButton').click();
      cy.get('#userTiles>div').eq(2).children().eq(1).click();
      cy.get('#userTiles>div').eq(2).children().eq(1).children().eq(1).children().eq(0).click();

      cy.get('#toplevelCreditorDiv').should('contain', 'philipptest3');
      cy.get('#toplevelCreditorDiv').should('contain', '@philipptest3:stub.pse.dsn.kastel.kit.edu');
      cy.get('#unevenSplitting>div')
        .eq(0)
        .children()
        .eq(0)
        .children()
        .eq(0)
        .children()
        .eq(1)
        .should('contain', 'Testbenutzer');
      cy.get('#inputFieldSum').children().eq(0).should('have.value', '2,00');
    });
  });
  it('automatic transaction negative balance', () => {
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
      //5 von philip3 an mich
      cy.get('#removeCreditor').click();
      cy.get('#addCreditorButton').click();
      cy.get('#creditorUserDropdown>div').eq(1).children().eq(2).click();
      cy.get('#addDebtorButton').click();
      cy.get('#debtorUserDropdown>div').eq(1).children().eq(3).click();
      cy.get('#inputFieldSum').type('500');
      cy.get('#inputFieldPurpose').type('testzwecke');
      cy.get('#submitButton').click();

      cy.get('#toggleMemberListButton').click();
      cy.get('#userTiles>div').eq(2).children().eq(1).click();
      cy.get('#userTiles>div').eq(2).children().eq(1).children().eq(1).children().eq(0).click();

      cy.get('#toplevelCreditorDiv').should('contain', 'Testbenutzer');
      cy.get('#toplevelCreditorDiv').should('contain', '@stub:stub.pse.dsn.kastel.kit.edu');
      cy.get('#unevenSplitting>div')
        .eq(0)
        .children()
        .eq(0)
        .children()
        .eq(0)
        .should('contain', 'philipptest3');
      cy.get('#inputFieldSum').children().eq(0).should('have.value', '5,00');
    });
  });
});
