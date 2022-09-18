/// <reference types="cypress"/>

import Address from "../pages/OrderPages/Address";
import PersonalInformation from "../pages/OrderPages/PersonalInformation";
import ProductsPage from "../pages/ProductstPage";

const btn_confirmPersonalInfo = '[data-link-action="register-new-customer"]'
const btn_confirmDelivery = '[name="confirmDeliveryOption"]'
const btn_confirmPayment = '#payment-confirmation button'
const opt_payByBankWire = 'input#payment-option-2'
const checkbox_termsOfService = '[name="conditions_to_approve[terms-and-conditions]"]'

describe('Checkout', () => {    
    it('deve impedir acesso à página Checkout com o carrinho vazio', () => {
        cy.visit('/order')
        // Valida se é redirecionado para o Carrinho
        cy.url().should('equal', Cypress.config().baseUrl+'/cart')
    });

    it('deve finalizar compra com sucesso', () => {
        cy.visit('/')
        ProductsPage.addProductsToCart([5])

        cy.visit('/order')
        // Preenche corretamente os Dados Pessoais
        PersonalInformation.fillForm()
        PersonalInformation.submit()

        // Preenche corretamente o Endereço
        Address.fillForm()
        Address.submit()

        // Confirma o método de entrega
        cy.get(btn_confirmDelivery).click()

        // Valida se o botão de confirmar pagamente está desativado
        cy.get(btn_confirmPayment).should('be.disabled')

        // Escolhe um método de pagamento
        cy.get(opt_payByBankWire).check()

        // Valida se botão de confirmar pagamento só é clicável 
        // quando também for aceito os Termos de Serviço
        cy.get(btn_confirmPayment).should('be.disabled')

        // Aceita os Termos de Serviço
        cy.get(checkbox_termsOfService).check()

        cy.get(btn_confirmPayment).should('not.be.disabled').click()

        // Valida finalização da compra
        cy.contains('h3', 'Your order is confirmed').should('be.visible')
        cy.contains('#content-hook_order_confirmation p', 'An email has been sent to the').should('be.visible')
    });

    context('Session com produtos no carrinho', () => {
        beforeEach(() => {
            cy.session('adicionando produtos ao carrinho', ()=>{
                cy.visit('/')
                ProductsPage.addProductsToCart([3])
            })
        });
    
        it('deve exigir preenchimento dos Dados Pessoais', () => {
            cy.visit('/order')
            // Tenta continuar sem preencher dados pessoais
            cy.get(btn_confirmPersonalInfo).click()
            // Valida se os campos obrigatórios estão como invalidos
            PersonalInformation.validateRequiredFields()
        });
        
        it('deve exigir preenchimento do Endereço', () => {
            cy.visit('/order')
            // Preenche corretamente a etapa de Dados Pessoais
            PersonalInformation.fillForm()
            PersonalInformation.submit()
            // Valida se os campos obrigatórios são cobrados
            Address.submit()
            Address.validateRequiredFields()
        });
    
        it('deve exigir preenchimento do Método de Pagamento', () => {
            cy.visit('/order')
            // Preenche corretamente os Dados Pessoais
            PersonalInformation.fillForm()
            PersonalInformation.submit()
    
            // Preenche corretamente o Endereço
            Address.fillForm()
            Address.submit()
    
            // Confirma o método de entrega
            cy.get(btn_confirmDelivery).click()
    
            // Valida se o botão de confirmar pagamento está desativado
            cy.get(btn_confirmPayment).should('be.disabled')
    
            // Escolhe um método de pagamento
            cy.get(opt_payByBankWire).check()
    
            // O botão de "Confirmar Pagamento" só deve ser clicável 
            // quando também for aceito os Termos de Serviço
            cy.get(btn_confirmPayment).should('be.disabled')
    
            // Aceita os Termos de Serviço
            cy.get(checkbox_termsOfService).check()
            
            // O botão de "Confirmar Pagamento" deve ser clicável
            cy.get(btn_confirmPayment).should('not.be.disabled')
        });
    });
});