import { TIMEOUT } from '../../../utils/constants'
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'

function getCurrentDateFormatted() {
    // Get the current date
    const currentDate = new Date()
    return currentDate && dayjs(currentDate).format('MMM D, YYYY')
}

describe('Dashboard Recent Videos Tests', () => {
    beforeEach(() => {
        cy.task('clearDB')
    })

    it('should not display any recent videos when no video is provided', () => {
        const email = 'noVideos@box.com'
        const password = 'noSubmissions1'

        cy.visit('/signup')

        // Sign up
        cy.task('createUser', { email, password })

        // Login
        cy.visit('/login')
        cy.get('[data-cy=email]').type(email)
        cy.get('[data-cy=password]').type(password)
        cy.get('[data-cy=submit]').click()
        cy.url({ timeout: TIMEOUT.EXTRA_LONG }).should('not.contain', 'login')

        cy.visit('/dashboard')
        cy.get('[data-cy="My Videos"]')
            .should('be.visible')
            .and('have.css', 'background-color', 'rgb(225, 240, 255)') // Check if the tab is focused

        cy.get('[data-cy="no-video-text"]', { timeout: TIMEOUT.EXTRA_LONG })
            .should('be.visible')
            .and('contain', 'You do not have any videos')
    })

    it('should display uploaded videos', () => {
        const email = 'user' + uuidv4() + '@example.com'
        const password = 'randomPasswordCool1'

        // Sign up
        cy.task('createUser', { email, password })

        // Create submission box and submit video
        const videoTitle = 'Test Video Title ' + uuidv4()
        cy.task('getUserId', email).then((userId) => {
            cy.task('createOneVideoAndRetrieveVideoId', { ownerId: userId, title: videoTitle })
        })

        // Login
        cy.visit('/login')
        cy.get('[data-cy=email]').type(email)
        cy.get('[data-cy=password]').type(password)
        cy.get('[data-cy=submit]').click()
        cy.url({ timeout: TIMEOUT.EXTRA_LONG }).should('not.contain', 'login')

        cy.visit('/dashboard')

        cy.get('[data-cy="video-list"]', { timeout: TIMEOUT.EXTRA_LONG })
            .should('be.visible')
            .children()
            .should('have.length', 1)

        const firstVideo = cy.get('[data-cy="video-list"]').children().first()

        firstVideo.should('contain', videoTitle)
        firstVideo.should('contain', 'Not Submitted')
        firstVideo.should('contain', 'Uploaded on: ' + getCurrentDateFormatted())
    })

    it('should not display received videos when a user has received videos', () => {
        const email = 'user' + uuidv4() + '@example.com'
        const password = 'randomPasswordCool1'

        // Sign up
        cy.task('createUser', { email, password })

        // Create submission box and submit video
        const videoTitle = 'Test Video Title ' + uuidv4()
        const submissionBoxTitle = 'Test Submission Box ' + uuidv4()
        cy.task('getUserId', email).then((userId) => {
            cy.task('createSubmissionBoxWithEmail', { userId, submissionBoxTitle }).then((submissionBoxId) => {
                cy.task('createOneVideoAndRetrieveVideoId', { title: videoTitle }).then((videoId) => {
                    cy.task('submitVideoToSubmissionBox', { requestedSubmissionId: submissionBoxId, videoId })
                })
            })
        })

        // Login
        cy.visit('/login')
        cy.get('[data-cy=email]').type(email)
        cy.get('[data-cy=password]').type(password)
        cy.get('[data-cy=submit]').click()
        cy.url({ timeout: TIMEOUT.EXTRA_LONG }).should('not.contain', 'login')

        cy.visit('/dashboard')

        cy.get('[data-cy="no-video-text"]', { timeout: TIMEOUT.EXTRA_LONG }).should('be.visible').should('contain', 'You do not have any videos')
    })

    it('Should show the date uploaded and what boxes the video has been submitted to on the video card', () => {
        const email = 'user' + uuidv4() + '@example.com'
        const password = 'randomPasswordCool1'

        // Sign up
        cy.task('createUser', { email, password })

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
        cy.visit('/login')
        cy.get('[data-cy=email]').type(email)
        cy.get('[data-cy=password]').type(password)
        cy.get('[data-cy=submit]').click()
        cy.url({ timeout: TIMEOUT.EXTRA_LONG }).should('not.contain', 'login')

        cy.visit('/dashboard')

        cy.get('[data-cy="video-list"]', { timeout: TIMEOUT.EXTRA_LONG })
            .should('be.visible')
            .children()
            .should('have.length', 1)

        const firstVideo = cy.get('[data-cy="video-list"]').children().first()

        firstVideo.should('contain', videoTitle)
        firstVideo.should('contain', 'Uploaded on: ' + getCurrentDateFormatted())
        firstVideo.should('contain', 'Submitted to: Test Submission Box')
    })
})
