import {authenticated} from '../support/stubs';

describe('/', () => {
  it('changes room avatar', () => {
    authenticated(() => {
      cy.intercept(
        {
          url: '/_matrix/media/v3/upload',
          method: 'POST',
        },
        {
          fixture: 'matrix_media_v3_upload',
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
      cy.get('#editRoomDataSm').click();
      cy.get('#uploadLabel').selectFile('cypress/fixtures/cat.jpg');
      cy.get('#updateRoomDataSm').click();
      cy.wait('@uploadPost');
      cy.wait('@MRoomAvatarEventPut').then(({request}) => {
        expect(request.body.url).to.eq('mxc://example.com/AQwafuaFswefuhsfAFAgsw');
      });
    });
  });
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
      cy.get('#editRoomDataSm').click();
      cy.get('#roomName').invoke('val', 'newName'); //workaround for cypress bug
      cy.get('#roomName').trigger('input');
      cy.get('#updateRoomDataSm').click();
      cy.wait('@MRoomNameEventPut').then(({request}) => {
        expect(request.body.name).to.eq('newName');
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
      cy.get('#editRoomDataSm').click();
      cy.get('#roomTopic').invoke('val', 'newTopic');
      cy.get('#roomTopic').trigger('input');
      cy.get('#updateRoomDataSm').click();
      cy.wait('@MRoomTopicEventPut').then(({request}) => {
        expect(request.body.topic).to.eq('newTopic');
      });
    });
  });
});
