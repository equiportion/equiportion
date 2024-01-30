import {authenticated} from '../support/stubs';

describe('membership messages are shown', () => {
  it('user leaves room is shown as message', () => {
    authenticated(() => {
      cy.visit('http://localhost:5173/');

      cy.get('#rooms>div').eq(2).click();
      cy.get('#transactions>div').eq(0).should('contain', 'hat den Raum verlassen');
    });
  });
  it('user is invited to room is shown as message', () => {
    authenticated(() => {
      cy.visit('http://localhost:5173/');

      cy.get('#rooms>div').eq(2).click();
      cy.get('#transactions>div').eq(1).should('contain', 'ist beigetreten');
    });
  });
  it('user joins room is shown as message', () => {
    authenticated(() => {
      cy.visit('http://localhost:5173/');

      cy.get('#rooms>div').eq(2).click();
      cy.get('#transactions>div').eq(2).should('contain', 'wurde eingeladen');
    });
  });
});
