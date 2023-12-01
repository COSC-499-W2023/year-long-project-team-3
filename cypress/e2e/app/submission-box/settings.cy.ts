import { TIMEOUT } from '../../../utils/constants'

describe('Submission box settings tests', () => {
    before(() => {
        cy.task('clearDB')
    })

    beforeEach(() => {
        cy.task('clearDB')
        cy.visit('/submission-box')
    })

    it('Should not allow the user to go to the next step without entering a title', () => {
        // Check that submitting with nothing in the fields presents user with prompts and does not let the user move on

        cy.wait(1000) // this is necessary because the layout shifts slightly due to the multiline text box

        // Check that the errors do not exist
        cy.get('p.Mui-error').should('have.length', 0)

        cy.get('[data-cy="next"]').click()

        cy.url().should('include', '/submission-box')

        cy.get('p.Mui-error').should('have.length', 1)
        cy.get('[data-cy="submission-box-title"]')
            .find('p.Mui-error')
            .should('be.visible')
            .and('contain', 'Please enter a title for your submission box')
    })

    it('Should allow user to move on to the next page', () => {
        // User data
        const title = 'My Test Title'

        // Create submission box
        cy.get('[data-cy="submission-box-title"]').type(title)

        // Double click is a known issue, cypress is not acting correctly on browser preview deployment
        cy.get('[data-cy="next"]').click().click()

        // We shouldn't be on the seeing the settings step anymore
        cy.get('[data-cy="title"]', { timeout: TIMEOUT.EXTRA_LONG }).contains('Request Submissions')
    })

    it('Should let the user return to the previous page using the back button', () => {
        cy.get('[data-cy="back-button"]').click()

        // TODO: change this to test for appropriate URL (currently not implemented as the user is not logged in for this test and would therefore be re-routed to login)
        // cy.url().should('include', '/dashboard')
    })
})
