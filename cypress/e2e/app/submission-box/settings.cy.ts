import { TIMEOUT } from '../../../utils/constants'

describe('Submission box settings tests', () => {
    before(() => {
        cy.task('clearDB')
    })

    beforeEach(() => {
        cy.task('clearDB')
    })

    it('Should not allow the user to go to the next step without entering a title', () => {
        // Check that submitting with nothing in the fields presents user with prompts and does not let the user move on
        cy.visit('/submission-box/settings')

        cy.wait(1000) // this is necessary because the layout shifts slightly due to the multiline text box

        // Check that the errors do not exist
        cy.get('p.Mui-error').should('have.length', 0)

        cy.get('[data-cy="next"]').click()

        cy.url().should('include', '/submission-box/settings')

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
        cy.visit('/submission-box/settings')
        cy.get('[data-cy="submission-box-title"]').type(title)
        cy.get('[data-cy="next"]').click()

        // We shouldn't be on the submission-box/settings page anymore
        cy.url({ timeout: TIMEOUT.LONG }).should('include', '/submission-box/add-members')
    })

    it('Should let the user return to the previous page using the back button', () => {
        cy.visit('/submission-box/settings')

        cy.get('[data-cy="back-button"]').click()

        // TODO: change this to test for appropriate URL (currently not implemented as the user is not logged in for this test and would therefore be re-routed to login)
        // cy.url().should('include', '/dashboard')
    })
})
