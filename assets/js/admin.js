// Admin page functionality
class AdminManager {
    constructor() {
        this.isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
        this.menuItems = [];
        this.editingItem = null;
        
        this.init();
    }

    init() {
        this.checkLogin();
        this.setupEventListeners();
        
        if (this.isLoggedIn) {
            this.loadMenuItems();
        }
    }

    checkLogin() {
        const loginModal = document.getElementById('loginModal');
        const adminContent = document.getElementById('adminContent');

        if (this.isLoggedIn) {
            if (loginModal) loginModal.style.display = 'none';
            if (adminContent) adminContent.style.display = 'block';
        } else {
            if (loginModal) loginModal.style.display = 'block';
            if (adminContent) adminContent.style.display = 'none';
        }
    }

    setupEventListeners() {
        // Admin login
        const adminLoginForm = document.getElementById('adminLoginForm');
        if (adminLoginForm) {
            adminLoginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }

        // Add new item
        const addNewItemBtn = document.getElementById('addNewItemBtn');
        if (addNewItemBtn) {
            addNewItemBtn.addEventListener('click', () => this.openItemModal());
        }

        // Item form
        const itemForm = document.getElementById('itemForm');
        if (itemForm) {
            itemForm.addEventListener('submit', (e) => this.saveItem(e));
        }

        // Modal close
        const closeModal = document.getElementById('closeModal');
        const cancelBtn = document.getElementById('cancelBtn');
        const itemModal = document.getElementById('itemModal');
        const overlay = document.getElementById('overlay');

        if (closeModal) {
            closeModal.addEventListener('click', () => this.closeItemModal());
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.closeItemModal());
        }

        if (overlay) {
            overlay.addEventListener('click', () => this.closeItemModal());
        }

