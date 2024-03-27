import { TIMEOUT } from '../../../../utils/constants'

describe('View Box Detail Page Tests', () => {
    // Submission Box information
    const submissionBoxTitle1 = 'Test Viewing With Members'
    const submissionBoxTitle2 = 'Test Viewing Without Members'
    const submissionBoxDescription = 'Description'
    const submissionBoxTime = new Date('December 17, 2045 03:24:00')
    const invitedEmail = 'invited@member.email'

    beforeEach(() => {
        cy.task('clearDB')
        // User information
        const email = 'view@detail.test'
        const password = 'Pass1234'

        // Create a user with two managed submission boxes, one with members, one without
        cy.task('createUser', { email, password })
        cy.visit('/login')
        cy.get('[data-cy=email]').type(email)
        cy.get('[data-cy=password]').type(password)
        cy.get('[data-cy=submit]').click()
        cy.url({ timeout: TIMEOUT.EXTRA_LONG }).should('not.contain', 'login')
        cy.task('getUserId', email).then((userId) => {
            cy.task('createSubmissionBoxWithEmail', { submissionBoxTitle: submissionBoxTitle1, email: invitedEmail, userId, submissionBoxDescription})
            cy.task('createSubmissionBoxForSubmissions', { submissionBoxTitle: submissionBoxTitle2, submissionBoxDescription, userId, closesAt: submissionBoxTime })
        })
        cy.reload()
        cy.visit('/dashboard')
    })

    it('Should allow the user to view members if there are members', () => {
        cy.get('[data-cy="Manage Boxes"]')
        cy.wait(1000)
        cy.get('[data-cy="Manage Boxes"]').click()

        cy.get(`[data-cy="${ submissionBoxTitle1 }"]`)
        cy.wait(1000)   // Waiting for it to be clickable
        cy.get(`[data-cy="${ submissionBoxTitle1 }"]`).click()

        cy.get('[data-cy="submissionBoxMembersHeading"]').should('be.visible')

        cy.get('[data-cy="submissionBoxMembers"]').should('contain', invitedEmail)
    })

    it('Should not display members if there aren\'t any', () => {
        cy.get('[data-cy="Manage Boxes"]')
        cy.wait(1000)
        cy.get('[data-cy="Manage Boxes"]').click()

        cy.get(`[data-cy="${ submissionBoxTitle2 }"]`)
        cy.wait(1000)   // Waiting for it to be clickable
        cy.get(`[data-cy="${ submissionBoxTitle2 }"]`).click()

        cy.get('[data-cy="submissionBoxMembersHeading"]').should('not.exist')

        cy.get('[data-cy="submissionBoxMembers"]').should('not.exist')
    })
})
