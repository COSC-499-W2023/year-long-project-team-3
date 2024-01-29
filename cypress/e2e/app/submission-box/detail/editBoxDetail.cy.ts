import { TIMEOUT } from '../../../../utils/constants'
import runWithRetry from '../../../../utils/runUntilExist'

describe('Recieving Dashboard Details Page Tests', () => {
    const email = 'requestedDetail@page.test'
    const password = 'Pass1234'
    beforeEach(() => {
        cy.task('clearDB')
        // Can create the same user for each test, but need to create two separate submission boxes
        cy.task('createUser', { email, password })
        cy.visit('/login')
        cy.get('[data-cy=email]').type(email)
        cy.get('[data-cy=password]').type(password)
        cy.get('[data-cy=submit]').click()
        cy.url({ timeout: TIMEOUT.EXTRA_LONG }).should('not.contain', 'login')
    })

    it('should display a submission box and be able to change it\'s information', () => {
        const submissionBoxTitle = 'Test Modification'
        cy.task('getUserId', email).then((userId) => {
            cy.task('createSubmissionBoxWithEmail', { submissionBoxTitle, email, userId })
        })
        cy.reload()
        cy.visit('/dashboard')
        runWithRetry(() => {
            cy.get('[data-cy="My Boxes"]', { timeout: TIMEOUT.EXTRA_LONG }).click()
            cy.url({ timeout: TIMEOUT.EXTRA_LONG }).should('contain', 'dashboard')
        })
        cy.get(`[data-cy="${ submissionBoxTitle }"]`, { timeout: TIMEOUT.EXTRA_EXTRA_LONG }).click()

        cy.get('[data-cy="submissionBoxTitle"]', { timeout: TIMEOUT.EXTRA_LONG }).should('contain', submissionBoxTitle)
        cy.get('[data-cy="submissionBoxDate"]', { timeout: TIMEOUT.EXTRA_LONG }).should('contain', 'N/A')
        cy.get('[data-cy="submissionBoxDesc"]', { timeout: TIMEOUT.EXTRA_LONG }).should('contain', 'N/A')

        cy.get('[data-cy="edit-icon"]').should('be.visible').click()
        cy.get('[data-cy="submissionBoxTitleEdit"]').should('be.visible').click()

        const newTitle = 'A new title for the submission box'
        const newDescription = 'A new description for the submission box.'
        cy.get('[data-cy="submissionBoxTitleEdit"]').should('have.value', submissionBoxTitle).clear().type(newTitle)
        cy.get('[data-cy="submissionBoxDescEdit"]').should('have.value', '').type(newDescription)
        cy.get('[data-cy="updateButton"]').should('be.visible').click()

        cy.get('[data-cy="submissionBoxTitle"]').should('contain', newTitle)
        cy.get('[data-cy="submissionBoxDesc"]').should('contain', newDescription)
    })

    it('should display a submission box, start to change it\'s information, cancel the operation and revert the title and description to the original', () => {
        const submissionBoxTitle = 'Test Modification'
        cy.task('getUserId', email).then((userId) => {
            cy.task('createSubmissionBoxWithEmail', { submissionBoxTitle, email, userId })
        })
        cy.reload()
        cy.visit('/dashboard')
        runWithRetry(() => {
            cy.get('[data-cy="My Boxes"]', { timeout: TIMEOUT.EXTRA_LONG }).click()
            cy.url({ timeout: TIMEOUT.EXTRA_LONG }).should('contain', 'dashboard')
        })
        cy.get(`[data-cy="${ submissionBoxTitle }"]`, { timeout: TIMEOUT.EXTRA_EXTRA_LONG }).click()

        cy.get('[data-cy="submissionBoxTitle"]', { timeout: TIMEOUT.EXTRA_LONG }).should('contain', submissionBoxTitle)
        cy.get('[data-cy="submissionBoxDate"]', { timeout: TIMEOUT.EXTRA_LONG }).should('contain', 'N/A')
        cy.get('[data-cy="submissionBoxDesc"]', { timeout: TIMEOUT.EXTRA_LONG }).should('contain', 'N/A')

        cy.get('[data-cy="edit-icon"]').should('be.visible').click()
        cy.get('[data-cy="submissionBoxTitleEdit"]').should('be.visible').click()

        const newTitle = 'A new title for the submission box'
        const newDescription = 'A new description for the submission box.'
        cy.get('[data-cy="submissionBoxTitleEdit"]').should('have.value', submissionBoxTitle).clear().type(newTitle).should('have.value', newTitle)
        cy.get('[data-cy="submissionBoxDescEdit"]').should('have.value', '').type(newDescription).should('have.value', newDescription)
        cy.get('[data-cy="cancelButton"]').should('be.visible').click()

        cy.get('[data-cy="submissionBoxTitle"]').should('contain', submissionBoxTitle)
        cy.get('[data-cy="submissionBoxDesc"]').should('contain', 'N/A')
    })
})
