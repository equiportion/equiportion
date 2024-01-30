import {authenticated} from '../support/stubs';

describe('the creation of new rooms', () => {
  it('json is sent after room creation', () => {
    authenticated(() => {
      cy.visit('http://localhost:5173/');

      //TODO implement test
    });
  });
});
