/**
 * Логика для страницы магазина (shop-grid.html)
 * Использует localStorage для хранения данных корзины и избранного
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // Обновляем счетчики корзины и избранного при загрузке страницы
    updateCartCount();
    updateFavoritesCount();
    
    // Загружаем товары из localStorage и отображаем их на странице
    loadProductsFromStorage();
    
    // Добавляем обработчики событий для кнопок добавления в корзину и избранное
    addEventListeners();
    
    // Добавляем обработчики для фильтрации по категориям
    setupCategoryFilters();
    
    // Настройка сортировки товаров
    setupSorting();
    
    // Настройка фильтрации по цене
    setupPriceFilter();
    
    // Проверяем, есть ли параметр поиска в URL
    checkSearchParam();
    
    // Добавляем обработчик для изменения количества товаров на странице
    setupItemsPerPageSelector();
    
    // Настройка переключения между режимами отображения (сетка/строки)
    // setupViewModeToggle();

function setupViewModeToggle() {
    const gridIcon = document.querySelector('.icon_grid-2x2');
    const listIcon = document.querySelector('.icon_ul');

    if (gridIcon && listIcon) {
        gridIcon.addEventListener('click', function() {
            setViewMode('grid');
            updateView();
        });

        listIcon.addEventListener('click', function() {
            setViewMode('list');
            updateView();
        });
    }
}

function setViewMode(mode) {
    viewMode = mode;
    localStorage.setItem('viewMode', mode);
}

function updateView() {
    const productsContainer = document.querySelector('.product__container');
    if (productsContainer) {
        productsContainer.className = 'product__container ' + viewMode;
    }
}

function setupPriceFilter() {
    const minInput = document.getElementById('minamount');
    const maxInput = document.getElementById('maxamount');
    
    
    const productsContainer = document.querySelector('.products');
    const foundCounter = document.querySelector('.filter__found h6 span');

    if (minInput && maxInput && productsContainer) {
        [minInput, maxInput].forEach(input => {
            
            input.addEventListener('input', () => {
                const minPrice = parseFloat(minInput.value) || 0;
                const maxPrice = parseFloat(maxInput.value) || Infinity;
                if (isNaN(minPrice) || isNaN(maxPrice) || minPrice > maxPrice) return;

                const productItems = productsContainer.querySelectorAll('.product__item, .product__discount__item');
                let visibleCount = 0;

                productItems.forEach(item => {
                    const priceElement = item.querySelector('.product__item__price');
                    if (priceElement) {
                        const price = parseFloat(priceElement.textContent.replace(/[^\d.]/g, ''));
                        if (price >= minPrice && price <= maxPrice) {
                            item.style.display = 'block';
                            visibleCount++;
                        } else {
                            item.style.display = 'none';
                        }
                    }
                });

                if (foundCounter) {
                    foundCounter.textContent = visibleCount;
                }
            });
        });
    }
}
});

// Глобальная переменная для режима отображения
let viewMode = localStorage.getItem('viewMode') || 'grid'; // 'grid' или 'list'

/**
 * Добавляет обработчики событий для всех кнопок на странице
 */
function addEventListeners() {
    // Обработчики для кнопок добавления в корзину
    const addToCartButtons = document.querySelectorAll('.fa-shopping-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productItem = this.closest('.product__item') || this.closest('.product__discount__item');
            const productId = getProductIdFromElement(productItem);
            addToCart(productId);
        });
    });
    
    // Обработчики для кнопок добавления в избранное
    const addToFavoritesButtons = document.querySelectorAll('.fa-heart');
    addToFavoritesButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productItem = this.closest('.product__item') || this.closest('.product__discount__item');
            const productId = getProductIdFromElement(productItem);
            addToFavorites(productId);
        });
    });
    
    // Обработчики для кнопок перехода на страницу товара
    const detailButtons = document.querySelectorAll('.fa-retweet');
    detailButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productItem = this.closest('.product__item') || this.closest('.product__discount__item');
            const productId = getProductIdFromElement(productItem);
            navigateToProductPage(productId);
        });
    });
}

/**
 * Получает ID товара из элемента DOM
 * @param {HTMLElement} element - DOM элемент товара
 * @returns {number} - ID товара
 */
