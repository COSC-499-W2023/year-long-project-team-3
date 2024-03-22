describe('test send reset password email api', () => {
    const invalidEmail: string = 'awd'
    const emailWithNoUser: string = 'john@harpvideo.ca'
    const email = 'help@harpvideo.ca'
    const password = 'Password1'

    beforeEach(() => {
        cy.task('clearDB')
        cy.task('createUser', { email, password })
        cy.visit('/login')
    })

    it('should reject invalid emails', () => {
        fetch('/api/reset-password/send-email', {
            method: 'POST',
            body: JSON.stringify({
                invalidEmail,
            }),
        }).then((res: Response) => {
            expect(res.status).to.eq(500)
            res.text().then((jsonBody) => {
                const message = JSON.parse(jsonBody)
                expect(message.error).to.eq('Invalid email address')
            })
        })
    })

    it('should return success when no user detected in database', async () => {
        await fetch('/api/reset-password/send-email', {
            method: 'POST',
            body: JSON.stringify({
                emailWithNoUser,
            }),
        }).then((res: Response) => {
            expect(res.status).to.eq(201)
            res.text().then((jsonBody) => {
                const message = JSON.parse(jsonBody)
                expect(message.error).to.eq('Request Success')
            })
        })
    })

    it('should return success when valid email is found', async () => {
        await fetch('/api/reset-password/send-email', {
            method: 'POST',
            body: JSON.stringify({
                email,
            }),
        }).then((res: Response) => {
            expect(res.status).to.eq(201)
            res.text().then((jsonBody) => {
                const message = JSON.parse(jsonBody)
                expect(message.message).to.eq('Request Success')
            })
        })
    })
})
