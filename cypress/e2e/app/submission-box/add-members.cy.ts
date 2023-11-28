describe('Submission box settings tests', () => {
    // before(() => {
    //     cy.task('clearDB')
    // })
    //
    // beforeEach(() => {
    //     cy.task('clearDB')
    // })

    it('Should have the owner as a member', () => {
        cy.visit('/submission-box/add-members')
        cy.get('[data-cy="card"]').find('[data-cy="card-content"]').find('[data-cy="member-role"]').contains('Owner')
    })

    it('Should allow user to click next', () => {
        cy.visit('/submission-box/add-members')

        cy.get('[data-cy="next"]').click()

        cy.url().should('include', '/submission-box/create')
    })

    it('Should let user add members', () => {
        const memberEmail = 'member@mail.com'
        const memberRole = 'Member'

        cy.visit('/submission-box/add-members')

        cy.get('[data-cy="email"]').type(memberEmail)
        cy.get('[data-cy="add"]').click()

        cy.get('[data-cy="member-email"]').eq(1).should('contain', memberEmail)
        cy.get('[data-cy="member-role"]').eq(1).should('contain', memberRole)
    })

    it('Should let user remove members', () => {
        const memberEmail = 'member@mail.com'
        const memberRole = 'Member'

        cy.visit('/submission-box/add-members')

        cy.get('[data-cy="email"]').type(memberEmail)
        cy.get('[data-cy="add"]').click()

        cy.get('[data-cy="member-email"]').eq(1).should('contain', memberEmail)
        cy.get('[data-cy="member-role"]').eq(1).should('contain', memberRole)

        cy.get('[data-cy="remove"]').eq(1).click()

        cy.get('[data-cy="member-email"]').eq(1).should('not.exist')
        cy.get('[data-cy="member-role"]').eq(1).should('not.exist')
    })

    it('Should not allow the user to add an empty email', () => {
        // Check that submitting with nothing in the field presents user with prompt and does not create a member
        cy.visit('/submission-box/add-members')

        // Check that the errors do not exist
        cy.get('.MuiFormHelperText-root').should('have.length', 0)

        cy.get('[data-cy="add"]').click()

        cy.url().should('include', '/submission-box/add-members')

        cy.get('.MuiFormHelperText-root').should('have.length', 1)
        cy.get('[data-cy="email"]')
            .find('.MuiFormHelperText-root')
            .should('be.visible')
            .and('contain', 'To add a member, enter their email')
    })

    it('Should give the user error feedback for an invalid email', () => {
        // user data
        const testValues = [
            { email: 'badEmail', expectedResponse: 'Enter a valid email' },
            { email: 'incomplete@email', expectedResponse: 'Enter a valid email' },
            { email: 'incomplete@email.', expectedResponse: 'Enter a valid email' },
        ]

        // Check that a valid email must be entered
        cy.visit('/submission-box/add-members')

        cy.wrap(testValues).each((input: { email: string; expectedResponse: string }) => {
            cy.get('[data-cy="email"]').find('input').clear().type(input.email)
            cy.get('[data-cy="add"]').click()

            cy.url().should('include', '/submission-box/add-members')

            cy.get('[data-cy="email"]').find('p.Mui-error').should('be.visible').and('contain', input.expectedResponse)
        })
    })

    it('Should give the user error feedback for a duplicate email', () => {
        const memberEmail = 'member@mail.com'

        // Check that submitting with nothing in the field presents user with prompt and does not create a member
        cy.visit('/submission-box/add-members')

        // Check that the errors do not exist
        cy.get('p.Mui-error').should('have.length', 0)

        cy.get('[data-cy="email"]').type(memberEmail)
        cy.get('[data-cy="add"]').click()

        cy.url().should('include', '/submission-box/add-members')

        cy.get('[data-cy="email"]').type(memberEmail)
        cy.get('[data-cy="add"]').click()

        cy.url().should('include', '/submission-box/add-members')

        cy.get('p.Mui-error').should('have.length', 1)
        cy.get('[data-cy="email"]')
            .find('p.Mui-error')
            .should('be.visible')
            .and('contain', 'This member has already been added!')
    })

    it('Should let the user return to the previous page using the back button', () => {
        cy.visit('/submission-box/add-members')

        cy.get('[data-cy="back-button"]').click()

        cy.url().should('include', '/submission-box/settings')
    })
})
