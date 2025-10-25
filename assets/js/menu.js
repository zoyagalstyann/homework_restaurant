// Menu page functionality
class MenuManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
        this.menuItems = [];
        this.filteredItems = [];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadMenuItems();
        this.renderCart();
        this.updateCartCount();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.filterMenuItems(e.target.value));
        }

        // Cart toggle
        const cartToggle = document.getElementById('cartToggle');
        const closeCart = document.getElementById('closeCart');
        const cartSidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('overlay');

        if (cartToggle) {
            cartToggle.addEventListener('click', () => this.toggleCart(true));
        }

        if (closeCart) {
            closeCart.addEventListener('click', () => this.toggleCart(false));
        }

        if (overlay) {
            overlay.addEventListener('click', () => this.toggleCart(false));
        }

        // Checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.openOrderModal());
        }

        // Order form
        const orderForm = document.getElementById('orderForm');
        if (orderForm) {
            orderForm.addEventListener('submit', (e) => this.submitOrder(e));
        }

        // Modal close
        const orderModal = document.getElementById('orderModal');
        const cancelOrder = document.getElementById('cancelOrder');
        const closeModal = orderModal?.querySelector('.close');

        if (cancelOrder) {
            cancelOrder.addEventListener('click', () => this.closeOrderModal());
        }

        if (closeModal) {
            closeModal.addEventListener('click', () => this.closeOrderModal());
        }
    }

    async loadMenuItems() {
        try {
            this.menuItems = await app.apiRequest('/menuitems');
            this.filteredItems = [...this.menuItems];
            this.renderMenuItems();
        } catch (error) {
            console.error('Failed to load menu items:', error);
            app.showNotification('Մենյուի տվյալները բեռնելու սխալ', 'error');
        }
    }

    renderMenuItems() {
        const menuGrid = document.getElementById('menuGrid');
        if (!menuGrid) return;

        if (this.filteredItems.length === 0) {
            menuGrid.innerHTML = `
                <div class="empty-state">
                    <h3>No dishes found</h3>
                    <p>Try changing your search term</p>
                </div>
            `;
            return;
        }

        menuGrid.innerHTML = this.filteredItems.map(item => `
            <div class="menu-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg'">
                <div class="menu-item-info">
                    <h3>${item.name}</h3>
                    <div class="price">$${item.price.toFixed(2)}</div>
                    ${item.description ? `<div class="description">${item.description}</div>` : ''}
                    <button class="add-to-cart" onclick="menuManager.addToCart(${item.id})">
                        Add to Cart
                    </button>
                </div>
            </div>
        `).join('');
    }

    filterMenuItems(searchTerm) {
        if (!searchTerm.trim()) {
            this.filteredItems = [...this.menuItems];
        } else {
            this.filteredItems = this.menuItems.filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
        this.renderMenuItems();
    }

    addToCart(itemId) {
        const item = this.menuItems.find(item => item.id === itemId);
        if (!item) return;

        const existingCartItem = this.cart.find(cartItem => cartItem.id === itemId);
        
        if (existingCartItem) {
            existingCartItem.quantity += 1;
        } else {
            this.cart.push({
                ...item,
                quantity: 1
            });
        }

        this.saveCart();
        this.renderCart();
        this.updateCartCount();
        
        app.showNotification(`${item.name} added to cart`);
    }

    updateQuantity(itemId, change) {
        const cartItem = this.cart.find(item => item.id === itemId);
        if (!cartItem) return;

        cartItem.quantity += change;

        if (cartItem.quantity <= 0) {
            this.removeFromCart(itemId);
        } else {
            this.saveCart();
            this.renderCart();
            this.updateCartCount();
        }
    }

    removeFromCart(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveCart();
        this.renderCart();
        this.updateCartCount();
    }

    renderCart() {
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');

        if (!cartItems || !cartTotal) return;

        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <p>Your cart is empty</p>
                </div>
            `;
            cartTotal.textContent = '0.00';
            return;
        }

        cartItems.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg'">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="menuManager.updateQuantity(${item.id}, -1)">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="qty-btn" onclick="menuManager.updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
            </div>
        `).join('');

        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = total.toFixed(2);
    }

    updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
    }

    toggleCart(show) {
        const cartSidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('overlay');

        if (!cartSidebar || !overlay) return;

        if (show) {
            cartSidebar.classList.add('active');
            overlay.style.display = 'block';
            document.body.style.overflow = 'hidden';
        } else {
            cartSidebar.classList.remove('active');
            overlay.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    openOrderModal() {
        if (this.cart.length === 0) {
            app.showNotification('Your cart is empty', 'error');
            return;
        }

        const orderModal = document.getElementById('orderModal');
        const overlay = document.getElementById('overlay');

        if (orderModal && overlay) {
            orderModal.style.display = 'block';
            overlay.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    closeOrderModal() {
        const orderModal = document.getElementById('orderModal');
        const overlay = document.getElementById('overlay');

        if (orderModal && overlay) {
            orderModal.style.display = 'none';
            overlay.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    async submitOrder(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const orderData = {
            customerName: formData.get('customerName') || document.getElementById('customerName').value,
            customerPhone: formData.get('customerPhone') || document.getElementById('customerPhone').value,
            customerAddress: formData.get('customerAddress') || document.getElementById('customerAddress').value,
            deliveryTime: formData.get('deliveryTime') || document.getElementById('deliveryTime').value,
            items: this.cart,
            totalAmount: this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            status: 'pending'
        };

        // Validate required fields
        if (!orderData.customerName || !orderData.customerPhone || !orderData.customerAddress) {
            app.showNotification('Please fill in all required fields', 'error');
            return;
        }

        try {
            await app.apiRequest('/orders', {
                method: 'POST',
                body: JSON.stringify(orderData)
            });

            // Clear cart
            this.cart = [];
            this.saveCart();
            this.renderCart();
            this.updateCartCount();

            // Close modals
            this.closeOrderModal();
            this.toggleCart(false);

            // Reset form
            document.getElementById('orderForm').reset();

            app.showNotification('Order placed successfully!');

        } catch (error) {
            console.error('Order submission failed:', error);
            app.showNotification('Failed to place order', 'error');
        }
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }
}

// Initialize menu manager
const menuManager = new MenuManager();