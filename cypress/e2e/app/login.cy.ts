describe('Login tests', () => {
    before(() => {
        cy.task('clearDB')
    })

    it('Should load up the login page', () => {
        // Check page loads
        cy.visit('/login')
    })

    it('Should not allow the user to log in with no information in fields', () => {
        // Check that submitting with nothing in the fields presents user with prompts and does not log the user in
        cy.visit('/login')
        cy.get('[data-cy="submit"]').click()
        cy.url().should('include', '/login')
    })

    it('Should give the user error feedback for an invalid email (pop up)', () => {
        // Check that a valid email must be entered
        cy.visit('/login')
        cy.get('[data-cy="email"]').type('badEmail')
        cy.get('[data-cy="submit"]').click()
        cy.url().should('include', '/signup')
    })

    it('Should give the user error feedback for an invalid email (field error)', () => {
        // Second email verification
        cy.visit('/login')
        cy.get('[data-cy="email"]').type('Incomplete@email')
        cy.get('[data-cy="submit"]').click()
        cy.url().should('include', '/signup')
    })

    it('Should give the user error feedback for a weak password', () => {
        // Check that appropriate password form must be used
        cy.visit('/login')
        cy.get('[data-cy="password"]').type('notgood')
        cy.get('[data-cy="submit"]').click()
        cy.url().should('include', '/signup')
    })

    it('Should allow the login of a valid user', () => {
        // Check that a valid user able to be created
        cy.visit('/login')
        cy.get('[data-cy="email"]').type('best@email.evr')
        cy.get('[data-cy="password"]').type('SuchAG00dPassword!')
        cy.get('[data-cy="submit"]').click()
        cy.url().should('include', '/dashboard')
    })

    // TODO: Write tests for:
    // wrong password
    // user does not exist
})
