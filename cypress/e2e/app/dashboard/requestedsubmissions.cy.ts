import { TIMEOUT } from '../../../utils/constants'

describe('Dashboard Requested Submission Boxes Tests', () => {

    beforeEach(() => {
        cy.task('clearDB')
    })

    it('should not display any outgoing submission boxes on a user that has no outgoing submission boxes', () => {
        const email = 'noSubmissions@box.com'
        const password = 'noSubmissions1'

        cy.visit('/signup')

        // Sign up
        cy.visit('/signup')
        cy.get('[data-cy="email"]').type(email)
        cy.get('[data-cy="password"]').type(password)
        cy.get('[data-cy="passwordConfirmation"]').type(password)
        cy.get('[data-cy="submit"]').click()
        cy.url({ timeout: TIMEOUT.EXTRA_LONG }).should('contain', 'login')

        // Login
        cy.get('[data-cy=email]').type(email)
        cy.get('[data-cy=password]').type(password)
        cy.get('[data-cy=submit]').click()
        cy.url({ timeout: TIMEOUT.EXTRA_LONG }).should('not.contain', 'login')

        cy.visit('/dashboard')
        cy.get('[data-cy="My Requests"]', { timeout: TIMEOUT.EXTRA_LONG }).click().click()
        cy.url({ timeout: TIMEOUT.EXTRA_LONG }).should('contain', 'requestedsubmissions')
        cy.get('[data-cy="no submission text"]', { timeout: TIMEOUT.EXTRA_LONG })
            .should('be.visible')
            .and('contain', 'You Have Not Submitted To Any Active Submission Boxes')
    })

    it('should display outgoing submission boxes for a user that has outgoing submission boxes', () => {
        const email = 'submission@out.box'
        const password = 'submissionOut1'

        // Load database
        cy.task('loadOutSubmissionBoxes')
        // Login
        cy.visit('/login')
        cy.get('[data-cy=email]').type(email)
        cy.get('[data-cy=password]').type(password)
        cy.get('[data-cy=submit]').click()
        cy.url().should('not.contain', 'login')

        cy.visit('/dashboard')
        cy.get('[data-cy="My Requests"]', { timeout: TIMEOUT.EXTRA_EXTRA_LONG }).click().click()
        cy.url({ timeout: TIMEOUT.EXTRA_EXTRA_LONG }).should('contain', 'requestedsubmissions')
        cy.get('[data-cy="Outgoing Submission Box"]', { timeout: TIMEOUT.EXTRA_EXTRA_LONG })
            .should('be.visible').and('contain', 'Outgoing Submission Box')
    })
})
