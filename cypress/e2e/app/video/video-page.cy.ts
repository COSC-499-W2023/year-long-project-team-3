import { TIMEOUT } from 'cypress/utils/constants'
import { describe } from 'mocha'
import { v4 as uuidv4 } from 'uuid'

describe('Test video editing page', () => {
    context('Not logged in', () => {
        beforeEach(() => {
            cy.visit('/video/randomVideoId')
        })

        it('should redirect to login', () => {
            cy.url().should('contain', 'login')
        })
    })

    // Skip this because there is no way to retrieve the video ID from the DB
    context('Logged in', () => {
        let videoUrl = ''

        beforeEach(() => {
            cy.session('testuser', () => {
                const email = 'user' + uuidv4() + '@example.com'
                const password = 'Password1'
                // Sign up
                cy.task('createUser', { email, password })

                // Login
                cy.visit('/login')
                cy.get('[data-cy=email]').type(email)
                cy.get('[data-cy=password]').type(password)
                cy.get('[data-cy=submit]').click()
                cy.url().should('not.contain', 'login')

                // Redirect to video edit page
                cy.task('getUserId', email).then((userId) => {
                    cy.task('createOneVideoAndRetrieveVideoId', { ownerId: userId, title: 'Test video' }).then(
                        (videoId) => {
                            videoUrl = '/video/' + videoId
                        }
                    )
                })
            })
        })

        it('should contain video', () => {
            cy.visit(videoUrl)
            cy.get('.react-player', { timeout: TIMEOUT.EXTRA_LONG }).should('exist')
        })

        it('should be controllable by keyboard', () => {
            cy.visit(videoUrl)
            const pressKey = (code: string) => {
                cy.get('body').trigger('keydown', { code: code })
                cy.wait(50)
                cy.get('body').trigger('keyup', { code: code })
            }
            cy.get('.react-player video', { timeout: TIMEOUT.EXTRA_LONG })

            // Play/pause
            pressKey('KeyK')
            cy.get('.react-player video').should('have.prop', 'paused', false)
            pressKey('KeyK')
            cy.get('.react-player video').should('have.prop', 'paused', true)

            // Muting
            pressKey('KeyM')
            cy.get('.react-player video').should('have.prop', 'muted', true)
            pressKey('KeyM')
            cy.get('.react-player video').should('have.prop', 'muted', false)
        })
    })
})