function getProductIdFromElement(element) {
    if (!element) return null;
    
    // Получаем название товара
    const productName = element.querySelector('h5 a, h6 a').textContent;
    
    // Получаем изображение товара
    const imgElement = element.querySelector('.set-bg');
    const imgUrl = imgElement ? imgElement.getAttribute('data-setbg') : '';
    const imgFileName = imgUrl.split('/').pop();
    
    // Находим товар в массиве products по названию и/или изображению
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => {
        return p.name === productName || imgFileName.includes(p.img);
    });
    
    return product ? product.id : null;
}

/**
 * Добавляет товар в корзину
 * @param {number} productId - ID товара
 */
function addToCart(productId) {
    if (!productId) return;
    
    // Получаем текущую корзину из localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    // Проверяем, есть ли уже этот товар в корзине
    const existingProduct = cart.find(item => item.id === productId);
    
    if (existingProduct) {
        // Если товар уже в корзине, увеличиваем количество
        existingProduct.quantity = (existingProduct.quantity || 1) + 1;
        showNotification('Товар уже в корзине. Количество увеличено.');
    } else {
        // Если товара нет в корзине, добавляем его
        const product = products.find(p => p.id === productId);
        if (product) {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                img: product.img,
                quantity: 1
            });
            showNotification('Товар добавлен в корзину!');
        }
    }
    
    // Сохраняем обновленную корзину в localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Обновляем счетчик товаров в корзине
    updateCartCount();
}

/**
 * Добавляет товар в избранное
 * @param {number} productId - ID товара
 */
function addToFavorites(productId) {
    if (!productId) return;
    
    // Получаем текущий список избранного из localStorage
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    // Проверяем, есть ли уже этот товар в избранном
    const existingProduct = favorites.find(item => item.id === productId);
    
    if (existingProduct) {
        // Если товар уже в избранном, сообщаем об этом
        showNotification('Этот товар уже в избранном!');
    } else {
        // Если товара нет в избранном, добавляем его
        const product = products.find(p => p.id === productId);
        if (product) {
            favorites.push({
                id: product.id,
                name: product.name,
                price: product.price,
                img: product.img
            });
            showNotification('Товар добавлен в избранное!');
        }
    }
    
    // Сохраняем обновленный список избранного в localStorage
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    // Обновляем счетчик товаров в избранном
    updateFavoritesCount();
}

/**
 * Обновляет счетчик товаров в корзине
 */
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    
    // Обновляем счетчики в хедере и мобильном меню
    const cartCounters = document.querySelectorAll('.header__cart ul li:nth-child(2) span, .humberger__menu__cart ul li:nth-child(2) span');
    cartCounters.forEach(counter => {
        counter.textContent = totalItems;
    });
}

/**
 * Обновляет счетчик товаров в избранном
 */
function updateFavoritesCount() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const totalItems = favorites.length;
    
    // Обновляем счетчики в хедере и мобильном меню
    const favCounters = document.querySelectorAll('.header__cart ul li:nth-child(1) span, .humberger__menu__cart ul li:nth-child(1) span');
    favCounters.forEach(counter => {
        counter.textContent = totalItems;
    });
}

/**
 * Показывает уведомление пользователю
 * @param {string} message - Текст уведомления
 */
