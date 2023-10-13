import React from 'react'
import Home from './page'

describe('<Home />', () => {
    it('renders', () => {
        // See: https://on.cypress.io/mounting-react
        cy.mount(<Home />)
    })
})
