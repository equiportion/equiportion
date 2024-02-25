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
  it('user invitation spawns event', () => {
    authenticated(() => {
      cy.visit('http://localhost:5173/');
      cy.get('#rooms>div').eq(4).click();
      cy.get('#toggleMemberListButton').click();
      cy.get('#addMemberButton').click();
      cy.get('#inputFieldForUserInvitation').type('@test:example.com');
      cy.get('#invitationSubmit').click();
      cy.get('#inputFieldForUserInvitation').should(
        'contain',
        'Einladung fehlgeschlagen: Bitte prüfe, ob der/die Benutzer*in existiert (und noch nicht in diesem Raum ist) und ob du die Berechtigung hast, ihn/sie einzuladen.'
      );
    });
  });
  it('user kicks other user spawns event', () => {
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
