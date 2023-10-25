describe('Sign up tests', () => {
    before(() => {
        cy.task('clearDB')
    })
    it('passes', () => {
        cy.visit('/signup')

        cy.get('[data-cy="submit"]').click()
        cy.url().should('include', '/signup')

        cy.get('[data-cy="email"]').type('badEmail')
        cy.get('[data-cy="submit"]').click()
        cy.url().should('include', '/signup')

        cy.get('[data-cy="email"]').type('{selectall} {backspace}')
        cy.get('[data-cy="email"]').type('Incomplete@email')
        cy.get('[data-cy="submit"]').click()
        cy.url().should('include', '/signup')

        cy.get('[data-cy="email"]').type('{selectall} {backspace}')
        cy.get('[data-cy="password"]').type('notgood')
        cy.get('[data-cy="submit"]').click()
        cy.url().should('include', '/signup')

        cy.get('[data-cy="passwordVerification"]').type('notthesame')
        cy.get('[data-cy="submit"]').click()
        cy.url().should('include', '/signup')

        cy.get('[data-cy="password"]').type('{selectall} {backspace}')
        cy.get('[data-cy="passwordVerification"]').type('{selectall} {backspace}')
        cy.get('[data-cy="email"]').type('best@email.evr')
        cy.get('[data-cy="password"]').type('SuchAG00dPassword!')
        cy.get('[data-cy="passwordVerification"]').type('SuchAG00dPassword!')
        cy.get('[data-cy="submit"]').click()
        cy.url().should('include', '/')

        cy.visit('/signup')
        cy.get('[data-cy="email"]').type('best@email.evr')
        cy.get('[data-cy="password"]').type('TryT0UseEmailAgain!')
        cy.get('[data-cy="passwordVerification"]').type('TryT0UseEmailAgain!')
        cy.get('[data-cy="submit"]').click()
        cy.url().should('include', '/signup')
    })
})