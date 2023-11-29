describe('Submission box request submissions tests', () => {
    before(() => {
        cy.task('clearDB')
    })

    beforeEach(() => {
        cy.task('clearDB')
    })

    it('Should allow user to click next', () => {
        cy.visit('/submission-box/request-submissions')

        cy.get('[data-cy="next"]').click()

        cy.url().should('include', '/submission-box/create')
    })

    it('Should let user add submission requests', () => {
        const requestedEmail = 'requested@mail.com'

        cy.visit('/submission-box/request-submissions')

        cy.get('[data-cy="email"]').type(requestedEmail)
        cy.get('[data-cy="add"]').click()

        cy.get('[data-cy="requested-email"]').should('contain', requestedEmail)
    })

    it('Should let user remove submission requests', () => {
        const requestedEmail = 'requested@mail.com'

        cy.visit('/submission-box/request-submissions')

        cy.get('[data-cy="email"]').type(requestedEmail)
        cy.get('[data-cy="add"]').click()

        cy.get('[data-cy="requested-email"]').should('contain', requestedEmail)

        cy.get('[data-cy="remove"]').click()

        cy.get('[data-cy="requested-email"]').should('not.exist')
    })

    it('Should not allow the user to add an empty email', () => {
        // Check that submitting with nothing in the field presents user with prompt and does not create a submission request card
        cy.visit('/submission-box/request-submissions')

        // Check that the errors do not exist
        cy.get('.MuiFormHelperText-root').should('have.length', 0)

        cy.get('[data-cy="add"]').click()

        cy.url().should('include', '/submission-box/request-submissions')

        cy.get('.MuiFormHelperText-root').should('have.length', 1)
        cy.get('[data-cy="email"]')
            .find('.MuiFormHelperText-root')
            .should('be.visible')
            .and('contain', 'To request a submission from someone, enter their email')
    })

    // TODO: test this. Cannot be tested currently as tests are run without user being logged in
    it.skip('Should not allow the user to add their own email', () => {
        cy.visit('/submission-box/request-submissions')
    })

    it('Should give the user error feedback for an invalid email', () => {
        // user data
        const testValues = [
            { email: 'badEmail', expectedResponse: 'Enter a valid email' },
            { email: 'incomplete@email', expectedResponse: 'Enter a valid email' },
            { email: 'incomplete@email.', expectedResponse: 'Enter a valid email' },
        ]

        // Check that a valid email must be entered
        cy.visit('/submission-box/request-submissions')

        cy.wrap(testValues).each((input: { email: string; expectedResponse: string }) => {
            cy.get('[data-cy="email"]').find('input').clear().type(input.email)
            cy.get('[data-cy="add"]').click()

            cy.url().should('include', '/submission-box/request-submissions')

            cy.get('[data-cy="email"]').find('p.Mui-error').should('be.visible').and('contain', input.expectedResponse)
        })
    })

    it('Should give the user error feedback for a duplicate email', () => {
        const requestedEmail = 'requested@mail.com'

        // Check that submitting with nothing in the field presents user with prompt and does not create a submission request
        cy.visit('/submission-box/request-submissions')

        // Check that the errors do not exist
        cy.get('p.Mui-error').should('have.length', 0)

        cy.get('[data-cy="email"]').type(requestedEmail)
        cy.get('[data-cy="add"]').click()

        cy.url().should('include', '/submission-box/request-submissions')

        cy.get('[data-cy="email"]').type(requestedEmail)
        cy.get('[data-cy="add"]').click()

        cy.url().should('include', '/submission-box/request-submissions')

        cy.get('p.Mui-error').should('have.length', 1)
        cy.get('[data-cy="email"]')
            .find('p.Mui-error')
            .should('be.visible')
            .and('contain', 'This email has already been added!')
    })

    it('Should let the user return to the previous page using the back button', () => {
        cy.visit('/submission-box/request-submissions')

        cy.get('[data-cy="back-button"]').click()

        cy.url().should('include', '/submission-box/settings')
    })
})
