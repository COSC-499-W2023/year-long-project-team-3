import { TIMEOUT } from '../../../../utils/constants'
import runWithRetry from '../../../../utils/runUntilExist'

describe('Receiving Dashboard Details Page Tests', () => {
    const email = 'requestedDetail@page.test'
    const fakeEmail = 'invalidUser@mail.com'
    const moreFakeEmail = 'wowsuchuser@person.com'
    const password = 'Pass1234'

    beforeEach(() => {
        cy.task('clearDB')
        // Can create the same user for each test, but need to create two separate submission boxes
        cy.task('createUser', { email, password })
        cy.task('createUser', { email: fakeEmail, password })
        cy.task('createUser', { email: moreFakeEmail, password })
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
            cy.get('[data-cy="Manage Boxes"]')
            cy.wait(1000)
            cy.get('[data-cy="Manage Boxes"]').click()

            cy.get(`[data-cy="${ submissionBoxTitle }"]`)
            cy.wait(1000)
            cy.get(`[data-cy="${ submissionBoxTitle }"]`).click()

            cy.get('[data-cy="no-video-text"]').should(
                'contain',
                'No Videos Have Been Submitted to Your Box'
            )
        })
        cy.get('[data-cy="submissionBoxTitle"]').should('contain', submissionBoxTitle)
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
                    })
                })
                cy.task('getUserId', moreFakeEmail).then((moreFakeUserId) => {
                    cy.task('createRequestedBoxForSubmissionBox', {
                        submissionBoxId: submissionBoxId,
                        userId: moreFakeUserId,
                    }).then((requestedSubmissionId) => {
                        cy.task('createOneVideoAndRetrieveVideoId', { title: videoTitle[1] }).then((videoId) => {
                            cy.task('submitVideoToSubmissionBox', {
                                requestedSubmissionId: requestedSubmissionId,
                                videoId,
                            })
                        })
                    })
                })
            })
        })

        runWithRetry(() => {
            cy.visit('/dashboard')
            cy.get('[data-cy="Manage Boxes"]')
            cy.wait(1000)
            cy.get('[data-cy="Manage Boxes"]').click()

            cy.get(`[data-cy="${ submissionBoxTitle }"]`)
            cy.wait(1000)  // Wait for it to be clickable
            cy.get(`[data-cy="${ submissionBoxTitle }"]`).click()

            cy.get('[data-cy="video-list"]')
                .should('be.visible')
                .children()
                .should('have.length', 2)
            cy.get('[data-cy="submissionBoxTitle"]').should('contain', submissionBoxTitle)
            cy.get('[data-cy="submissionBoxDate"]').should('contain', new Date().toDateString().slice(4))
            cy.get('[data-cy="submissionBoxDesc"]').should(
                'contain',
                'This is a description that describes what users need to submit and have in their videos.  The description is a good tool to make sure that participants in the submission box are able to determine what is needed in their submissions and the ability for them to hit their goals. :)'
            )
        })
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

        cy.visit('/dashboard')
        runWithRetry(() => {
            cy.get('[data-cy="Manage Boxes"]')
            cy.wait(1000)
            cy.get('[data-cy="Manage Boxes"]').click()

            cy.get(`[data-cy="${ submissionBoxTitle }"]`).click()
            cy.get('[data-cy="video-list"]')
                .should('be.visible')
                .children()
                .should('have.length', 1)
            cy.get('[data-cy="video-list"]').children().first().should('contain', videoTitle[1])
        })
    })

    it('should not allow a user to view a submission box that they do not have permission to', () => {
        const submissionBoxTitle = 'Test Invalid'
        cy.task('getUserId', email).then((userId) => {
            cy.task('createSubmissionBoxWithEmail', { submissionBoxTitle, email, userId })
        })

        runWithRetry(() => {
            cy.visit('/dashboard')
            cy.get('[data-cy="Manage Boxes"]')
            cy.wait(1000)
            cy.get('[data-cy="Manage Boxes"]').click()

            cy.get(`[data-cy="${ submissionBoxTitle }"]`)
                .should('be.visible')
                .should('not.be.disabled')
            cy.wait(1000)
            cy.get(`[data-cy="${ submissionBoxTitle }"]`).click()
            cy.url().should('contain', 'submission-box/')

            let slug: string | undefined = ''
            cy.url().then((url) => (slug = url.split('/').pop()))

            cy.get('[data-cy="header-profile"]').click({ force: true })
            cy.get('[data-cy="sign-out-button"]').click()
            cy.url().should('not.contain', 'submission-box')
            cy.reload()

            cy.visit('/login')
            cy.get('[data-cy=email]').type(fakeEmail)
            cy.get('[data-cy=password]').type(password)
            cy.get('[data-cy=submit]').click()
            cy.url().should('not.contain', 'login')

            cy.then(() => {
                cy.visit(`/submission-box/${ slug }`)
            })
            cy.wait(2000)  // Wait for redirect to finish
            cy.url().should('contain', 'dashboard')
        })
    })

    it('should allow user to go back to submission box after clicking video', () => {
        const videoTitle = 'Test video'
        const submissionBoxTitle = 'Test Box'

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
                        cy.task('createOneVideoAndRetrieveVideoId', { title: videoTitle }).then((videoId) => {
                            cy.task('submitVideoToSubmissionBox', {
                                requestedSubmissionId: requestedSubmissionId,
                                videoId,
                            })
                        })
                    })
                })
            })
        })

        // Go to dashboard to navigate to submission box
        cy.visit('/dashboard')
        runWithRetry(() => {
            cy.get('[data-cy="Manage Boxes"]')
            cy.wait(1000)
            cy.get('[data-cy="Manage Boxes"]').click()

            cy.get(`[data-cy="${ submissionBoxTitle }"]`)
            cy.wait(1000)  // Wait for card to become clickable
            cy.get(`[data-cy="${ submissionBoxTitle }"]`).click()

            // Click on video to go to video page
            cy.wait(1000)  // Wait for page to fully load
            cy.get('[data-cy="video-list"]').children().first().should('contain', videoTitle)
            cy.wait(1000)
            cy.get('[data-cy="video-list"]').children().first().click()
            cy.url().should('contain', 'video')
        })

        // Go back to submission box
        cy.wait(1000)  // Wait for page to fully load
        cy.get('[data-cy="back-button"]').should('exist').and('be.visible')
        cy.wait(1000)
        cy.get('[data-cy="back-button"]').should('exist').and('be.visible').click()
        cy.url({ timeout: TIMEOUT.EXTRA_LONG }).should('contain', 'submission-box')
    })

    // Submission Box information
    const submissionBoxTitle1 = 'Test Viewing With Members'
    const submissionBoxTitle2 = 'Test Viewing Without Members'
    const submissionBoxDescription = 'Description'
    const submissionBoxTime = new Date('December 17, 2045 03:24:00')
    const invitedEmail = 'invited@member.email'

    it('Should allow the user to view members if there are members', () => {
        cy.task('getUserId', email).then((userId) => {
            cy.task('createSubmissionBoxWithEmail', { submissionBoxTitle: submissionBoxTitle1, email: invitedEmail, userId, submissionBoxDescription})
            cy.task('createSubmissionBoxForSubmissions', { submissionBoxTitle: submissionBoxTitle2, submissionBoxDescription, userId, closesAt: submissionBoxTime })
        })
        cy.reload()
        cy.visit('/dashboard')

        cy.get('[data-cy="Manage Boxes"]')
        cy.wait(1000)
        cy.get('[data-cy="Manage Boxes"]').click()

        cy.get(`[data-cy="${ submissionBoxTitle1 }"]`)
        cy.wait(1000)   // Waiting for it to be clickable
        cy.get(`[data-cy="${ submissionBoxTitle1 }"]`).click()

        cy.get('[data-cy="submissionBoxMembersHeading"]').should('be.visible')

        cy.get('[data-cy="submissionBoxMembers"]').should('contain', invitedEmail)
    })

    it('Should not display members if there aren\'t any', () => {
        cy.task('getUserId', email).then((userId) => {
            cy.task('createSubmissionBoxWithEmail', { submissionBoxTitle: submissionBoxTitle1, email: invitedEmail, userId, submissionBoxDescription})
            cy.task('createSubmissionBoxForSubmissions', { submissionBoxTitle: submissionBoxTitle2, submissionBoxDescription, userId, closesAt: submissionBoxTime })
        })
        cy.reload()
        cy.visit('/dashboard')

        cy.get('[data-cy="Manage Boxes"]')
        cy.wait(1000)
        cy.get('[data-cy="Manage Boxes"]').click()

        cy.get(`[data-cy="${ submissionBoxTitle2 }"]`)
        cy.wait(1000)   // Waiting for it to be clickable
        cy.get(`[data-cy="${ submissionBoxTitle2 }"]`).click()

        cy.get('[data-cy="submissionBoxMembersHeading"]').should('not.exist')

        cy.get('[data-cy="submissionBoxMembers"]').should('not.exist')
    })
})
