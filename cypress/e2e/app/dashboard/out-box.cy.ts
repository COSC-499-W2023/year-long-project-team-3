describe('Dashboard Submission Inbox Tests', () => {
    before(() => {
        cy.task('clearDB')
    })

    beforeEach(() => {
        cy.task('clearDB')
    })

    it('should not display any outgoing submission boxes', () => {
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
        cy.get('[data-cy="Submission Out-Box"]').click()
        cy.url().should('contain', 'outbox')
        cy.get('[data-cy="no submission text"]')
            .should('be.visible')
            .and('contain', 'You Have Not Submitted To Any Active Submission Boxes')
    })

    it('should display outgoing submission boxes for a user that has outgoing submission boxes', () => {
    // Load database
        cy.task('loadOutSubmissionBoxes')
        // Login
        cy.visit('/login')
        cy.get('[data-cy=email]').type('submission@out.box')
        cy.get('[data-cy=password]').type('submissionOut1')
        cy.get('[data-cy=submit]').click()
        cy.url().should('not.contain', 'login')

        cy.visit('/dashboard')
        cy.get('[data-cy="Submission Out-Box"]').click()
        cy.url().should('contain', 'outbox')
        cy.get('[data-cy="Outgoing Submission Box"]')
            .should('be.visible').and('contain', 'Outgoing Submission Box')
    })
})
