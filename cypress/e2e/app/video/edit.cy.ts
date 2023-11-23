import { describe } from 'mocha'

describe('Test video editing page', () => {
    context('Not logged in', () => {
        beforeEach(() => {
            cy.visit('/video/edit')
        })

        it('should redirect to login', () => {
            cy.url().should('contain', 'login')
        })
    })

    context.only('Logged in', () => {
        beforeEach(() => {
            cy.session(['user@example.com', 'Password1'], () => {
                cy.visit('/login')
                cy.get('[data-cy=email]').type('justin.schoenit@gmail.com')
                cy.get('[data-cy=password]').type('Password1')
                cy.get('[data-cy=submit]').click()
                cy.url().should('not.contain', 'login')
            })
            cy.visit('/video/edit')
        })

        it('should contain video', () => {
            cy.get('.react-player').should('exist')
        })

        it('should have continue and back', () => {
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
