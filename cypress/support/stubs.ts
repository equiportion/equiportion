/**
 * This file is used to stub requests to the homeserver.
 */

function standard() {
  cy.intercept(
    {
      method: 'GET',
      url: '/_matrix/client/versions',
    },
    {
      fixture: 'matrix_client_versions.json',
    }
  ).as('matrix_client_versions');
}

type authenticatedOptions = {
  profilePictureSet?: boolean;
  syncOption?: string;
};

function authenticated(tests: Function, authenticatedOptions: authenticatedOptions = {}) {
  standard();

  cy.setCookie('homeserverUrl', 'https://stub.pse.dsn.kastel.kit.edu');
  cy.setCookie('accessToken', Cypress.env('as_token'));

  cy.intercept(
    {
      method: 'GET',
      url: '/_matrix/client/v3/account/whoami',
    },
    {
      fixture: 'matrix_client_v3_account_whoami-authenticated.json',
    }
  ).as('whoami_authenticated');

  if (authenticatedOptions.profilePictureSet) {
    cy.intercept(
      {
        method: 'GET',
        url: '/_matrix/client/v3/profile/@stub:stub.pse.dsn.kastel.kit.edu',
      },
      {
        fixture: 'matrix_client_v3_profile-me-pic.json',
      }
    ).as('profile-me');
  } else {
    cy.intercept(
      {
        method: 'GET',
        url: '/_matrix/client/v3/profile/@stub:stub.pse.dsn.kastel.kit.edu',
      },
      {
        fixture: 'matrix_client_v3_profile-me.json',
      }
    ).as('profile-me');
  }

  cy.intercept(
    {
      method: 'GET',
      url: ' /_matrix/media/v3/thumbnail/**/*',
    },
    {
      fixture: 'cat.jpg',
    }
  ).as('thumbnail');

  cy.intercept(
    {
      method: 'GET',
      url: '/_matrix/client/v3/sync*',
    },
    {
      fixture: 'matrix_client_v3_sync-' + (authenticatedOptions.syncOption ?? 'default') + '.json',
    }
  ).as('sync');

  cy.intercept(
    {
      method: 'GET',
      url: '/_matrix/client/v3/rooms/!UwIPSjAeKraDVxRvWW:stub.pse.dsn.kastel.kit.edu/messages*',
    },
    {
      fixture: 'matrix_client_v3_rooms_messages.json',
    }
  ).as('loadMoreMessages');

  tests();

  cy.wait('@whoami_authenticated').then(({request}) => {
    expect(request.headers.authorization).to.eq(`Bearer ${Cypress.env('as_token')}`);
  });
}

function unauthenticated(tests: Function) {
  standard();

  cy.intercept(
    {
      method: 'GET',
      url: '/_matrix/client/v3/account/whoami',
    },
    {
      fixture: 'matrix_client_v3_account_whoami-unauthenticated.json',
    }
  ).as('whoami_unauthenticated');

  tests();
}

export {standard, authenticated, unauthenticated};
