describe('test page', () => {
    it('Contains correct title and text', () => {
        cy.visit('/')
        cy.title().should('eq', 'Harp: A Secure Platform for Videos')
        cy.get('h1').contains('Harp')
    })
})
