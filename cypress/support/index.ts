// File defines custom commands into the Cypress namespace
declare namespace Cypress {
    interface Chainable {
        dataCy(value: string):  Cypress.Chainable<JQuery<HTMLElement>>
        typeDatePicker(selector: string, value: string):  Cypress.Chainable<JQuery<HTMLElement>>
    }
}
