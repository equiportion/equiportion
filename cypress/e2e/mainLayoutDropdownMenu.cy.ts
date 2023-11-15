describe('main layout: profile dropdown', () => {
  it('click outside dropdown menu closes it', () => {
    cy.visit('http://localhost:5173/')
    cy.get('#profile-picture').click()
    cy.get('#logout-button').should('be.visible')
    cy.get('#home-button').click()
    cy.get('#logout-button').should('not.be.visible')
  })
})