// Initialize heart items from localStorage
let heartItems = [];
try {
    const storedItems = localStorage.getItem('favorites');
    console.log('Stored items:', storedItems);
    if (storedItems) {
        heartItems = JSON.parse(storedItems);
        console.log('Parsed heart items:', heartItems);
    }
} catch (error) {
    console.error('Error loading heart items:', error);
}

// Update heart count in header
function updateHeartCount() {
    const count = heartItems.length;
    document.getElementById('heartCount').textContent = count;
    document.getElementById('heartCount2').textContent = count;
}

// Remove item from heart
function removeFromHeart(id) {
    heartItems = heartItems.filter(item => item.id !== id);
    localStorage.setItem('favorites', JSON.stringify(heartItems));
    updateHeartCount();
    displayHeartItems();
}

// Add item to cart
function addToCart(id) {
    const item = heartItems.find(item => item.id === id);
    if (item) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(cartItem => cartItem.id === id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.img,
                quantity: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart count
        const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
        document.getElementById('cartCount').textContent = cartCount;
        document.getElementById('cartCount2').textContent = cartCount;
        
        // Remove from heart
        removeFromHeart(id);
    }
}

// Display heart items
function displayHeartItems() {
    const heartItemsContainer = document.getElementById('heartItems');
    if (!heartItemsContainer) {
        console.error('Heart items container not found');
        return;
    }
    console.log('Displaying heart items:', heartItems);

    heartItemsContainer.innerHTML = '';
    
    if (heartItems.length === 0) {
        heartItemsContainer.innerHTML = `
            <tr>
                <td colspan="4" class="text-center">
                    <h5>Список избранного пуст</h5>
                    <a href="shop-grid.html" class="primary-btn">ПЕРЕЙТИ В МАГАЗИН</a>
                </td>
            </tr>
        `;
        return;
    }

    heartItems.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="shoping__cart__item">
                <img src="img/product/${item.img}" alt="${item.name}" style="width: 100px;">
                <h5>${item.name}</h5>
            </td>
            <td class="shoping__cart__price">
                ${item.price} P
            </td>
            <td class="shoping__cart__item__close">
                <button class="primary-btn" onclick="addToCart(${item.id})">В КОРЗИНУ</button>
            </td>
            <td class="shoping__cart__item__close">
                <span class="icon_close" onclick="removeFromHeart(${item.id})"></span>
            </td>
        `;
        heartItemsContainer.appendChild(tr);
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    updateHeartCount();
    displayHeartItems();
});