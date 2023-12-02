describe('Test submission inbox API', () => {
    before(() => {
        cy.task('clearDB')
    })

    beforeEach(() => {
        cy.task('clearDB')
    })

    context('Logged out', () => {
        it('should reject any request if not logged in', () => {
            cy.request({
                method: 'GET',
                url: '/api/submission-box/inboxes',
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eq(401)
                expect(response.body.error).to.eq('Unauthorized')
            })
        })
    })

    context('Logged in', () => {
        it('should return an empty submissionBox array when a user does not have any incoming submission boxes', () => {
            const email = 'noSubmission@user.com'
            const password = 'noSubmission1'

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

            cy.request({
                method: 'GET',
                url: '/api/submission-box/inboxes',
            }).then((response) => {
                expect(response.status).to.eq(200)
                const data = response.body
                expect(data).to.exist
                expect(data.submissionBoxes.length).to.eq(0)
            })
        })

        it('should return a correct submissionBox array of incoming submission boxes when a user has incoming submission boxes', () => {
            const email = 'submission@in.box'
            const password = 'submissionIn1'
            const title = 'Incoming Submission Box'
            const description = null
            const closesAt = new Date('2050-12-01T03:24:00')
            const videoStoreToDate = null
            const maxVideoLength = null
            const isPublic = false

            // Load database
            cy.task('loadInSubmissionBoxes')
            // Login
            cy.visit('/login')
            cy.get('[data-cy=email]').type(email)
            cy.get('[data-cy=password]').type(password)
            cy.get('[data-cy=submit]').click()
            cy.url().should('not.contain', 'login')

            cy.request({
                method: 'GET',
                url: '/api/submission-box/inboxes',
            }).then((response) => {
                expect(response.status).to.eq(200)
                const data = response.body
                expect(data).to.exist
                expect(data.submissionBoxes.length).to.eq(1)
                const submissionBox = data.submissionBoxes[0]
                expect(submissionBox.title).to.eq(title)
                expect(submissionBox.description).to.eq(description)
                expect(submissionBox.closesAt).to.eq(closesAt.toISOString())
                expect(submissionBox.videoStoreToDate).to.eq(videoStoreToDate)
                expect(submissionBox.maxVideoLength).to.eq(maxVideoLength)
            })
        })
    })
})
