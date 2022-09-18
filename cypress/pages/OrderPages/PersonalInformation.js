class PersonalInfo{
    validateRequiredFields(){
        cy.get('#customer-form').within(()=>{
            cy.get('[name="firstname"]').then($el => $el[0].checkValidity()).should('be.false')
            cy.get('[name="lastname"]').then($el => $el[0].checkValidity()).should('be.false')
            cy.get('[name="email"]').then($el => $el[0].checkValidity()).should('be.false')
            cy.get('[name="psgdpr"]').then($el => $el[0].checkValidity()).should('be.false')
        })
    }
    fillForm(){
        cy.get('#customer-form').within(()=>{
            cy.get('[name="firstname"]').type('Primeiro Nome')
            cy.get('[name="lastname"]').type('Ultimo Nome')
            cy.get('[name="email"]').type('emailfalsodeteste@falsoprovedor.com')
            cy.get('[name="psgdpr"]').check()
        })
    }
    submit(){
        cy.get('[data-link-action="register-new-customer"]').click()
    }
}
export default new PersonalInfo