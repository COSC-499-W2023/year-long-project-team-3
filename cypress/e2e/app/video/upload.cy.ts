import { MOCKUSER, TIMEOUT } from '../../../utils/constants'
import { Video } from '@prisma/client'

describe('Test Video Upload and Streaming Processing Pipeline', () => {
    context('Not logged in', () => {
        beforeEach(() => {
            cy.visit('/video/upload')
        })

        it('should redirect to login', () => {
            cy.url().should('contain', 'login')
        })
    })

    context('Logged in', () => {
        beforeEach(() => {
            cy.task('clearDB')
            cy.task('populateDB')

            cy.session('testuser', () => {
                cy.visit('/login')
                cy.get('[data-cy=email]').type(MOCKUSER.email)
                cy.get('[data-cy=password]').type(MOCKUSER.password)
                cy.get('[data-cy=submit]').click()
                cy.url().should('not.contain', 'login')
            })
        })

        it('should allow the user to check the box to blur their face', () => {
            cy.visit('/video/upload')

            // Click the span to simulate checking the checkbox
            cy.get('[data-cy=blur-checkbox]').click()
            // Check that the checkbox has been checked
            cy.get('[data-cy=blur-checkbox]').should('have.class', 'Mui-checked')
        })

        it('should allow the user to uncheck the box to blur their face', () => {
            cy.visit('/video/upload')

            // Click the span to simulate checking the checkbox
            cy.get('[data-cy=blur-checkbox]').should('be.visible').click()
            // Check that the checkbox has been checked
            cy.get('[data-cy=blur-checkbox]').should('be.visible').should('have.class', 'Mui-checked')
            // Click the span to simulate un-checking the checkbox
            cy.get('[data-cy=blur-checkbox]').should('be.visible').click()
            // Check that the checkbox has been unchecked
            cy.get('[data-cy=blur-checkbox]').should('be.visible').should('not.have.class', 'Mui-checked')
        })

        it('should upload and process video', () => {
            /* This is the happy path :) */
            /* Upload video from "file system" */
            cy.visit('/video/upload')
            cy.get('[data-cy=test-input]').selectFile('public/videos/lemons.mp4', { force: true })
            cy.get('[data-cy=loading-circle-blur-background]', { timeout: TIMEOUT.EXTRA_EXTRA_LONG }).should(
                'be.visible'
            )

            /* Check if the url changes and displays the loading icon */
            cy.url({ timeout: TIMEOUT.LONG }).should('contain', 'video/edit/')
            cy.get('[data-cy=loading-circle]', { timeout: TIMEOUT.LONG }).should('be.visible')

            /* Once the video is made, we should display the processing component */
            cy.get('[data-cy=video-processing-alert]').should(
                'contain',
                'Your video is currently being processed by our server. Please wait or come back later.'
            )

            /* Make sure that the url is also correct */
            cy.task('getLatestVideo').then((response) => {
                cy.url().should('contain', `video/edit/${ (<Video>response).id }`)
            })

            /* Check that the processed video preview is displayed once we redirect to the edit page */
            cy.get('[data-cy=video-player]', { timeout: 4 * TIMEOUT.EXTRA_EXTRA_LONG }).should('be.visible')
        })
    })
})
