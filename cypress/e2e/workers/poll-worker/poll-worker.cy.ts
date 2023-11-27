import { MOCKUSER } from '../../../utils/constants'

describe('Test Poll Worker Updates Database with Video Metadata', () => {
    before(() => {
        cy.task('clearDB')
        cy.task('populateDB')

        cy.session('testuser', () => {
            cy.visit('/login')
            cy.get('[data-cy=email]').type(MOCKUSER.email)
            cy.get('[data-cy=password]').type(MOCKUSER.password)
            cy.get('[data-cy=submit]').click()
            cy.url().should('not.contain', 'login')
        })
    })

    it('should upload video and redirect ', () => {
        cy.visit('/video/upload')
        cy.get('[data-cy=upload-button]').selectFile('public/videos/westminster.mp4')
        // .selectFile('public/videos/westminster.mp4', { action: 'drag-drop' })
        // cy.document().selectFile('public/videos/westminster.mp4', { action: 'drag-drop' })
    })
})
