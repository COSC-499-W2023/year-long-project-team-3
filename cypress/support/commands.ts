/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add('dataCy', (value: string) => {
    return cy.get(`[data-cy=${ value }]`)
})

Cypress.Commands.add('typeDatePicker', (selector: string, value: string) => {
    cy.get('body').then(($body) => {
        // const mobilePickerSelector = `${ selector } input[readonly]`
        // const isMobile = $body.find(mobilePickerSelector).length > 0
        // if (isMobile) {
        //     // The MobileDatePicker component has readonly inputs and needs to
        //     // be opened and clicked on edit so its inputs can be edited
        //     cy.get(mobilePickerSelector).click()
        //     cy.get('[role="dialog"] [aria-label="calendar view is open, go to text input view"]').click()
        //     cy.get(`[role="dialog"] ${ selector }`).find('input').clear().type(value)
        //     cy.contains('[role="dialog"] button', 'OK').click()
        // } else {
        cy.get(selector).find('input', { force: true }).clear().type(value)
        // }
    })
})
