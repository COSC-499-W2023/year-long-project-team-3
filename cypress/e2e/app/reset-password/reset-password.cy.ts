describe('test password reset send email api', () => {
    const email = 'no-reply@harpvideo.ca'
    const password = 'Password1'
    const updatedPassword = 'Another1'

    beforeEach(() => {
        cy.task('clearDB')
        cy.task('createUser', { email, password })
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

            cy.get('[data-cy=password]').type(updatedPassword)
            cy.get('[data-cy=passwordConfirmation]').type(updatedPassword)
            cy.get('[data-cy=submit]').wait(1000).click()

            cy.get('[data-cy=email]').type(email)
            cy.get('[data-cy=password]').type(updatedPassword)
            cy.get('[data-cy=submit]').wait(1000).click()

            cy.url().should('contain', 'dashboard')
        })
    })
})
