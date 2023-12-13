describe('landing page', () => {
  it('loads', () => {
    cy.visit('http://localhost:5173/welcome')
    cy.get('#login-button-on-landing-page').should('exist')
  })
})