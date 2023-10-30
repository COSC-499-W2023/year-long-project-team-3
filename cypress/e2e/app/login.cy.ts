describe('Login tests', () => {
    before(() => {
        cy.task('clearDB')
    })

    it('Should load up the login page', () => {
        // Check page loads
        cy.visit('/login')
    })

    it('Should not allow the user to log in with no information in fields', () => {
        // Check that submitting with nothing in the fields presents user with prompts and does not log the user in
        cy.visit('/login')
        cy.get('[data-cy="submit"]').click()
        cy.url().should('include', '/login')
    })
})
