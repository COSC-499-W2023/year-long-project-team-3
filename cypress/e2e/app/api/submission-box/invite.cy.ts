import { beforeEach } from 'mocha'
import { SubmissionBox, User } from '@prisma/client'

describe('Test inviting and uninviting users', () => {
    const email = 'test@user.ca'
    const password = 'Password1'

    const invitedEmails = [
        'joe@harpvideo.ca',
        'crasheshisbike@harpvideo.ca',
        'biden@harpvideo.ca',
    ]

    beforeEach(() => {
        cy.task('clearDB')

        cy.task<User>('createUser', { email ,password }).then((user) => {
            cy.task('createSubmissionBoxForSubmissions', { userId: user.id })
        })

        // Login
        cy.visit('/login')
        cy.get('input[name=email]').type(email)
        cy.get('input[name=password]').type(password)
        cy.get('button[type=submit]').click()
        cy.url().should('not.contain', 'login')
    })

    context('No emails invited', () => {
        it('should invite emails', () => {
            cy.task<SubmissionBox[]>('getSubmissionBoxes').then((submissionBoxes) => {
                cy.request('POST', '/api/submission-box/invite', {
                    submissionBoxId: submissionBoxes[0].id,
                    emails: invitedEmails,
                }).its('status').should('equal', 201)
                cy.task<string[]>('getInvitedUserEmails', submissionBoxes[0].id).then(emails => {
                    expect(emails).to.have.length(invitedEmails.length)
                    emails.map(email => {
                        expect(invitedEmails).to.include(email)
                    })
                })
            })
        })
    })

    context('Emails already invited', () => {
        beforeEach(() => {
            cy.task<SubmissionBox[]>('getSubmissionBoxes').then((submissionBoxes) => {
                cy.task('inviteEmails', { submissionBoxId: submissionBoxes[0].id, emails: invitedEmails })
            })
        })

        it('should un-invite emails', () => {
            cy.task<SubmissionBox[]>('getSubmissionBoxes').then((submissionBoxes) => {
                cy.request('DELETE', '/api/submission-box/invite', {
                    submissionBoxId: submissionBoxes[0].id,
                    emails: invitedEmails,
                }).its('status').should('equal', 200)
                cy.task<string[]>('getInvitedUserEmails', submissionBoxes[0].id).then(emails => {
                    expect(emails).to.have.length(0)
                })
            })
        })

        it('should not fail when inviting a user already invited', () => {
            cy.task<SubmissionBox[]>('getSubmissionBoxes').then((submissionBoxes) => {
                cy.request('POST', '/api/submission-box/invite', {
                    submissionBoxId: submissionBoxes[0].id,
                    emails: ['joe@harpvideo.ca', 'otherperson@harpvideo.ca'],
                }).its('status').should('equal', 201)
                cy.task<string[]>('getInvitedUserEmails', submissionBoxes[0].id).then(emails => {
                    expect(emails).to.have.length(invitedEmails.length + 1)
                })
            })
        })

        it('should not fail uninviting user not invited to box', () => {
            cy.task<SubmissionBox[]>('getSubmissionBoxes').then((submissionBoxes) => {
                cy.request('DELETE', '/api/submission-box/invite', {
                    submissionBoxId: submissionBoxes[0].id,
                    emails: ['joe@harpvideo.ca', 'otherperson@harpvideo.ca'],
                }).its('status').should('equal', 200)
                cy.task<string[]>('getInvitedUserEmails', submissionBoxes[0].id).then(emails => {
                    expect(emails).to.have.length(invitedEmails.length - 1)
                })
            })
        })
    })
})
