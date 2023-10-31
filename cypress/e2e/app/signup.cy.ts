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
        cy.get('[data-cy="passwordVerification"]')
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
        cy.get('[data-cy="passwordVerification"]').type(retypedPassword)
        cy.get('[data-cy="submit"]').click()

        cy.url().should('include', '/signup')

        cy.get('[data-cy="passwordVerification"]')
            .find('p.Mui-error')
            .should('be.visible')
            .and('contain', 'Your passwords must match')
    })

    // Skip these two tests because this is about to be completed in another PR
    it('Should allow the creation of a valid user', () => {
        // User data
        const userEmail = 'best@email.evr'
        const password = 'TryT0UseEmailAgain!'

        // Create user
        cy.visit('/signup')
        cy.get('[data-cy="email"]').type(userEmail)
        cy.get('[data-cy="password"]').type(password)
        cy.get('[data-cy="passwordVerification"]').type(password)
        cy.get('[data-cy="submit"]').click()

        // We shouldn't be on the signup page anymore
        cy.url().should('include', 'login')
    })

    it('Should not allow the creation of an account that already is using email', () => {
        // User data
        const userEmail = 'best@email.evr'
        const password = 'TryT0UseEmailAgain!'

        // Create user
        cy.visit('/signup')
        cy.get('[data-cy="email"]').type(userEmail)
        cy.get('[data-cy="password"]').type(password)
        cy.get('[data-cy="passwordVerification"]').type(password)
        cy.get('[data-cy="submit"]').click()
        cy.url().should('include', '/')

        // Check that already in use email cannot be used to sign up again
        cy.visit('/signup')
        cy.get('[data-cy="email"]').type(userEmail)
        cy.get('[data-cy="password"]').type(password)
        cy.get('[data-cy="passwordVerification"]').type(password)
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
})
