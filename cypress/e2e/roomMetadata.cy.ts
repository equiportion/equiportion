import {authenticated} from '../support/stubs';

describe('/', () => {
  it('changes room name', () => {
    authenticated(() => {
      cy.intercept(
        {
          url: '/_matrix/client/v3/rooms/!AovfRJyqtfNuSlegxT:stub.pse.dsn.kastel.kit.edu/state/m.room.name/',
          method: 'PUT',
        },
        {
          fixture: '',
        }
      ).as('MRoomNameEventPut');
      cy.visit('http://localhost:5173/');
      cy.get('#rooms>div').eq(0).click();
      cy.get('#changeRoomDataButtonSm').click();
      cy.get('#roomName').type('{selectall}A');
      cy.get('#changeRoomDataSubmitSm').click();
      cy.wait('@MRoomNameEventPut').then(({request}) => {
        expect(request.body.name).to.eq('A');
      });
    });
  });
  it('changes room topic', () => {
    authenticated(() => {
      cy.intercept(
        {
          url: '/_matrix/client/v3/rooms/!AovfRJyqtfNuSlegxT:stub.pse.dsn.kastel.kit.edu/state/m.room.topic/',
          method: 'PUT',
        },
        {
          fixture: '',
        }
      ).as('MRoomTopicEventPut');
      cy.visit('http://localhost:5173/');
      cy.get('#rooms>div').eq(0).click();
      cy.get('#changeRoomDataButtonSm').click();
      cy.get('#roomTopic').type('{selectall}B');
      cy.get('#changeRoomDataSubmitSm').click();
      cy.wait('@MRoomTopicEventPut').then(({request}) => {
        expect(request.body.topic).to.eq('B');
      });
    });
  });
  it('changes room avatar', () => {
    authenticated(() => {
      cy.intercept(
        {
          url: '/_matrix/media/v3/upload',
          method: 'POST',
        },
        {
          fixture: '',
        }
      ).as('uploadPost');
      cy.intercept(
        {
          url: '/_matrix/client/v3/rooms/!AovfRJyqtfNuSlegxT:stub.pse.dsn.kastel.kit.edu/state/m.room.avatar/',
          method: 'PUT',
        },
        {
          fixture: '',
        }
      ).as('MRoomAvatarEventPut');
      cy.visit('http://localhost:5173/');
      cy.get('#rooms>div').eq(0).click();
      cy.get('#changeRoomDataButtonSm').click();
      cy.get('#uploadLabel').selectFile('cypress/fixtures/cat.jpg');
      cy.get('#changeRoomDataSubmitSm').click();
      cy.wait('@uploadPost');
      cy.wait('@MRoomAvatarEventPut');
    });
  });
});
