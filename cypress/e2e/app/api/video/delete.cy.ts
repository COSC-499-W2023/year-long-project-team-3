import { v4 as uuidv4 } from 'uuid'
import runWithRetry from "../../../../utils/runUntilExist";

describe('Test video deletion API', () => {
    it('should reject if not DELETE method', () => {
        const allOtherMethods = ['GET', 'POST', 'PUT', 'PATCH', 'OPTIONS', 'HEAD']
        allOtherMethods.forEach((method) => {
            cy.request({
                method: method,
                url: '/api/video/delete/randomVideoId',
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eq(405)
                expect(response.statusText).to.eq('Method Not Allowed')
            })
        })
    })

    it('should reject if provide videoId incorrectly', () => {
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

        cy.request({
            method: 'DELETE',
            url: '/api/video/delete/wrongVideoId',
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(500)
            expect(response.statusText).to.eq('Internal Server Error')
        })
    })

    it('should return 200 if videoId is correct', () => {
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

        const videoTitle = 'Video ' + uuidv4()

        cy.task('getUserId', email).then((userId) => {
            cy.task('createRequestSubmissionForUser', { userId }).then((submissionBoxId) => {
                cy.task('createOneVideoAndRetrieveVideoId', { ownerId: userId, title: videoTitle }).then((videoId) => {
                    // Retrieve the video
                    cy.request({
                        method: 'GET',
                        url: '/api/video/' + videoId,
                        failOnStatusCode: false,
                    }).then((response) => {
                        expect(response.status).to.eq(200)
                    })

                    // Delete the video
                    cy.request({
                        method: 'DELETE',
                        url: '/api/video/delete/' + videoId,
                    }).then((response) => {
                        expect(response.status).to.eq(200)
                    })

                    // check if the video is deleted
                    cy.request({
                        method: 'GET',
                        url: '/api/video/' + videoId,
                        failOnStatusCode: false,
                    }).then((response) => {
                        expect(response.status).to.eq(500)
                    })
                })
            })
        })
    })

    it('should not delete video if not the owner', () => {
        const email1 = 'user' + uuidv4() + '@example.com'
        const email2 = 'user' + uuidv4() + '@example.com'
        const password = 'Password1'

        // Sign up
        cy.task('createUser', { email: email1, password })
        cy.task('createUser', { email: email2, password })

        // Login user1
        cy.visit('/login')
        cy.get('[data-cy=email]').type(email1)
        cy.get('[data-cy=password]').type(password)
        cy.get('[data-cy=submit]').click()
        cy.url().should('not.contain', 'login')

        const videoTitle = 'Video ' + uuidv4()
        cy.task('getUserId', email1).then((userId) => {
            cy.task('createRequestSubmissionForUser', { userId }).then((submissionBoxId) => {
                cy.task('createOneVideoAndRetrieveVideoId', { ownerId: userId, title: videoTitle }).then((videoId) => {
                    // Log out
                    runWithRetry(() => {
                        cy.get('[data-cy="sign-out-button"]').click({ force: true })
                        cy.wait(2000)
                    })

                    // Login user2
                    cy.visit('/login')
                    cy.get('[data-cy=email]').type(email2)
                    cy.get('[data-cy=password]').type(password)
                    cy.get('[data-cy=submit]').click()
                    cy.url().should('not.contain', 'login')

                    // Delete the video
                    cy.request({
                        method: 'DELETE',
                        url: '/api/video/delete/' + videoId,
                        failOnStatusCode: false,
                    }).then((response) => {
                        expect(response.status).to.eq(500)
                    })

                    // Log out
                    runWithRetry(() => {
                        cy.get('[data-cy="sign-out-button"]').click({ force: true })
                        cy.wait(2000)
                    })

                    // Login user1
                    cy.visit('/login')
                    cy.get('[data-cy=email]').type(email1)
                    cy.get('[data-cy=password]').type(password)
                    cy.get('[data-cy=submit]').click()
                    cy.url().should('not.contain', 'login')

                    // check if the video is still there
                    cy.request({
                        method: 'GET',
                        url: '/api/video/' + videoId,
                        failOnStatusCode: false,
                    }).then((response) => {
                        expect(response.status).to.eq(200)
                    })
                })
            })
        })
    })
})
