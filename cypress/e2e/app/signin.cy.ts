import { DELAY, TIMEOUT } from '../../utils/constants'
import { getHeaders } from '../../utils/headers'

describe('Test auth', () => {
    before(() => {
        // TODO: Clear DB before each test
    })
    it('should log in with google', () => {
        // TODO: Visit landing page, check if logged in, if not, redirect to /signin instead of visit /signin directly
        cy.visit('/signin', { headers: getHeaders() })
        cy.get('h1').should('include.text', 'Sign In Page')
        cy.get('button').should('include.text', 'Login with Google').click()

        cy.url({ timeout: TIMEOUT.LONG }).should('eq', '')
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

                // Type username
                cy.get('input[type=email]', { timeout: TIMEOUT.MEDIUM }).should('be.visible').type(username)
                cy.get('button').contains('Next').click()

                // Type password
                cy.get('input[type=password]', { timeout: TIMEOUT.LONG })
                    .should('be.visible')
                    .then(($pwfInp) => {
                        // find the one that is not hidden
                        const $visiblePwfInp = $pwfInp.filter((i, el) => {
                            return !Cypress.$(el).is(':hidden')
                        })
                        cy.wrap($visiblePwfInp).type(password)
                        cy.get('button').contains('Next').click()
                    })
            }
        )

        cy.url({ timeout: TIMEOUT.EXTRA_LONG }).should('eq', Cypress.env('BASE_URL'))
    })
})
