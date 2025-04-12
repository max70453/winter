document.addEventListener('DOMContentLoaded', function() {
    // Инициализация данных в localStorage при первом посещении
    initLocalStorage();
    
    // Обновление счетчиков корзины и избранного
    updateCartCounter();
    updateFavoritesCounter();
    
    // Добавление обработчиков событий для кнопок добавления в корзину и избранное
    setupEventListeners();
    
    // Инициализация поиска
    setupSearch();
    
    // Инициализация подписки на рассылку
    setupNewsletterSubscription();
});

/**
 * Инициализация данных в localStorage при первом посещении
 */
function initLocalStorage() {
    // Проверяем, есть ли уже данные в localStorage
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('favorites')) {
        localStorage.setItem('favorites', JSON.stringify([]));
    }
    
    // Сохраняем продукты в localStorage, если их там еще нет
    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify(products));
    }
    
    // Инициализация списка подписчиков
    if (!localStorage.getItem('subscribers')) {
        localStorage.setItem('subscribers', JSON.stringify([]));
    }
}

/**
 * Обновление счетчика корзины
 */
function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCounters = document.querySelectorAll('.header__cart ul li:nth-child(2) span, .humberger__menu__cart ul li:nth-child(2) span');
    
    cartCounters.forEach(counter => {
        counter.textContent = cart.length;
    });
}

/**
 * Обновление счетчика избранного
 */
function updateFavoritesCounter() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const favCounters = document.querySelectorAll('.header__cart ul li:nth-child(1) span, .humberger__menu__cart ul li:nth-child(1) span');
    
    favCounters.forEach(counter => {
        counter.textContent = favorites.length;
    });
}

/**
 * Настройка обработчиков событий
 */
function setupEventListeners() {
    // Обработчики для кнопок добавления в корзину
    const addToCartButtons = document.querySelectorAll('.fa-shopping-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Определяем тип элемента товара (featured__item, product__item или product__discount__item)
            const productElement = this.closest('.featured__item') || this.closest('.product__item') || this.closest('.product__discount__item');
            
            if (productElement) {
                // Получаем путь к изображению в зависимости от типа элемента
                let productImg;
                if (productElement.querySelector('.featured__item__pic')) {
                    productImg = productElement.querySelector('.featured__item__pic').getAttribute('data-setbg');
                } else if (productElement.querySelector('.product__item__pic')) {
                    productImg = productElement.querySelector('.product__item__pic').getAttribute('data-setbg');
                } else if (productElement.querySelector('.product__discount__item__pic')) {
                    productImg = productElement.querySelector('.product__discount__item__pic').getAttribute('data-setbg');
                }
                 
                if (productImg) {
                    // Находим ID продукта по изображению
                    const imgPath = productImg.split('/');
                    const imgFile = imgPath[imgPath.length - 1];
                    const product = findProductByImage(imgFile);
                    
                    if (product) {
                        addToCart(product);
                    }
                }
            }
        });
    });
    
    // Обработчики для кнопок добавления в избранное
    const addToFavButtons = document.querySelectorAll('.fa-heart');
    addToFavButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productElement = this.closest('.featured__item');
            if (productElement) {
                const productImg = productElement.querySelector('.featured__item__pic').getAttribute('data-setbg');
                const productPrice = productElement.querySelector('.featured__item__text h5').textContent;
                
                // Находим ID продукта по изображению
                const imgPath = productImg.split('/');
                const imgFile = imgPath[imgPath.length - 1];
                const product = findProductByImage(imgFile);
                
                if (product) {
                    addToFavorites(product);
                }
            }
        });
    });
    
    // Обработчики для фильтров категорий
    const categoryFilters = document.querySelectorAll('.featured__controls li');
    categoryFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            // Обработка фильтрации уже реализована в main.js через mixitup
            // Обновляем счетчик найденных товаров
            setTimeout(() => {
                const visibleCount = $('.featured__filter .mix:visible').length;
                const foundCountElement = document.querySelector('.filter__found span');
                if (foundCountElement) {
                    foundCountElement.textContent = visibleCount;
                }
            }, 100); // Небольшая задержка для завершения анимации mixitup
        });
    });

    
    // Обработчик для категорий в мобильном меню
    const mobileMenuToggle = document.querySelector('.hero__categories__all');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            // Обработка уже реализована в main.js
        });
    }
}

