describe('test page', () => {
    it('Contains correct title and text', () => {
        cy.visit('/')
        cy.title().should('eq', 'Create Next App')
        cy.get('[data-test="page text"]').contains('Get started by editing')
    })
})
