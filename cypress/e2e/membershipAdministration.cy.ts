import {authenticated} from '../support/stubs';

describe('membership administration', () => {
  it('user leaves room event', () => {
    authenticated(() => {
      cy.intercept({
        url: '/_matrix/client/v3/rooms/!UwIPSjAeKraDVxRvWW:stub.pse.dsn.kastel.kit.edu/leave',
        method: 'POST',
      }).as('userLeavesRoomEvent');
      cy.visit('http://localhost:5173/');
      cy.get('#rooms>div').eq(4).click();
      cy.get('#toggleMemberListButton').click();
      cy.get('#userTiles>div').eq(0).children().eq(1).click();
      cy.wait('@userLeavesRoomEvent').then(({request}) => {
        expect(request.body.membership).to.eq(undefined);
      });
    });
  });
  it('user invitation leads to error when given user does not exist', () => {
    authenticated(() => {
      cy.intercept(
        {
          url: ' /_matrix/client/v3/user_directory/search',
          method: 'POST',
        },
        {
          fixure: 'search_result_no_result.json',
        }
      ).as('userSearch');
      cy.visit('http://localhost:5173/');
      cy.get('#rooms>div').eq(4).click();
      cy.get('#toggleMemberListButton').click();
      cy.get('#addMemberButton').click();
      cy.get('#inputFieldForUserInvitation').type('@test:example.com');
      cy.get('#invitationSubmit').click();
      cy.get('#inviteModal').should('contain', 'Einladung fehlgeschlagen');
    });
  });
  it('user kicks other user sends event', () => {
    authenticated(() => {
      cy.intercept({
        url: '/_matrix/client/v3/rooms/!UwIPSjAeKraDVxRvWW:stub.pse.dsn.kastel.kit.edu/kick',
        method: 'POST',
      }).as('userGetsKickedEvent');
      cy.visit('http://localhost:5173/');
      cy.get('#rooms>div').eq(4).click();
      cy.get('#toggleMemberListButton').click();
      cy.get('#userTiles>div').eq(2).children().eq(1).click();
      cy.get('#userTiles>div').eq(2).children().eq(1).children().eq(1).click();
      cy.wait('@userGetsKickedEvent').then(({request}) => {
        expect(request.body.membership).to.eq(undefined);
      });
    });
  });
});
