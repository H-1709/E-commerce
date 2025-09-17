// Product Data
const products = [
    {
        id: 'prod1',
        name: 'Premium Slim Fit Shirt',
        price: 49.99,
        category: 'shirts',
        image: 'https://funkybabaji.com/cdn/shop/files/112_4_800x1000.jpg?v=1735020212'
    },
    {
        id: 'prod2',
        name: 'Classic Denim Jeans',
        price: 59.99,
        category: 'pants',
        image: 'https://media.gettyimages.com/id/173239968/photo/skinny-tight-blue-jeans-on-white-background.jpg?s=612x612&w=gi&k=20&c=QqoFe-m6N_FQKu6KyDVrHUwmKUyh3nkFK8QbDrl3OVM='
    },
    {
        id: 'prod3',
        name: 'Casual T-Shirt',
        price: 24.99,
        category: 'shirts',
        image: 'https://5.imimg.com/data5/SELLER/Default/2023/10/353194924/NN/MV/BA/1044551/mens-casual-t-shirts-1000x1000.jpg'
    },
    {
        id: 'prod4',
        name: 'Chino Pants',
        price: 44.99,
        category: 'pants',
        image: 'https://de-backers.com/cdn/shop/files/34700205-1.jpg?v=1757243082&width=2400'
    },
    {
        id: 'prod5',
        name: 'Leather Belt',
        price: 29.99,
        category: 'accessories',
        image: 'https://teakwoodleathers.com/cdn/shop/products/T_BT_473_CfBr_6_1080x.jpg?v=1750934390'
    },
    {
        id: 'prod6',
        name: 'Wool Beanie',
        price: 19.99,
        category: 'accessories',
        image: 'https://hairloveindia.com/cdn/shop/products/NAVY-BLUE-WITH-GREY_1200x.jpg?v=1681304340'
    }
];

// Cart Functions
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(product, size = 'M', color = '#4a6fa5', quantity = 1) {
    // Check if product already exists in cart
    const existingItem = cart.find(item => 
        item.id === product.id && 
        item.size === size && 
        item.color === color
    );
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            size,
            color,
            quantity
        });
    }
    
    saveCart();
    updateCartCount();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartCount();
}

function updateCartItemQuantity(index, newQuantity) {
    if (newQuantity > 0) {
        cart[index].quantity = newQuantity;
    } else {
        cart.splice(index, 1);
    }
    saveCart();
    updateCartCount();
}

function clearCart() {
    cart = [];
    saveCart();
    updateCartCount();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = count;
    });
}

// Display Functions
function loadProducts() {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;
    
    // Get category from URL
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    // Filter products by category if specified
    let filteredProducts = products;
    if (category && category !== 'all') {
        filteredProducts = products.filter(product => product.category === category);
    }
    
    // Clear existing products
    productsGrid.innerHTML = '';
    
    // Add filtered products
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
    
    // Add event listeners to add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const product = products.find(p => p.id === productId);
            if (product) {
                addToCart(product);
                alert(`${product.name} added to cart!`);
            }
        });
    });
}

function displayCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-bag"></i>
                <h3>Your cart is empty</h3>
                <p>Looks like you haven't added anything to your cart yet</p>
                <a href="shop.html" class="btn">Continue Shopping</a>
            </div>
        `;
        return;
    }
    
    cartItemsContainer.innerHTML = '';
    
    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p>Size: ${item.size}</p>
                <p>Color: <span style="display: inline-block; width: 15px; height: 15px; background-color: ${item.color}; border-radius: 50%;"></span></p>
                <div class="cart-item-quantity">
                    <button class="quantity-minus" data-index="${index}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-plus" data-index="${index}">+</button>
                </div>
            </div>
            <div class="cart-item-actions">
                <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                <button class="cart-item-remove" data-index="${index}">Remove</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    
    // Add event listeners to quantity buttons
    document.querySelectorAll('.quantity-minus').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            const newQuantity = cart[index].quantity - 1;
            updateCartItemQuantity(index, newQuantity);
            displayCartItems();
            updateCartSummary();
        });
    });

    
    document.querySelectorAll('.quantity-plus').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            const newQuantity = cart[index].quantity + 1;
            updateCartItemQuantity(index, newQuantity);
            displayCartItems();
            updateCartSummary();
        });
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.cart-item-remove').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            removeFromCart(index);
            displayCartItems();
            updateCartSummary();
        });
    });
}

function updateCartSummary() {
    const subtotal = getCartTotal();
    const shipping = subtotal > 50 || subtotal === 0 ? 0 : 5.99;
    const total = subtotal + shipping;
    
    document.querySelectorAll('.subtotal').forEach(el => {
        el.textContent = `$${subtotal.toFixed(2)}`;
    });
    
    document.querySelectorAll('.shipping').forEach(el => {
        el.textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
    });
    
    document.querySelectorAll('.total-price').forEach(el => {
        el.textContent = `$${total.toFixed(2)}`;
    });
    
    // Disable checkout button if cart is empty
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.disabled = cart.length === 0;
    }
    
    const placeOrderBtn = document.querySelector('.place-order-btn');
    if (placeOrderBtn) {
        placeOrderBtn.disabled = cart.length === 0;
    }
}

function displayOrderSummary() {
    const orderItemsContainer = document.querySelector('.order-items');
    if (!orderItemsContainer) return;
    
    orderItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <div class="order-item-info">
                <div class="order-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="order-item-details">
                    <h4>${item.name}</h4>
                    <p>Size: ${item.size}</p>
                    <p>Qty: ${item.quantity}</p>
                </div>
            </div>
            <div class="order-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
        `;
        orderItemsContainer.appendChild(orderItem);
    });
    
    updateCartSummary();
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    // Load products on shop page
    if (document.querySelector('.products-grid')) {
        loadProducts();
    }
    
    // Filter products when filter changes
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            const url = new URL(window.location.href);
            url.searchParams.set('category', this.value);
            window.location.href = url.toString();
        });
        
        // Set initial filter value from URL
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        if (category) {
            categoryFilter.value = category;
        }
    }
    
    // Sort products when sort changes
    const sortBy = document.getElementById('sort-by');
    if (sortBy) {
        sortBy.addEventListener('change', function() {
            // In a real app, you would sort the products here
            alert('Sorting functionality would be implemented here');
        });
    }
});