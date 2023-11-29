import ProgressDots from '@/components/ProgressDots'

describe('Test progress dots', () => {
    it('should color the correct number of dots', () => {
        const size = 3

        cy.wrap(new Array(size)).each((_, i) => {
            cy.mount(<ProgressDots activeStep={i} numSteps={size} />)

            // Should have i completed steps
            cy.get('.MuiSvgIcon-root.Mui-completed').should('have.length', i)

            // Should have 1 active step
            cy.get('.MuiSvgIcon-root.Mui-active').should('have.length', 1)

            // Should have 3-i disabled steps
            cy.get('.Mui-disabled .MuiSvgIcon-root').should('have.length', size - i - 1)
        })
    })

    it('should create the right number of dots', () => {
        cy.wrap([1, 2, 3, 8]).each((item: number) => {
            cy.mount(<ProgressDots activeStep={0} numSteps={item} />)

            cy.get('.MuiSvgIcon-root').should('have.length', item)
        })
    })

    it('should have all provided labels', () => {
        const labels = ['label1', 'label2', 'label3']

        cy.mount(<ProgressDots activeStep={0} numSteps={labels.length} labels={labels} />)

        cy.get('.MuiStepLabel-label').each((el, i) => {
            cy.wrap(el).should('contain.text', labels[i])
        })
    })
})
