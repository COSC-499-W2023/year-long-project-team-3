describe('Test that url callbacks work', () => {
    const email = 'test@user.ca'
    const password = 'Password1'

    beforeEach(() => {
        cy.task('clearDB')
    })

    it('should redirect to login when accessing dashboard', () => {
        cy.visit('/dashboard')

        cy.url().should('contain', 'login')
    })

    it('should redirect back after login', () => {
        const page = '/submission-box/create'

        cy.task('createUser', { email: email, password: password })

        cy.visit(page)

        cy.url().should('contain', 'login')

        // Login
        cy.get('[data-cy="email"]').type(email)
        cy.get('[data-cy="password"]').type(password)
        cy.get('[data-cy="submit"]').click()

        // Check that we go back to original page
        cy.url().should('contain', page)
    })

    it('should redirect after signup', () => {
        const page = '/submission-box/create'

        cy.visit(page)

        cy.url().should('contain', 'login')
        cy.get('[data-cy=link-to-signup]').click()

        // Manually signup
        cy.url().should('contain', 'signup')
        cy.get('[data-cy="email"]').type(email)
        cy.get('[data-cy="password"]').type(password)
        cy.get('[data-cy="passwordConfirmation"]').type(password)
        cy.get('[data-cy="submit"]').click()

        // Wait to arrive at login to ensure user is created
        cy.url().should('contain', 'login')
        cy.task('verifyEmail', email)

        // Login
        cy.get('[data-cy="email"]').type(email)
        cy.get('[data-cy="password"]').type(password)
        cy.get('[data-cy="submit"]').click()

        // Check that it redirects back to original page
        cy.url().should('contain', page)
    })
})
