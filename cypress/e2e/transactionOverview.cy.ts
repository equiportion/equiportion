import {authenticated} from '../support/stubs';

describe('/', () => {
  it('transaction tile without purpose renders', () => {
    authenticated(() => {
      cy.visit('http://localhost:5173/');

      cy.get('#rooms>div').eq(0).click();
      cy.get('#transactions>div').eq(2).should('contain.text', '347587,00€');
    });
  });
  it('all transactions are beeing shown', () => {
    authenticated(() => {
      cy.visit('http://localhost:5173/');

      cy.get('#rooms>div').eq(0).click();
      cy.get('#transactions').children().should('have.length', 12);
      cy.get('#no-transaction-message').should('not.be.visible');
    });
  });
  it('shows chevron on large screen', () => {
    authenticated(() => {
      cy.viewport(1280, 720);
      cy.visit('http://localhost:5173/');
      cy.get('#rooms>div').eq(0).click();
      cy.get('#transactions .fa-solid.fa-chevron-right.w-5').should('be.visible');
    });
  });
  it('does not show chevron on small screen', () => {
    authenticated(() => {
      cy.viewport(480, 800);
      cy.visit('http://localhost:5173/');
      cy.get('#rooms>div').eq(0).click();
      cy.get('#transactions .fa-solid.fa-chevron-right.w-5').should('not.be.visible');
    });
  });

  it('does not show transaction balance to myself', () => {
    authenticated(() => {
      cy.visit('http://localhost:5173/');
      cy.get('#rooms>div').eq(2).click();
      cy.get('#toggleMemberListButton').click();
      cy.get('#userTiles>div')
        .eq(0)
        .should('not.contain', 'Du schuldest')
        .and('not.contain', 'Schuldet dir')
        .and('not.contain', 'Ausgeglichen');
    });
  });
});
