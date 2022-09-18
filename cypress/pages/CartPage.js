class Cart{

    clearCart(){
        cy.get('.cart-items .cart-item').each(() =>{
            cy.get('[data-link-action="delete-from-cart"]')
            .eq(0)
            .click()
            .should('not.exist')
        })
    }

    isCartEmpty(){
        cy.get('.cart-items .cart-item').should('have.length', '0')
        cy.contains('.no-items', 'There are no more items in your cart').should('be.visible')
    }

}

export default new Cart