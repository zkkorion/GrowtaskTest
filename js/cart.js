'use strict';

import Product from './product.js';

export default class Cart {
    productList = [];
    selectedProductIdList = [];
    formatPrice = window.Utils.formatPrice;
    productCardTemplate = document.querySelector('#productCard');
    productListContainer = document.querySelector('.productList');

    productCountlist = document.querySelectorAll('.productCount');
    totalOldPriceList = document.querySelectorAll('.cart__totalPrice');
    saleAmountList = document.querySelectorAll('.cart__saleAmount');
    totalPriceList = document.querySelectorAll('.cart__summAmount');

    promocodeUseList = document.querySelectorAll('.promocode__use');
    clearCartButton = document.querySelector('.clearCart__button');
    deleteSelectedButton = document.querySelector('.deleteSelected__button');

    productQuantity = 0;
    totalPriceValue = 0;
    totalOldPrice = 0;
    sale = 0;
    promocodeUsed = false;

    amountChange = (type, price, old_price) => {
        if (type === 'increase') {
            this.productQuantity++;
            this.totalOldPrice += old_price ?? price;
            this.totalPriceValue += price;
        } else if (type === 'decrease') {
            this.productQuantity--;
            this.totalOldPrice -= old_price ?? price;
            this.totalPriceValue -= price;
        }
        this.sale = this.totalOldPrice - this.totalPriceValue;
        this.render();
    };

    deleteProduct = (id) => {
        const deletedProduct = this.productList.find(item => item.parameters.id === id);
        this.productList = this.productList.filter(item => item.parameters.id !== id);
        this.productListContainer.querySelector(`#id${id}`).remove();
        this.productQuantity -= deletedProduct.parameters.quantity;
        this.totalOldPrice -= (deletedProduct.parameters.old_price ?? deletedProduct.parameters.price) * deletedProduct.parameters.quantity;
        this.totalPriceValue -= deletedProduct.totalPrice;
        this.sale = this.totalOldPrice - this.totalPriceValue;
        this.render();
    };

    selectProduct = (id, isSelected) => {
        if (isSelected) {
            this.selectedProductIdList.push(id);
        } else {
            this.selectedProductIdList = this.selectedProductIdList.filter(item => item !== id);
        }
    };

    init() {
        this.loadProducts().then(list => {
            list.forEach(item => {
                const fragment = this.productCardTemplate.content.cloneNode(true);
                const productCard = fragment.firstElementChild;
                const product = new Product(item, productCard, this.amountChange, this.deleteProduct, this.selectProduct);
                this.productListContainer.appendChild(product.node);
                this.productList.push(product);
                this.productQuantity += item.quantity;
                this.totalOldPrice += (item.old_price ?? item.price) * item.quantity;
                this.totalPriceValue += (item.price * item.quantity);
                this.sale = this.totalOldPrice - this.totalPriceValue;
            });
            this.render();
            this.promocodeInit();
            this.clearCartButton.addEventListener('click', () => this.clearProductList());
            this.deleteSelectedButton.addEventListener('click', () => this.deleteSelectedProducts());
        });
    }

    loadProducts() {
        return fetch(window.Config.PRODUCTS_ENDPOINT, { headers: { Accept: 'application/json' } })
            .then((response) => {
                if (!response.ok) throw new Error('HTTP ' + response.status);
                return response.json();
            })
            .then(json => {
                return mock;
                return json.data;
            })
            .catch((error) => {
                console.warn(error.message);
                return [];
            });
    }

    render() {
        this.productCountlist.forEach(item => item.innerText = this.productQuantity);
        this.totalOldPriceList.forEach(item => item.innerText = this.formatPrice(this.totalOldPrice));
        this.totalPriceList.forEach(item => item.innerText = this.formatPrice(this.totalPriceValue));
        this.saleAmountList.forEach(item => item.innerText = this.formatPrice(this.sale));
    }

    promocodeInit() {
        this.promocodeUseList.forEach(button => {
            button.addEventListener('click', () => {
                const promocode = button.closest('.promocode__content')?.querySelector('.promocodeInput').value;
                if (promocode == window.Config.PROMO_CODES.GROWTASK2026.code && !this.promocodeUsed) {
                    this.totalPriceValue *= (1 - window.Config.PROMO_CODES.GROWTASK2026.value);
                    this.sale = this.totalOldPrice - this.totalPriceValue;
                    this.promocodeUsed = true;
                    this.render();
                }
            });
        });
    }

    addPromocode() {
        this.totalPriceValue *= (1 - window.Config.PROMO_CODES.GROWTASK2026.value);
        this.sale = this.totalOldPrice - this.totalPriceValue;
    }

    clearProductList() {
        this.productList = [];
        this.productQuantity = 0;
        this.totalOldPrice = 0;
        this.totalPriceValue = 0;
        this.sale = 0;
        this.render();
        while (this.productListContainer.firstChild) {
            this.productListContainer.removeChild(this.productListContainer.firstChild);
        }

    }

    deleteSelectedProducts() {
        this.selectedProductIdList.forEach(id => this.deleteProduct(id));
        this.selectedProductIdList = [];
    }

}

var mock = [
    {
        "id": 1,
        "name": "Аудиокассета",
        "price": 100,
        "old_price": 150,
        "image": "http://growtask.ru/assets/img/products/cassette.png",
        "sku": "RT-CAS-001",
        "quantity": 2
    },
    {
        "id": 2,
        "name": "Видеомагнитофон",
        "price": 200,
        "old_price": 200,
        "image": "http://growtask.ru/assets/img/products/multimedia.png",
        "sku": "RT-VCR-002",
        "quantity": 1
    },
    {
        "id": 3,
        "name": "Кассетный плеер",
        "price": 300,
        "old_price": null,
        "image": "http://growtask.ru/assets/img/products/player.png",
        "sku": "RT-PLR-003",
        "quantity": 1
    },
];
