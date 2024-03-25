describe('Test that the API can update videos details', () => {
    beforeEach(() => {
        cy.task('clearDB')
    })

    context('logged out', () => {
        it('should not allow modifying video details when not logged in', () => {
            const email = 'video@owner.net'
            const password = 'P@ssw0rd'
            const title = 'Not Gonna work bruh'
            cy.task('createUser', { email, password })

            cy.task('getUserId', email).then((userId) => {
                cy.task('createOneVideoAndRetrieveVideoId', { ownerId: userId, title }).then((videoId) => {
                    fetch('/api/video/update/' + videoId, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            title: 'a title',
                            description: 'description',
                        }),
                    }).then(async (response) => {
                        expect(response.status).to.eq(401)
                        const body = await response.json()
                        expect(body.error).to.eq('You must be signed in to edit the video')
                    })
                })
            })
            cy.wait(1000)
        })
    })

    context('logged in', () => {
        const email = 'user@calling.api'
        const password = 'P@ssw0rd1'
        beforeEach(() => {
            // Sign up
            cy.task('createUser', { email, password })

            // Login
            cy.visit('/login')
            cy.get('[data-cy=email]').type(email)
            cy.get('[data-cy=password]').type(password)
            cy.get('[data-cy=submit]').click()
            cy.url().should('not.contain', 'login')
        })

        it('should not allow modifying the video details if the user does not own the video', () => {
            const otherEmail = 'video@owner.net'
            const title = 'not authorized bruh'
            // Create the video owner and create video
            cy.task('createUser', { email: otherEmail, password })

            cy.task('getUserId', otherEmail).then((userId) => {
                cy.task('createOneVideoAndRetrieveVideoId', { ownerId: userId, title }).then((videoId) => {
                    fetch('/api/video/update/' + videoId, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            title: 'a title',
                            description: 'description',
                        }),
                    }).then(async (response) => {
                        expect(response.status).to.eq(403)
                        const body = await response.json()
                        expect(body.error).to.eq('Forbidden')
                    })
                })
            })
            cy.wait(1000)
        })

        it('should not allow no title to be entered when modifying a videos details', () => {
            const title = 'a proper title'
            cy.task('getUserId', email).then((userId) => {
                cy.task('createOneVideoAndRetrieveVideoId', {ownerId: userId, title }).then((videoId) => {
                    fetch('/api/video/update/' + videoId, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            title: '',
                        }),
                    }).then(async (response) => {
                        expect(response.status).to.eq(500)
                        const body = await response.json()
                        expect(body.error).to.eq('No title provided')
                    })
                })
            })
            cy.wait(1000)
        })

        it.skip('should not allow modifying the details of a video still being processed', () => {
            const title = 'a proper title'
            cy.task('getUserId', email).then((userId) => {
                cy.task('createOneVideoAndRetrieveVideoId', {ownerId: userId, title }).then((videoId) => {
                    fetch('/api/video/update/' + videoId, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            title: '',
                        }),
                    }).then(async (response) => {
                        expect(response.status).to.eq(500)
                        const body = await response.json()
                        expect(body.error).to.eq('No title provided')
                    })
                })
            })
            cy.wait(1000)
        })

        it('should ALLOW modifying video details when the user owns the video and enters a valid title and description', () => {
            const title = 'Can I get a 200'
            cy.task('getUserId', email).then((userId) => {
                cy.task('createOneVideoAndRetrieveVideoId', {ownerId: userId, title }).then((videoId) => {
                    fetch('/api/video/update/' + videoId, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            title: 'A good title',
                            description: 'Also a good description',
                        }),
                    }).then(async (response) => {
                        expect(response.status).to.eq(200)
                        const body = await response.json()
                        expect(body.video).to.exist
                        expect(body.video.title).to.eq('A good title')
                        expect(body.video.description).to.eq('Also a good description')
                    })
                })
            })
            cy.wait(1000)
            cy.reload()
        })
    })
})
