describe('landing page', () => {
  it('loads', () => {
    cy.visit('http://localhost:5173/welcome')
    cy.get('#loginButton').should('exist')
  })
})