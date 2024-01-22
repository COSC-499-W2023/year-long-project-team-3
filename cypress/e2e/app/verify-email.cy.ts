import { TIMEOUT } from '../../utils/constants'

describe('Test email verification', () => {
    // Using a real email address, else I think Amazon might be upset about our emails bouncing
    const email = 'no-reply@harpvideo.ca'
    const password = 'Password1'

    beforeEach(() => {
        cy.task('clearDB')

        // Sign up
        cy.task('createUser', { email, password, verifyEmail: false })

        // Login
        cy.visit('/login')
        cy.get('[data-cy=email]').type(email)
        cy.get('[data-cy=password]').type(password)
        cy.get('[data-cy=submit]').click()

        cy.url().should('not.contain', '/login')
    })

    it('should prompt user to verify after signup', () => {
        cy.url().should('contain', '/verify-email')
    })

    const pages = [
        '/dashboard',
        '/submission-box/create',
        '/video/upload',
    ]
    it('should block user from pages if email is not verified', () => {
        cy.wrap(pages).each((page: string) => {
            cy.visit(page)
            cy.url().should('contain', '/verify-email')
        })
    })

    it('should allow user verify email', () => {
        cy.get('[data-cy=verify-email-button]').should('be.visible').click()
        cy.get('[data-cy=verify-email-button]', { timeout: TIMEOUT.EXTRA_LONG }).should('contain.text', 'Email Sent!')

        cy.task('getVerificationToken', email).then((token) => {
            cy.visit(`/verify-email/${ token }`)
            cy.url().should('match', /\/verify-email\/[a-zA-Z0-9_-]+$/)
            cy.get('body').should('contain', 'Email verified!')
            cy.get('[data-cy=dashboard-button]').click()
            cy.url().should('contain', '/dashboard')

            // Test that user can access pages
            cy.wrap(pages).each((page: string) => {
                cy.visit(page)
                cy.url().should('not.contain', '/verify-email')
            })
        })
    })
})
