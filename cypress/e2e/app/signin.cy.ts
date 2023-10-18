import { TIMEOUT, DELAY } from '../../utils/constants'

describe('Test auth', () => {
    it('should log in with google', () => {
        // TODO: Visit landing page, check if logged in, if not, redirect to /signin instead of visit /signin directly

        cy.visit('/signin', {
            headers: {
                Accept: 'application/json, text/plain, */*',
                'User-Agent':
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
                'LOYALTY-PARTNER-FORWARD': 'D19313AA-5BFF-4586-947A-C3AE8D78CEA4',
            },
        })
        cy.get('h1').should('include.text', 'Sign In Page')
        cy.get('button').should('include.text', 'Login with Google').click()

        cy.url({ timeout: TIMEOUT.MEDIUM }).should('eq', '')
        cy.origin(
            'https://accounts.google.com',
            {
                args: {
                    username: Cypress.env('GOOGLE_USER'),
                    password: Cypress.env('GOOGLE_PW'),
                    cookieName: Cypress.env('COOKIE_NAME'),
                    TIMEOUT: TIMEOUT,
                    DELAY: DELAY,
                },
            },
            ({ username, password, cookieName, TIMEOUT, DELAY }) => {
                Cypress.on(
                    'uncaught:exception',
                    (err) =>
                        !err.message.includes('ResizeObserver loop') &&
                        !err.message.includes('Error in protected function')
                )

                cy.clearCookies()
                cy.setCookie(cookieName, 'true')
                cy.get('input[type=email]').should('be.visible').type(username)
                cy.get('button').contains('Next').click().wait(DELAY.MEDIUM)
                cy.get('input[type=password]', { timeout: TIMEOUT.LONG })
                    .should('be.visible')
                    .then(($pwfInp) => {
                        // find the one that is not hidden
                        const $visiblePwfInp = $pwfInp.filter((i, el) => {
                            return !Cypress.$(el).is(':hidden')
                        })
                        cy.wrap($visiblePwfInp).type(password)
                        cy.get('button').contains('Next').click().wait(DELAY.MEDIUM)
                    })
            }
        )

        cy.url({ timeout: TIMEOUT.LONG }).should('eq', 'http://localhost:3000')
    })
})
