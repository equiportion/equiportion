import {authenticated} from '../support/stubs';

describe('the creation of new rooms', () => {
  it('event is sent on room creation', () => {
    authenticated(() => {
      cy.intercept({
        url: '/_matrix/client/v3/createRoom*',
        method: 'POST',
      }).as('newRoomEventPost');

      cy.visit('http://localhost:5173/');

      cy.get('#toolBar>div').eq(0).children().eq(0).children().eq(0).click();
      cy.get('#roomNameInputField').type('room test name');
      cy.get('#createRoomButton').click();
      cy.wait('@newRoomEventPost').then(({request}) => {
        expect(request.body.name).to.eq('room test name');
      });
    });
  });
});
