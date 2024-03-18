describe('test new video upload api', () => {
    const validVideoTitle: string = 'Spanish Test 1'
    const validVideoDescription: string = 'John Smith submission for spoken Spanish test 1'
    const validFaceBlur: string = 'false'
    const fileName = 'lemons.mp4'

    function createValidVideoUploadForm() {
        const videoUploadForm: FormData = new FormData()
        videoUploadForm.append('title', validVideoTitle)
        videoUploadForm.append('description', validVideoDescription)
        videoUploadForm.append('blurFace', validFaceBlur)
        return videoUploadForm
    }

    context('Logged out', () => {
        it('should reject any request if not logged in', () => {
            const videoUploadForm = createValidVideoUploadForm()
            cy.fixture(fileName, 'binary').then((binaryFile) => {
                const blobFile = Cypress.Blob.binaryStringToBlob(binaryFile)
                videoUploadForm.append('file', blobFile)
                fetch('/api/video/upload', {
                    method: 'POST',
                    body: videoUploadForm,
                }).then(async (response) => {
                    expect(response.status).to.eq(401)
                    const body = await response.json()
                    expect(body.error).to.eq('Unauthorized')
                })
            })
        })
    })

    context('Logged in', () => {
        beforeEach(() => {
            cy.task('clearDB')

            const email = 'user@example.com'
            const password = 'Password1'

            // Sign up
            cy.task('createUser', { email, password })

            // Login
            cy.visit('/login')
            cy.get('[data-cy=email]').type(email)
            cy.get('[data-cy=password]').type(password)
            cy.get('[data-cy=submit]').click()
            cy.url().should('not.contain', 'login')
        })

        it('should return the video file created',  () => {
            const videoUploadForm = createValidVideoUploadForm()
            cy.fixture(fileName, 'binary').then(async (binaryFile) => {
                const blobFile = Cypress.Blob.binaryStringToBlob(binaryFile)
                videoUploadForm.append('file', blobFile)
                await fetch('/api/video/upload', {
                    method: 'POST',
                    body: videoUploadForm,
                }).then(async (response) => {
                    expect(response.status).to.eq(201)
                    const body = await response.json()
                    expect(body.video).to.exist
                    expect(body.video.title).to.eq(validVideoTitle)
                    expect(body.video.description).to.eq(validVideoDescription)
                })
            })
        })

        it('should return error if no title is present', () => {
            const videoUploadForm = new FormData()
            videoUploadForm.append('description', '')
            videoUploadForm.append('blurFace', 'true')
            cy.fixture(fileName, 'binary').then(async (binaryFile) => {
                const blobFile = Cypress.Blob.binaryStringToBlob(binaryFile)
                videoUploadForm.append('file', blobFile)
                await fetch('/api/video/upload', {
                    method: 'POST',
                    body: videoUploadForm,
                }).then(async (response) => {
                    expect(response.status).to.eq(400)
                    const body = await response.json()
                    expect(body.error).to.eq('Video title is required')
                })
            })
        })

        it('should return error if no file is present or file is a string', async () => {
            const videoUploadForm = new FormData()
            videoUploadForm.append('title', 'Video Title')
            videoUploadForm.append('description', '')
            videoUploadForm.append('blurFace', 'true')
            await fetch('/api/video/upload', {
                method: 'POST',
                body: videoUploadForm,
            }).then(async (response) => {
                expect(response.status).to.eq(400)
                const body = await response.json()
                expect(body.error).to.eq('Video file is required')
            })
            videoUploadForm.append('file', 'lemons.mp4')
            await fetch('/api/video/upload', {
                method: 'POST',
                body: videoUploadForm,
            }).then(async (response) => {
                expect(response.status).to.eq(400)
                const body = await response.json()
                expect(body.error).to.eq('Video file is required')
            })
        })

        it('should return error if file is not mp4 or mov', () => {
            const videoUploadForm = new FormData()
            videoUploadForm.append('title', 'Video Title')
            videoUploadForm.append('description', '')
            videoUploadForm.append('blurFace', 'true')
            cy.fixture('avi-sample-file.avi', 'binary').then(async (binaryFile) => {
                const blobFile = Cypress.Blob.binaryStringToBlob(binaryFile)
                videoUploadForm.append('file', blobFile)
                await fetch('/api/video/upload', {
                    method: 'POST',
                    body: videoUploadForm,
                }).then(async (response) => {
                    expect(response.status).to.eq(400)
                    const body = await response.json()
                    expect(body.error).to.eq('Video must be an mp4 or mov file')
                })
            })
        })

        it('should return error if no face blur selection', () => {
            const videoUploadForm = new FormData()
            videoUploadForm.append('title', 'Video Title')
            videoUploadForm.append('description', '')
            cy.fixture(fileName, 'binary').then(async (binaryFile) => {
                const blobFile = Cypress.Blob.binaryStringToBlob(binaryFile)
                videoUploadForm.append('file', blobFile)
                await fetch('/api/video/upload', {
                    method: 'POST',
                    body: videoUploadForm,
                }).then(async (response) => {
                    expect(response.status).to.eq(400)
                    const body = await response.json()
                    expect(body.error).to.eq('Face blur selection is required')
                })
            })
        })

        it('should return error if face blue selection is not a boolean', () => {
            const videoUploadForm = new FormData()
            videoUploadForm.append('title', 'Video Title')
            videoUploadForm.append('description', '')
            videoUploadForm.append('blurFace', 'trues')
            cy.fixture(fileName, 'binary').then(async (binaryFile) => {
                const blobFile = Cypress.Blob.binaryStringToBlob(binaryFile)
                videoUploadForm.append('file', blobFile)
                await fetch('/api/video/upload', {
                    method: 'POST',
                    body: videoUploadForm,
                }).then(async (response) => {
                    expect(response.status).to.eq(400)
                    const body = await response.json()
                    expect(body.error).to.eq('Face blur selection must be a boolean value')
                })
            })
            const videoUploadFormFalse = new FormData()
            videoUploadFormFalse.append('title', 'Video Title')
            videoUploadFormFalse.append('description', '')
            videoUploadFormFalse.append('blurFace', 'fals')
            cy.fixture(fileName, 'binary').then(async (binaryFile) => {
                const blobFile = Cypress.Blob.binaryStringToBlob(binaryFile)
                videoUploadFormFalse.append('file', blobFile)
                await fetch('/api/video/upload', {
                    method: 'POST',
                    body: videoUploadFormFalse,
                }).then(async (response) => {
                    expect(response.status).to.eq(400)
                    const body = await response.json()
                    expect(body.error).to.eq('Face blur selection must be a boolean value')
                })
            })
        })
    })
})