        // Image preview
        const itemImage = document.getElementById('itemImage');
        if (itemImage) {
            itemImage.addEventListener('input', () => this.previewImage());
        }
    }

    handleLogin(e) {
        e.preventDefault();
        
        const password = document.getElementById('adminPassword').value;
        const loginError = document.getElementById('loginError');
        
        if (password === 'admin123') {
            this.isLoggedIn = true;
            localStorage.setItem('adminLoggedIn', 'true');
            this.checkLogin();
            this.loadMenuItems();
            
            if (loginError) loginError.textContent = '';
            document.getElementById('adminPassword').value = '';
        } else {
            if (loginError) {
                loginError.textContent = 'Incorrect password';
            }
        }
    }

    logout() {
        this.isLoggedIn = false;
        localStorage.removeItem('adminLoggedIn');
        this.checkLogin();
    }

    async loadMenuItems() {
        try {
            this.menuItems = await app.apiRequest('/menuitems');
            this.renderMenuItems();
        } catch (error) {
            console.error('Failed to load menu items:', error);
            app.showNotification('Failed to load menu items', 'error');
        }
    }

    renderMenuItems() {
        const menuItemsList = document.getElementById('menuItemsList');
        if (!menuItemsList) return;

        if (this.menuItems.length === 0) {
            menuItemsList.innerHTML = `
                <div class="empty-state">
                    <h3>Menu is empty</h3>
                    <p>Add your first dish</p>
                    <button class="btn btn-primary" onclick="adminManager.openItemModal()">
                        + Add Dish
                    </button>
                </div>
            `;
            return;
        }

        menuItemsList.innerHTML = this.menuItems.map(item => `
            <div class="admin-item-card">
                <div class="admin-item-image">
                    ${item.image ? `<img src="${item.image}" alt="${item.name}" onerror="this.parentElement.innerHTML='Image failed to load'">` : 'No image'}
                </div>
                <div class="admin-item-info">
                    <div class="admin-item-name">${item.name}</div>
                    <div class="admin-item-price">$${item.price.toFixed(2)}</div>
                    ${item.description ? `<div class="admin-item-description">${item.description}</div>` : ''}
                    <div class="admin-item-actions">
                        <button class="btn btn-small btn-secondary" onclick="adminManager.editItem(${item.id})">
                            Edit
                        </button>
                        <button class="btn btn-small btn-danger" onclick="adminManager.deleteItem(${item.id})">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    openItemModal(item = null) {
        const itemModal = document.getElementById('itemModal');
        const modalTitle = document.getElementById('modalTitle');
        const overlay = document.getElementById('overlay');
        
        this.editingItem = item;
        
        if (item) {
            // Edit mode
            modalTitle.textContent = 'Edit Dish';
            document.getElementById('itemId').value = item.id;
            document.getElementById('itemName').value = item.name;
            document.getElementById('itemPrice').value = item.price;
            document.getElementById('itemImage').value = item.image || '';
            document.getElementById('itemDescription').value = item.description || '';
            this.previewImage();
        } else {
            // Add mode
            modalTitle.textContent = 'New Dish';
            document.getElementById('itemForm').reset();
            this.hideImagePreview();
        }

        itemModal.style.display = 'block';
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeItemModal() {
        const itemModal = document.getElementById('itemModal');
        const overlay = document.getElementById('overlay');
        
        itemModal.style.display = 'none';
        overlay.style.display = 'none';
        document.body.style.overflow = '';
        
        this.editingItem = null;
        this.hideImagePreview();
    }

    previewImage() {
        const imageUrl = document.getElementById('itemImage').value;
        const imagePreview = document.getElementById('imagePreview');
        const previewImg = document.getElementById('previewImg');

        if (imageUrl) {
            previewImg.src = imageUrl;
            imagePreview.style.display = 'block';
            
            previewImg.onerror = () => {
                imagePreview.style.display = 'none';
            };
        } else {
            this.hideImagePreview();
        }
    }

    hideImagePreview() {
        const imagePreview = document.getElementById('imagePreview');
        if (imagePreview) {
            imagePreview.style.display = 'none';
        }
    }

    async saveItem(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const itemData = {
            name: formData.get('itemName') || document.getElementById('itemName').value,
            price: parseFloat(formData.get('itemPrice') || document.getElementById('itemPrice').value),
            image: formData.get('itemImage') || document.getElementById('itemImage').value,
            description: formData.get('itemDescription') || document.getElementById('itemDescription').value
        };

        // Validate required fields
        if (!itemData.name || !itemData.price || !itemData.image) {
            app.showNotification('Please fill in all required fields', 'error');
            return;
        }

        if (itemData.price <= 0) {
            app.showNotification('Price must be greater than 0', 'error');
            return;
        }

        try {
            if (this.editingItem) {
                // Update existing item
                const itemId = document.getElementById('itemId').value;
                await app.apiRequest(`/menuitems/${itemId}`, {
                    method: 'PUT',
                    body: JSON.stringify(itemData)
                });
                app.showNotification('Dish updated successfully');
            } else {
                // Create new item
                await app.apiRequest('/menuitems', {
                    method: 'POST',
                    body: JSON.stringify(itemData)
                });
                app.showNotification('Dish added successfully');
            }

            this.closeItemModal();
            this.loadMenuItems();

        } catch (error) {
            console.error('Failed to save item:', error);
            app.showNotification('Failed to save dish', 'error');
        }
    }

    editItem(itemId) {
        const item = this.menuItems.find(item => item.id === itemId);
        if (item) {
            this.openItemModal(item);
        }
    }

    async deleteItem(itemId) {
        const item = this.menuItems.find(item => item.id === itemId);
        if (!item) return;

        if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
            try {
                await app.apiRequest(`/menuitems/${itemId}`, {
                    method: 'DELETE'
                });

                app.showNotification('Dish deleted successfully');
                this.loadMenuItems();

            } catch (error) {
                console.error('Failed to delete item:', error);
                app.showNotification('Failed to delete dish', 'error');
            }
        }
    }
}

// Initialize admin manager
const adminManager = new AdminManager();