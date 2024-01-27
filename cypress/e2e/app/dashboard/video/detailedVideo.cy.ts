import { v4 as uuidv4 } from 'uuid'
import { TIMEOUT } from '../../../../utils/constants'

describe('Detail video page', () => {
    let email: string

    beforeEach(() => {
        cy.task('clearDB')

        email = 'user' + uuidv4() + '@example.com'
        const password = 'Password1'

        // Sign up
        cy.task('createUser', { email, password })

        // Login
        cy.visit('/login')
        cy.get('[data-cy=email]').type(email)
        cy.get('[data-cy=password]').type(password)
        cy.get('[data-cy=submit]').click()
        cy.url({ timeout: TIMEOUT.EXTRA_EXTRA_LONG }).should('not.contain', 'login')
    })

    it('Should go in the video detail page and have the correct values (description included)', () => {
        cy.visit('/dashboard')

        const videoTitle = 'Test Video Title ' + uuidv4()
        const videoDescription = 'Test Video Description ' + uuidv4()
        const submissionBoxTitle = 'Test Submission Box ' + uuidv4()
        cy.task('getUserId', email).then((userId) => {
            cy.task('createRequestSubmissionForUser', { userId, submissionBoxTitle }).then((submissionBoxId) => {
                cy.task('createOneVideoAndRetrieveVideoId', { ownerId: userId, title: videoTitle, description: videoDescription }).then(
                    (videoId) => {
                        cy.task('submitVideoToSubmissionBox', {
                            requestedSubmissionId: submissionBoxId,
                            videoId: videoId,
                        })

                        cy.reload()
                        cy.get('[data-cy="video-list"]', { timeout: TIMEOUT.EXTRA_LONG })
                            .should('be.visible')
                            .children()
                            .should('have.length', 1)

                        cy.get('[data-cy="video-list"]').children().first().should('contain', videoTitle).click()

                        cy.url().should('contain', `/video/${ videoId }`, { timeout: TIMEOUT.EXTRA_LONG })
                    }
                )
            })
        })

        cy.get('[data-cy="detail-video-title"]').should('contain', videoTitle)
        cy.get('[data-cy="detail-video-description"]').should('be.visible').should('contain', videoDescription)

        // Get the second children
        cy.get('[data-cy="submission-box-chips-wrapper"]')
            .should('be.visible')
            .children()
            .last()
            .children()
            .should('have.length', 1)
            .should('contain', submissionBoxTitle)
    })


    it('Should go in the video detail page and have the correct values (description excluded)', () => {
        cy.visit('/dashboard')

        const videoTitle = 'Test Video Title ' + uuidv4()
        const submissionBoxTitle = 'Test Submission Box ' + uuidv4()
        cy.task('getUserId', email).then((userId) => {
            cy.task('createRequestSubmissionForUser', { userId, submissionBoxTitle }).then((submissionBoxId) => {
                cy.task('createOneVideoAndRetrieveVideoId', { ownerId: userId, title: videoTitle }).then(
                    (videoId) => {
                        cy.task('submitVideoToSubmissionBox', {
                            requestedSubmissionId: submissionBoxId,
                            videoId: videoId,
                        })

                        cy.reload()
                        cy.get('[data-cy="video-list"]', { timeout: TIMEOUT.EXTRA_LONG })
                            .should('be.visible')
                            .children()
                            .should('have.length', 1)

                        cy.get('[data-cy="video-list"]').children().first().should('contain', videoTitle).click()

                        cy.url().should('contain', `/video/${ videoId }`, { timeout: TIMEOUT.EXTRA_LONG })
                    }
                )
            })
        })

        cy.get('[data-cy="detail-video-title"]').should('contain', videoTitle)
        cy.get('[data-cy="detail-video-description"]').should('be.not.visible')

        // Get the second children
        cy.get('[data-cy="submission-box-chips-wrapper"]')
            .should('be.visible')
            .children()
            .last()
            .children()
            .should('have.length', 1)
            .should('contain', submissionBoxTitle)
    })

    it('Should be able to edit the video\'s title and description', () => {
        cy.visit('/dashboard')

        const videoTitle = 'Test Video Title ' + uuidv4()
        const videoDescription = 'Test Video Description ' + uuidv4()
        const submissionBoxTitle = 'Test Submission Box ' + uuidv4()
        cy.task('getUserId', email).then((userId) => {
            cy.task('createRequestSubmissionForUser', { userId, submissionBoxTitle }).then((submissionBoxId) => {
                cy.task('createOneVideoAndRetrieveVideoId', { ownerId: userId, title: videoTitle, description: videoDescription }).then(
                    (videoId) => {
                        cy.task('submitVideoToSubmissionBox', {
                            requestedSubmissionId: submissionBoxId,
                            videoId: videoId,
                        })

                        cy.reload()
                        cy.get('[data-cy="video-list"]', { timeout: TIMEOUT.EXTRA_LONG })
                            .should('be.visible')
                            .children()
                            .should('have.length', 1)

                        cy.get('[data-cy="video-list"]').children().first().should('contain', videoTitle).click()

                        cy.url().should('contain', `/video/${ videoId }`, { timeout: TIMEOUT.EXTRA_LONG })
                    }
                )
            })
        })

        cy.get('[data-cy="edit-icon"]').click()
        cy.get('[data-cy="detail-video-title"]').should('not.exist')
        cy.get('[data-cy="detail-video-description"]').should('not.exist')
        cy.get('[data-cy="detail-video-title-edit"]').should('be.visible').should('have.value', videoTitle)
        cy.get('[data-cy="detail-video-description-edit"]').should('be.visible').should('have.value', videoDescription)

        const newTitle = 'New Title ' + uuidv4()
        const newDescription = 'New Description ' + uuidv4()
        cy.get('[data-cy="detail-video-title-edit"]').clear().type(newTitle)
        cy.get('[data-cy="detail-video-description-edit"]').clear().type(newDescription)
        cy.get('[data-cy="detail-video-update-button"]').click()
        cy.get('[data-cy="detail-video-title"]').should('be.visible').should('contain', newTitle)
        cy.get('[data-cy="detail-video-description"]').should('be.visible').should('contain', newDescription)
    })


    it('Should be able to edit the video\'s title and description and cancel then get the old values', () => {
        cy.visit('/dashboard')

        const videoTitle = 'Test Video Title ' + uuidv4()
        const videoDescription = 'Test Video Description ' + uuidv4()
        const submissionBoxTitle = 'Test Submission Box ' + uuidv4()
        cy.task('getUserId', email).then((userId) => {
            cy.task('createRequestSubmissionForUser', { userId, submissionBoxTitle }).then((submissionBoxId) => {
                cy.task('createOneVideoAndRetrieveVideoId', { ownerId: userId, title: videoTitle, description: videoDescription }).then(
                    (videoId) => {
                        cy.task('submitVideoToSubmissionBox', {
                            requestedSubmissionId: submissionBoxId,
                            videoId: videoId,
                        })

                        cy.reload()
                        cy.get('[data-cy="video-list"]', { timeout: TIMEOUT.EXTRA_LONG })
                            .should('be.visible')
                            .children()
                            .should('have.length', 1)

                        cy.get('[data-cy="video-list"]').children().first().should('contain', videoTitle).click()

                        cy.url().should('contain', `/video/${ videoId }`, { timeout: TIMEOUT.EXTRA_LONG })
                    }
                )
            })
        })

        cy.get('[data-cy="edit-icon"]').click()
        cy.get('[data-cy="detail-video-title"]').should('not.exist')
        cy.get('[data-cy="detail-video-description"]').should('not.exist')
        cy.get('[data-cy="detail-video-title-edit"]').should('be.visible').should('have.value', videoTitle)
        cy.get('[data-cy="detail-video-description-edit"]').should('be.visible').should('have.value', videoDescription)

        const newTitle = 'New Title ' + uuidv4()
        const newDescription = 'New Description ' + uuidv4()
        cy.get('[data-cy="detail-video-title-edit"]').clear().type(newTitle)
        cy.get('[data-cy="detail-video-description-edit"]').clear().type(newDescription)
        cy.get('[data-cy="detail-video-cancel-button"]').click()
        cy.get('[data-cy="detail-video-title"]').should('be.visible').should('not.contain', newTitle).should('contain', videoTitle)
        cy.get('[data-cy="detail-video-description"]').should('be.visible').should('not.contain', newDescription).should('contain', videoDescription)
    })
})
