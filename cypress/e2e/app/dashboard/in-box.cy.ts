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

        cy.visit('/dashboard')
        cy.get('[data-cy="Submission In-Box"]').click()
        cy.url().should('contain', 'inbox')
        cy.get('[data-cy="no submission text"]')
            .should('be.visible')
            .and('contain', 'You Do Not Have Any Active Submission Boxes')
    })

    it('should display incoming submission boxes for a user that has incoming submission boxes', () => {
        // Load database
        cy.task('loadInSubmissionBoxes')
        // Login
        cy.visit('/login')
        cy.get('[data-cy=email]').type('submission@in.box')
        cy.get('[data-cy=password]').type('submissionIn1')
        cy.get('[data-cy=submit]').click()
        cy.url().should('not.contain', 'login')

        cy.visit('/dashboard')
        cy.get('[data-cy="Submission In-Box"]').click()
        cy.url().should('contain', 'inbox')
        cy.get('[data-cy="Incoming Submission Box"]')
            .should('be.visible').and('contain', 'Incoming Submission Box')
    })
})
