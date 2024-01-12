import { TIMEOUT } from '../../../../utils/constants'
import { v4 as uuidv4 } from 'uuid'

describe('Submission box settings tests', () => {
    before(() => {
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
        })

        it('Should not allow the user to go to the next step without entering a title', () => {
            // Check that submitting with nothing in the fields presents user with prompts and does not let the user move on

            cy.wait(1000) // this is necessary because the layout shifts slightly due to the multiline text box

            // Check that the errors do not exist
            cy.get('p.Mui-error').should('have.length', 0)

            cy.get('[data-cy="Next"]').click()

            cy.url().should('include', '/submission-box')

            cy.get('p.Mui-error').should('have.length', 1)
            cy.get('[data-cy="submission-box-title"]')
                .find('p.Mui-error')
                .should('be.visible')
                .and('contain', 'Please enter a title for your submission box')
        })

        it('Should allow user to click next', () => {
            // User data
            const title = 'My Test Title'

            // Create submission box
            cy.get('[data-cy="submission-box-title"]').type(title)

            // Double click is a known issue, cypress is not acting correctly on browser preview deployment
            cy.get('[data-cy="Next"]').click().click()

            // We shouldn't be on the seeing the settings step anymore
            cy.get('[data-cy="title"]', { timeout: TIMEOUT.EXTRA_LONG }).contains('Request Submissions')
        })

        // Flaky test
        it.skip('Should let the user return to the previous page using the return to dashboard button', () => {
            cy.get('[data-cy="back-button"]').click()

            // TODO: change this to test for appropriate URL
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
