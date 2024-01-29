import {authenticated} from '../support/stubs';

describe('main layout: profile dropdown', () => {
  it('user leaves room is shown as message', () => {
    authenticated(() => {
      cy.visit('http://localhost:5173/');

      cy.get('#rooms>div').eq(2).click();
    });
  });
  it('user is invited to room is shown as message', () => {
    authenticated(() => {
      cy.visit('http://localhost:5173/');

      cy.get('#rooms>div').eq(2).click();
    });
  });
  it('user joins room is shown as message', () => {
    authenticated(() => {
      cy.visit('http://localhost:5173/');

      cy.get('#rooms>div').eq(2).click();
    });
  });
});
