describe('Login tests', () => {
    before(() => {
        cy.task('clearDB')
    })

    it('Should not allow the user to log in with no information in fields', () => {
        // Check that submitting with nothing in the fields presents user with prompts and does not create a user
        cy.visit('/login')

        // Check that the errors do not exist
        cy.get('p.Mui-error').should('have.length', 0)

        cy.get('[data-cy="submit"]').click()

        cy.url().should('include', '/login')

        cy.get('p.Mui-error').should('have.length', 2)
        cy.get('[data-cy="email"]').find('p.Mui-error').should('be.visible').and('contain', 'Email is required')
        cy.get('[data-cy="password"]').find('p.Mui-error').should('be.visible').and('contain', 'Enter your password')
    })

    it('Should give the user error feedback for an invalid email', () => {
        // user data
        const testValues = [
            { email: 'badEmail', expectedResponse: 'Enter a valid email' },
            { email: 'incomplete@email', expectedResponse: 'Enter a valid email' },
        ]

        // Check that a valid email must be entered
        cy.visit('/login')

        cy.wrap(testValues).each((input: { email: string; expectedResponse: string }) => {
            cy.get('[data-cy="email"]').find('input').clear().type(input.email)
            cy.get('[data-cy="submit"]').click()

            cy.url().should('include', '/login')

            cy.get('[data-cy="email"]').find('p.Mui-error').should('be.visible').and('contain', input.expectedResponse)
        })
    })
})
