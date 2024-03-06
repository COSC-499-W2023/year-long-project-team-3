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

    it.only('should display a submission box with no information inputted other than title and no video', () => {
        const submissionBoxTitle = 'Test Requested'

        cy.task('getUserId', email).then((userId) => {
            cy.task('createRequestSubmissionForUser', { userId, submissionBoxTitle }).then(() => {
                runWithRetry(() => {
                    cy.visit('/dashboard')

                    cy.get('[data-cy="My Invitations"]')
                    cy.wait(1000)
                    cy.get('[data-cy="My Invitations"]').click()

                    cy.get(`[data-cy="${ submissionBoxTitle }"]`)
                    cy.wait(1000)  // Wait for card to be clickable
                    cy.get(`[data-cy="${ submissionBoxTitle }"]`).click()
                    cy.url().should('contain', 'submission-box')

                    // Assert no submission message and submission box title
                    cy.get('[data-cy="noSubmission"]')
                        .should('be.visible')
                        .and('contain', 'No Current Submission')
                    cy.get('[data-cy="submissionBoxTitle"]')
                        .should('contain', submissionBoxTitle)
                })
            })
        })
    })


    it.only('should display a submission box with all information inputted and current submitted video', () => {
        const submissionBoxTitle = 'Test Requested with Data'
        const submissionBoxDescription =
          'This is a description that describes what users need to submit and have in their videos.  The description is a good tool to make sure that participants in the submission box are able to determine what is needed in their submissions and the ability for them to hit their goals. :)'
        const videoTitle = 'Test video'

        cy.task('getUserId', placeEmail).then((userId) => {
            cy.task('createSubmissionBoxForSubmissions', {
                userId,
                submissionBoxTitle,
                submissionBoxDescription,
                closesAt: new Date(),
            }).then((submissionBoxId) => {
                cy.task('getUserId', email).then((userId) => {
                    cy.task('createRequestedBoxForSubmissionBox', {
                        submissionBoxId,
                        userId,
                    }).then((submissionBoxId) => {
                        cy.task('createOneVideoAndRetrieveVideoId', {
                            title: videoTitle,
                        }).then((videoId) => {
                            cy.task('submitVideoToSubmissionBox', {
                                requestedSubmissionId: submissionBoxId,
                                videoId,
                            }).then(() => {
                                cy.reload()
                                cy.visit('/dashboard')
                                cy.get('[data-cy="My Invitations"]')
                                cy.wait(1000)
                                cy.get('[data-cy="My Invitations"]').click()

                                cy.get(`[data-cy="${ submissionBoxTitle }"]`)
                                cy.wait(1000)
                                cy.get(`[data-cy="${ submissionBoxTitle }"]`).click()
                                cy.url().should('contain', 'submission-box')

                                // Assert submission box information
                                cy.get('[data-cy="submissionBoxTitle"]').should('contain', submissionBoxTitle)
                                cy.get('[data-cy="submissionBoxDate"]').should('contain', new Date().toDateString().slice(4))
                                cy.get('[data-cy="submissionBoxDesc"]').should('contain', submissionBoxDescription)

                                // Assert video player is visible
                                cy.get('[data-cy="video-player"]', {
                                    timeout: 2 * TIMEOUT.EXTRA_EXTRA_LONG,
                                }).should('be.visible')
                            })
                        })
                    })
                })
            })
        })
    })


    it('should direct users to the video submission page when the submission button is clicked', () => {
        const submissionBoxTitle = 'Test Requested with Data'
        const submissionBoxDescription =
          'This is a description that describes what users need to submit and have in their videos.  The description is a good tool to make sure that participants in the submission box are able to determine what is needed in their submissions and the ability for them to hit their goals. :)'

        cy.task('getUserId', email).then((userId) => {
            cy.task('createRequestSubmissionForUser', { userId, submissionBoxTitle, submissionBoxDescription }).then(() => {
                cy.visit('/dashboard')

                cy.get('[data-cy="My Invitations"]')
                cy.wait(1000)
                cy.get('[data-cy="My Invitations"]').click()

                runWithRetry(() => {
                    cy.get(`[data-cy="${ submissionBoxTitle }"]`)
                    cy.wait(1000)
                    cy.get(`[data-cy="${ submissionBoxTitle }"]`).click()

                    // Assert redirection to submission box page
                    cy.url({ timeout: TIMEOUT.EXTRA_LONG }).should('contain', 'submission-box')

                    // Click submission button
                    // Assert redirection to upload page
                    cy.get('[data-cy="submissionButton"]').should('be.visible')
                    cy.wait(1000)
                    cy.get('[data-cy="submissionButton"]').should('be.visible').click()

                    cy.url().should('contain', 'upload')
                })
            })
        })
    })
})
