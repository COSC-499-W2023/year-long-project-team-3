import prisma from '@/lib/prisma'

describe('Sign up tests', () => {
    beforeEach(() => {
        cy.task('clearDB')
    })

    it('Should not allow the user to sign up with no information in fields', () => {
        // Check that submitting with nothing in the fields presents user with prompts and does not create a user
        cy.visit('/signup')
        cy.get('[data-cy="submit"]').click()

        // TODO: Check for error from backend
        cy.url().should('include', '/signup')
    })

    it('Should give the user error feedback for an invalid email (pop up)', () => {
        // user data
        const email = 'badEmail'
        const password = 'AreallyG00dPass!'

        // Check that a valid email must be entered
        cy.visit('/signup')
        cy.get('[data-cy="email"]').type(email)
        cy.get('[data-cy="password"]').type(password)
        cy.get('[data-cy="submit"]').click()

        // TODO: Check for error from backend
        cy.url().should('include', '/signup')
    })

    it('Should give the user error feedback for an invalid email (field error)', () => {
        // user data
        const email = 'Incomplete@email'
        const password = 'AreallyG00dPass!'

        // Second email verification
        cy.visit('/signup')
        cy.get('[data-cy="email"]').type(email)
        cy.get('[data-cy="password"]').type(password)
        cy.get('[data-cy="submit"]').click()

        // TODO: Check for error from backend
        cy.url().should('include', '/signup')
    })

    it('Should give the user error feedback for a weak password', () => {
        // user data
        const email = 'best@email.evr'
        const password = 'notgood'

        // Check that appropriate password form must be used
        cy.visit('/signup')
        cy.get('[data-cy="email"]').type(email)
        cy.get('[data-cy="password"]').type(password)
        cy.get('[data-cy="submit"]').click()

        // TODO: Check for error from backend
        cy.url().should('include', '/signup')
    })

    it('Should give the user error feedback when both password fields do not match', () => {
        // User data
        const userEmail = 'best@email.evr'
        const password = 'AreallyG00dPass!'
        const retypedPassword = 'N0ttHEsAMEP4ss@@@'

        // Check that Comfirmation password and password must match
        cy.visit('/signup')
        cy.get('[data-cy="email"]').type(userEmail)
        expect(password).not.equal(retypedPassword)
        cy.get('[data-cy="password"]').type(password)
        cy.get('[data-cy="passwordVerification"]').type(retypedPassword)
        cy.get('[data-cy="submit"]').click()

        // TODO: Check for error from backend
        cy.url().should('include', '/signup')
    })

    it('Should allow the creation of a valid user', async () => {
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

        // Check user exists in database
        const createdUser = await prisma.user.findUnique({ where: { email: userEmail } })
        expect(createdUser).exist
        expect(createdUser?.email).equal(userEmail)
        expect(createdUser?.password).exist
        expect(createdUser?.password).not.equal(password)
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

        // TODO: Log out

        // Check that already in use email cannot be used to sign up again
        cy.visit('/signup')
        cy.get('[data-cy="email"]').type(userEmail)
        cy.get('[data-cy="password"]').type(password)
        cy.get('[data-cy="passwordVerification"]').type(password)
        cy.get('[data-cy="submit"]').click()

        // TODO: Check for error from backend
        cy.url().should('include', '/signup')
    })
})
