'use strict';

export default class Product {
    parameters = {
        id: 1,
        name: 'Аудиокассета',
        price: 0,
        old_price: 0,
        image: 'http://growtask.ru/assets/img/products/cassette.png',
        sku: 'RT-CAS-001',
        quantity: 0
    };

    node;
    onAmountChange;
    image;
    article;
    name;
    price;
    oldPrice;
    amountCount;
    amountValue;
    formatPrice = window.Utils.formatPrice;
    totalPrice;
    onDelete;
    onSelect;

    constructor(parameters, node, onAmountChange, onDelete, onSelect) {
        this.parameters = parameters;
        this.node = node;
        this.onAmountChange = onAmountChange;
        this.onDelete = onDelete;
        this.onSelect = onSelect;
        this.init();
        this.render();
    }

    init() {
        this.node.setAttribute('id', `id${this.parameters.id}`);
        this.image = this.node.querySelector('.productCard__image');
        this.article = this.node.querySelector('.productCard__article');
        this.name = this.node.querySelector('.productCard__name');
        this.price = this.node.querySelector('.productCardPrice');
        this.oldPrice = this.node.querySelector('.productCardOldPrice');
        this.amountCount = this.node.querySelector('.amount__count');
        this.amountValue = this.node.querySelector('.amount__value');
        this.node.querySelector('.selectProduct');
        this.node.querySelector('.productDecrease').addEventListener('click', () => this.decrease());
        this.node.querySelector('.productIncrease').addEventListener('click', () => this.increase());
        this.node.querySelector('.amount__delete').addEventListener('click', () => this.deleteProduct());
        this.node.querySelector('.selectProduct').addEventListener(
            'change',
            (event) => this.onSelect(this.parameters.id, event.target.checked)
        );
        this.totalPrice = this.parameters.price * this.parameters.quantity;
    }

    render() {
        this.image.src = this.parameters.image;
        this.article.innerText = this.parameters.sku;
        this.name.innerText = this.parameters.name;
        this.price.innerText = this.formatPrice(this.parameters.price);
        this.oldPrice.innerText = this.formatPrice(this.parameters.old_price ?? this.parameters.price);
        this.changeAmmount('first');
    }


    decrease() {
        if (this.parameters.quantity == 0) return;
        this.parameters.quantity--;
        this.changeAmmount('decrease');
    }

    increase() {
        this.parameters.quantity++;
        this.changeAmmount('increase');
    }

    changeAmmount(type) {
        this.totalPrice = this.parameters.price * this.parameters.quantity;
        this.amountCount.innerText = this.parameters.quantity;
        this.amountValue.innerText = this.formatPrice(this.totalPrice);
        if (type == 'first') return;
        this.onAmountChange(type, this.parameters.price, this.parameters.old_price);
    }

    deleteProduct() {
        this.onDelete(this.parameters.id);
    }
}
