import { TIMEOUT } from '../../../utils/constants'

describe('Dashboard requested submission badge count tests', () => {
    // User information
    const email = 'requested@badge.test'
    const password = 'Pass1234'
    beforeEach(() => {
        cy.task('clearDB')
        cy.task('createUser', { email, password })
        cy.visit('/login')
        cy.get('[data-cy=email]').type(email)
        cy.get('[data-cy=password]').type(password)
        cy.get('[data-cy=submit]').click()
        cy.url({ timeout: TIMEOUT.EXTRA_LONG }).should('not.contain', 'login')
        cy.reload()
        cy.visit('/dashboard')
    })

    it('should not have any badge when the user has no requested submissions', () => {
        // Wait for api fetch
        cy.wait(1000)
        cy.get('[data-cy=requested-badge]').should('exist').should('contain', '')
    })

    it('should increment count when the user has a submission not yet submitted to and decrement it after submission', () => {
        const submissionBoxTitle = 'Badge testing simulator'
        const videoTitle = 'Get rid of the badge'
        cy.task('getUserId', email).then((userId) => {
            cy.task('createRequestSubmissionForUser', {userId, submissionBoxTitle}).then((requestedSubmissionId) => {
                cy.reload()
                // wait for api fetch
                cy.wait(1000)
                cy.get('[data-cy=requested-badge]').should('be.visible').should('contain', '1')
                cy.task('createOneVideoAndRetrieveVideoId', {
                    title: videoTitle,
                }).then((videoId) => {
                    cy.task('submitVideoToSubmissionBox', {
                        requestedSubmissionId,
                        videoId,
                    }).then(() => {
                        cy.reload()
                        cy.get('[data-cy=requested-badge]').should('exist').should('contain', '')
                    })
                })
            })
        })
    })
})
