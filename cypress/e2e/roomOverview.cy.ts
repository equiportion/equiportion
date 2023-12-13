import {login} from '../support/e2e';

describe('account-with-two-rooms-has-three-rooms-displayed', () => {
  it('account-with-two-rooms-has-two-rooms-displayed', () => {
    login('two-filled-rooms');
    cy.get('#main-layout').should('be.visible');
    cy.get('#main-layout').get('#rooms').children().should('have.length', 2);
  });
});
