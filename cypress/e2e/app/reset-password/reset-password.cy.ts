describe('test password reset process', () => {
    const email = 'no-reply@harpvideo.ca'
    const password = 'Password1'

    beforeEach(() => {
        cy.task('clearDB')

        // Sign up
        cy.task('createUser', { email, password, verifyEmail: false })

        // Login
        cy.visit('/login')
    })

    it('should allow user to reset password', () => {
        /* Navigate from login to reset password page */
        cy.get('[data-cy=link-to-reset-password]').wait(1000).click()

        cy.get('[data-cy=email]').type(email)
        cy.get('[data-cy=submit]').wait(1000).click()

        cy.url().should('contain', 'login')

        cy.task('getResetPasswordToken', email).then((token) => {
            cy.visit(`/reset-password/${ token }`)
            cy.url().should('match', /\/reset-password\/[a-zA-Z0-9_-]+$/)
        //     cy.get('body').should('contain', 'Email verified!')
        //     cy.get('[data-cy=home-page-button]').click()
        //     cy.url().should('contain', '/dashboard')
        })
    })
})
