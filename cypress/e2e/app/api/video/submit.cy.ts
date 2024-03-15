import { RequestedSubmission, Video } from '@prisma/client'

describe('Test that the API can submit and unsubmit videos to submission boxes', () => {
    const email = 'testuser@harpvideo.ca'
    const password = 'Password1'

    beforeEach(() => {
        cy.task('clearDB')

        // Login
        cy.task('createUser', { email, password })
        cy.visit('/login')
        cy.get('input[name=email]').type(email)
        cy.get('input[name=password]').type(password)
        cy.get('button[type=submit]').click()
        cy.url().should('contain', 'dashboard')

        // Request user to a few submission boxes
        cy.task('getUserId', email).then((userId) => {
            cy.task('createRequestSubmissionForUser', { userId })
            cy.task('createRequestSubmissionForUser', { userId })
            cy.task('createRequestSubmissionForUser', { userId })
        })
    })

    context('Submit', () => {
        it('should submit video to single box', () => {
            cy.task('getUserId', email).then((userId) => {
                cy.task<string>('createOneVideoAndRetrieveVideoId', {
                    ownerId: userId,
                    title: 'Hi Seth',
                }).then((videoId) => {
                    cy.task<RequestedSubmission[]>('getRequestedSubmissions', email).then((requestedSubmissions) => {
                        const submissionBoxId = requestedSubmissions[0]?.submissionBoxId

                        fetch('/api/video/submit', {
                            method: 'POST',
                            body: JSON.stringify({
                                videoId,
                                submissionBoxIds: [submissionBoxId],
                            }),
                        }).then((res) => {
                            expect(res.ok).to.eq(true)
                        })
                    })
                })
            })

            cy.visit('/dashboard')
            cy.get('[data-cy="video-list"]').children().first().click()

            cy.url().should('contain', '/video/')

            cy.get('[data-cy="submission-box-chips-wrapper"]').find('div.MuiChip-root').should('have.length', 1)
        })

        it('should submit video to multiple boxes', () => {
            cy.task('getUserId', email).then((userId) => {
                cy.task<string>('createOneVideoAndRetrieveVideoId', {
                    ownerId: userId,
                    title: 'Hi Seth',
                }).then((videoId) => {
                    cy.task<RequestedSubmission[]>('getRequestedSubmissions', email).then((requestedSubmissions) => {
                        const submissionBoxIds = requestedSubmissions.map((requestedSubmission) => requestedSubmission.submissionBoxId)

                        fetch('/api/video/submit', {
                            method: 'POST',
                            body: JSON.stringify({
                                videoId,
                                submissionBoxIds,
                            }),
                        }).then((res) => {
                            expect(res.ok).to.eq(true)
                        })
                    })
                })
            })

            cy.visit('/dashboard')
            cy.get('[data-cy="video-list"]').children().first().click()

            cy.url().should('contain', '/video/')

            cy.get('[data-cy="submission-box-chips-wrapper"]').find('div.MuiChip-root').should('have.length', 3)
        })
    })

    context('Unsubmit', () => {
        beforeEach(() => {
            // Submit video to all three boxes
            cy.task('getUserId', email).then((userId) => {
                cy.task<string>('createOneVideoAndRetrieveVideoId', {
                    ownerId: userId,
                    title: 'Hi Seth',
                }).then((videoId) => {
                    cy.task<RequestedSubmission[]>('getRequestedSubmissions', email).then((requestedSubmissions) => {
                        const submissionBoxIds = requestedSubmissions.map((requestedSubmission) => requestedSubmission.submissionBoxId)

                        fetch('/api/video/submit', {
                            method: 'POST',
                            body: JSON.stringify({
                                videoId,
                                submissionBoxIds,
                            }),
                        }).then((res) => {
                            expect(res.ok).to.eq(true)
                        })
                    })
                })
            })
        })

        it('should unsubmit to single box', () => {
            cy.task<Video>('getLatestVideo').then((video) => {
                cy.task<RequestedSubmission[]>('getRequestedSubmissions', email).then((requestedSubmissions) => {
                    const submissionBoxId = requestedSubmissions[0]?.submissionBoxId

                    fetch('/api/video/submit', {
                        method: 'DELETE',
                        body: JSON.stringify({
                            videoId: video.id,
                            submissionBoxIds: [submissionBoxId],
                        }),
                    }).then((res) => {
                        expect(res.ok).to.eq(true)
                    })
                })
            })

            cy.visit('/dashboard')
            cy.get('[data-cy="video-list"]').children().first().click()

            cy.url().should('contain', '/video/')

            cy.get('[data-cy="submission-box-chips-wrapper"]').find('div.MuiChip-root').should('have.length', 2)
        })

        it('should unsubmit video to multiple boxes', () => {
            cy.task<Video>('getLatestVideo').then((video) => {
                cy.task<RequestedSubmission[]>('getRequestedSubmissions', email).then((requestedSubmissions) => {
                    const submissionBoxIds = requestedSubmissions.map((requestedSubmission) => requestedSubmission.submissionBoxId)

                    fetch('/api/video/submit', {
                        method: 'DELETE',
                        body: JSON.stringify({
                            videoId: video.id,
                            submissionBoxIds,
                        }),
                    }).then((res) => {
                        expect(res.ok).to.eq(true)
                    })
                })
            })

            cy.visit('/dashboard')
            cy.get('[data-cy="video-list"]').children().first().click()

            cy.url().should('contain', '/video/')

            cy.get('[data-cy="submission-box-chips-wrapper"]').find('div.MuiChip-root').should('have.length', 0)
        })
    })

    it('should fail when user doesn\'t own video', () => {
        cy.task<string>('createOneVideoAndRetrieveVideoId', {
            title: 'This ain\'t my video',
        }).then((videoId) => {
            cy.task<RequestedSubmission[]>('getRequestedSubmissions', email).then((requestedSubmissions) => {
                const submissionBoxIds = requestedSubmissions.map((requestedSubmission) => requestedSubmission.submissionBoxId)

                fetch('/api/video/submit', {
                    method: 'POST',
                    body: JSON.stringify({
                        videoId,
                        submissionBoxIds,
                    }),
                }).then((res) => {
                    expect(res.ok).to.eq(false)
                })
            })
        })

        // Check one of the boxes to see if the video was submitted
        cy.visit('/dashboard')
        cy.get('[data-cy="My Invitations"]')
        cy.wait(1000)
        cy.get('[data-cy="My Invitations"]').click()

        cy.get('li').first().should('be.visible')
        cy.wait(1000)
        cy.get('li').first().click()
        cy.url().should('contain', '/submission-box/')

        cy.get('[data-cy="select-video-for-submission"]').should('exist').and('be.visible')
    })

    it('should fail when user isn\'t invited to box', () => {
        cy.task('getUserId', email).then((userId) => {
            cy.task<string>('createOneVideoAndRetrieveVideoId', {
                ownerId: userId,
                title: 'Hi Seth',
            }).then((videoId) => {
                fetch('/api/video/submit', {
                    method: 'POST',
                    body: JSON.stringify({
                        videoId,
                        submissionBoxIds: ['fakeSubmissionBoxId'],
                    }),
                }).then((res) => {
                    expect(res.ok).to.eq(false)
                })
            })
        })

        // Check video to see if it was submitted
        cy.visit('/dashboard')
        cy.get('[data-cy="video-list"]').children().first().click()
        cy.url().should('contain', '/video/')
        cy.get('[data-cy="submission-box-chips-wrapper"]').find('div.MuiChip-root').should('have.length', 0)
    })
})
