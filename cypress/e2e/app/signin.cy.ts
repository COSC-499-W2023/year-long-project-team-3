import { TIMEOUT } from '../../utils/constants'

describe('Test auth', () => {
    before(() => {
        cy.task('clearDB')
        cy.intercept(
            {
                method: 'GET',
                url: 'https://accounts.google.com/o/oauth2/v2/auth?*',
            },
            (req) => {
                const redirectUri = req.query['redirect_uri'] as string
                const state = req.query['state'] as string
                const code = req.query['code'] as string
                const scope = req.query['scope'] as string
                const authuser = req.query['authuser'] as number
                const prompt = req.query['prompt'] as string
                const url = `${ redirectUri }?code=${ code }&state=${ state }&scope=${ scope }&authuser=${ authuser }&prompt=${ prompt }`
                req.redirect(url, 302)
            }
        ).as('googleSignIn')
        cy.intercept('/api/auth/callback/google?*', (req) => {
            req.redirect('/', 302)
        }).as('googleSignInCallback')
    })
    it('should log in with google', () => {
        cy.visit('/')
        cy.get('[data-cy="login-button"]').click()

        cy.get('h1').should('include.text', 'Sign In Page')
        cy.get('[data-cy="google-sign-in-btn"]').should('include.text', 'Sign in with Google').click()
        cy.wait(['@googleSignInCallback'], { timeout: TIMEOUT.EXTRA_LONG })

        cy.location('origin', { timeout: TIMEOUT.EXTRA_LONG }).should('eq', Cypress.config().baseUrl)
        cy.location('pathname').should('eq', '/')
    })
})
