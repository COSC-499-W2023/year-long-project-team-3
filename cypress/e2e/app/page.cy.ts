describe('Test landing page', () => {
    it('Contains landing app bar with correct text', () => {
        cy.visit('/')
        cy.title().should('eq', 'Harp: A Secure Platform for Anonymous Video Submission')
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

    it('Should navigate to Learn More page after clicking on Find Out More', () => {
        cy.visit('/')
        cy.get('[data-cy="home-page-button"]').contains('Find Out More').click()
        cy.url().should('include', '/learn-more')
        cy.get('[data-cy="title"]').contains('How to use Harp Video')
    })

    it('Should navigate to Login page after clicking on Get Started', () => {
        cy.visit('/')
        cy.get('[data-cy="home-page-button"]').contains('Get Started').click()
        cy.url().should('include', '/login')
        cy.get('[data-cy="title"]').contains('Login')
    })

    it('Should navigate to Login page after clicking Dashboard Tab', () => {
        cy.visit('/')
        cy.get('[data-cy="dashboard-tab"]').click()
        cy.url().should('include', '/login')
        cy.get('[data-cy="title"]').contains('Login')
    })

    it('Should navigate to Learn More page after clicking Learn More Tab', () => {
        cy.visit('/')
        cy.get('[data-cy="learn-more-tab"]').click()
        cy.url().should('include', '/learn-more')
        cy.get('[data-cy="title"]').contains('How to use Harp Video')
    })
})
