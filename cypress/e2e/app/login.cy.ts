import { TIMEOUT } from '../../utils/constants'
import { v4 as uuidv4 } from 'uuid'

describe('Login tests', () => {
    before(() => {
        cy.task('clearDB')
    })

    beforeEach(() => {
        cy.task('clearDB')
    })

    it('Should not allow the user to log in with no information in fields', () => {
        // Check that submitting with nothing in the fields presents user with prompts and does not create a user
        cy.visit('/login')

        // Check that the errors do not exist
        cy.get('p.Mui-error').should('have.length', 0)

        cy.get('[data-cy="submit"]').click()

        cy.url().should('include', '/login')

        cy.get('p.Mui-error').should('have.length', 2)
        cy.get('[data-cy="email"]').find('p.Mui-error').should('be.visible').and('contain', 'Email is required')
        cy.get('[data-cy="password"]').find('p.Mui-error').should('be.visible').and('contain', 'Enter your password')
    })

    it('Should give the user error feedback for an invalid email', () => {
        // User data
        const testValues = [
            { email: 'badEmail', expectedResponse: 'Enter a valid email' },
            { email: 'incomplete@email', expectedResponse: 'Enter a valid email' },
        ]

        // Check that a valid email must be entered
        cy.visit('/login')

        cy.wrap(testValues).each((input: { email: string; expectedResponse: string }) => {
            cy.get('[data-cy="email"]').find('input').clear().type(input.email)
            cy.get('[data-cy="submit"]').click()

            cy.url({ timeout: TIMEOUT.LONG }).should('include', '/login')

            cy.get('[data-cy="email"]').find('p.Mui-error').should('be.visible').and('contain', input.expectedResponse)
        })
    })

    it('Should allow user to create an account, login, and logout', () => {
        // User data
        const email = `test-${ uuidv4() }@test.com`
        const password = 'P@ssw0rd'

        // Sign up
        cy.task('createUser', { email, password })

        // We should be able to log in
        cy.visit('/login')
        cy.get('[data-cy="email"]').type(email)
        cy.get('[data-cy="password"]').type(password)
        cy.get('[data-cy="submit"]').click()

        // We shouldn't be on the login page anymore
        cy.url({ timeout: TIMEOUT.EXTRA_EXTRA_LONG }).should('include', '/dashboard')

        // We should be able to log out
        cy.get('[data-cy="sign-out-button"]').click({ force: true })

        cy.title().should('eq', 'Harp: A Secure Platform for Anonymous Video Submission')
        cy.get('[data-cy="sign-up-button"]').contains('Sign Up')
        cy.get('[data-cy="login-button"]').contains('Login')

        // We should be able to log in again
        cy.get('[data-cy="login-button"]').click()

        cy.url({ timeout: TIMEOUT.EXTRA_LONG }).should('include', '/login')
    })

    it('Should not allow user to login with invalid credentials', () => {
        // User data (does not exist in database)
        const userEmail = `test-${ uuidv4() }@test.com`
        const password = 'P@ssw0rd'

        cy.visit('/login')

        // We should not be able to log in
        cy.get('[data-cy="email"]').type(userEmail)
        cy.get('[data-cy="password"]').type(password)
        cy.get('[data-cy="submit"]').click()

        // We should still be on the login page
        cy.url().should('include', '/login')

        cy.get('.Toastify__toast-container', { timeout: TIMEOUT.EXTRA_LONG })
            .should('be.visible')
            .and('contain', 'Unable to login with provided credentials')
    })

    it('Should not allow user to login with incorrect password', () => {
        // User data (user exists but password is wrong)
        const userEmail = `test-${ uuidv4() }@test.com`
        const password = '12345'

        cy.visit('/login')

        // We should not be able to log in
        cy.get('[data-cy="email"]').type(userEmail)
        cy.get('[data-cy="password"]').type(password)
        cy.get('[data-cy="submit"]').click()

        // We should still be on the login page
        cy.url().should('include', '/login')

        cy.get('.Toastify__toast-container', { timeout: TIMEOUT.EXTRA_LONG })
            .should('be.visible')
            .and('contain', 'Unable to login with provided credentials')
    })

    it('Should navigate to signup when clicking on Don\'t have an account?', () => {
        cy.visit('/login')
        cy.get('[data-cy="link-to-signup"]').click()
        cy.url({ timeout: TIMEOUT.LONG }).should('include', '/signup')
        cy.get('[data-cy="title"]').contains('Signup')
    })

    it('Should toggle password visibility when clicking on icon button', () => {
        cy.visit('/login')

        // Initially, the password input should be of type 'password'
        cy.get('[data-cy=password] input').should('have.attr', 'type', 'password')

        // Click the toggle password visibility button
        cy.get('[data-cy=toggle-password-visibility]').click()

        // After clicking, the password input type should change to 'text'
        cy.get('[data-cy=password] input').should('have.attr', 'type', 'text')

        // Click the toggle password visibility button
        cy.get('[data-cy=toggle-password-visibility]').click()

        // After clicking again, the password input type should change back to 'password'
        cy.get('[data-cy=password] input').should('have.attr', 'type', 'password')
    })

    it('should use case insensitive email', () => {
        // User data
        const email = 'TeSt@something.com'
        const password = 'P@ssw0rd'

        // Sign up
        cy.visit('/signup')
        cy.get('[data-cy="email"]').type(email)
        cy.get('[data-cy="password"]').type(password)
        cy.get('[data-cy="passwordConfirmation"]').type(password)
        cy.get('[data-cy="submit"]').click()

        // We should be able to log in with same email
        cy.url().should('include', '/login')
        cy.get('[data-cy="email"]').type(email)
        cy.get('[data-cy="password"]').type(password)
        cy.get('[data-cy="submit"]').click()

        // Log out
        cy.get('[data-cy="sign-out-button"]').click({ force: true })
        cy.wait(2000)

        // We should be able to log in with differently capitalized email
        const differentEmail = 'TEsT@something.com'
        cy.visit('/login')
        cy.get('[data-cy="email"]').type(differentEmail)
        cy.get('[data-cy="password"]').type(password)
        cy.get('[data-cy="submit"]').click()
        cy.url().should('not.contain', 'login')
    })
})
