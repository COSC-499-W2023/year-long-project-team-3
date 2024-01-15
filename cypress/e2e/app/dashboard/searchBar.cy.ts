import { v4 as uuidv4 } from 'uuid'
import { TIMEOUT } from '../../../utils/constants'

describe('Dashboard Search Bar', () => {
    let email: string

    beforeEach(() => {
        cy.task('clearDB')

        email = 'user' + uuidv4() + '@example.com'
        const password = 'Password1'

        // Sign up
        cy.visit('/signup')
        cy.get('[data-cy="email"]').type(email)
        cy.get('[data-cy="password"]').type(password)
        cy.get('[data-cy="passwordConfirmation"]').type(password)
        cy.get('[data-cy="submit"]').click()
        cy.url().should('contain', 'login')

        // Login
        cy.get('[data-cy=email]').type(email)
        cy.get('[data-cy=password]').type(password)
        cy.get('[data-cy=submit]').click()
        cy.url({ timeout: TIMEOUT.EXTRA_EXTRA_LONG }).should('not.contain', 'login')
    })

    it('should display search bar', () => {
        cy.visit('/dashboard')
        cy.get('[data-cy="dashboard-search-bar"]').should('be.visible')
    })

    it('should only display searched videos', () => {
        cy.visit('/dashboard')

        const visibleVideo1 = 'Test Video Title ' + uuidv4()
        const visibleVideo2 = 'Test Video Title ' + uuidv4()
        const videoShouldNotBeDisplayed = 'Not Display' + uuidv4()
        cy.task('getUserId', email).then((userId) => {
            cy.task('createRequestSubmissionForUser', { userId }).then((submissionBoxId) => {
                cy.task('createOneVideoAndRetrieveVideoId', { ownerId: userId, title: visibleVideo1 }).then((videoId) => {
                    cy.task('submitVideoToSubmissionBox', { requestedSubmissionId: submissionBoxId, videoId })
                })
                cy.task('createOneVideoAndRetrieveVideoId', { ownerId: userId, title: visibleVideo2 }).then((videoId) => {
                    cy.task('submitVideoToSubmissionBox', { requestedSubmissionId: submissionBoxId, videoId })
                })
                cy.task('createOneVideoAndRetrieveVideoId', { ownerId: userId, title: videoShouldNotBeDisplayed }).then(
                    (videoId) => {
                        cy.task('submitVideoToSubmissionBox', { requestedSubmissionId: submissionBoxId, videoId })
                    }
                )
            })
        })

        cy.reload()
        cy.get('[data-cy="video-list"]', { timeout: TIMEOUT.EXTRA_LONG })
            .should('be.visible')
            .children()
            .should('have.length', 3)

        cy.get('[data-cy="dashboard-search-bar"]').type('Test Video Title')


        cy.get('[data-cy="video-list"]', { timeout: TIMEOUT.EXTRA_LONG })
            .should('be.visible')
            .children()
            .should('have.length', 2)
    })


    it('should display different string when no videos are found', () => {
        cy.visit('/dashboard')

        cy.get('[data-cy="no-video-text"]', { timeout: TIMEOUT.EXTRA_LONG }).should('be.visible').should('contain', 'You Do Not Have Any Videos')

        const videoShouldNotBeDisplayed = 'Not Display' + uuidv4()
        cy.task('getUserId', email).then((userId) => {
            cy.task('createRequestSubmissionForUser', { userId }).then((submissionBoxId) => {
                cy.task('createOneVideoAndRetrieveVideoId', { ownerId: userId, title: videoShouldNotBeDisplayed }).then(
                    (videoId) => {
                        cy.task('submitVideoToSubmissionBox', { requestedSubmissionId: submissionBoxId, videoId })
                    }
                )
            })
        })

        cy.reload()
        cy.get('[data-cy="video-list"]', { timeout: TIMEOUT.EXTRA_LONG })
            .should('be.visible')
            .children()
            .should('have.length', 1)

        cy.get('[data-cy="dashboard-search-bar"]').type('Random String')

        cy.get('[data-cy="no-video-text"]', { timeout: TIMEOUT.EXTRA_LONG }).should('be.visible').should('contain', 'There Are No Videos That Match This Search')
    })
})
