import { TIMEOUT } from '../../../utils/constants'
import { v4 as uuidv4 } from 'uuid'

describe('Dashboard Recent Videos Tests', () => {
    beforeEach(() => {
        cy.task('clearDB')
    })

    it('should not display any recent videos when no video is provided', () => {
        const email = 'noVideos@box.com'
        const password = 'noSubmissions1'

        cy.visit('/signup')

        // Sign up
        cy.visit('/signup')
        cy.get('[data-cy="email"]').type(email)
        cy.get('[data-cy="password"]').type(password)
        cy.get('[data-cy="passwordConfirmation"]').type(password)
        cy.get('[data-cy="submit"]').click()
        cy.url({ timeout: TIMEOUT.EXTRA_LONG }).should('contain', 'login')

        // Login
        cy.get('[data-cy=email]').type(email)
        cy.get('[data-cy=password]').type(password)
        cy.get('[data-cy=submit]').click()
        cy.url({ timeout: TIMEOUT.EXTRA_LONG }).should('not.contain', 'login')

        cy.visit('/dashboard')
        cy.get('[data-cy="Recent"]')
            .should('be.visible')
            .and('contain', 'Recent')
            .and('have.css', 'background-color', 'rgb(225, 240, 255)') // Check if the tab is focused

        cy.get('[data-cy="no-video-text"]', { timeout: TIMEOUT.EXTRA_LONG })
            .should('be.visible')
            .and('contain', 'You Do Not Have Any Video')
    })

    it('should display sent videos when a user has sent videos', () => {
        const email = 'user' + uuidv4() + '@example.com'
        const password = 'randomPasswordCool1'

        // Sign up
        cy.visit('/signup')
        cy.get('[data-cy="email"]').type(email)
        cy.get('[data-cy="password"]').type(password)
        cy.get('[data-cy="passwordConfirmation"]').type(password)
        cy.get('[data-cy="submit"]').click()
        cy.url({ timeout: TIMEOUT.EXTRA_LONG }).should('contain', 'login')

        // Create submission box and submit video
        const videoTitle = 'Test Video Title ' + uuidv4()
        cy.task('getUserId', email).then((userId) => {
            cy.task('createRequestSubmissionForUser', { userId }).then((submissionBoxId) => {
                cy.task('createOneVideoAndRetrieveVideoId', { ownerId: userId, title: videoTitle }).then((videoId) => {
                    cy.task('submitVideoToSubmissionBox', { requestedSubmissionId: submissionBoxId, videoId })
                })
            })
        })

        // Login
        cy.get('[data-cy=email]').type(email)
        cy.get('[data-cy=password]').type(password)
        cy.get('[data-cy=submit]').click()
        cy.url({ timeout: TIMEOUT.EXTRA_LONG }).should('not.contain', 'login')

        cy.visit('/dashboard')

        cy.get('[data-cy="video-list"]', { timeout: TIMEOUT.EXTRA_LONG })
            .should('be.visible')
            .children()
            .should('have.length', 1)

        // get the first video
        cy.get('[data-cy="video-list"]').children().first().should('contain', videoTitle)
    })
})
