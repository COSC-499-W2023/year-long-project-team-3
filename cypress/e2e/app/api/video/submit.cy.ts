import {RequestedSubmission} from '@prisma/client'

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

    it.only('should submit video to single box', () => {
        let submissionBoxId = null
        cy.task('getUserId', email).then((userId) => {
            cy.task<string>('createOneVideoAndRetrieveVideoId', { ownerId: userId, title: 'Hi Seth' }).then((videoId) => {
                cy.task<RequestedSubmission[]>('getRequestedSubmissions', email).then((requestedSubmissions) => {
                    submissionBoxId = requestedSubmissions[0]?.submissionBoxId

                    fetch('/api/video/submit/new', {
                        method: 'POST',
                        body: JSON.stringify({
                            videoId,
                            submissionBoxIds: [submissionBoxId],
                        }),
                    }).then((res) => {
                        expect(res.status).to.eq(201)
                    })
                })
            })
        })

        cy.visit('/dashboard')
        cy.get('[data-cy="video-list"]').children().first().click()

        cy.url().should('contain', '/video/')

        cy.get('div.MuiChip-root').should('have.length', 1)
    })

    it('should submit video to multiple boxes', () => {

    })

    it('should unsubmit to single box', () => {

    })

    it('should unsubmit video to multiple boxes', () => {

    })

    it('should fail when user doesn\'t own video', () => {

    })

    it('should fail when user isn\'t invited to box', () => {

    })
})
