import { TIMEOUT } from '../../../../utils/constants'

describe('Edit Box Detail Page Tests', () => {
    // Submission Box information
    const submissionBoxTitle1 = 'Test Modification with only title'
    const submissionBoxTitle2 = 'Test Modification with all fields'
    const submissionBoxDescription = 'Description for a submission box with all fields filled out'
    const submissionBoxTime = new Date('December 17, 2045 03:24:00')
    const submissionBoxTimeString = '2045/12/17 03:24 AM'   // How textfield displays the date information
    // New values for editing
    const newTitle = 'A new title for the submission box'
    const newDescription = 'A new description for the submission box.'
    const newTimeCharacters = '2060 06 13 03:30 AM' // Characters to be typed in DatePicker
    const newTimeDisplay = '2060/06/13 03:30 AM'

    beforeEach(() => {
        cy.task('clearDB')
        // User information
        const email = 'modification@detail.test'
        const password = 'Pass1234'
        // Create a user with two managed submission boxes, one with only title, the other with all fields.
        cy.task('createUser', { email, password })
        cy.visit('/login')
        cy.get('[data-cy=email]').type(email)
        cy.get('[data-cy=password]').type(password)
        cy.get('[data-cy=submit]').click()
        cy.url({ timeout: TIMEOUT.EXTRA_LONG }).should('not.contain', 'login')
        cy.task('getUserId', email).then((userId) => {
            cy.task('createSubmissionBoxForSubmissions', { submissionBoxTitle: submissionBoxTitle1, userId })
            cy.task('createSubmissionBoxForSubmissions', { submissionBoxTitle: submissionBoxTitle2, submissionBoxDescription, userId, closesAt: submissionBoxTime })
        })
        cy.reload()
        cy.visit('/dashboard')
    })

    it('should display a submission box and be able to change it\'s information when the only field populated is title', () => {
        cy.get('[data-cy="Manage Boxes"]')
        cy.wait(1000)
        cy.get('[data-cy="Manage Boxes"]').click()

        cy.get(`[data-cy="${ submissionBoxTitle1 }"]`)
        cy.wait(1000)   // Waiting for it to be clickable
        cy.get(`[data-cy="${ submissionBoxTitle1 }"]`).click()

        cy.get('[data-cy="submissionBoxTitle"]').should('contain', submissionBoxTitle1)
        // Start the editing process
        cy.get('[data-cy="edit-icon"]').should('be.visible').click()
        // Determine that the title field is visible
        cy.get('[data-cy="submissionBoxTitleEditing"]').should('be.visible').click()
        // Focus the textfield, determine that it has the correct current value
        cy.get('[data-cy="submissionBoxTitleEditing"]').focused().should('have.value', submissionBoxTitle1)
        // Focus and clear the textfield and type in new title
        cy.get('[data-cy="submissionBoxTitleEditing"]').focused().clear().type(newTitle)
        cy.get('[data-cy="updateButton"]').should('be.visible').click()

        cy.get('[data-cy="submissionBoxTitle"]').should('contain', newTitle)
    })

    it('should display a submission box, change all it\'s information and update all fields after the form is submitted', () => {
        // Determine what the displayed date should be
        cy.get('[data-cy="Manage Boxes"]')
        cy.wait(1000)
        cy.get('[data-cy="Manage Boxes"]').click()

        cy.get(`[data-cy="${ submissionBoxTitle2 }"]`)
        cy.wait(1000)   // Waiting for it to be clickable
        cy.get(`[data-cy="${ submissionBoxTitle2 }"]`).click()

        cy.get('[data-cy="submissionBoxTitle"]', { timeout: TIMEOUT.EXTRA_LONG }).should('contain', submissionBoxTitle2)
        cy.get('[data-cy="submissionBoxDate"]', { timeout: TIMEOUT.EXTRA_LONG }).should('contain', submissionBoxTime.toDateString().slice(4))
        cy.get('[data-cy="submissionBoxDesc"]', { timeout: TIMEOUT.EXTRA_LONG }).should('contain', submissionBoxDescription)

        cy.get('[data-cy="edit-icon"]').should('be.visible').click()
        // Determine if title values are correct and change values
        cy.get('[data-cy="submissionBoxTitleEditing"]').should('be.visible').click()
        cy.get('[data-cy="submissionBoxTitleEditing"]').focused().should('have.value', submissionBoxTitle2)
        cy.get('[data-cy="submissionBoxTitleEditing"]').focused().clear().type(newTitle).should('have.value', newTitle)
        // Determine if description values are correct and change values
        cy.get('[data-cy="submissionBoxDescEditing"]').should('be.visible').click()
        cy.get('[data-cy="submissionBoxDescEditing"]').focused().should('have.value', submissionBoxDescription)
        cy.get('[data-cy="submissionBoxDescEditing"]').focused().clear().type(newDescription).should('have.value', newDescription)
        // Determine if date values are correct and change values
        cy.get('.data-cy-date-time-picker').should('be.visible').click()
        cy.get('.data-cy-date-time-picker').focused().should('have.value', submissionBoxTimeString)
        cy.get('.data-cy-date-time-picker').focused().clear().type(newTimeCharacters.replaceAll(' ', '')).should('have.value', newTimeDisplay)
        cy.get('[data-cy="updateButton"]').should('be.visible').click()

        cy.get('[data-cy="submissionBoxTitle"]').should('contain', newTitle)
        cy.get('[data-cy="submissionBoxDesc"]').should('contain', newDescription)
        cy.get('[data-cy="submissionBoxDate"]').should('contain', new Date('June 13, 2060 13:30:00').toDateString().slice(4))
    })

    it('should display a submission box, start to change it\'s information, cancel the operation and revert the fields to the original', () => {
        // Determine what the displayed date should be
        cy.get('[data-cy="Manage Boxes"]')
        cy.wait(1000)
        cy.get('[data-cy="Manage Boxes"]').click()

        cy.get(`[data-cy="${ submissionBoxTitle2 }"]`)
        cy.wait(1000)   // Waiting for it to be clickable
        cy.get(`[data-cy="${ submissionBoxTitle2 }"]`).click()

        cy.get('[data-cy="submissionBoxTitle"]', { timeout: TIMEOUT.EXTRA_LONG }).should('contain', submissionBoxTitle2)
        cy.get('[data-cy="submissionBoxDate"]', { timeout: TIMEOUT.EXTRA_LONG }).should('contain', submissionBoxTime.toDateString().slice(4))
        cy.get('[data-cy="submissionBoxDesc"]', { timeout: TIMEOUT.EXTRA_LONG }).should('contain', submissionBoxDescription)

        cy.get('[data-cy="edit-icon"]').should('be.visible').click()
        // Change title value
        cy.get('[data-cy="submissionBoxTitleEditing"]').should('be.visible').click()
        cy.get('[data-cy="submissionBoxTitleEditing"]').focused().clear().type(newTitle).should('have.value', newTitle)
        // Change description value
        cy.get('[data-cy="submissionBoxDescEditing"]').should('be.visible').click()
        cy.get('[data-cy="submissionBoxDescEditing"]').focused().clear().type(newDescription).should('have.value', newDescription)
        // Change time value
        cy.get('.data-cy-date-time-picker').should('be.visible').click()
        cy.get('.data-cy-date-time-picker').focused().clear().type(newTimeCharacters.replaceAll(' ', '')).should('have.value', newTimeDisplay)
        // Discard all changes
        cy.get('[data-cy="cancelButton"]').should('be.visible').click()
        // Values should revert to old values
        cy.get('[data-cy="submissionBoxTitle"]').should('contain', submissionBoxTitle2)
        cy.get('[data-cy="submissionBoxDesc"]').should('contain', submissionBoxDescription)
        cy.get('[data-cy="submissionBoxDate"]').should('contain', submissionBoxTime.toDateString().slice(4))
    })

    it('should not allow the form to submit with no title or and invalid date is entered', () => {
        const invalidTimeCharacters = '1995042312:00PM'

        cy.get('[data-cy="Manage Boxes"]')
        cy.wait(1000)
        cy.get('[data-cy="Manage Boxes"]').click()

        cy.get(`[data-cy="${ submissionBoxTitle1 }"]`)
        cy.wait(1000)   // Waiting for it to be clickable
        cy.get(`[data-cy="${ submissionBoxTitle1 }"]`).click()

        // Start the editing process
        cy.get('[data-cy="edit-icon"]').should('be.visible').click()
        // Determine that the title field is visible
        cy.get('[data-cy="submissionBoxTitleEditing"]').should('be.visible').click()
        cy.get('[data-cy="submissionBoxTitleEditing"]').focused().clear()
        cy.get('[data-cy="updateButton"]').should('be.visible').click()
        cy.get('p.Mui-error').should('have.length', 1)

        cy.get('.data-cy-date-time-picker').should('be.visible').click()
        cy.get('.data-cy-date-time-picker').focused().clear().type(invalidTimeCharacters)
        cy.get('[data-cy="updateButton"]').should('be.visible').click()
        // Verify that form was not submitted with invalid date
        cy.get('[data-cy="updateButton"]').should('be.visible')
    })
})
