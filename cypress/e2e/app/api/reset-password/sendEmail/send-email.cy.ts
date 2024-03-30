describe('test send reset password email api', () => {
    const invalidEmail: string = 'awd'
    const emailWithNoUser: string = 'john@harpvideo.ca'
    const email = 'help@harpvideo.ca'
    const password = 'Password1'

    beforeEach(() => {
        cy.task('clearDB')
        cy.task('createUser', { email, password })
    })

    it('should reject invalid emails', () => {
        fetch('/api/reset-password/send-email', {
            method: 'POST',
            body: JSON.stringify({
                email: invalidEmail,
            }),
        }).then(async(res: Response) => {
            expect(res.status).to.eq(500)
            await res.text().then((jsonBody) => {
                const message = JSON.parse(jsonBody)
                expect(message.error).to.eq('Invalid email address')
            })
        })
        // Added wait as cypress was not waiting for the api assert before moving to the next test
        cy.wait(1000)
    })

    it('should return success when no user detected in database', async () => {
        await fetch('/api/reset-password/send-email', {
            method: 'POST',
            body: JSON.stringify({
                email: emailWithNoUser,
            }),
        }).then(async (res: Response) => {
            expect(res.status).to.eq(201)
            await res.text().then((jsonBody) => {
                const message = JSON.parse(jsonBody)
                expect(message.message).to.eq('Request Success')
            })
        })
        // Added wait as cypress was not waiting for the api assert before moving to the next test
        cy.wait(1000)
    })

    it('should return success when valid email is found', async () => {
        await fetch('/api/reset-password/send-email', {
            method: 'POST',
            body: JSON.stringify({
                email: email,
            }),
        }).then(async(res: Response) => {
            expect(res.status).to.eq(201)
            await res.text().then((jsonBody) => {
                const message = JSON.parse(jsonBody)
                expect(message.message).to.eq('Request Success')
            })
        })
        // Added wait as cypress was not waiting for the api assert before moving to the next test
        cy.wait(1000)
    })
})
