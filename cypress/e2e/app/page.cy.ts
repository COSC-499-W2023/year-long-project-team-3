describe('test page', () => {
    it('Contains landing app bar with correct text', () => {
        cy.visit('/')
        cy.title().should('eq', 'Harp: A Secure Platform for Videos')
        cy.get('[data-cy="landing-page-app-bar"]').contains('Harp')
        cy.get('[data-cy="sign-up-button"]').contains('Sign Up')
    })

    it('contains platform description', () => {
        cy.visit('/')
        cy.get('[data-cy="motto"').contains('Secure Platform')
        cy.get('[data-cy="platform-description"]').contains('Professional video')
    })
})
