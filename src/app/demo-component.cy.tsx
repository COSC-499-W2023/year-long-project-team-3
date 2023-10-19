import Demo from '@/app/demo-component'

describe('Demo Component', () => {
    const dateNow = new Date().toLocaleDateString()
    it('Default Message', () => {
        cy.mount(<Demo />)
        cy.get('#message').should('have.text', 'Hello World! Good Morning')
        cy.get('#date').should('have.text', "Today's date is: " + dateNow)
    })
    it('Good Evening Message', () => {
        cy.mount(<Demo greetings='Good Evening' />)
        cy.get('#message').should('have.text', 'Hello World! Good Evening')
        cy.get('#date').should('have.text', "Today's date is: " + dateNow)
    })
})
