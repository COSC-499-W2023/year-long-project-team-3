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

    it('should display a submission box with no information inputted other than title', () => {
        const submissionBoxTitle = 'Test Recieving'
        cy.task('getUserId', email).then((userId) => {
            cy.task('createSubmissionBoxWithEmail', { submissionBoxTitle, email, userId })
        })

        cy.visit('/dashboard')
        runWithRetry(() => {
            cy.get('[data-cy="My Boxes"]', { timeout: TIMEOUT.EXTRA_LONG }).click()
            cy.url({ timeout: TIMEOUT.EXTRA_LONG }).should('contain', 'dashboard')
        })
        cy.get(`[data-cy="${ submissionBoxTitle }"]`, { timeout: TIMEOUT.EXTRA_EXTRA_LONG }).click()

        cy.get('[data-cy="no-video-text"]', { timeout: TIMEOUT.EXTRA_LONG }).should(
            'contain',
            'You Do Not Have Any Videos'
        )
        cy.get('[data-cy="submissionBoxTitle"]', { timeout: TIMEOUT.EXTRA_LONG }).should('contain', submissionBoxTitle)
        cy.get('[data-cy="submissionBoxDate"]', { timeout: TIMEOUT.EXTRA_LONG }).should('contain', 'N/A')
        cy.get('[data-cy="submissionBoxDesc"]', { timeout: TIMEOUT.EXTRA_LONG }).should('contain', 'N/A')
    })

    it('should display a submission box with all information inputted and videos', () => {
        const submissionBoxTitle = 'Test Recieving with Data'
        const submissionBoxDescription =
            'This is a description that describes what users need to submit and have in their videos.  The description is a good tool to make sure that participants in the submission box are able to determine what is needed in their submissions and the ability for them to hit their goals. :)'
        const videoTitle = ['Test video1', 'Test video2']
        cy.task('getUserId', email).then((userId) => {
            cy.task('createSubmissionBoxWithEmail', {
                submissionBoxTitle,
                email,
                userId,
                submissionBoxDescription,
            }).then((submissionBoxId) => {
                cy.task('createOneVideoAndRetrieveVideoId', { title: videoTitle[0] }).then((videoId) => {
                    cy.task('submitVideoToSubmissionBox', { requestedSubmissionId: submissionBoxId, videoId })
                })
                cy.task('createOneVideoAndRetrieveVideoId', { title: videoTitle[1] }).then((videoId) => {
                    cy.task('submitVideoToSubmissionBox', { requestedSubmissionId: submissionBoxId, videoId })
                })
            })
        })

        cy.visit('/dashboard')
        runWithRetry(() => {
            cy.get('[data-cy="My Boxes"]', { timeout: TIMEOUT.EXTRA_LONG }).click()
            cy.url({ timeout: TIMEOUT.EXTRA_LONG }).should('contain', 'dashboard')
        })
        cy.get(`[data-cy="${ submissionBoxTitle }"]`, { timeout: TIMEOUT.EXTRA_EXTRA_LONG }).click()

        cy.get('[data-cy="video-list"]', { timeout: TIMEOUT.EXTRA_LONG })
            .should('be.visible')
            .children()
            .should('have.length', 2)

        cy.get('[data-cy="submissionBoxTitle"]', { timeout: TIMEOUT.EXTRA_LONG }).should('contain', submissionBoxTitle)
        cy.get('[data-cy="submissionBoxDate"]', { timeout: TIMEOUT.EXTRA_LONG }).should('contain', 'N/A')
        cy.get('[data-cy="submissionBoxDesc"]', { timeout: TIMEOUT.EXTRA_LONG }).should(
            'contain',
            'This is a description that describes what users need to submit and have in their videos.  The description is a good tool to make sure that participants in the submission box are able to determine what is needed in their submissions and the ability for them to hit their goals. :)'
        )
    })
})
