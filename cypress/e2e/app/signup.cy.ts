import { v4 as uuidv4 } from 'uuid'

describe('Sign up tests', () => {
    beforeEach(() => {
        cy.task('clearDB')
    })

    it('Should not allow the user to sign up with no information in fields', () => {
        // Check that submitting with nothing in the fields presents user with prompts and does not create a user
        cy.visit('/signup')

        // Check that the errors do not exist
        cy.get('p.Mui-error').should('have.length', 0)

        cy.get('[data-cy="submit"]').click()

        cy.url().should('include', '/signup')

        cy.get('p.Mui-error').should('have.length', 3)
        cy.get('[data-cy="email"]').find('p.Mui-error').should('be.visible').and('contain', 'Email is required')
        cy.get('[data-cy="password"]').find('p.Mui-error').should('be.visible').and('contain', 'Enter your password')
        cy.get('[data-cy="passwordConfirmation"]')
            .find('p.Mui-error')
            .should('be.visible')
            .and('contain', 'Please re-type your password')
    })

    it('Should give the user error feedback for an invalid email', () => {
        // user data
        const testValues = [
            { email: 'badEmail', expectedResponse: 'Enter a valid email' },
            { email: 'incomplete@email', expectedResponse: 'Enter a valid email' },
            { email: 'incomplete@email.', expectedResponse: 'Enter a valid email' },
        ]

        // Check that a valid email must be entered
        cy.visit('/signup')

        cy.wrap(testValues).each((input: { email: string; expectedResponse: string }) => {
            cy.get('[data-cy="email"]').find('input').clear().type(input.email)
            cy.get('[data-cy="submit"]').click()

            cy.url().should('include', '/signup')

            cy.get('[data-cy="email"]').find('p.Mui-error').should('be.visible').and('contain', input.expectedResponse)
        })
    })

    it('Should give the user error feedback for a weak password', () => {
        // user data
        const testValues = [
            { pass: 'notgood', expectedResponse: 'Password should be a minimum of 8 characters long' },
            {
                pass: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
                expectedResponse: 'Password should be a maximum of 100 characters long',
            },
            { pass: 'Password', expectedResponse: 'Your password must have at least one numeric character' },
            { pass: 'passw0rd', expectedResponse: 'Your password must have at least one uppercase character' },
            { pass: 'PASSW0RD', expectedResponse: 'Your password must have at least one lowercase character' },
        ]

        // Check that appropriate password form must be used
        cy.visit('/signup')

        cy.wrap(testValues).each((input: { pass: string; expectedResponse: string }) => {
            cy.get('[data-cy="password"]').find('input').clear().type(input.pass)
            cy.get('[data-cy="submit"]').click()

            cy.url().should('include', '/signup')

            cy.get('[data-cy="password"]')
                .find('p.Mui-error')
                .should('be.visible')
                .and('contain', input.expectedResponse)
        })
    })

    it('Should give the user error feedback when both password fields do not match', () => {
        // User data
        const password = 'AreallyG00dPass!'
        const retypedPassword = 'N0ttHEsAMEP4ss@@@'

        // Check that Comfirmation password and password must match
        cy.visit('/signup')
        expect(password).not.equal(retypedPassword)
        cy.get('[data-cy="password"]').type(password)
        cy.get('[data-cy="passwordConfirmation"]').type(retypedPassword)
        cy.get('[data-cy="submit"]').click()

        cy.url().should('include', '/signup')

        cy.get('[data-cy="passwordConfirmation"]')
            .find('p.Mui-error')
            .should('be.visible')
            .and('contain', 'Your passwords must match')
    })

    // Skip these two tests because this is about to be completed in another PR
    it('Should allow the creation of a valid user', () => {
        // User data
        const userEmail = `best-${ uuidv4() }@email.evr`
        const password = 'TryT0UseEmailAgain!'

        // Create user
        cy.visit('/signup')
        cy.get('[data-cy="email"]').type(userEmail)
        cy.get('[data-cy="password"]').type(password)
        cy.get('[data-cy="passwordConfirmation"]').type(password)
        cy.get('[data-cy="submit"]').click()

        // We shouldn't be on the signup page anymore
        cy.url().should('include', 'login')
    })

    it('Should not allow the creation of an account that already is using email', () => {
        // User data
        const userEmail = `best-${ uuidv4() }@email.evr`
        const password = 'TryT0UseEmailAgain!'

        // Create user
        cy.visit('/signup')
        cy.get('[data-cy="email"]').type(userEmail)
        cy.get('[data-cy="password"]').type(password)
        cy.get('[data-cy="passwordConfirmation"]').type(password)
        cy.get('[data-cy="submit"]').click()
        cy.url().should('include', '/')

        // Check that already in use email cannot be used to sign up again
        cy.visit('/signup')
        cy.get('[data-cy="email"]').type(userEmail)
        cy.get('[data-cy="password"]').type(password)
        cy.get('[data-cy="passwordConfirmation"]').type(password)
        cy.get('[data-cy="submit"]').click()

        cy.url().should('include', '/signup')

        cy.get('.Toastify__toast-container').should('be.visible').and('contain', 'The input email is not valid')
    })

    it('Should navigate to login when clicking on Already have an account?', () => {
        cy.visit('/signup')
        cy.get('[data-cy="link-to-login"]').click()
        cy.url().should('include', '/login')
        cy.get('[data-cy="title"]').contains('Login')
    })

    it('Should toggle password visibility when clicking on icon button', () => {
        cy.visit('/signup')

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

    it('Should toggle password confirmation visibility when clicking on icon button', () => {
        cy.visit('/signup')

        // Initially, the password confirmation input should be of type 'password'
        cy.get('[data-cy=passwordConfirmation] input').should('have.attr', 'type', 'password')

        // Click the toggle password visibility button
        cy.get('[data-cy=toggle-confirm-password-visibility]').click()

        // After clicking, the password confirmation input type should change to 'text'
        cy.get('[data-cy=passwordConfirmation] input').should('have.attr', 'type', 'text')

        // Click the toggle password visibility button
        cy.get('[data-cy=toggle-confirm-password-visibility]').click()

        // After clicking again, the password confirmation input type should change back to 'password'
        cy.get('[data-cy=passwordConfirmation] input').should('have.attr', 'type', 'password')
    })

    it('should add new user to any requested submissions with same email', () => {
        const email = 'red@is.sus'
        const password = 'Password1'

        cy.task('createSubmissionBoxWithEmail', email)

        cy.visit('/signup')

        cy.get('[data-cy=email]').type(email)
        cy.get('[data-cy=password]').type(password)
        cy.get('[data-cy=passwordConfirmation]').type(password)
        cy.get('[data-cy=submit]').click()
        cy.url().should('not.contain', 'signup')

        cy.task('getUserId', email).then((userId) => {
            cy.task('getRequestedSubmissions').then((requestedSubmissions: any) => {
                expect(requestedSubmissions).to.have.length(1)
                expect(requestedSubmissions[0].email).to.eq(email)
                expect(requestedSubmissions[0].userId).to.eq(userId)
            })
        })
    })
})
