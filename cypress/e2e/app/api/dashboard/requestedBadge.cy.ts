import { TIMEOUT } from '../../../../utils/constants'

describe('test requested submission required API', () => {

    context('Logged out', () => {
        it('should reject any request if not logged in', () => {
            cy.request({
                url: '/api/submission-box/requestedsubmissions/require-submission',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                failOnStatusCode: false,
            }).then(async (response) => {
                expect(response.status).to.eq(401)
                expect(response.body.error).to.eq('Unauthorized')
            })
        })
    })

    context('Logged in', () => {
        const email = 'noRequests@user.com'
        beforeEach(() => {
            cy.task('clearDB')
            const password = 'Pass1234'
            cy.task('createUser', { email, password })
            cy.visit('/login')
            cy.get('[data-cy=email]').type(email)
            cy.get('[data-cy=password]').type(password)
            cy.get('[data-cy=submit]').click()
            cy.url({ timeout: TIMEOUT.EXTRA_LONG }).should('not.contain', 'login')
            cy.reload()
        })

        it('should return nothing when user does not have any requests', () => {
            cy.request({
                url: '/api/submission-box/requestedsubmissions/require-submission',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(async (response) => {
                expect(response.status).to.eq(200)
                expect(response.body.requiredCount).to.eq(0)
            })
        })

        it('should return the number of requested submissions needing to be submitted to', () => {
            const submissionBoxTitle = 'multiple submissions'
            cy.task('getUserId', email).then((userId) => {
                cy.task('createRequestSubmissionForUser', { userId, submissionBoxTitle })
                cy.task('createRequestSubmissionForUser', { userId, submissionBoxTitle })
                cy.task('createRequestSubmissionForUser', { userId, submissionBoxTitle })
                cy.task('createRequestSubmissionForUser', { userId, submissionBoxTitle })
            })
            cy.reload()
            cy.request({
                url: '/api/submission-box/requestedsubmissions/require-submission',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(async (response) => {
                expect(response.status).to.eq(200)
                expect(response.body.requiredCount).to.eq(4)
            })
        })
    })
})
