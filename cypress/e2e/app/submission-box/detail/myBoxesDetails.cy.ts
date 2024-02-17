import { TIMEOUT } from '../../../../utils/constants'
import runWithRetry from '../../../../utils/runUntilExist'

describe('Receiving Dashboard Details Page Tests', () => {
    const email = 'requestedDetail@page.test'
    const fakeEmail = 'invalidUser@mail.com'
    const password = 'Pass1234'
    beforeEach(() => {
        cy.task('clearDB')
        // Can create the same user for each test, but need to create two separate submission boxes
        cy.task('createUser', { email, password })
        cy.task('createUser', { email: fakeEmail, password })
        cy.visit('/login')
        cy.get('[data-cy=email]').type(email)
        cy.get('[data-cy=password]').type(password)
        cy.get('[data-cy=submit]').click()
        cy.url({ timeout: TIMEOUT.EXTRA_LONG }).should('not.contain', 'login')
    })

    it('should display a submission box with no information inputted other than title', () => {
        const submissionBoxTitle = 'Test Receiving'
        cy.task('getUserId', email).then((userId) => {
            cy.task('createSubmissionBoxForSubmissions', { submissionBoxTitle, userId })
        })
        cy.reload()
        cy.visit('/dashboard')
        runWithRetry(() => {
            cy.get('[data-cy="Manage Boxes"]', { timeout: TIMEOUT.EXTRA_LONG }).click()
            cy.url({ timeout: TIMEOUT.EXTRA_LONG }).should('contain', 'dashboard')
        })
        cy.get(`[data-cy="${ submissionBoxTitle }"]`, { timeout: TIMEOUT.EXTRA_EXTRA_LONG }).click()

        cy.get('[data-cy="no-video-text"]', { timeout: TIMEOUT.EXTRA_LONG }).should(
            'contain',
            'No Videos Have Been Submitted to Your Box'
        )
        cy.get('[data-cy="submissionBoxTitle"]', { timeout: TIMEOUT.EXTRA_LONG }).should('contain', submissionBoxTitle)
    })

    it('should display a submission box with all information inputted and videos', () => {
        const submissionBoxTitle = 'Test Receiving with Data'
        const submissionBoxDescription =
            'This is a description that describes what users need to submit and have in their videos.  The description is a good tool to make sure that participants in the submission box are able to determine what is needed in their submissions and the ability for them to hit their goals. :)'
        const videoTitle = ['Test video1', 'Test video2']
        cy.task('getUserId', email).then((userId) => {
            cy.task('createSubmissionBoxForSubmissions', {
                submissionBoxTitle,
                userId,
                submissionBoxDescription,
                closesAt: new Date,
            }).then((submissionBoxId) => {
                cy.task('createRequestedBoxForSubmissionBox', {
                    submissionBoxId: submissionBoxId,
                    email: fakeEmail,
                }).then((requestedSubmissionId) => {
                    cy.task('createOneVideoAndRetrieveVideoId', { title: videoTitle[0] }).then((videoId) => {
                        cy.task('submitVideoToSubmissionBox', {
                            requestedSubmissionId: requestedSubmissionId,
                            videoId,
                        })
                    })
                })
                cy.task('createRequestedBoxForSubmissionBox', {submissionBoxId: submissionBoxId, email: 'other@fake.email'}).then((requestedSubmissionId) => {
                    cy.task('createOneVideoAndRetrieveVideoId', { title: videoTitle[1] }).then((videoId) => {
                        cy.task('submitVideoToSubmissionBox', { requestedSubmissionId: requestedSubmissionId, videoId })
                    })
                })
            })
        })
        cy.reload()
        cy.visit('/dashboard')
        runWithRetry(() => {
            cy.get('[data-cy="Manage Boxes"]', { timeout: TIMEOUT.EXTRA_LONG }).click()
            cy.url({ timeout: TIMEOUT.EXTRA_LONG }).should('contain', 'dashboard')
        })
        cy.get(`[data-cy="${ submissionBoxTitle }"]`, { timeout: TIMEOUT.EXTRA_EXTRA_LONG }).click()

        cy.get('[data-cy="video-list"]', { timeout: TIMEOUT.EXTRA_LONG })
            .should('be.visible')
            .children()
            .should('have.length', 2)

        cy.get('[data-cy="submissionBoxTitle"]', { timeout: TIMEOUT.EXTRA_LONG }).should('contain', submissionBoxTitle)
        cy.get('[data-cy="submissionBoxDate"]', { timeout: TIMEOUT.EXTRA_LONG }).should('contain', new Date().toDateString().slice(4))
        cy.get('[data-cy="submissionBoxDesc"]', { timeout: TIMEOUT.EXTRA_LONG }).should(
            'contain',
            'This is a description that describes what users need to submit and have in their videos.  The description is a good tool to make sure that participants in the submission box are able to determine what is needed in their submissions and the ability for them to hit their goals. :)'
        )
    })

    it('should only show the most recently submitted video that a user has submitted',() => {
        const submissionBoxTitle = 'Test Multiple Submissions'
        const videoTitle = ['Test video1', 'Test video2']

        cy.task('getUserId', email).then((userId) => {
            cy.task('createSubmissionBoxForSubmissions', {
                submissionBoxTitle,
                userId,
            }).then((submissionBoxId) => {
                cy.task('getUserId', fakeEmail).then((fakeUserId) => {
                    cy.task('createRequestedBoxForSubmissionBox', {
                        submissionBoxId: submissionBoxId,
                        userId: fakeUserId,
                    }).then((requestedSubmissionId) => {
                        cy.task('createOneVideoAndRetrieveVideoId', { title: videoTitle[0] }).then((videoId) => {
                            cy.task('submitVideoToSubmissionBox', {
                                requestedSubmissionId: requestedSubmissionId,
                                videoId,
                            })
                        })
                        cy.task('createOneVideoAndRetrieveVideoId', { title: videoTitle[1] }).then((videoId) => {
                            cy.task('submitVideoToSubmissionBox', { requestedSubmissionId: requestedSubmissionId, videoId })
                        })
                    })
                })
            })
        })
        cy.reload()
        cy.visit('/dashboard')
        runWithRetry(() => {
            cy.get('[data-cy="Manage Boxes"]', { timeout: TIMEOUT.EXTRA_LONG }).click()
            cy.url({ timeout: TIMEOUT.EXTRA_LONG }).should('contain', 'dashboard')
        })
        cy.get(`[data-cy="${ submissionBoxTitle }"]`, { timeout: TIMEOUT.EXTRA_EXTRA_LONG }).click()

        cy.get('[data-cy="video-list"]', { timeout: TIMEOUT.EXTRA_LONG })
            .should('be.visible')
            .children()
            .should('have.length', 1)
        cy.get('[data-cy="video-list"]').children().first().should('contain', videoTitle[1])
    })

    it('should not allow a user to view a submission box that they do not have permission to', () => {
        const submissionBoxTitle = 'Test Invalid'
        cy.task('getUserId', email).then((userId) => {
            cy.task('createSubmissionBoxWithEmail', { submissionBoxTitle, email, userId })
        })
        cy.reload()
        cy.visit('/dashboard')
        runWithRetry(() => {
            cy.get('[data-cy="Manage Boxes"]', { timeout: TIMEOUT.EXTRA_LONG }).click()
            cy.url({ timeout: TIMEOUT.EXTRA_LONG }).should('contain', 'dashboard')
        })
        cy.get(`[data-cy="${ submissionBoxTitle }"]`, { timeout: TIMEOUT.EXTRA_EXTRA_LONG }).click()

        let slug: string | undefined = ''
        cy.url().then((url) => (slug = url.split('/').pop()))

        cy.get('[data-cy="sign-out-button"]').click()
        cy.reload()

        cy.visit('/login')
        cy.get('[data-cy=email]').type(fakeEmail)
        cy.get('[data-cy=password]').type(password)
        cy.get('[data-cy=submit]').click()
        cy.url({ timeout: TIMEOUT.EXTRA_LONG }).should('not.contain', 'login')

        cy.then(() => {
            cy.visit(`/submission-box/${ slug }`)
        })
        cy.url({ timeout: TIMEOUT.EXTRA_LONG }).should('contain', 'submission-box')
        cy.url({ timeout: TIMEOUT.EXTRA_LONG }).should('contain', 'dashboard')
    })
})
