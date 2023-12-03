import { v4 as uuidv4 } from 'uuid'
import {TIMEOUT} from '../../../../utils/constants'

describe('Test full submission box creation', () => {
    it('should work', () => {
        cy.task('clearDB')

        const email = 'user@example.com'
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

        cy.task('getUserId', email).then((userId: any) => {
            // Submission box to create
            const sb = {
                title: 'Test box title ' + uuidv4(),
                description: 'wow such box',
                closesAt: '2028/06/23 11:59 PM',
                requestedEmails: ['example@user.com', 'big@chungus.gg'],
            }

            cy.task('createUser', { email: sb.requestedEmails[0], password: 'Password1' }).then(
                (requestedUser: any) => {
                    cy.visit('/dashboard')

                    cy.get('[data-cy="Create new"]').click()

                    cy.url().should('contain', 'submission-box/create')

                    cy.get('[data-cy=title]').should('contain', 'Box Settings')

                    cy.get('[data-cy=submission-box-title]').type(sb.title)
                    cy.get('[data-cy=description]').type(sb.description)
                    cy.get('.data-cy-date-time', {timeout: TIMEOUT.EXTRA_LONG}).type(sb.closesAt.replaceAll(' ', ''))
                    cy.get('[data-cy=next]').click({force: true})

                    cy.get('[data-cy=title]').should('contain', 'Request Submissions')

                    cy.wrap(sb.requestedEmails).each((email: string) => {
                        cy.get('[data-cy=email]').type(email).type('{enter}')
                    })
                    cy.get('[data-cy=next]').click({force: true})

                    cy.get('[data-cy=title]').should('contain', 'Review & Create')

                    cy.get('[data-cy=submission-box-title]').find('input').should('have.value', sb.title)
                    cy.get('[data-cy=description]').should('contain', sb.description)
                    cy.get('.data-cy-date-time', {timeout: TIMEOUT.EXTRA_LONG}).find('input').should('contain.value', sb.closesAt)
                    cy.wrap(sb.requestedEmails).each((email: string) => {
                        cy.get('[data-cy=requested-emails]').should('contain', email)
                    })

                    cy.get('[data-cy=next]').click({force: true})

                    // Wait a bit for submission box to be added to database, else test is flaky
                    cy.wait(2000)

                    cy.task('getSubmissionBoxes').then((submissionBoxes: any) => {
                        assert(Array.isArray(submissionBoxes))
                        expect(submissionBoxes).to.have.length(1)
                        const subBox = submissionBoxes[0]
                        expect(subBox.title).to.eq(sb.title)
                        expect(subBox.description).to.eq(sb.description)
                        expect(new Date(subBox.closesAt).toString()).to.eq(new Date(sb.closesAt).toString())

                        cy.task('getSubmissionBoxManagers').then((managers: any) => {
                            assert(Array.isArray(managers))
                            expect(managers).to.have.length(1)
                            expect(managers[0].userId).to.eq(userId)
                            expect(managers[0].submissionBoxId).to.eq(subBox.id)
                            expect(managers[0].viewPermission).to.eq('owner')
                        })

                        cy.task('getRequestedSubmissions').then((requestedSubmissions: any) => {
                            assert(Array.isArray(requestedSubmissions))
                            expect(requestedSubmissions).to.have.length(sb.requestedEmails.length)
                            const requestsWithUserId = requestedSubmissions.filter(
                                (requestedSubmission: any) => !!requestedSubmission.userId
                            )
                            expect(requestsWithUserId).to.have.length(1)
                            expect(requestsWithUserId[0].userId).to.eq(requestedUser.id)
                            requestedSubmissions.forEach((requestedSubmission: any) => {
                                expect(requestedSubmission.submissionBoxId).to.eq(subBox.id)
                            })
                        })
                    })
                }
            )
        })
    })
})
