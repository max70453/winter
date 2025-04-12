// Получение ID товара из URL
const getProductIdFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
};

// Получение данных о товаре из localStorage или из глобального массива
const getProductDetails = (productId) => {
    const localProducts = JSON.parse(localStorage.getItem('products')) || [];
    const numericProductId = parseInt(productId);
    let product = localProducts.find(product => product.id === numericProductId);
    
    // Если товар не найден в localStorage, ищем в глобальном массиве
    if (!product && typeof window.products !== 'undefined') {
        product = window.products.find(product => product.id === numericProductId);
        // Сохраняем товар в localStorage для будущего использования
        if (product) {
            localStorage.setItem('products', JSON.stringify([...localProducts, product]));
        }
    }
    return product;
};

// Обновление количества товаров в корзине/избранном в шапке
const updateHeaderCounts = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    document.querySelectorAll('.header__cart li span').forEach((span, index) => {
        if (index === 0) span.textContent = wishlist.length;
        if (index === 1) span.textContent = cart.length;
    });
};

// Обработка изменения количества товара
const handleQuantityChange = () => {
    const proQty = $('.pro-qty');
    
    // Удаляем существующие кнопки и обработчики
    proQty.find('.qtybtn').remove();
    proQty.off('click', '.qtybtn');
    
    // Добавляем кнопки только один раз
    proQty.prepend('<span class="dec qtybtn">-</span>');
    proQty.append('<span class="inc qtybtn">+</span>');
    
    // Добавляем обработчик события
    proQty.on('click', '.qtybtn', function() {
        const $button = $(this);
        const oldValue = $button.parent().find('input').val();
        let newVal;
        if ($button.hasClass('inc')) {
            newVal = parseFloat(oldValue) + 1;
        } else {
            newVal = oldValue > 1 ? parseFloat(oldValue) - 1 : 1;
        }
        $button.parent().find('input').val(newVal);
    });
};

// Добавление товара в корзину
const addToCart = (product) => {
    const quantity = parseInt($('.pro-qty input').val());
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ ...product, quantity });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateHeaderCounts();
    alert('Товар добавлен в корзину!');
};

// Добавление товара в избранное
const addToWishlist = (product) => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    if (!wishlist.some(item => item.id === product.id)) {
        wishlist.push(product);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateHeaderCounts();
        alert('Товар добавлен в избранное!');
    } else {
        alert('Товар уже в избранном!');
    }
};

// Инициализация галереи изображений
const initializeGallery = () => {
    $('.product__details__pic__slider img').on('click', function() {
        const imgUrl = $(this).data('imgbigurl');
        $('.product__details__pic__item--large').attr('src', imgUrl);
    });
};

// Обновление отображения информации о товаре
const updateProductDisplay = (product) => {
    // Обновление основной информации
    $('.product__details__text h3').text(product.name);
    $('.product__details__price').text(`${product.price} ₽`);
    $('.product__description').text(product.description);
    
    // Обновление статуса наличия
    $('.product__details__text ul li:first-child span').text(product.inStock ? 'В наличии' : 'Нет в наличии');
    
    // Обновление основного изображения
    $('.product__details__pic__item--large').attr('src', 'img/product/' + product.img);
};

// Основная функция инициализации
const initializeProductDetails = () => {
    const productId = getProductIdFromUrl();
    if (!productId) {
        console.error('Product ID not found in URL');
        return;
    }
    
    const product = getProductDetails(productId);
    if (!product) {
        console.error('Product not found in localStorage');
        return;
    }
    
    // Обновление отображения товара
    updateProductDisplay(product);
    
    // Инициализация обработчиков событий
    handleQuantityChange();
    initializeGallery();
    
    // Обработчики кнопок добавления в корзину и избранное
    $('.primary-btn').on('click', () => addToCart(product));
    $('.heart-icon').on('click', () => addToWishlist(product));
    
    // Обновление счетчиков в шапке
    updateHeaderCounts();
};

// Запуск инициализации при загрузке страницы
$(document).ready(initializeProductDetails);