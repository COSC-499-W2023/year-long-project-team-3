describe('test password reset api', () => {
    const email = 'help@harpvideo.ca'
    const password = 'Password1'
    const updatedPassword = 'Another1'

    beforeEach(() => {
        cy.task('clearDB')
        cy.task('createUser', { email, password })
    })

    it('should reject requests if password confirmation does not match password', () => {
        cy.task('createResetPasswordToken', email).then((token) => {
            fetch('/api/reset-password', {
                method: 'POST',
                body: JSON.stringify({
                    token: token,
                    password: updatedPassword,
                    passwordConfirmation: 'Another2',
                }),
            }).then(async (res: Response) => {
                expect(res.status).to.eq(400)
                await res.text().then((jsonBody) => {
                    const message = JSON.parse(jsonBody)
                    expect(message.error).to.eq('Passwords do not match')
                })
            })
        })
        // Added wait as cypress was not waiting for the api assert before moving to the next test
        cy.wait(1000)
    })

    it('should reject requests if password token is not found', () => {
        fetch('/api/reset-password', {
            method: 'POST',
            body: JSON.stringify({
                token: '1',
                password: updatedPassword,
                passwordConfirmation: updatedPassword,
            }),
        }).then(async(res: Response) => {
            expect(res.status).to.eq(400)
            await res.text().then((jsonBody) => {
                const message = JSON.parse(jsonBody)
                expect(message.error).to.eq('Invalid password reset token')
            })
        })
        // Added wait as cypress was not waiting for the api assert before moving to the next test
        cy.wait(1000)
    })

    it('should reject requests if password reset token is out of date', () => {
        cy.task('createResetPasswordToken', email).then((token) => {
            const date = new Date()
            date.setTime(date.getTime() - 15 * 60 * 1000)
            cy.task('editPasswordResetTokenDate', {token, date}).then(() => {
                fetch('/api/reset-password', {
                    method: 'POST',
                    body: JSON.stringify({
                        token: token,
                        password: updatedPassword,
                        passwordConfirmation: updatedPassword,
                    }),
                }).then(async (res: Response) => {
                    expect(res.status).to.eq(410)
                    await res.text().then((jsonBody) => {
                        const message = JSON.parse(jsonBody)
                        expect(message.error).to.eq('Password reset link expired')
                    })
                })
            })
            // Added wait as cypress was not waiting for the api assert before moving to the next test
            cy.wait(1000)
        })
    })

    it('should update password with valid token', () => {
        cy.task('createResetPasswordToken', email).then((token) => {
            fetch('/api/reset-password', {
                method: 'POST',
                body: JSON.stringify({
                    token: token,
                    password: updatedPassword,
                    passwordConfirmation: updatedPassword,
                }),
            }).then(async (res: Response) => {
                expect(res.status).to.eq(200)
                await res.text().then((jsonBody) => {
                    const message = JSON.parse(jsonBody)
                    expect(message.message).to.eq('Password has been reset')
                })
            })
        })
        // Added wait as cypress was not waiting for the api assert before moving to the next test
        cy.wait(1000)
    })
})
