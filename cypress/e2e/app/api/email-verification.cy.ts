describe('Test email verification APIs', () => {
    const email = 'no-reply@harpvideo.ca'
    const password = 'Password1'

    beforeEach(() => {
        cy.task('clearDB')
        cy.task('createUser', {email, password, verifyEmail: false})
    })

    it('should correctly determine if user has an open token', () => {
        // Login
        cy.visit('/login')
        cy.get('[data-cy="email"]').type(email)
        cy.get('[data-cy="password"]').type(password)
        cy.get('[data-cy="submit"]').click()
        cy.url().should('not.contain', '/login')

        // Go to landing page to avoid creating verification token
        cy.visit('/')

        // Remove token just in case
        cy.task('deleteVerificationToken', email)

        // No verification attempted
        cy.request('/api/verify-email/has-open-token').should((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.have.property('hasOpenToken')
            expect(response.body.hasOpenToken).to.eq(false)
        })

        // Now visit verify-email
        cy.visit('/verify-email')
        // Wait for token to be generated, there is no change on page to detect this, so just wait 2 secs
        cy.wait(2000)

        // Token should exist and be open
        cy.request('/api/verify-email/has-open-token').should((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.have.property('hasOpenToken')
            expect(response.body.hasOpenToken).to.eq(true)
        })

        // Update token to outdated date
        cy.task('editOrCreateVerificationToken', {email, date: new Date('2003-12-13')})

        // Token should exist but be closed
        cy.request('/api/verify-email/has-open-token').should((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.have.property('hasOpenToken')
            expect(response.body.hasOpenToken).to.eq(false)
        })
    })
})
