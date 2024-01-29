import {authenticated} from '../support/stubs';

describe('main layout: profile dropdown', () => {
  // TODO durch Longpolling kaputt
  // it('click outside dropdown menu closes it', () => {
  //   authenticated(() => {
  //     cy.request('http://localhost:5173/');

  //     cy.get('#profile-picture').click();
  //     cy.get('#logout-button').should('be.visible');
  //     cy.get('#home-button').click();
  //     cy.get('#logout-button').should('not.be.visible');
  //   });
  // });
  // TODO durch Longpolling kaputt
  // it('logout button visible after click on profile picture', () => {
  //   authenticated(() => {
  //     cy.visit('http://localhost:5173/');

  //     cy.get('#profile-picture').click();
  //     cy.get('#logout-button').should('be.visible');
  //   });
  // });
});
