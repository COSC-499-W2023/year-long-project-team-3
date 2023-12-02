import { TIMEOUT } from '../../../../utils/constants'

describe('Submission box review and create tests', () => {
    before(() => {
        cy.task('clearDB')
    })

    beforeEach(() => {
        cy.task('clearDB')
        cy.visit('/submission-box')
    })

    it('Should allow the user to review their submission box before creating', () => {
        const title = 'My Test Title'

        // Create submission box
        cy.get('[data-cy="submission-box-title"]').type(title)

        // Double click is a known issue, cypress is not acting correctly on browser preview deployment
        cy.get('[data-cy="next"]').click().click()

        // We should be on the request submission step
        cy.get('[data-cy="title"]', { timeout: TIMEOUT.EXTRA_LONG }).contains('Request Submissions')

        cy.get('[data-cy="next"]').click()

        cy.get('[data-cy="title"]', { timeout: TIMEOUT.EXTRA_LONG }).contains('Review & Create')

        // TODO: extend this test to check more details about the page
    })

    it.skip('Should let the user return to the previous page using the return to dashboard button', () => {
        cy.get('[data-cy="back-button"]').click()

        // TODO: change this to test for appropriate URL (currently not implemented as the user is not logged in for this test and would therefore be re-routed to login)
        // cy.url().should('include', '/dashboard')
    })

    it('Should let the user return to the previous step using the back button', () => {
        const title = 'My Test Title'

        // Create submission box
        cy.get('[data-cy="submission-box-title"]').type(title)

        // Double click is a known issue, cypress is not acting correctly on browser preview deployment
        cy.get('[data-cy="next"]').click().click()

        // We should be on the request submission step
        cy.get('[data-cy="title"]', { timeout: TIMEOUT.EXTRA_LONG }).contains('Request Submissions')

        cy.get('[data-cy="next"]').click()

        cy.get('[data-cy="title"]', { timeout: TIMEOUT.EXTRA_LONG }).contains('Review & Create')

        cy.get('[data-cy="back"]').click()

        cy.url().should('include', '/submission-box')

        cy.get('[data-cy="title"]', { timeout: TIMEOUT.EXTRA_LONG }).contains('Request Submissions')
    })

    it.skip('Should allow user to click create', () => {
        cy.get('[data-cy="next"]').click()

        cy.url().should('include', '/dashboard')
    })
})
