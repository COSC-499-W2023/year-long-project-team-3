import { v4 as uuidv4 } from 'uuid'

describe('Test landing page', () => {
    it('Contains landing app bar with correct text', () => {
        cy.visit('/')
        cy.title().should('eq', 'Harp Video - A Secure Platform for Anonymous Video Submission')
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
        cy.get('[data-cy="home-page-button"]').contains('Learn More')
    })

    it('Should navigate to Learn More page after clicking on Learn More', () => {
        cy.visit('/')
        cy.get('[data-cy="home-page-button"]').contains('Learn More').click()
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

    it('Should navigate to Dashboard page after clicking Dashboard Tab after logged in', () => {
        cy.task('clearDB')

        const email = 'user' + uuidv4() + '@example.com'
        const password = 'Password1'

        // Sign up
        cy.task('createUser', { email, password })

        // Login
        cy.visit('/login')
        cy.get('[data-cy=email]').type(email)
        cy.get('[data-cy=password]').type(password)
        cy.get('[data-cy=submit]').wait(1000).click()
        cy.url().should('not.contain', 'login')

        cy.visit('/')
        cy.get('[data-cy="dashboard-tab"]').click()
        cy.url().should('include', '/dashboard')
    })

    it('Should navigate to Learn More page after clicking Learn More Tab after logged in', () => {
        cy.task('clearDB')

        const email = 'user' + uuidv4() + '@example.com'
        const password = 'Password1'

        // Sign up
        cy.task('createUser', { email, password })

        // Login
        cy.visit('/login')
        cy.get('[data-cy=email]').type(email)
        cy.get('[data-cy=password]').type(password)
        cy.get('[data-cy=submit]').click()
        cy.url().should('not.contain', 'login')

        cy.visit('/')
        cy.get('[data-cy="learn-more-tab"]').click()
        cy.url().should('include', '/learn-more')
        cy.get('[data-cy="title"]').contains('How to use Harp Video')
    })

})
