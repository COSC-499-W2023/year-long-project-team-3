import { TIMEOUT } from '../../../../utils/constants'
import { v4 as uuidv4 } from 'uuid'
import { timeout } from 'rxjs'

describe('Submission box request submissions tests', () => {
    beforeEach(() => {
        cy.task('clearDB')
    })

    let currentUserEmail: string

    context('Logged in', () => {
        beforeEach(() => {
            const email = 'user' + uuidv4() + '@example.com'
            currentUserEmail = email
            const password = 'Password1'

            /// Sign up
            cy.task('createUser', { email, password })

            // Login
            cy.visit('/login')
            cy.get('[data-cy=email]').type(email)
            cy.get('[data-cy=password]').type(password)
            cy.get('[data-cy=submit]').click()
            cy.url().should('not.contain', 'login')

            cy.visit('/dashboard')
            cy.get('[data-cy="Create new"]').click()

            const title = 'My Test Title'

            // Create submission box
            cy.get('[data-cy="submission-box-title"]').type(title)

            // Double click is a known issue, cypress is not acting correctly on browser preview deployment
            cy.get('[data-cy="Next"]').click().click()

            // We should be on the request submission step
            cy.get('[data-cy="title"]', { timeout: TIMEOUT.EXTRA_LONG }).contains('Request Submissions')
        })

        it('Should allow user to click next', () => {
            cy.get('[data-cy="Next"]').click()

            cy.url().should('include', '/submission-box')

            cy.get('[data-cy="title"]', { timeout: TIMEOUT.EXTRA_LONG }).contains('Review & Create')
        })

        it('Should let user add submission requests', () => {
            const requestedEmail = 'requested@mail.com'

            cy.get('[data-cy="email"]').type(requestedEmail)
            cy.get('[data-cy="add"]').click()

            cy.get('[data-cy="requested-email"]').should('contain', requestedEmail)
        })

        it('Should let user remove submission requests', () => {
            const requestedEmail = 'requested@mail.com'

            cy.get('[data-cy="email"]').type(requestedEmail)
            cy.get('[data-cy="add"]').click()

            cy.get('[data-cy="requested-email"]').should('contain', requestedEmail)

            cy.get('[data-cy="remove"]').click()

            cy.get('[data-cy="requested-email"]').should('not.exist')
        })

        it('Should not allow the user to add an empty email', () => {
            // Check that submitting with nothing in the field presents user with prompt and does not create a submission request card

            // Check that the errors do not exist
            cy.get('.MuiFormHelperText-root').should('have.length', 0)

            cy.get('[data-cy="add"]').click()

            cy.url().should('include', '/submission-box')

            cy.get('.MuiFormHelperText-root').should('have.length', 1)
            cy.get('[data-cy="email"]')
                .find('.MuiFormHelperText-root')
                .should('be.visible')
                .and('contain', 'To request a submission from someone, enter their email')
        })

        it('Should not allow the user to add their own email', () => {
            cy.get('.MuiFormHelperText-root').should('have.length', 0)

            cy.get('[data-cy="email"]').type(currentUserEmail)

            cy.get('[data-cy="add"]').click()

            cy.url().should('include', '/submission-box')

            cy.get('.MuiFormHelperText-root').should('have.length', 1)
            cy.get('[data-cy="email"]')
                .find('.MuiFormHelperText-root')
                .should('be.visible')
                .and('contain', 'You cannot add your own email!')
        })

        it('Should give the user error feedback for an invalid email', () => {
            // user data
            const testValues = [
                { email: 'badEmail', expectedResponse: 'Enter a valid email' },
                { email: 'incomplete@email', expectedResponse: 'Enter a valid email' },
                { email: 'incomplete@email.', expectedResponse: 'Enter a valid email' },
            ]

            // Check that a valid email must be entered

            cy.wrap(testValues).each((input: { email: string; expectedResponse: string }) => {
                cy.get('[data-cy="email"]').find('input').clear().type(input.email)
                cy.get('[data-cy="add"]').click()

                cy.url().should('include', '/submission-box')

                cy.get('[data-cy="email"]')
                    .find('p.Mui-error')
                    .should('be.visible')
                    .and('contain', input.expectedResponse)
            })
        })

        it('Should give the user error feedback for a duplicate email', () => {
            const requestedEmail = 'requested@mail.com'

            // Check that submitting with nothing in the field presents user with prompt and does not create a submission request

            // Check that the errors do not exist
            cy.get('p.Mui-error').should('have.length', 0)

            cy.get('[data-cy="email"]').type(requestedEmail)
            cy.get('[data-cy="add"]').click()

            cy.url().should('include', '/submission-box')

            cy.get('[data-cy="email"]').type(requestedEmail)
            cy.get('[data-cy="add"]').click()

            cy.url().should('include', '/submission-box')

            cy.get('p.Mui-error').should('have.length', 1)
            cy.get('[data-cy="email"]')
                .find('p.Mui-error')
                .should('be.visible')
                .and('contain', 'This email has already been added!')
        })

        it('Should let the user return to the previous page using the return to dashboard button', () => {
            cy.get('[data-cy="back-button"]').click()

            // TODO: change this to test for appropriate URL
            cy.url().should('include', '/dashboard')
        })

        it('Should let the user return to the previous step using the back button', () => {
            cy.get('[data-cy="Back"]').click()

            cy.url().should('include', '/submission-box')

            cy.get('[data-cy="title"]', { timeout: TIMEOUT.EXTRA_LONG }).contains('Box Settings')
        })
    })

    context('Not logged in', () => {
        beforeEach(() => {
            cy.visit('/submission-box/create')
        })

        it('Should redirect to login', () => {
            cy.url().should('contain', 'login')
        })
    })
})
