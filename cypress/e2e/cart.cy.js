/// <reference types="cypress"/>
import CartPage from "../pages/CartPage";
import ProductstPage from "../pages/ProductstPage";

const cartProductsCounter = 'span.cart-products-count'
const btn_proceedToCheckout = '.cart-summary > .checkout > button'
const productTitle = '.product-line-info > .label'
const btn_addToCart = '[data-button-action="add-to-cart"]'
const addedProduct = '.cart-items .cart-item'
const desiredQuantityOfProduct = '[name="product-quantity-spin"]'
const unitProductPrice = '.current-price > .price'
const totalProductPrice = '.product-price strong'
const subtotalCart = '#cart-subtotal-products > .value'
const shippingTax = '#cart-subtotal-shipping > span.value'
const totalCart = '.cart-total > .value'

describe('Cart Page', () => {
    beforeEach(() => {
        cy.visit('/')
    });
    
    it('deve contabilizar produtos no carrinho', () => {
        ProductstPage.addProductsToCart([2])
        cy.get(cartProductsCounter).contains('(1)')
        
        cy.visit('/')
        ProductstPage.addProductsToCart([3])
        cy.get(cartProductsCounter).contains('(2)')
    });

    it('deve ter produto adicionado para liberar botão de Checkout', () => {
        cy.visit('/cart')
        CartPage.isCartEmpty()
        cy.get(btn_proceedToCheckout).should('be.disabled')
    });

    
    context('Session com produtos no carrinho', () => {
        beforeEach(() => {
            cy.session('adicionando produtos ao carrinho', ()=>{
                cy.visit('/')
                ProductstPage.addProductsToCart([2, 4, 3])
            })
        });
        
        it('deve redirecionar para a página do produto listado', () => {
            cy.visit('/cart')
            cy.get(productTitle).eq(0).click()
            cy.get(btn_addToCart).should('be.visible')
        });

        it('deve exibir produtos adicionados', () => {
            cy.visit('/cart')
            cy.get(addedProduct).its('length').should('be.greaterThan', 0)
        });

        
        it('deve calcular o valor do produto pela quantidade', () => {
            cy.visit('/cart')
            let desiredQuantity = 2
            cy.get(desiredQuantityOfProduct)
                .eq(0)
                .clear()
                .type(`${desiredQuantity}{enter}`)
            cy.intercept('/demoprestashop/cart?ajax=1&action=refresh').as('updatedValue')
            cy.wait('@updatedValue')
            cy.get(unitProductPrice)
            .eq(0)
            .invoke('text')
            .then(s => s.replace('$', ''))
            .then(s => parseFloat(s))
            .then(unitPriceFloat => {
                cy.get(totalProductPrice)
                    .eq(0)
                    .invoke('text')
                    .then(s => s.replace('$', ''))
                    .then(s => parseFloat(s))
                    .should('equal', unitPriceFloat*desiredQuantity)
            })
        });

        it('deve calcular o valor total do pedido', () => {
            cy.visit('/cart')
            let subtotal
            let tax
            cy.get(subtotalCart)
                .invoke('text')
                .then(s => s.replace('$', ''))
                .then(s => parseFloat(s))
                .then(subtotalFloat => subtotal = subtotalFloat)
            cy.get(shippingTax)
                .invoke('text')
                .then(s => s.replace('$', ''))
                .then(s => parseFloat(s))
                .then(taxFloat => tax = taxFloat)
            cy.get(totalCart)
                .invoke('text')
                .then(s => s.replace('$', ''))
                .then(s => parseFloat(s))
                .then(total => {
                    let expectedTotal = subtotal + tax
                        expect(total).to.eq(expectedTotal)
                    })
            });

        it('deve persistir os produtos no carrinho', () => {
            cy.visit('/cart')
            cy.contains('.label', 'Continue shopping').click()
            cy.url().should('contain', Cypress.config().baseUrl)
            cy.visit('/cart')
            cy.get(addedProduct).its('length').should('be.greaterThan', 0)
        });
        
        it('deve remover produtos', () => {
            cy.visit('/cart')
            CartPage.clearCart()
            CartPage.isCartEmpty()
        });
    });
});