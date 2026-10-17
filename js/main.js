'use strict';

import Router from './router.js';
import Cart from './cart.js';

const router = new Router();
const cart = new Cart();
router.init();
cart.init();


const cartButtons = document.querySelectorAll('.cartButton');
const promocodeButtons = document.querySelectorAll('.promocode__accordeon');
const promocodeContent = document.querySelectorAll('.promocode__content');

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
