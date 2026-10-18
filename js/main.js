'use strict';

import Router from './router.js';
import Cart from './cart.js';
import Checkout from './checkout.js';


const router = new Router();
const cart = new Cart();
router.init();
cart.init().then(() => {
    const checkout = new Checkout();
    checkout.init(cart);
});

const cartButtons = document.querySelectorAll('.cartButton');
const promocodeButtons = document.querySelectorAll('.promocode__accordeon');
const promocodeContent = document.querySelectorAll('.promocode__content');
const clearInputButtons = document.querySelectorAll('.inputField__clear');

cartButtons.forEach(button => {
    button.addEventListener('click', () => {
        window.location.hash = '#checkout';
    });
});

promocodeButtons.forEach(button => {
    button.addEventListener('click', () => {
        button.classList.toggle('promocode__accordeon_open');
        promocodeContent.forEach(content => {
            content.classList.toggle('promocode__content_open');
        });
    });
});

clearInputButtons.forEach(button => {
    button.addEventListener('click', () => {
        const inputField = button.closest('.inputField');
        const input = inputField.querySelector('.inputField__input');
        input.value = '';
        input.dispatchEvent(new Event('input', { bubbles: true }));
    });
});
