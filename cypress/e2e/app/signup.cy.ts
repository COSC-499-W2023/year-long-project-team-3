describe('Sign up tests', () => {
    before(() => {
        cy.task('clearDB')
    })

    it('Should load up the sign up page', () => {
        // Check page loads
        cy.visit('/signup')
    })

    it('Should not allow the user to sign up with no information in fields', () => {
        // Check that submitting with nothing in the fields presents user with prompts and does not create a user
        cy.visit('/signup')
        cy.get('[data-cy="submit"]').click()
        cy.url().should('include', '/signup')
    })

    it('Should give the user error feedback for an invalid email (pop up)', () => {
        // Check that a valid email must be entered
        cy.visit('/signup')
        cy.get('[data-cy="email"]').type('badEmail')
        cy.get('[data-cy="submit"]').click()
        cy.url().should('include', '/signup')
    })

    it('Should give the user error feedback for an invalid email (field error)', () => {
        // Second email verification
        cy.visit('/signup')
        cy.get('[data-cy="email"]').type('Incomplete@email')
        cy.get('[data-cy="submit"]').click()
        cy.url().should('include', '/signup')
    })

    it('Should give the user error feedback for a weak password', () => {
        // Check that appropriate password form must be used
        cy.visit('/signup')
        cy.get('[data-cy="password"]').type('notgood')
        cy.get('[data-cy="submit"]').click()
        cy.url().should('include', '/signup')
    })

    it('Should give the user error feedback when both password fields do not match', () => {
        // Check that Comfirmation password and password must match
        cy.visit('/signup')
        cy.get('[data-cy="password"]').type('AreallyG00dPass!')
        cy.get('[data-cy="passwordVerification"]').type('notthesame')
        cy.get('[data-cy="submit"]').click()
        cy.url().should('include', '/signup')
    })

    it('Should allow the creation of a valid user', () => {
        // Check that a valid user able to be created
        cy.visit('/signup')
        cy.get('[data-cy="email"]').type('best@email.evr')
        cy.get('[data-cy="password"]').type('SuchAG00dPassword!')
        cy.get('[data-cy="passwordVerification"]').type('SuchAG00dPassword!')
        cy.get('[data-cy="submit"]').click()
        cy.url().should('include', '/')
    })

    it('Should not allow the creation of an account that already is using email', () => {
        // Check that already in use email cannot be used to sign up again
        cy.visit('/signup')
        cy.get('[data-cy="email"]').type('best@email.evr')
        cy.get('[data-cy="password"]').type('TryT0UseEmailAgain!')
        cy.get('[data-cy="passwordVerification"]').type('TryT0UseEmailAgain!')
        cy.get('[data-cy="submit"]').click()
        cy.url().should('include', '/signup')
    })
})
