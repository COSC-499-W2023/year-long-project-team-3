import { TIMEOUT } from '../../../utils/constants'

describe('Dashboard My Submission Boxes Tests', () => {

    beforeEach(() => {
        cy.task('clearDB')
    })

    it('should not display any incoming submission boxes', () => {
        const email = 'noSubmissions@box.com'
        const password = 'noSubmissions1'

        cy.visit('/signup')

        // Sign up
        cy.visit('/signup')
        cy.get('[data-cy="email"]').type(email)
        cy.get('[data-cy="password"]').type(password)
        cy.get('[data-cy="passwordConfirmation"]').type(password)
        cy.get('[data-cy="submit"]').click()
        cy.url().should('contain', 'login')

        // Login
        cy.get('[data-cy=email]').type(email)
        cy.get('[data-cy=password]').type(password)
        cy.get('[data-cy=submit]').click()
        cy.url().should('not.contain', 'login')

        cy.visit('/dashboard')
        cy.get('[data-cy="My Boxes"]', { timeout: TIMEOUT.LONG }).click()
        cy.url().should('contain', 'myboxes')
        cy.get('[data-cy="no submission text"]', { timeout: TIMEOUT.LONG })
            .should('be.visible')
            .and('contain', 'You Do Not Have Any Active Submission Boxes')
    })

    it('should display incoming submission boxes for a user that has incoming submission boxes', () => {
        const email = 'submission@in.box'
        const password = 'submissionIn1'

        // Load database
        cy.task('loadInSubmissionBoxes')
        // Login
        cy.visit('/login')
        cy.get('[data-cy=email]').type(email)
        cy.get('[data-cy=password]').type(password)
        cy.get('[data-cy=submit]').click()
        cy.url().should('not.contain', 'login')

        cy.visit('/dashboard')
        cy.get('[data-cy="My Boxes"]', { timeout: TIMEOUT.LONG }).click()
        cy.url().should('contain', 'myboxes')
        cy.get('[data-cy="Incoming Submission Box"]', { timeout: TIMEOUT.LONG })
            .should('be.visible').and('contain', 'Incoming Submission Box')
    })
})
