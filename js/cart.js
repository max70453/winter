// Инициализация корзины
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let appliedCoupon = JSON.parse(localStorage.getItem('appliedCoupon')) || null;

// Список доступных купонов
const availableCoupons = {
  'WINTER10': { discount: 0.10, type: 'percent' },
  'WINTER20': { discount: 0.20, type: 'percent' },
  'WINTER500': { discount: 500, type: 'fixed' }
};

// Функция для отображения товаров в корзине
function renderCart() {
  const tbody = document.querySelector('.shoping__cart__table tbody');
  tbody.innerHTML = '';
console.log(cart);

  cart.forEach((item, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="shoping__cart__item">
        <img style="width: 40%;" src="img/product/${item.img || 'product-1.jpg'}" alt="${item.name}">
        <h5>${item.name}</h5>
      </td>
      <td class="shoping__cart__price">
        ${item.price.toFixed(2)} P
      </td>
      <td class="shoping__cart__quantity">
        <div class="quantity">
          <div class="pro-qty">
            <span class="dec qtybtn" onclick="updateQuantity(${index}, ${item.quantity - 1})">-</span>
            <input type="text" value="${item.quantity}" readonly>
            <span class="inc qtybtn" onclick="updateQuantity(${index}, ${item.quantity + 1})">+</span>
          </div>
        </div>
      </td>
      <td class="shoping__cart__total">
        ${(item.price * item.quantity).toFixed(2)} P
      </td>
      <td class="shoping__cart__item__close">
        <span class="icon_close" onclick="removeItem(${index})"></span>
      </td>
    `;
    tbody.appendChild(tr);
  });

  updateTotal();
  updateCartCount();
}

// Функция обновления количества товара
function updateQuantity(index, quantity) {
  if (quantity > 0) {
    cart[index].quantity = quantity;
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
  }
}

// Функция удаления товара из корзины
function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

// Функция расчета общей суммы
function updateTotal() {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  let discount = 0;
  let total = subtotal;

  if (appliedCoupon) {
    const couponInfo = availableCoupons[appliedCoupon];
    if (couponInfo.type === 'percent') {
      discount = subtotal * couponInfo.discount;
    } else {
      discount = couponInfo.discount;
    }
    total = subtotal - discount;
  }
  
  document.querySelector('.shoping__checkout ul li:first-child span').textContent = `${subtotal.toFixed(2)} P`;
  
  // Добавляем строку со скидкой, если купон применен
  const discountElement = document.querySelector('.shoping__checkout ul li.discount');
  if (appliedCoupon) {
    if (!discountElement) {
      const li = document.createElement('li');
      li.className = 'discount';
      li.innerHTML = `Скидка по купону ${appliedCoupon} <span>-${discount.toFixed(2)} P</span>`;
      document.querySelector('.shoping__checkout ul li:last-child').insertAdjacentElement('beforebegin', li);
    } else {
      discountElement.innerHTML = `Скидка по купону ${appliedCoupon} <span>-${discount.toFixed(2)} P</span>`;
    }
  } else if (discountElement) {
    discountElement.remove();
  }

  document.querySelector('.shoping__checkout ul li:last-child span').textContent = `${total.toFixed(2)} P`;
}

// Функция обновления счетчика товаров в корзине
function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountElements = document.querySelectorAll('.header__cart ul li:last-child span');
  cartCountElements.forEach(element => {
    element.textContent = count;
  });
}

// Обработчик кнопки "Обновить корзину"
document.querySelector('.cart-btn-right').addEventListener('click', () => {
  renderCart();
});

// Обработчик формы купона
document.querySelector('.shoping__discount form').addEventListener('submit', (e) => {
  e.preventDefault();
  const couponInput = e.target.querySelector('input');
  const couponCode = couponInput.value.trim().toUpperCase();

  if (availableCoupons[couponCode]) {
    appliedCoupon = couponCode;
    localStorage.setItem('appliedCoupon', JSON.stringify(appliedCoupon));
    renderCart();
    alert('Купон успешно применен!');
  } else {
    alert('Неверный код купона');
  }
  
  couponInput.value = '';
});

// Функция отмены купона
function removeCoupon() {
  appliedCoupon = null;
  localStorage.removeItem('appliedCoupon');
  renderCart();
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  renderCart();
});