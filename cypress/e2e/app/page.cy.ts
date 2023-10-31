describe('Test landing page', () => {
    it('Contains landing app bar with correct text', () => {
        cy.visit('/')
        cy.title().should('eq', 'Harp: A Secure Platform for Videos')
        cy.get('[data-cy="landing-page-app-bar"]').contains('Harp')
        cy.get('[data-cy="sign-up-button"]').contains('Sign Up')
        cy.get('[data-cy="login-button"]').contains('Login')
    })

    it('Should contain platform description', () => {
        cy.visit('/')
        cy.get('[data-cy="motto"]').contains('Secure Platform')
        cy.get('[data-cy="platform-description"]').contains('Professional video')
    })

    it('Should contain bottom buttons ', () => {
        cy.visit('/')
        cy.get('[data-cy="home-page-button"]').contains('Get Started')
        cy.get('[data-cy="home-page-button"]').contains('Find Out More')
    })

    it('Should navigate to Mission Statement page after clicking on Find Out More', () => {
        cy.visit('/')
        cy.get('[data-cy="home-page-button"]').contains('Find Out More').click()
        cy.url().should('include', '/find-out-more')
        cy.get('[data-cy="title"]').contains('Mission Statement')
    })

    it('Should navigate to Login page after clicking on Get Started', () => {
        cy.visit('/')
        cy.get('[data-cy="home-page-button"]').contains('Get Started').click()
        cy.url().should('include', '/login')
        cy.get('[data-cy="title"]').contains('Login')
    })
})
