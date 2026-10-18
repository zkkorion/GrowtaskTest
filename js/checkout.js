
export default class Checkout {
    cart;
    productList = [];
    productCardTemplate = document.querySelector('#checkoutProductTemplate').content.firstElementChild;
    checkoutCartList = document.querySelector('.checkoutCart__list');
    swiperSlide = document.querySelector('.swiper-slide');
    paymentList = document.querySelectorAll('.payment');
    submitButtonList = document.querySelectorAll('.submitButton');
    checkoutForm = document.querySelector('.checkoutForm');
    checkoutFooterWarning = document.querySelector('.checkoutFooter__warning');

    form = {
        name: '',
        secondName: '',
        phone: '',
        email: '',
        comment: '',
        spam: false,
        payment: '',
    };

    init(cart) {
        this.cart = cart;
        cart.addEventListener('render', () => this.render());
        this.paymentList.forEach(payment => {
            payment.addEventListener('click', () => this.paymentOnClick(payment));
        });
        this.submitButtonList.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                this.submit();
            });
        });
        this.submitButtonList.forEach(button => {
            button.disabled = !this.formValid();
        });
        this.checkoutForm.addEventListener('input', () => {
            const formData = Object.fromEntries(new FormData(this.checkoutForm).entries());
            this.form = {
                ...this.form,
                ...formData,
                spam: !!formData.spam
            };
            this.submitButtonList.forEach(button => {
                button.disabled = !this.formValid();
            });
            this.checkoutFooterWarning.hidden = !this.formValid();
        });
        this.render();
    }

    render() {
        this.checkoutCartList.innerHTML = '';
        this.swiperSlide.innerHTML = '';
        this.productList = this.cart.getProductList();
        this.productList.forEach(item => {
            const productCard = this.productCardTemplate.cloneNode(true);
            productCard.querySelector('.checkoutCart__image').src = item.parameters.image;
            productCard.querySelector('.checkoutCart__badge').textContent = item.parameters.quantity;
            this.checkoutCartList.appendChild(productCard);
            this.swiperSlide.appendChild(productCard.cloneNode(true));
        });
    }

    paymentOnClick(payment) {
        const radio = payment.querySelector('.payment__radio');
        this.paymentList.forEach(item => item.classList.remove('payment_active'));
        payment.classList.add('payment_active');
        radio.click();
        this.form.payment = radio.value;
    }

    formValid() {
        return !!this.form?.name && !!this.form?.secondName && !!this.form?.phone && !!this.form?.email;
    }

    submit() {
        const submitData = {
            productList: this.productList.map(product => {
                return { ...product.parameters };
            }),
            checkout: { ...this.form },
            cartAmmount: this.cart.getCartAmmount()
        };
        console.log('%c-------------> submitData: ', 'color: #1c7a14', submitData);
        window.location.hash = '#success';
    }
}
