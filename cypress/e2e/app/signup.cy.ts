describe('Sign up tests', () => {
    before(() => {
        cy.task('clearDB')
    })
    it('passes', () => {
        // Check page loads
        cy.visit('/signup')

        // Check that submitting with nothing in the fields presents user with prompts and does not create a user
        cy.get('[data-cy="submit"]').click()
        cy.url().should('include', '/signup')

        // Check that a valid email must be entered
        cy.get('[data-cy="email"]').type('badEmail')
        cy.get('[data-cy="submit"]').click()
        cy.url().should('include', '/signup')

        // Second email verification
        cy.get('[data-cy="email"]').type('{selectall} {backspace}')
        cy.get('[data-cy="email"]').type('Incomplete@email')
        cy.get('[data-cy="submit"]').click()
        cy.url().should('include', '/signup')

        // Check that appropriate password form must be used
        cy.get('[data-cy="email"]').type('{selectall} {backspace}')
        cy.get('[data-cy="password"]').type('notgood')
        cy.get('[data-cy="submit"]').click()
        cy.url().should('include', '/signup')

        // Check that Comfirmation password and password must match
        cy.get('[data-cy="passwordVerification"]').type('notthesame')
        cy.get('[data-cy="submit"]').click()
        cy.url().should('include', '/signup')

        // Check that a valid user able to be created
        cy.get('[data-cy="password"]').type('{selectall} {backspace}')
        cy.get('[data-cy="passwordVerification"]').type('{selectall} {backspace}')
        cy.get('[data-cy="email"]').type('best@email.evr')
        cy.get('[data-cy="password"]').type('SuchAG00dPassword!')
        cy.get('[data-cy="passwordVerification"]').type('SuchAG00dPassword!')
        cy.get('[data-cy="submit"]').click()
        cy.url().should('include', '/')

        // Check that already in use email cannot be used to sign up again
        cy.visit('/signup')
        cy.get('[data-cy="email"]').type('best@email.evr')
        cy.get('[data-cy="password"]').type('TryT0UseEmailAgain!')
        cy.get('[data-cy="passwordVerification"]').type('TryT0UseEmailAgain!')
        cy.get('[data-cy="submit"]').click()
        cy.url().should('include', '/signup')
    })
})
