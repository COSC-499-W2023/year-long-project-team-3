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
                fetch('/api/new/video/upload', {
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

        it('should return the video file created', () => {
            const videoUploadForm = createValidVideoUploadForm()
            cy.fixture(fileName, 'binary').then((binaryFile) => {
                const blobFile = Cypress.Blob.binaryStringToBlob(binaryFile)
                videoUploadForm.append('file', blobFile)
                fetch('/api/new/video/upload', {
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
    })
})
