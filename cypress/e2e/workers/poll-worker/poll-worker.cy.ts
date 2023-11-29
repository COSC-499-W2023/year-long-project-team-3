import { MOCKUSER } from '../../../utils/constants'
import { Video } from '@prisma/client'

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
        cy.get('[data-cy=test-input]').selectFile('cypress/data/lemons.mp4', { force: true })
        cy.url().should('contain', 'video/edit/')

        cy.task('getLatestVideo').then((response) => {
            cy.url().should('contain', `video/edit/${ (<Video>response).id }`)
        })
    })
})
