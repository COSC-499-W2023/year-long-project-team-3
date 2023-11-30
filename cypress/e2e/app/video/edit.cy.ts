import { describe } from 'mocha'
import { v4 as uuidv4 } from 'uuid'

describe.skip('Test video editing page', () => {
    // Skipping this test because we need video id for this

    context('Not logged in', () => {
        beforeEach(() => {
            cy.visit('/video/edit')
        })

        it('should redirect to login', () => {
            cy.url().should('contain', 'login')
        })
    })

    context('Logged in', () => {
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
            })
            cy.visit('/video/edit')
        })

        it('should contain video', () => {
            cy.get('.react-player').should('exist')
        })

        it('should have continue and back buttons', () => {
            cy.get('#nav-buttons-div')
                .find('button')
                .should('have.length', 2)
                .and('contain', 'Back')
                .and('contain', 'Continue')
        })

        it('should show message on edit change', () => {
            // Make change
            cy.get('.editor-tools').should('exist').find('.MuiIconButton-root').should('have.length', 4).first().click()

            // Check for message
            cy.get('.MuiAlert-root[role=alert]').should('exist').and('be.visible')
        })

        it('should open modals', () => {
            cy.get('.editor-tools')
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
            const pressKey = (code: string) => {
                cy.get('body').trigger('keydown', { code: code })
                cy.wait(50)
                cy.get('body').trigger('keyup', { code: code })
            }

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
