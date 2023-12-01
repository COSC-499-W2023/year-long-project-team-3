describe('Dashboard Submission Inbox Tests', () => {
    before(() => {
        cy.task('clearDB')
    })

    beforeEach(() => {
        cy.task('clearDB')
    })

    it('should not display any incoming submission boxes', () => {
        cy.visit('/signup')

        // Sign up
        cy.visit('/signup')
        cy.get('[data-cy="email"]').type('email@e.com')
        cy.get('[data-cy="password"]').type('Password1')
        cy.get('[data-cy="passwordConfirmation"]').type('Password1')
        cy.get('[data-cy="submit"]').click()
        cy.url().should('contain', 'login')

        // Login
        cy.get('[data-cy=email]').type('email@e.com')
        cy.get('[data-cy=password]').type('Password1')
        cy.get('[data-cy=submit]').click()
        cy.url().should('not.contain', 'login')

        cy.visit('/dashboard/inbox')
        cy.get('[data-cy="no submission text"]')
            .should('be.visible')
            .and('contain', 'You Do Not Have Any Active Submission Boxes')
    })
})
