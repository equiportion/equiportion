import {authenticated} from '../support/stubs';

describe('/profile', () => {
  it('loads', () => {
    authenticated(() => {
      cy.visit('http://localhost:5173/profile');
      cy.get('h1').should('contain', 'Stefan Stub');
      cy.get('span').should('contain', '@stub:stub.pse.dsn.kastel.kit.edu');

      // check that img src is correct
      cy.get('img.w-40.h-40.rounded-full').should(
        'have.attr',
        'src',
        'https://ui-avatars.com/api/?name=Stefan Stub&size=128&background=random'
      );
    });
  });

  it('loads with profile picture', () => {
    authenticated(
      () => {
        cy.visit('http://localhost:5173/profile');
        cy.get('#profile-picture').should('exist');
      },
      {profilePictureSet: true}
    );
  });
});
