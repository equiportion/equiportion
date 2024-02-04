import {authenticated} from '../support/stubs';

describe('/', () => {
  // TODO fix
  it('room with more transactions than shown', () => {
    authenticated(() => {
      cy.visit('http://localhost:5173/');

      cy.get('#rooms>div').eq(4).click();
      cy.get('#transactions>div').eq(9).should('be.visible');
      cy.get('#transactions').children().should('have.length', 12);
      cy.get('#spinner').should('not.be.visible');
      cy.window().scrollTo('bottom');
      cy.get('#spinner').should('be.visible');
      cy.wait('@loadMoreMessages');
      cy.get('#spinner').should('not.be.visible');
      cy.get('#transactions').children().should('have.length', 13);
      cy.get('#transactions>div').eq(10).should('contain', 'Ich wurde nachgeladen');
      cy.window().scrollTo('bottom');
      cy.get('#spinner').should('not.be.visible');
      cy.get('#transactions').children().should('have.length', 13);
    });
  });
});
