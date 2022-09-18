
class ProductsPage{
    
    addProductsToCart(products) {
        // Pecorre array de produtos
        products.forEach((product, index)=>{
            // Acessa a página do produto
            cy.get('.products article').eq(product).click()
            // Clica em Adicionar ao Carrinho de Compras
            cy.get('[data-button-action="add-to-cart"]')
                .should('be.visible')
                .click()
            cy.contains('#myModalLabel', 'Product successfully added to your shopping cart')
            // Voltará para a Home enquanto o array de produtos não terminar
            if(index+1 < products.length){
                cy.visit('/')
            }
        })
    }
}

export default new ProductsPage