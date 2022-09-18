class Address{
    validateRequiredFields(){
        cy.get('#checkout-addresses-step').within(()=>{
            cy.get('[name="address1"]').then($el => $el[0].checkValidity()).should('be.false')
            cy.get('[name="city"]').then($el => $el[0].checkValidity()).should('be.false')
            cy.get('[name="id_state"]').then($el => $el[0].checkValidity()).should('be.false')
            cy.get('[name="postcode"]').then($el => $el[0].checkValidity()).should('be.false')
        })
    }
    fillForm(){
        cy.get('#checkout-addresses-step').within(()=>{
            cy.get('[name="firstname"]').clear().type('Primeiro Nome')
            cy.get('[name="lastname"]').clear().type('Segundo Nome')
            cy.get('[name="address1"]').type('Narnia')
            cy.get('[name="city"]').type('Roma')
            cy.get('[name="id_state"]').select('Alabama')
            cy.get('[name="postcode"]').type('00000')
        })
    }
    submit(){
        cy.get('[name="confirm-addresses"]').click()
    }
}
export default new Address