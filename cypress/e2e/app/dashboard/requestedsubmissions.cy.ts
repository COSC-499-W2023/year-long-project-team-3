import { TIMEOUT } from '../../../utils/constants'
import runWithRetry from '../../../utils/runUntilExist'
import { v4 as uuidv4 } from 'uuid'

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
        cy.get('[data-cy="My Requests"]', { timeout: TIMEOUT.EXTRA_LONG }).click()
        cy.url({ timeout: TIMEOUT.EXTRA_LONG }).should('contain', 'dashboard')
        cy.get('[data-cy="no-submission-text"]', { timeout: TIMEOUT.EXTRA_LONG })
            .should('be.visible')
            .and('contain', 'You Do Not Have Any Submission Boxes')
    })

    it('should display outgoing submission boxes for a user that has outgoing submission boxes', () => {
        const email = 'submission@out.box'
        const password = 'submissionOut1'
        const title = 'Outgoing Submission Box' + uuidv4()

        // Load database
        cy.task('loadOutSubmissionBoxes', { email, password, title })
        // Login
        cy.visit('/login')
        cy.get('[data-cy=email]').type(email)
        cy.get('[data-cy=password]').type(password)
        cy.get('[data-cy=submit]').click()
        cy.url().should('not.contain', 'login')

        cy.visit('/dashboard')
        runWithRetry(() => {
            cy.get('[data-cy="My Requests"]', { timeout: TIMEOUT.EXTRA_EXTRA_LONG }).click()
            cy.url({ timeout: TIMEOUT.EXTRA_EXTRA_LONG }).should('contain', 'dashboard')
        })
        cy.get(`[data-cy="${ title }"]`, { timeout: TIMEOUT.EXTRA_EXTRA_LONG })
            .should('be.visible')
            .and('contain', title)
    })
})
