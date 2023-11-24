import EditorTools from '@/components/EditorTools'
import { beforeEach } from 'mocha'

describe('Test editing tools', () => {
    beforeEach(() => {
        const onChangeSpy = cy.spy().as('onChangeSpy')
        cy.mount(<EditorTools setIsEditorChanged={onChangeSpy} />)
    })

    it('should have 4 buttons', () => {
        cy.get('.editor-tools').find('.MuiIconButton-root').should('have.length', 4)
    })

    it('should lift up if changes have been made', () => {
        cy.get('.MuiIconButton-root').first().click()

        cy.get('@onChangeSpy').should('have.been.calledWith', true)

        cy.get('.MuiIconButton-root').first().click()

        cy.get('@onChangeSpy').should('have.been.calledWith', false)
    })
})
