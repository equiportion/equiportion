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
      ).as('MRoomNamePut');
      cy.visit('http://localhost:5173/');
      cy.get('#rooms>div').eq(0).click();
      cy.get('#changeRoomDataButtonSm').click();
      cy.get('#roomName').type('{selectall}anderes Name');
      cy.get('#changeRoomDataSubmitSm').click();
      cy.wait('@MRoomNamePut').then(({request}) => {
        expect(request.body.name).to.eq('anderes Name');
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
          ).as('MRoomTopicPut');
      cy.visit('http://localhost:5173/');
      cy.get('#rooms>div').eq(0).click();
      cy.get('#changeRoomDataButtonSm').click();
      cy.get('#roomTopic').type('{selectall}anderes Thema');
      cy.get('#changeRoomDataSubmitSm').click();
      cy.wait('@MRoomTopicPut').then(({request}) => {
        expect(request.body.topic).to.eq('anderes Thema');
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
      ).as('RoomImageChangePost');
      cy.intercept(
        {
          url: '/_matrix/client/v3/rooms/!AovfRJyqtfNuSlegxT:stub.pse.dsn.kastel.kit.edu/state/m.room.avatar/',
          method: 'PUT',
        },
        {
          fixture: '',
        }
      ).as('MRoomAvatarPut');
      cy.visit('http://localhost:5173/');
      cy.get('#rooms>div').eq(0).click();
      cy.get('#changeRoomDataButtonSm').click();
      cy.get('#uploadLabel').selectFile('cypress/fixtures/cat.jpg');
      cy.get('#changeRoomDataSubmitSm').click();
      cy.wait('@RoomImageChangePost');
      cy.wait('@MRoomAvatarPut');
    });
  });
});
