'use strict';

(function() {

    const PRODUCTS_ENDPOINT = 'https://growtask.ru/test-front/api/products';

    const PROMO_CODES = {
        GROWTASK2026: { code: 'GROWTASK2026', type: 'percent', value: 0.15, desc: 'Скидка 15% на товары' },
    };

    const VIEW_CLASSES = {
        CART: '.viewCart',
        CHECKOUT: '.viewCheckout',
        SUCCESS: '.viewSuccess',
    };

    const ROUTES = {
        CART: '#cart',
        CHECKOUT: '#checkout',
        SUCCESS: '#success',
    };


    window.Config = {
        PRODUCTS_ENDPOINT,
        PROMO_CODES,
        ROUTES,
        VIEW_CLASSES,
    };
})();
