// Функция для загрузки товаров из корзины
function loadCartItems() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const appliedCoupon = JSON.parse(localStorage.getItem('appliedCoupon'));
    const availableCoupons = {
        'WINTER10': { discount: 0.10, type: 'percent' },
        'WINTER20': { discount: 0.20, type: 'percent' },
        'WINTER500': { discount: 500, type: 'fixed' }
    };
    
    const orderList = document.querySelector('.checkout__order ul');
    const subtotalElement = document.querySelector('.checkout__order__subtotal span');
    const totalElement = document.querySelector('.checkout__order__total span');
    const productsTitle = document.querySelector('.checkout__order__products');

    // Проверяем наличие элементов на странице
    if (!orderList || !subtotalElement || !totalElement || !productsTitle) {
        console.error('Не найдены необходимые элементы на странице');
        return;
    }

    // Очищаем список
    orderList.innerHTML = '';
    let subtotal = 0;

    if (cartItems.length === 0) {
        // Если корзина пуста
        productsTitle.style.marginBottom = '20px';
        orderList.innerHTML = '<li class="empty-cart">Корзина пуста</li>';
        subtotalElement.textContent = '0.00 P';
        totalElement.textContent = '0.00 P';
        return;
    }

    // Добавляем товары в список
    cartItems.forEach(item => {
        const li = document.createElement('li');
        const itemTotal = item.price * item.quantity;
        li.innerHTML = `
            <font>${item.name} (${item.quantity} шт.)</font>
            <span>${itemTotal.toFixed(2)} P</span>
        `;
        orderList.appendChild(li);
        subtotal += itemTotal;
    });

    // Рассчитываем скидку, если есть применённый купон
    let total = subtotal;
    if (appliedCoupon && availableCoupons[appliedCoupon]) {
        const couponInfo = availableCoupons[appliedCoupon];
        let discount = 0;

        if (couponInfo.type === 'percent') {
            discount = subtotal * couponInfo.discount;
        } else {
            discount = couponInfo.discount;
        }

        // Добавляем информацию о скидке в список
        const discountLi = document.createElement('li');
        discountLi.innerHTML = `
            <font>Скидка по купону ${appliedCoupon}</font>
            <span>-${discount.toFixed(2)} P</span>
        `;
        orderList.appendChild(discountLi);

        total = subtotal - discount;
    }

    // Обновляем суммы
    subtotalElement.textContent = `${subtotal.toFixed(2)} P`;
    totalElement.textContent = `${total.toFixed(2)} P`;

    // Обновляем счетчик товаров в шапке
    updateCartCounter();
}

// Функция обновления счетчика товаров в шапке
function updateCartCounter() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCounters = document.querySelectorAll('.header__cart ul li a span');
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    cartCounters.forEach(counter => {
        if (counter.parentElement.querySelector('.fa-shopping-bag')) {
            counter.textContent = totalItems;
        }
    });
}

// Функция для валидации формы
function validateForm(form) {
    const requiredFields = form.querySelectorAll('input[placeholder="Имя"], input[placeholder="Фамилия"], input[placeholder="Страна"], input[placeholder="Почтовый адрес"], input[placeholder="Город"], input[placeholder="Страна/Государство"], input[placeholder="Почтовый индекс"], input[placeholder="Телефон"], input[placeholder="Email"]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = 'red';
            isValid = false;
        } else {
            field.style.borderColor = '';
        }
    });

    if (!isValid) {
        alert('Пожалуйста, заполните все обязательные поля');
    }

    return isValid;
}

// Функция для сохранения данных заказа
function saveOrder(formData) {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const order = {
        items: cartItems,
        customerInfo: formData,
        total: parseFloat(document.querySelector('.checkout__order__total span').textContent.replace('P', '')),
        date: new Date().toISOString()
    };

    // Сохраняем заказ в localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Очищаем корзину
    localStorage.removeItem('cart');
    localStorage.removeItem('appliedCoupon');
}

// Обработчик отправки формы
document.addEventListener('DOMContentLoaded', () => {
    // Загружаем товары при загрузке страницы
    loadCartItems();

    // Обработчик купона
    const couponLink = document.querySelector('a[href="#"]');
    if (couponLink) {
        couponLink.addEventListener('click', (e) => {
            e.preventDefault();
            // Здесь можно добавить логику обработки купона
            alert('Функция применения купона будет доступна позже');
        });
    }

    // Обработчик формы заказа
    const checkoutForm = document.querySelector('.checkout__form form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (validateForm(checkoutForm)) {
                const formData = {
                    firstName: checkoutForm.querySelector('input[placeholder="Имя"]').value,
                    lastName: checkoutForm.querySelector('input[placeholder="Фамилия"]').value,
                    country: checkoutForm.querySelector('input[placeholder="Страна"]').value,
                    address: checkoutForm.querySelector('input[placeholder="Почтовый адрес"]').value,
                    city: checkoutForm.querySelector('input[placeholder="Город"]').value,
                    state: checkoutForm.querySelector('input[placeholder="Страна/Государство"]').value,
                    postcode: checkoutForm.querySelector('input[placeholder="Почтовый индекс"]').value,
                    phone: checkoutForm.querySelector('input[placeholder="Телефон"]').value,
                    email: checkoutForm.querySelector('input[placeholder="Email"]').value
                };

                saveOrder(formData);
                alert('Заказ успешно оформлен!');
                window.location.href = 'index.html';
            } else {
                alert('Пожалуйста, заполните все обязательные поля');
            }
        });
    }
});