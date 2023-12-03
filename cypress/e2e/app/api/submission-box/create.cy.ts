import { v4 as uuidv4 } from 'uuid'

const arbitraryValidRequest = {
    title: 'Test title',
    requestedEmails: ['example@test.com'],
}
describe('Test submission box creation API', () => {
    context('Logged out', () => {
        it('should reject any request if not logged in', () => {
            cy.request({
                method: 'POST',
                url: '/api/submission-box/create',
                body: arbitraryValidRequest,
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eq(401)
                expect(response.body.error).to.eq('Unauthorized')
            })
        })
    })

    context('Logged in', () => {
        beforeEach(() => {
            cy.session('testuser', () => {
                cy.task('clearDB')

                const email = 'user' + uuidv4() + '@example.com'
                const password = 'Password1'

                // Sign up
                cy.visit('/signup')
                cy.get('[data-cy="email"]').type(email)
                cy.get('[data-cy="password"]').type(password)
                cy.get('[data-cy="passwordConfirmation"]').type(password)
                cy.get('[data-cy="submit"]').click()
                cy.url().should('contain', 'login')

                // Login
                cy.get('[data-cy=email]').type(email)
                cy.get('[data-cy=password]').type(password)
                cy.get('[data-cy=submit]').click()
                cy.url().should('not.contain', 'login')
            })
        })

        it('should accept valid request', () => {
            // Will fail on non success response code
            cy.request({
                method: 'POST',
                url: '/api/submission-box/create',
                body: arbitraryValidRequest,
            })
        })

        it('should return the submission box that it created', () => {
            const title = 'Test title ' + uuidv4()
            const requestedEmails = ['example@test.com', 'example99@test.com']
            const description = 'this is a test-generated submission box'
            const closesAt = new Date()

            cy.request({
                method: 'POST',
                url: '/api/submission-box/create',
                body: {
                    title,
                    description,
                    closesAt,
                    requestedEmails,
                },
            }).then((response) => {
                expect(response.status).to.eq(201)
                const data = response.body
                expect(data).to.exist
                expect(data.title).to.eq(title)
                expect(data.description).to.eq(description)
                expect(JSON.stringify(data.closesAt)).to.eq(JSON.stringify(closesAt))
            })
        })

        it('should accept empty email list', () => {
            const title = 'Test title ' + uuidv4()
            const requestedEmails: string[] = []

            cy.request({
                method: 'POST',
                url: '/api/submission-box/create',
                body: {
                    title,
                    requestedEmails,
                },
            }).then((response) => {
                expect(response.status).to.eq(201)
                const data = response.body
                expect(data).to.exist
                expect(data.title).to.eq(title)
            })
        })

        it('should reject incomplete requests', () => {
            const incompleteRequestBodies = [{}, { title: 'hi' }, { requestedEmails: ['example@test.com'] }]

            cy.wrap(incompleteRequestBodies).each((requestBody) => {
                cy.request({
                    method: 'POST',
                    url: '/api/submission-box/create',
                    body: requestBody,
                    failOnStatusCode: false,
                }).then((response) => {
                    expect(response.status).to.eq(400)
                })
            })
        })

        it('should handle malformed json', () => {
            cy.request({
                method: 'POST',
                url: '/api/submission-box/create',
                body: '{"title":"hello","requestedEmails":["example@test.com"]',
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eq(400)
            })
        })

        it('should reject invalid emails', () => {
            cy.request({
                method: 'POST',
                url: '/api/submission-box/create',
                body: {
                    title: 'test title',
                    requestedEmails: ['aaaaaaaa.com'],
                },
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eq(400)
            })
        })
    })
})
