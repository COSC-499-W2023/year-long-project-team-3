import { TIMEOUT } from '../../../../utils/constants'
import runWithRetry from '../../../../utils/runUntilExist'

describe('Requested Dashboard Details Page Tests', () => {
    const email = 'requestedDetail@page.test'
    const placeEmail = 'placeHolderUser@mail.com'
    const password = 'Pass1234'
    beforeEach(() => {
        cy.task('clearDB')
        // Can create the same user for each test, but need to create two separate submission boxes
        cy.task('createUser', { email, password })
        cy.task('createUser', { email: placeEmail, password })
        cy.visit('/login')
        cy.get('[data-cy=email]').type(email)
        cy.get('[data-cy=password]').type(password)
        cy.get('[data-cy=submit]').click()
        cy.url({ timeout: TIMEOUT.EXTRA_LONG }).should('not.contain', 'login')
    })

    it('should display a submission box with no information inputted other than title and no video', () => {
        const submissionBoxTitle = 'Test Requested'
        cy.task('getUserId', email).then((userId) => {
            cy.task('createRequestSubmissionForUser', { userId, submissionBoxTitle })
        })
        cy.reload()
        cy.visit('/dashboard')
        runWithRetry(() => {
            cy.get('[data-cy="My Invitations"]', { timeout: TIMEOUT.EXTRA_LONG }).click()
            cy.url({ timeout: TIMEOUT.EXTRA_LONG }).should('contain', 'dashboard')
        })
        cy.get(`[data-cy="${ submissionBoxTitle }"]`, { timeout: TIMEOUT.EXTRA_EXTRA_LONG }).wait(1000).click()

        cy.get('[data-cy="noSubmission"]', { timeout: TIMEOUT.EXTRA_LONG })
            .should('be.visible')
            .and('contain', 'No Current Submission')
        cy.get('[data-cy="submissionBoxTitle"]', { timeout: TIMEOUT.EXTRA_LONG }).should('contain', submissionBoxTitle)
    })

    it('should display a submission box with all information inputted and current submitted video', () => {
        const submissionBoxTitle = 'Test Requested with Data'
        const submissionBoxDescription =
            'This is a description that describes what users need to submit and have in their videos.  The description is a good tool to make sure that participants in the submission box are able to determine what is needed in their submissions and the ability for them to hit their goals. :)'
        const videoTitle = 'Test video'
        cy.task('getUserId', placeEmail)
            .then((userId) => {
                cy.task('createSubmissionBoxForSubmissions', { userId, submissionBoxTitle, submissionBoxDescription, closesAt: new Date })
            })
            .then((submissionBoxId) => {
                cy.task('getUserId', email).then((userId) => {
                    cy.task('createRequestedBoxForSubmissionBox', { submissionBoxId, userId }).then((submissionBoxId) => {
                        cy.task('createOneVideoAndRetrieveVideoId', { title: videoTitle }).then((videoId) => {
                            cy.task('submitVideoToSubmissionBox', { requestedSubmissionId: submissionBoxId, videoId,
                            })
                        })
                    })

                })
            })

        cy.reload()
        cy.visit('/dashboard')
        runWithRetry(() => {
            cy.get('[data-cy="My Invitations"]', { timeout: TIMEOUT.EXTRA_LONG }).click()
            cy.url({ timeout: TIMEOUT.EXTRA_LONG }).should('contain', 'dashboard')
        })
        cy.get(`[data-cy="${ submissionBoxTitle }"]`, { timeout: TIMEOUT.EXTRA_EXTRA_LONG }).wait(1000).click()

        cy.get('[data-cy="video-player"]', { timeout: 2 * TIMEOUT.EXTRA_EXTRA_LONG }).should('be.visible')

        cy.get('[data-cy="submissionBoxTitle"]', { timeout: TIMEOUT.EXTRA_LONG }).should('contain', submissionBoxTitle)
        cy.get('[data-cy="submissionBoxDate"]', { timeout: TIMEOUT.EXTRA_LONG }).should('contain', new Date().toDateString().slice(4))
        cy.get('[data-cy="submissionBoxDesc"]', { timeout: TIMEOUT.EXTRA_LONG }).should(
            'contain',
            submissionBoxDescription
        )
    })

    it('should should direct users to the video submission page when the submission button is clicked', () => {
        const submissionBoxTitle = 'Test Requested with Data'
        const submissionBoxDescription =
            'This is a description that describes what users need to submit and have in their videos.  The description is a good tool to make sure that participants in the submission box are able to determine what is needed in their submissions and the ability for them to hit their goals. :)'
        cy.task('getUserId', email).then((userId) => {
            cy.task('createRequestSubmissionForUser', { userId, submissionBoxTitle, submissionBoxDescription })
        })

        cy.reload()
        cy.visit('/dashboard')
        runWithRetry(() => {
            cy.get('[data-cy="My Invitations"]', { timeout: TIMEOUT.EXTRA_LONG }).click()
            cy.url({ timeout: TIMEOUT.EXTRA_LONG }).should('contain', 'dashboard')
        })
        cy.get(`[data-cy="${ submissionBoxTitle }"]`, { timeout: TIMEOUT.EXTRA_EXTRA_LONG }).wait(1000).click()

        cy.url({ timeout: TIMEOUT.EXTRA_LONG }).should('contain', 'submission-box')
        cy.get('[data-cy="submissionButton"]', { timeout: TIMEOUT.EXTRA_LONG }).should('be.visible').click()
        cy.url({ timeout: TIMEOUT.EXTRA_LONG }).should('contain', 'upload')
    })
})
