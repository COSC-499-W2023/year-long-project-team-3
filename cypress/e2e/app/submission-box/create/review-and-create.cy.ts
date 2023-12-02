import { TIMEOUT } from '../../../../utils/constants'
import { v4 as uuidv4 } from 'uuid'

describe('Submission box review and create tests', () => {
    before(() => {
        cy.task('clearDB')
    })

    beforeEach(() => {
        cy.task('clearDB')
    })

    context('Logged in', () => {
        beforeEach(() => {
            cy.session('testuser', () => {
                const email = 'user' + uuidv4() + '@example.com'
                const password = 'Password1'

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
            })

            cy.visit('/dashboard')
            cy.get('[data-cy="Create new"]').click()

            const title = 'My Test Title'

            // Create submission box
            cy.get('[data-cy="submission-box-title"]').type(title)

            // Double click is a known issue, cypress is not acting correctly on browser preview deployment
            cy.get('[data-cy="next"]').click().click()

            // We should be on the request submission step
            cy.get('[data-cy="title"]', { timeout: TIMEOUT.EXTRA_LONG }).contains('Request Submissions')

            cy.get('[data-cy="next"]').click()
        })

        it('Should allow the user to review their submission box before creating', () => {
            cy.get('[data-cy="title"]', { timeout: TIMEOUT.EXTRA_LONG }).contains('Review & Create')

            // TODO: extend this test to check more details about the page
        })

        it('Should let the user return to the previous page using the return to dashboard button', () => {
            cy.get('[data-cy="back-button"]').click()

            // TODO: change this to test for appropriate URL
            cy.url().should('include', '/dashboard')
        })

        it('Should let the user return to the previous step using the back button', () => {
            cy.get('[data-cy="back"]').click()

            cy.url().should('include', '/submission-box')

            cy.get('[data-cy="title"]', { timeout: TIMEOUT.EXTRA_LONG }).contains('Request Submissions')
        })

        it.skip('Should allow user to click create', () => {
            cy.get('[data-cy="next"]').click()

            cy.url().should('include', '/dashboard')
        })
    })

    context('Not logged in', () => {
        beforeEach(() => {
            cy.visit('/submission-box/create')
        })

        it('Should redirect to login', () => {
            cy.url().should('contain', 'login')
        })
    })
})
