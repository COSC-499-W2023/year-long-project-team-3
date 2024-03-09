import { TIMEOUT } from '../../../../utils/constants'
import runWithRetry from '../../../../utils/runUntilExist'

describe('Recieving Dashboard Details Page Tests', () => {
    // User information
    const email = 'modification@detail.test'
    const password = 'Pass1234'
    // Submission Box information
    const emptySubmissionBoxTitle = 'Test Modification with only title'
    const fullSubmissionBoxTitle = 'Test Modification with all fields'
    const submissionBoxDescription = 'Description for a submission box with all fields filled out'
    const submissionBoxTime = new Date()
    submissionBoxTime.setDate(submissionBoxTime.getDate() + 90)
    // New values for editing
    const newTitle = 'A new title for the submission box'
    const newDescription = 'A new description for the submission box.'
    console.log(new Date(submissionBoxTime))
    beforeEach(() => {
        cy.task('clearDB')
        // Can create the same user for each test, but need to create two separate submission boxes
        cy.task('createUser', { email, password })
        cy.visit('/login')
        cy.get('[data-cy=email]').type(email)
        cy.get('[data-cy=password]').type(password)
        cy.get('[data-cy=submit]').click()
        cy.url({ timeout: TIMEOUT.EXTRA_LONG }).should('not.contain', 'login')
        cy.task('getUserId', email).then((userId) => {
            cy.task('createSubmissionBoxForSubmissions', { submissionBoxTitle: emptySubmissionBoxTitle, userId })
            cy.task('createSubmissionBoxForSubmissions', { submissionBoxTitle: fullSubmissionBoxTitle, submissionBoxDescription, userId, closesAt: submissionBoxTime })
        })
        cy.reload()
        cy.visit('/dashboard')
    })

    it('should display a submission box and be able to change it\'s information when the only field populated is title', () => {
        runWithRetry(() => {
            cy.get('[data-cy="Manage Boxes"]', { timeout: TIMEOUT.EXTRA_LONG }).click()
            cy.url({ timeout: TIMEOUT.EXTRA_LONG }).should('contain', 'dashboard')
        })
        cy.get(`[data-cy="${ emptySubmissionBoxTitle }"]`, { timeout: TIMEOUT.EXTRA_EXTRA_LONG }).click()

        cy.get('[data-cy="submissionBoxTitle"]', { timeout: TIMEOUT.EXTRA_LONG }).should('contain', emptySubmissionBoxTitle)

        cy.get('[data-cy="edit-icon"]').should('be.visible').click()
        cy.get('[data-cy="submissionBoxTitleEditing"]').should('be.visible').click()

        cy.get('[data-cy="submissionBoxTitleEditing"]').focused().clear().type(newTitle)
        cy.get('[data-cy="updateButton"]').should('be.visible').click()

        cy.get('[data-cy="submissionBoxTitle"]').should('contain', newTitle)
    })

    it('should display a submission box, start to change it\'s information, cancel the operation and revert the title, description, and date to the original', () => {
        runWithRetry(() => {
            cy.get('[data-cy="Manage Boxes"]', { timeout: TIMEOUT.EXTRA_LONG }).click()
            cy.url({ timeout: TIMEOUT.EXTRA_LONG }).should('contain', 'dashboard')
        })
        const oldDateString = submissionBoxTime.getFullYear() + '/' + (submissionBoxTime.getMonth() + 1) + '/' + submissionBoxTime.getDate() + ' ' +

        cy.get(`[data-cy="${ fullSubmissionBoxTitle }"]`, { timeout: TIMEOUT.EXTRA_EXTRA_LONG }).click()

        cy.get('[data-cy="submissionBoxTitle"]', { timeout: TIMEOUT.EXTRA_LONG }).should('contain', fullSubmissionBoxTitle)
        cy.get('[data-cy="submissionBoxDate"]', { timeout: TIMEOUT.EXTRA_LONG }).should('contain', submissionBoxTime.toDateString().slice(4))
        cy.get('[data-cy="submissionBoxDesc"]', { timeout: TIMEOUT.EXTRA_LONG }).should('contain', submissionBoxDescription)

        cy.get('[data-cy="edit-icon"]').should('be.visible').click()
        cy.get('[data-cy="submissionBoxTitleEditing"]').should('be.visible').click()
        cy.get('[data-cy="submissionBoxTitleEditing"]').focused().should('have.value', fullSubmissionBoxTitle).clear().type(newTitle).should('have.value', newTitle)
        cy.get('[data-cy="submissionBoxDescEditing"]').should('be.visible').click()
        cy.get('[data-cy="submissionBoxDescEditing"]').focused().should('have.value', submissionBoxDescription).clear().type(newDescription).should('have.value', newDescription)
        cy.get('.data-cy-date-time-picker').should('be.visible').click()
        cy.get('.data-cy-date-time-picker').focused().should('contain', oldDateString).clear().type(newDescription).should('have.value', newDescription)
        cy.get('[data-cy="cancelButton"]').should('be.visible').click()

        cy.get('[data-cy="submissionBoxTitle"]').should('contain', fullSubmissionBoxTitle)
        cy.get('[data-cy="submissionBoxDesc"]').should('contain', new Date(submissionBoxTime).toDateString().slice(4))
    })
})