function showNotification(message) {
    // Проверяем, существует ли уже элемент уведомления
    let notification = document.querySelector('.shop-notification');
    
    // Если элемент не существует, создаем его
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'shop-notification';
        document.body.appendChild(notification);
        
        // Добавляем стили для уведомления
        const style = document.createElement('style');
        style.textContent = `
            .shop-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background-color: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 15px 20px;
                border-radius: 5px;
                z-index: 9999;
                opacity: 0;
                transition: opacity 0.3s ease;
                max-width: 300px;
                text-align: center;
            }
            .shop-notification.show {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Устанавливаем текст уведомления
    notification.textContent = message;
    
    // Показываем уведомление
    notification.classList.add('show');
    
    // Скрываем уведомление через 3 секунды
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

/**
 * Настраивает фильтрацию товаров по категориям
 */
function setupCategoryFilters() {
    const categoryLinks = document.querySelectorAll('.sidebar__item ul li a');
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.textContent.trim();
   
            filterProductsByCategory(category);
        });
    });
}

/**
 * Фильтрует товары по выбранной категории
 * @param {string} category - Название категории
 */
function filterProductsByCategory(category) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    // Фильтруем товары по категории
    filteredProducts = products.filter(product => product.category === category);
    
    // Сбрасываем на первую страницу при фильтрации
    currentPage = 1;
    
    // Отображаем отфильтрованные товары
    displayProductsForPage(filteredProducts, currentPage);
    
    // Обновляем пагинацию
    setupPagination(filteredProducts);
    
    // Обновляем счетчик найденных товаров
    updateFoundCount(filteredProducts.length);
}

/**
 * Обновляет счетчик найденных товаров
 * @param {number} count - Количество товаров (если не указано, будет посчитано автоматически)
 */
function updateFoundCount(count) {
    const foundCountElement = document.querySelector('.filter__found span');
    
    if (foundCountElement) {
        if (count !== undefined) {
            foundCountElement.textContent = count;
        } else {
            const visibleProducts = document.querySelectorAll('.product__item[style="display: block"]');
            foundCountElement.textContent = visibleProducts.length;
        }
    }
}

/**
 * Настраивает сортировку товаров
 */
function setupSorting() {
    const sortSelect = document.querySelector('.filter__sort select');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
            sortProducts(sortValue);
        });
    }
}

/**
 * Сортирует товары по выбранному критерию
 * @param {string} sortValue - Критерий сортировки
 */
function sortProducts(sortValue) {
    // Получаем все товары на странице
    const productItems = document.querySelectorAll('.product__item');
    const productContainer = document.querySelector('.row:not(.product__discount__slider)');
    
    // Преобразуем NodeList в массив для сортировки
    const productsArray = Array.from(productItems);
    
    // Сортируем товары в зависимости от выбранного критерия
    switch(sortValue) {
        case 'price-low-to-high':
            productsArray.sort((a, b) => {
                const priceA = parseFloat(a.querySelector('.product__item__text h5').textContent.replace(/[^\d.]/g, ''));
                const priceB = parseFloat(b.querySelector('.product__item__text h5').textContent.replace(/[^\d.]/g, ''));
                return priceA - priceB;
            });
            break;
        case 'price-high-to-low':
            productsArray.sort((a, b) => {
                const priceA = parseFloat(a.querySelector('.product__item__text h5').textContent.replace(/[^\d.]/g, ''));
                const priceB = parseFloat(b.querySelector('.product__item__text h5').textContent.replace(/[^\d.]/g, ''));
                return priceB - priceA;
            });
            break;
        case 'name-a-z':
            productsArray.sort((a, b) => {
                const nameA = a.querySelector('.product__item__text h6 a').textContent.trim();
                const nameB = b.querySelector('.product__item__text h6 a').textContent.trim();
                return nameA.localeCompare(nameB);
            });
            break;
        case 'name-z-a':
            productsArray.sort((a, b) => {
                const nameA = a.querySelector('.product__item__text h6 a').textContent.trim();
                const nameB = b.querySelector('.product__item__text h6 a').textContent.trim();
                return nameB.localeCompare(nameA);
            });
            break;
        default:
            // По умолчанию не меняем порядок
            break;
    }
    
    // Удаляем все товары из контейнера
    productItems.forEach(item => item.remove());
    
    // Добавляем отсортированные товары обратно в контейнер
    productsArray.forEach(item => {
        productContainer.appendChild(item);
    });
    
    console.log('Сортировка по:', sortValue);
}

// Глобальные переменные для пагинации
let currentPage = parseInt(localStorage.getItem('currentPage')) || 1;
let itemsPerPage = parseInt(localStorage.getItem('itemsPerPage')) || 6; // Количество товаров на странице
let filteredProducts = [];

/**
 * Загружает товары из localStorage и отображает их на странице
 */
function loadProductsFromStorage() {
    // Получаем товары из localStorage
    const products = JSON.parse(localStorage.getItem('products')) || [];
    filteredProducts = [...products]; // Сохраняем копию всех товаров для фильтрации
    
    // Получаем сохраненную страницу из localStorage
    currentPage = parseInt(localStorage.getItem('currentPage')) || 1;
    
    // Находим контейнер для товаров
    const productContainer = document.querySelector('.products');
    
    // Очищаем контейнер перед добавлением товаров
    if (productContainer) {
        // Сохраняем первые элементы, если они уже есть в HTML
        const existingItems = productContainer.querySelectorAll('.product__item');
        
        // Если товары уже отображены на странице, не добавляем их повторно
        if (existingItems.length > 0 && existingItems.length === products.length) {
            setupPagination(products); // Настраиваем пагинацию для существующих товаров
            return;
        }
        
        // Очищаем контейнер
        productContainer.innerHTML = '';
        
        // Отображаем товары с учетом пагинации
        displayProductsForPage(products, currentPage);
        
        // Настраиваем пагинацию
        setupPagination(products);
        
        // Обновляем счетчик найденных товаров
        updateFoundCount(products.length);
    }
}

/**
 * Создает HTML-элемент товара
 * @param {Object} product - Объект товара
 * @returns {HTMLElement} - HTML-элемент товара
 */
function createProductElement(product) {
    // Создаем обертку для товара
    const colDiv = document.createElement('div');
    colDiv.className = 'col-lg-4 col-md-6 col-sm-6';
    
    // Создаем элемент товара
    const productItem = document.createElement('div');
    productItem.className = 'product__item';
    productItem.setAttribute('data-product-id', product.id);
    productItem.setAttribute('data-category', product.category);
    
    // Создаем элемент изображения товара
    const picDiv = document.createElement('div');
    picDiv.className = 'product__item__pic set-bg';
    picDiv.setAttribute('data-setbg', `img/product/${product.img}`);
    
    // Создаем список иконок для товара
    const hoverUl = document.createElement('ul');
    hoverUl.className = 'product__item__pic__hover';
    
    // Добавляем иконку избранного
    const favoriteLi = document.createElement('li');
    const favoriteLink = document.createElement('a');
    const favoriteIcon = document.createElement('i');
    favoriteIcon.className = 'fa fa-heart';
    favoriteLink.appendChild(favoriteIcon);
    favoriteLi.appendChild(favoriteLink);

    // Добавляем иконку подробнее
    const detailLi = document.createElement('li');
    const detailLink = document.createElement('a');
    const detailIcon = document.createElement('i');
    detailIcon.className = 'fa fa-retweet';
    detailLink.appendChild(detailIcon);
    detailLi.appendChild(detailLink);

    // Добавляем иконку корзины
    const cartLi = document.createElement('li');
    const cartLink = document.createElement('a');
    const cartIcon = document.createElement('i');
    cartIcon.className = 'fa fa-shopping-cart';
    // Удаляем прямую ссылку, так как будем использовать обработчик событий
    // cartLink.setAttribute('href', 'shop-details.html');
    cartLink.appendChild(cartIcon);
    cartLi.appendChild(cartLink);
    
    // Собираем список иконок
    hoverUl.appendChild(favoriteLi);
    hoverUl.appendChild(detailLi);
    hoverUl.appendChild(cartLi);
    picDiv.appendChild(hoverUl);
    
    // Создаем элемент текста товара
    const textDiv = document.createElement('div');
    textDiv.className = 'product__item__text';
    
    // Добавляем название товара
    const nameH6 = document.createElement('h6');
    const nameLink = document.createElement('a');
    nameLink.href = 'shop-details.html';
    nameLink.textContent = product.name;
    nameH6.appendChild(nameLink);
    
    // Добавляем цену товара
    const priceH5 = document.createElement('h5');
    priceH5.textContent = `${product.price.toFixed(2)} P`;
    
    // Собираем текстовый блок
    textDiv.appendChild(nameH6);
    textDiv.appendChild(priceH5);
    
    // Собираем элемент товара
    productItem.appendChild(picDiv);
    productItem.appendChild(textDiv);
    colDiv.appendChild(productItem);
    
    return colDiv;
}

/**
 * Проверяет наличие параметра поиска в URL и фильтрует товары соответственно
 */
function checkSearchParam() {
    // Получаем параметры URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('search');
    
    // Если есть параметр поиска, фильтруем товары
    if (searchTerm) {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        
        // Фильтруем товары по поисковому запросу
        filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        // Сбрасываем на первую страницу при поиске
        currentPage = 1;
        
        // Отображаем отфильтрованные товары
        displayProductsForPage(filteredProducts, currentPage);
        
        // Обновляем пагинацию
        setupPagination(filteredProducts);
        
        // Обновляем счетчик найденных товаров
        updateFoundCount(filteredProducts.length);
    }
}

/**
 * Перенаправляет пользователя на страницу товара
 * @param {number} productId - ID товара
 */
function navigateToProductPage(productId) {
    if (!productId) return;
    
    // Перенаправляем на страницу товара с указанием ID
    window.location.href = `shop-details.html?id=${productId}`;
}

/**
 * Отображает товары для указанной страницы
 * @param {Array} products - Массив товаров для отображения
 * @param {number} page - Номер страницы
 */
function displayProductsForPage(products, page) {
    // Находим контейнер для товаров
    const productContainer = document.querySelector('.products');
    
    if (!productContainer) return;
    
    // Очищаем контейнер
    productContainer.innerHTML = '';
    
    // Вычисляем индексы начала и конца для текущей страницы
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, products.length);
    
    // Отображаем только товары для текущей страницы
    for (let i = startIndex; i < endIndex; i++) {
        const product = products[i];
        if (product) {
            // Создаем элемент товара
            const productItem = createProductElement(product);
            
            // Добавляем элемент в контейнер
            productContainer.appendChild(productItem);
        }
    }
    
    // Применяем фоновые изображения к элементам с классом set-bg
    $('.set-bg').each(function () {
        var bg = $(this).data('setbg');
        $(this).css('background-image', 'url(' + bg + ')');
    });
    
    // Добавляем обработчики событий для новых элементов
    addEventListeners();
}

/**
 * Обновляет информацию о текущей странице
 * @param {number} currentPage - Текущая страница
 * @param {number} totalPages - Общее количество страниц
 * @param {number} totalItems - Общее количество товаров
 */
function updatePageInfo(currentPage, totalPages, totalItems) {
    // Находим или создаем контейнер для информации о странице
    let pageInfoContainer = document.querySelector('.page-info');
    
    if (!pageInfoContainer) {
        // Если контейнер не существует, создаем его
        pageInfoContainer = document.createElement('div');
        pageInfoContainer.className = 'page-info';
        pageInfoContainer.style.textAlign = 'center';
        pageInfoContainer.style.marginTop = '15px';
        pageInfoContainer.style.color = '#6c757d';
        
        // Находим контейнер пагинации для добавления информации о странице после него
        const paginationContainer = document.querySelector('.product__pagination');
        if (paginationContainer) {
            paginationContainer.parentNode.insertBefore(pageInfoContainer, paginationContainer.nextSibling);
        }
    }
    
    // Обновляем информацию о странице
    pageInfoContainer.textContent = `Страница ${currentPage} из ${totalPages} (всего ${totalItems} товаров)`;
}

/**
 * Настраивает селектор для выбора количества товаров на странице
 */
function setupItemsPerPageSelector() {
    // Находим селектор сортировки, чтобы добавить рядом с ним селектор количества товаров
    const sortSelectContainer = document.querySelector('.filter__sort');
    
    if (sortSelectContainer) {
        // Создаем контейнер для селектора количества товаров
        const itemsPerPageContainer = document.createElement('div');
        itemsPerPageContainer.className = 'filter__items-per-page';
        itemsPerPageContainer.style.marginLeft = '15px';
        
        // Создаем лейбл
        const label = document.createElement('span');
        label.textContent = 'Товаров на странице: ';
        label.style.marginRight = '5px';
        
        // Создаем селектор
        const select = document.createElement('select');
        
        // Добавляем опции
        const options = [6, 9, 12, 24];
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            if (option === itemsPerPage) {
                optionElement.selected = true;
            }
            select.appendChild(optionElement);
        });
        
        // Добавляем обработчик события
        select.addEventListener('change', function() {
            // Обновляем количество товаров на странице
            itemsPerPage = parseInt(this.value);
            
            // Сохраняем в localStorage
            localStorage.setItem('itemsPerPage', itemsPerPage);
            
            // Сбрасываем на первую страницу
            currentPage = 1;
            localStorage.setItem('currentPage', currentPage);
            
            // Перезагружаем товары
            loadProductsFromStorage();
        });
        
        // Собираем все вместе
        itemsPerPageContainer.appendChild(label);
        itemsPerPageContainer.appendChild(select);
        
        // Добавляем в родительский контейнер рядом с сортировкой
        sortSelectContainer.parentNode.appendChild(itemsPerPageContainer);
    }
}

/**
 * Настраивает пагинацию для товаров
 * @param {Array} products - Массив товаров
 */
function setupPagination(products) {
    // Находим или создаем контейнер для пагинации
    let paginationContainer = document.querySelector('.product__pagination');
    
    if (!paginationContainer) {
        // Если контейнер не существует, создаем его
        paginationContainer = document.createElement('div');
        paginationContainer.className = 'product__pagination';
        
        // Находим родительский контейнер для добавления пагинации
        const productSection = document.querySelector('.product.spad .container');
        if (productSection) {
            productSection.appendChild(paginationContainer);
        }
    }
    
    // Очищаем контейнер пагинации
    paginationContainer.innerHTML = '';
    
    // Вычисляем общее количество страниц
    const totalPages = Math.ceil(products.length / itemsPerPage);
    
    // Если страниц меньше 2, не показываем пагинацию
    if (totalPages <= 1) {
        paginationContainer.style.display = 'none';
        return;
    } else {
        paginationContainer.style.display = 'flex';
    }
    
    // Добавляем кнопку "Предыдущая"
    const prevButton = document.createElement('a');
    prevButton.href = '#';
    prevButton.innerHTML = '<i class="fa fa-long-arrow-left"></i>';
    prevButton.addEventListener('click', function(e) {
        e.preventDefault();
        if (currentPage > 1) {
            goToPage(currentPage - 1, products);
        }
    });
    if (currentPage <= 1) {
        prevButton.classList.add('disabled');
        prevButton.style.opacity = '0.5';
        prevButton.style.pointerEvents = 'none';
    }
    paginationContainer.appendChild(prevButton);
    
    // Определяем диапазон страниц для отображения
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    // Корректируем начальную страницу, если конечная страница близка к общему количеству
    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }
    
    // Добавляем кнопку для первой страницы, если текущий диапазон не начинается с первой страницы
    if (startPage > 1) {
        const firstPageButton = document.createElement('a');
        firstPageButton.href = '#';
        firstPageButton.textContent = '1';
        firstPageButton.addEventListener('click', function(e) {
            e.preventDefault();
            goToPage(1, products);
        });
        paginationContainer.appendChild(firstPageButton);
        
        // Добавляем многоточие, если между первой страницей и текущим диапазоном есть пропуск
        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.style.margin = '0 5px';
            paginationContainer.appendChild(ellipsis);
        }
    }
    
    // Добавляем кнопки с номерами страниц
    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('a');
        pageButton.href = '#';
        pageButton.textContent = i;
        
        if (i === currentPage) {
            pageButton.className = 'active';
        }
        
        pageButton.addEventListener('click', function(e) {
            e.preventDefault();
            goToPage(i, products);
        });
        
        paginationContainer.appendChild(pageButton);
    }
    
    // Добавляем многоточие и последнюю страницу, если текущий диапазон не заканчивается последней страницей
    if (endPage < totalPages) {
        // Добавляем многоточие, если между текущим диапазоном и последней страницей есть пропуск
        if (endPage < totalPages - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.style.margin = '0 5px';
            paginationContainer.appendChild(ellipsis);
        }
        
        const lastPageButton = document.createElement('a');
        lastPageButton.href = '#';
        lastPageButton.textContent = totalPages;
        lastPageButton.addEventListener('click', function(e) {
            e.preventDefault();
            goToPage(totalPages, products);
        });
        paginationContainer.appendChild(lastPageButton);
    }
    
    // Добавляем кнопку "Следующая"
    const nextButton = document.createElement('a');
    nextButton.href = '#';
    nextButton.innerHTML = '<i class="fa fa-long-arrow-right"></i>';
    nextButton.addEventListener('click', function(e) {
        e.preventDefault();
        if (currentPage < totalPages) {
            goToPage(currentPage + 1, products);
        }
    });
    if (currentPage >= totalPages) {
        nextButton.classList.add('disabled');
        nextButton.style.opacity = '0.5';
        nextButton.style.pointerEvents = 'none';
    }
    paginationContainer.appendChild(nextButton);
    
    // Обновляем информацию о текущей странице
    updatePageInfo(currentPage, totalPages, products.length);
}

/**
 * Переходит на указанную страницу
 * @param {number} page - Номер страницы
 * @param {Array} products - Массив товаров
 */
function goToPage(page, products) {
    // Обновляем текущую страницу
    currentPage = page;
    
    // Сохраняем текущую страницу в localStorage
    localStorage.setItem('currentPage', page);
    
    // Отображаем товары для выбранной страницы
    displayProductsForPage(products, page);
    
    // Обновляем пагинацию
    setupPagination(products);
    
    // Прокручиваем страницу вверх
    window.scrollTo({
        top: document.querySelector('.product.spad').offsetTop - 100,
        behavior: 'smooth'
    });
}