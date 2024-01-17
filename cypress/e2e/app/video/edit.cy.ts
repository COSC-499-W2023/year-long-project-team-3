import { TIMEOUT } from 'cypress/utils/constants'
import { describe } from 'mocha'
import { v4 as uuidv4 } from 'uuid'

describe('Test video editing page', () => {
    context('Not logged in', () => {
        beforeEach(() => {
            cy.visit('/video/edit/randomVideoId')
        })

        it('should redirect to login', () => {
            cy.url().should('contain', 'login')
        })
    })

    // Skip this because there is no way to retrieve the video ID from the DB
    context('Logged in', () => {
        if (!Cypress.env('CYPRESS_RUN_LOCAL_ONLY')) {
            // TODO: Remove this when we have a way to get the video ID (aka using Cognito)
            it.skip('Skipped in production', () => {})
            return
        }
        let videoUrl = ''

        beforeEach(() => {
            cy.session('testuser', () => {
                const email = 'user' + uuidv4() + '@example.com'
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
                cy.url().should('not.contain', 'login')

                // Redirect to video edit page
                cy.task('getUserId', email).then((userId) => {
                    cy.task('createOneVideoAndRetrieveVideoId', { ownerId: userId, title: 'Test video' }).then(
                        (videoId) => {
                            videoUrl = '/video/edit/' + videoId
                        }
                    )
                })
            })
        })

        it('should contain video', () => {
            cy.visit(videoUrl)
            cy.get('.react-player', { timeout: TIMEOUT.EXTRA_LONG }).should('exist')
        })

        it('should have next and back buttons', () => {
            cy.visit(videoUrl)
            cy.get('#nav-buttons-div', { timeout: TIMEOUT.EXTRA_LONG })
                .find('button')
                .should('have.length', 2)
                .and('contain', 'Back')
                .and('contain', 'Next')
        })

        it('should show message on edit change', () => {
            cy.visit(videoUrl)
            // Make change
            cy.get('.editor-tools', { timeout: TIMEOUT.EXTRA_LONG })
                .should('exist')
                .find('.MuiIconButton-root')
                .should('have.length', 4)
                .first()
                .click()

            // Check for message
            cy.get('.MuiAlert-root[role=alert]').should('exist').and('be.visible')
        })

        it('should open modals', () => {
            cy.visit(videoUrl)
            cy.get('.editor-tools', { timeout: TIMEOUT.EXTRA_LONG })
                .find('.MuiIconButton-root')
                .not('[aria-label=Mute]')
                .each((button) => {
                    cy.wrap(button).click()

                    // Check for message
                    cy.get('.MuiModal-root').as('modal').should('exist').and('be.visible')

                    cy.get('@modal').find('button.modal-close').click()

                    cy.get('.MuiModal-root').should('not.exist')
                })
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
