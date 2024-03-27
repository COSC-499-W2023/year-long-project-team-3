import { TIMEOUT } from '../../../../utils/constants'
import runWithRetry from '../../../../utils/runUntilExist'
import { SubmissionBox } from '@prisma/client'

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
                    cy.get('[data-cy="select-video-for-submission"]')
                        .should('exist')
                        .and('be.visible')
                    cy.get('[data-cy="submissionBoxTitle"]')
                        .should('contain', submissionBoxTitle)
                })
            })
        })
    })


    it('should display a submission box with all information inputted and current submitted video', () => {
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

                                // Assert that member information is not visible on box user was invited to (should only be visible on owned boxes)
                                cy.get('[data-cy="submissionBoxMembersHeading"]').should('not.exist')
                                cy.get('[data-cy="submissionBoxMembers"]').should('not.exist')

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
                    cy.get('[data-cy="upload-new-submission"]').should('be.visible')
                    cy.wait(1000)
                    cy.get('[data-cy="upload-new-submission"]').should('be.visible').click()

                    cy.url().should('contain', 'upload')
                })
            })
        })
    })

    it('should allow user to select existing video', ()=> {
        const submissionBoxTitle = 'very exciting submission box'
        const videoTitle = 'Such video'

        cy.task('getUserId', email).then((userId) => {
            cy.task('createOneVideoAndRetrieveVideoId', { ownerId: userId, title: videoTitle })
            cy.task('createRequestSubmissionForUser', { userId, submissionBoxTitle }).then(() => {
                cy.visit('/dashboard')

                cy.get('[data-cy="My Invitations"]')
                cy.wait(1000)
                cy.get('[data-cy="My Invitations"]').click()

                runWithRetry(() => {
                    cy.get(`[data-cy="${ submissionBoxTitle }"]`)
                    cy.wait(1000)
                    cy.get(`[data-cy="${ submissionBoxTitle }"]`).click()

                    // Assert redirection to submission box page
                    cy.url().should('contain', 'submission-box')

                    // Click 'Choose existing video' button
                    cy.get('[data-cy="submit-existing"]').should('be.visible')
                    cy.wait(1000)
                    cy.get('[data-cy="submit-existing"]').should('be.visible').click()

                    // Submit video
                    cy.get('[data-cy="video-list"]').children().first().should('be.visible')
                    cy.wait(1000)
                    cy.get('[data-cy="video-list"]').children().first().should('be.visible').click()

                    // Confirm submission
                    cy.get('button').last().should('have.text', 'Yes')
                    cy.wait(1000)
                    cy.get('button').last().should('have.text', 'Yes').click()

                    // Check that it is submitted
                    cy.get('[data-cy="select-video-for-submission"]').should('not.exist')
                    cy.get('[data-cy="video-player"]').should('exist').and('be.visible')
                })
            })
        })
    })

    it('should allow user to unsubmit a video', () => {
        const submissionBoxTitle = 'very exciting submission box'
        const videoTitle = 'Such video'

        cy.task('getUserId', email).then((userId) => {
            cy.task('createOneVideoAndRetrieveVideoId', {ownerId: userId, title: videoTitle}).then((videoId) => {
                cy.task('createRequestSubmissionForUser', {userId, submissionBoxTitle}).then((requestedSubmissionId) => {
                    cy.task('submitVideoToSubmissionBox', { videoId, requestedSubmissionId })
                })
            })
        })

        cy.visit('/dashboard?tab=my-invitations')

        cy.get('[data-cy="My Invitations"]')
        cy.wait(1000)
        cy.get('[data-cy="My Invitations"]').click()

        cy.get(`[data-cy="${ submissionBoxTitle }"]`)
        cy.wait(1000)
        cy.get(`[data-cy="${ submissionBoxTitle }"]`).click()

        cy.get('[data-cy="unsubmit-button"]').should('be.visible')
        cy.wait(1000)
        cy.get('[data-cy="unsubmit-button"]').should('be.visible').click()
        cy.get('button').last().should('be.visible').and('have.text', 'Yes').click()

        cy.get('[data-cy="select-video-for-submission"]').should('be.visible')
    })

    it('shouldn\'t allow user to submit a video if the submission box is closed', () => {
        const submissionBoxTitle = 'very exciting submission box'

        cy.task('getUserId', email).then((userId) => {
            cy.task('createRequestSubmissionForUser', {userId, submissionBoxTitle, closeDate: new Date('2003-12-13')})
        })
        cy.wait(1000)  // Wait for submission box to be created
        cy.task<SubmissionBox[]>('getSubmissionBoxes').then((submissionBoxes) => {
            cy.visit(`/submission-box/${ submissionBoxes[0].id }`)
        })

        cy.url().should('contain', 'submission-box')

        cy.get('[data-cy="videoHolder"]').should('contain.text', 'Sorry, this submission box closed')
    })
})
