'use strict';

import Product from './product.js';

export default class Cart extends EventTarget {
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

    renderEvent = new CustomEvent('render');

    getProductList = () => this.productList;

    init() {
        return this.loadProducts().then(list => {
            list.forEach(item => {
                const fragment = this.productCardTemplate.content.cloneNode(true);
                const productCard = fragment.firstElementChild;
                const product = new Product();
                product.init(item, productCard, this.amountChange, this.deleteProduct, this.selectProduct);
                this.productListContainer.appendChild(product.node);
                this.productList.push(product);
            });
            this.calculate();
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
                // return mock;
                return json.data;
            })
            .catch((error) => {
                console.warn(error.message);
                return [];
            });
    }

    amountChange = () => {
        this.calculate();
        this.render();
    };

    deleteProduct = (id) => {
        this.productList = this.productList.filter(item => item.parameters.id !== id);
        this.productListContainer.querySelector(`#id${id}`).remove();
        this.calculate();
        this.render();
    };

    selectProduct = (id, isSelected) => {
        if (isSelected) {
            this.selectedProductIdList.push(id);
        } else {
            this.selectedProductIdList = this.selectedProductIdList.filter(item => item !== id);
        }
    };

    clearProductList() {
        this.clearValues();
        this.productList = [];
        this.promocodeUsed = false;
        this.render();
        while (this.productListContainer.firstChild) {
            this.productListContainer.removeChild(this.productListContainer.firstChild);
        }

    }

    deleteSelectedProducts() {
        this.productList = this.productList.filter(item => !this.selectedProductIdList.includes(item.parameters.id));
        this.selectedProductIdList = [];
        this.calculate();
        this.render();
    }

    promocodeInit() {
        this.promocodeUseList.forEach(button => {
            button.addEventListener('click', () => {
                const promocode = button.closest('.promocode__content')?.querySelector('.promocodeInput').value;
                if (promocode == window.Config.PROMO_CODES.GROWTASK2026.code && !this.promocodeUsed) {
                    this.promocodeUsed = true;
                    this.calculate();
                    this.render();
                }
            });
        });
    }

    calculate() {
        this.clearValues();
        this.productList.forEach(item => {
            this.productQuantity += item.parameters.quantity;
            this.totalOldPrice += (item.parameters.old_price ?? item.parameters.price) * item.parameters.quantity;
            this.totalPriceValue += (item.parameters.price * item.parameters.quantity);
        });
        if (this.promocodeUsed) {
            this.totalPriceValue *= (1 - window.Config.PROMO_CODES.GROWTASK2026.value);
        }
        this.sale = this.totalOldPrice - this.totalPriceValue;
    }

    clearValues() {
        this.productQuantity = 0;
        this.totalOldPrice = 0;
        this.totalPriceValue = 0;
        this.sale = 0;
    }

    render() {
        this.productCountlist.forEach(item => item.innerText = this.productQuantity);
        this.totalOldPriceList.forEach(item => item.innerText = this.formatPrice(this.totalOldPrice));
        this.totalPriceList.forEach(item => item.innerText = this.formatPrice(this.totalPriceValue));
        this.saleAmountList.forEach(item => item.innerText = this.formatPrice(this.sale));
        this.dispatchEvent(this.renderEvent);
        swiper.update();
    }

    getCartAmmount() {
        return {
            quantity: this.productQuantity,
            old_price: this.totalOldPrice,
            price: this.totalPriceValue,
            discount: this.sale,
        };
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