/**
 * Настройка поиска товаров
 */
function setupSearch() {
    const searchForm = document.querySelector('.hero__search__form form');
    const searchInput = document.querySelector('.hero__search__form input');
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchTerm = searchInput.value.trim().toLowerCase();
            
            if (searchTerm) {
                // Сохраняем поисковый запрос в localStorage
                localStorage.setItem('lastSearch', searchTerm);
                
                // Перенаправляем на страницу магазина с параметром поиска
                window.location.href = `shop-grid.html?search=${encodeURIComponent(searchTerm)}`;
            }
        });
    }
}

/**
 * Поиск продукта по имени файла изображения
 */
function findProductByImage(imgFile) {
    const allProducts = JSON.parse(localStorage.getItem('products')) || products;
    return allProducts.find(product => product.img === imgFile);
}

/**
 * Добавление товара в корзину
 */
function addToCart(product) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Проверяем, есть ли уже такой товар в корзине
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingProductIndex !== -1) {
        // Если товар уже есть, увеличиваем количество
        cart[existingProductIndex].quantity += 1;
    } else {
        // Если товара нет, добавляем его с количеством 1
        const productToAdd = {...product, quantity: 1};
        cart.push(productToAdd);
    }
    
    // Сохраняем обновленную корзину в localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Обновляем счетчик корзины
    updateCartCounter();
    
    // Показываем уведомление
    showNotification('Товар добавлен в корзину');
}

/**
 * Добавление товара в избранное
 */
function addToFavorites(product) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    // Проверяем, есть ли уже такой товар в избранном
    const existingProductIndex = favorites.findIndex(item => item.id === product.id);
    
    if (existingProductIndex === -1) {
        // Если товара нет, добавляем его
        favorites.push(product);
        
        // Сохраняем обновленное избранное в localStorage
        localStorage.setItem('favorites', JSON.stringify(favorites));
        
        // Обновляем счетчик избранного
        updateFavoritesCounter();
        
        // Показываем уведомление
        showNotification('Товар добавлен в избранное');
    } else {
        // Если товар уже есть, удаляем его из избранного
        favorites.splice(existingProductIndex, 1);
        
        // Сохраняем обновленное избранное в localStorage
        localStorage.setItem('favorites', JSON.stringify(favorites));
        
        // Обновляем счетчик избранного
        updateFavoritesCounter();
        
        // Показываем уведомление
        showNotification('Товар удален из избранного');
    }
}

/**
 * Показ уведомления пользователю
 */
function showNotification(message) {
    // Проверяем, существует ли уже элемент уведомления
    let notification = document.querySelector('.notification');
    
    if (!notification) {
        // Создаем элемент уведомления, если его нет
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
        
        // Добавляем стили для уведомления
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = '#7fad39';
        notification.style.color = 'white';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '1000';
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease-in-out';
    }
    
    // Устанавливаем текст уведомления
    notification.textContent = message;
    
    // Показываем уведомление
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);
    
    // Скрываем уведомление через 3 секунды
    setTimeout(() => {
        notification.style.opacity = '0';
    }, 3000);
}

/**
 * Настройка подписки на рассылку
 */
function setupNewsletterSubscription() {
    const subscriptionForm = document.querySelector('.footer__widget form');
    const emailInput = document.querySelector('.footer__widget input[type="text"]');
    
    if (subscriptionForm && emailInput) {
        subscriptionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = emailInput.value.trim();
            
            // Проверка валидности email
            if (!isValidEmail(email)) {
                showNotification('Пожалуйста, введите корректный email');
                return;
            }
            
            // Получаем текущий список подписчиков
            const subscribers = JSON.parse(localStorage.getItem('subscribers')) || [];
            
            // Проверяем, есть ли уже такой email в списке
            if (subscribers.includes(email)) {
                showNotification('Вы уже подписаны на нашу рассылку');
                return;
            }
            
            // Добавляем email в список подписчиков
            subscribers.push(email);
            localStorage.setItem('subscribers', JSON.stringify(subscribers));
            
            // Очищаем поле ввода
            emailInput.value = '';
            
            // Показываем уведомление об успешной подписке
            showNotification('Спасибо за подписку на нашу рассылку!');
        });
    }
}

/**
 * Проверка валидности email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}