import { MOCKUSER } from '../../../../utils/constants'

describe('Test Video Upload and Streaming Processing Pipeline', () => {
    context('Not logged in', () => {
        beforeEach(() => {
            cy.visit('/new/video/upload')
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
            cy.visit('/new/video/upload')
            // Click the span to simulate checking the checkbox
            cy.get('[data-cy=blur-checkbox]').wait(1000).click()
            // Check that the checkbox has been checked
            cy.get('[data-cy=blur-checkbox]').should('have.class', 'Mui-checked')
        })

        it('should print errors if user tries to submit form with no data', () => {
            cy.visit('/new/video/upload')
            // Check that dropzone is in initial state
            cy.get('[data-cy=dropbox-neutral-message]').should('be.visible')

            // Try to submit with no data
            cy.get('[data-cy=submit-upload-button]').wait(1000).click()
            cy.get('[data-cy=title]').find('p.Mui-error').should('be.visible').and('contain', 'Video title is required')
            cy.get('[data-cy=dropbox-error-message]').should('be.visible').and('contain', 'You must select a file to upload')

            // Fix Title
            cy.get('[data-cy=title]').type('Justino599 how to get them W\'s TM')
            cy.contains('Video title is required').should('not.exist')

            // Fix Video
            cy.get('[data-cy=dropzone-file-input]').selectFile('public/videos/lemons.mp4', { force: true })
            cy.get('[data-cy=dropbox-success-message]').should('be.visible').and('contain', 'lemons.mp4')

            // Submit
            cy.get('[data-cy=submit-upload-button]').wait(1000).click()
            cy.contains('Video title is required').should('not.exist')
            cy.get('[data-cy=dropbox-error-message]').should('not.exist')
        })

        it('should create video and redirect page to video details', () => {
            cy.visit('/new/video/upload')
            const videoTitle: string = 'I got a lot of lemons'
            const videoDescription: string = 'TOO MANY LEMONS'
            cy.get('[data-cy=title]').type(videoTitle)
            cy.get('[data-cy=description]').type(videoDescription)
            cy.get('[data-cy=dropzone-file-input]').selectFile('public/videos/lemons.mp4', { force: true })
            cy.get('[data-cy=submit-upload-button]').wait(1000).click()

            cy.url().should('not.contain', '/new/video/upload')

            cy.get('[data-cy="detail-video-title"]').should('contain', videoTitle)
            cy.get('[data-cy="detail-video-description"]').should('be.visible').should('contain', videoDescription)
        })
    })
})
