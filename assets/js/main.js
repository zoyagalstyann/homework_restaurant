// Main JavaScript file
class RestaurantApp {
    constructor() {
        this.isProduction = false; // Set to true for production mode with PHP API
        this.apiBase = '/api'; // API base URL for production
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeData();
    }

    setupEventListeners() {
        // Mobile menu toggle (if needed)
        document.addEventListener('DOMContentLoaded', () => {
            this.highlightActiveNavLink();
        });
    }

    highlightActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    }

    initializeData() {
        // Initialize demo data if not in localStorage
        if (!this.isProduction && !localStorage.getItem('menuItems')) {
            this.initializeDemoData();
        }
    }

    initializeDemoData() {
        const demoMenuItems = [
            // Antipasti
            {
                id: 1,
                name: 'Antipasto Misto',
                price: 18.50,
                image: 'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg',
                description: 'Selection of Italian cured meats, cheeses, olives, and marinated vegetables'
            },
            {
                id: 2,
                name: 'Bruschetta Trio',
                price: 14.00,
                image: 'https://images.pexels.com/photos/5949888/pexels-photo-5949888.jpeg',
                description: 'Three varieties: classic tomato basil, mushroom truffle, and ricotta honey'
            },
            {
                id: 3,
                name: 'Burrata Caprese',
                price: 16.50,
                image: 'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg',
                description: 'Creamy burrata with heirloom tomatoes, fresh basil, and balsamic glaze'
            },
            {
                id: 4,
                name: 'Arancini Siciliani',
                price: 12.00,
                image: 'https://images.pexels.com/photos/5949888/pexels-photo-5949888.jpeg',
                description: 'Crispy risotto balls stuffed with mozzarella and served with marinara'
            },
            
            // Pasta
            {
                id: 5,
                name: 'Spaghetti Carbonara',
                price: 22.00,
                image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg',
                description: 'Classic Roman pasta with pancetta, eggs, pecorino romano, and black pepper'
            },
            {
                id: 6,
                name: 'Fettuccine Alfredo',
                price: 20.00,
                image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg',
                description: 'Fresh fettuccine in rich parmesan cream sauce with butter and herbs'
            },
            {
                id: 7,
                name: 'Penne Arrabbiata',
                price: 18.50,
                image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg',
                description: 'Spicy tomato sauce with garlic, red chilies, and fresh parsley'
            },
            {
                id: 8,
                name: 'Linguine alle Vongole',
                price: 26.00,
                image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg',
                description: 'Fresh clams in white wine sauce with garlic, parsley, and olive oil'
            },
            {
                id: 9,
                name: 'Lasagna della Casa',
                price: 24.00,
                image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg',
                description: 'Homemade lasagna with meat sauce, bechamel, and three cheeses'
            },
            {
                id: 10,
                name: 'Ravioli di Ricotta e Spinaci',
                price: 21.50,
                image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg',
                description: 'Handmade ravioli filled with ricotta and spinach in sage butter sauce'
            },
            {
                id: 11,
                name: 'Gnocchi Gorgonzola',
                price: 19.50,
                image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg',
                description: 'Potato gnocchi in creamy gorgonzola sauce with walnuts'
            },
            {
                id: 12,
                name: 'Pappardelle al Cinghiale',
                price: 28.00,
                image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg',
                description: 'Wide ribbon pasta with slow-cooked wild boar ragu and herbs'
            },
            
            // Pizza
            {
                id: 13,
                name: 'Pizza Margherita',
                price: 16.00,
                image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg',
                description: 'San Marzano tomatoes, fresh mozzarella, basil, and extra virgin olive oil'
            },
            {
                id: 14,
                name: 'Pizza Quattro Stagioni',
                price: 20.00,
                image: 'https://images.pexels.com/photos/708587/pexels-photo-708587.jpeg',
                description: 'Four seasons pizza with artichokes, mushrooms, ham, and olives'
            },
            {
                id: 15,
                name: 'Pizza Diavola',
                price: 18.50,
                image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg',
                description: 'Spicy salami, mozzarella, tomato sauce, and hot peppers'
            },
            {
                id: 16,
                name: 'Pizza Prosciutto e Funghi',
                price: 19.50,
                image: 'https://images.pexels.com/photos/708587/pexels-photo-708587.jpeg',
                description: 'Prosciutto di Parma, mushrooms, mozzarella, and tomato sauce'
            },
            {
                id: 17,
                name: 'Pizza Quattro Formaggi',
                price: 21.00,
                image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg',
                description: 'Four cheese pizza with mozzarella, gorgonzola, parmesan, and fontina'
            },
            {
                id: 18,
                name: 'Pizza Capricciosa',
                price: 20.50,
                image: 'https://images.pexels.com/photos/708587/pexels-photo-708587.jpeg',
                description: 'Ham, mushrooms, artichokes, olives, and mozzarella'
            },
            
            // Secondi Piatti
            {
                id: 19,
                name: 'Osso Buco alla Milanese',
                price: 32.00,
                image: 'https://images.pexels.com/photos/2233729/pexels-photo-2233729.jpeg',
                description: 'Braised veal shanks with saffron risotto and gremolata'
            },
            {
                id: 20,
                name: 'Saltimbocca alla Romana',
                price: 28.50,
                image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
                description: 'Veal scallopini with prosciutto and sage in white wine sauce'
            },
            {
                id: 21,
                name: 'Branzino in Crosta di Sale',
                price: 30.00,
                image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
                description: 'Mediterranean sea bass baked in salt crust with herbs'
            },
            {
                id: 22,
                name: 'Pollo alla Parmigiana',
                price: 24.00,
                image: 'https://images.pexels.com/photos/2233729/pexels-photo-2233729.jpeg',
                description: 'Breaded chicken breast with tomato sauce and melted mozzarella'
            },
            {
                id: 23,
                name: 'Bistecca alla Fiorentina',
                price: 45.00,
                image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
                description: 'Grilled T-bone steak with rosemary, garlic, and olive oil (for 2)'
            },
            {
                id: 24,
                name: 'Salmone in Crosta',
                price: 26.50,
                image: 'https://images.pexels.com/photos/2233729/pexels-photo-2233729.jpeg',
                description: 'Herb-crusted salmon with lemon butter sauce and vegetables'
            },
            
            // Risotti
            {
                id: 25,
                name: 'Risotto ai Porcini',
                price: 23.00,
                image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg',
                description: 'Creamy risotto with porcini mushrooms and parmesan'
            },
            {
                id: 26,
                name: 'Risotto ai Frutti di Mare',
                price: 28.00,
                image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg',
                description: 'Seafood risotto with shrimp, mussels, clams, and calamari'
            },
            {
                id: 27,
                name: 'Risotto alla Milanese',
                price: 21.00,
                image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg',
                description: 'Traditional saffron risotto with bone marrow and parmesan'
            },
            
            // Contorni
            {
                id: 28,
                name: 'Verdure Grigliate',
                price: 12.00,
                image: 'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg',
                description: 'Grilled seasonal vegetables with balsamic glaze'
            },
            {
                id: 29,
                name: 'Spinaci Saltati',
                price: 10.00,
                image: 'https://images.pexels.com/photos/5949888/pexels-photo-5949888.jpeg',
                description: 'Sautéed spinach with garlic and olive oil'
            },
            {
                id: 30,
                name: 'Patate Arrosto',
                price: 9.50,
                image: 'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg',
                description: 'Roasted potatoes with rosemary and sea salt'
            }
            
            // Dolci
            
            
        ];

        localStorage.setItem('menuItems', JSON.stringify(demoMenuItems));
    }

    // API Methods
    async apiRequest(endpoint, options = {}) {
        if (!this.isProduction) {
            // Demo mode - use localStorage
            return this.localStorageRequest(endpoint, options);
        }

        // Production mode - use fetch API
        try {
            const response = await fetch(`${this.apiBase}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    localStorageRequest(endpoint, options = {}) {
        // Simulate API with localStorage
        const method = options.method || 'GET';
        const body = options.body ? JSON.parse(options.body) : null;

        switch (endpoint) {
            case '/menuitems':
                if (method === 'GET') {
                    return JSON.parse(localStorage.getItem('menuItems') || '[]');
                } else if (method === 'POST') {
                    const items = JSON.parse(localStorage.getItem('menuItems') || '[]');
                    const newItem = {
                        id: Date.now(),
                        ...body
                    };
                    items.push(newItem);
                    localStorage.setItem('menuItems', JSON.stringify(items));
                    return newItem;
                }
                break;

            case (endpoint.match(/^\/menuitems\/(\d+)$/) || {}).input:
                const id = parseInt(endpoint.split('/').pop());
                const items = JSON.parse(localStorage.getItem('menuItems') || '[]');
                const itemIndex = items.findIndex(item => item.id === id);

                if (method === 'PUT' && itemIndex !== -1) {
                    items[itemIndex] = { ...items[itemIndex], ...body };
                    localStorage.setItem('menuItems', JSON.stringify(items));
                    return items[itemIndex];
                } else if (method === 'DELETE' && itemIndex !== -1) {
                    const deletedItem = items.splice(itemIndex, 1)[0];
                    localStorage.setItem('menuItems', JSON.stringify(items));
                    return deletedItem;
                }
                break;

            case '/reservations':
                if (method === 'POST') {
                    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
                    const newReservation = {
                        id: Date.now(),
                        ...body,
                        createdAt: new Date().toISOString()
                    };
                    reservations.push(newReservation);
                    localStorage.setItem('reservations', JSON.stringify(reservations));
                    return newReservation;
                }
                break;

            case '/customers':
                if (method === 'POST') {
                    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
                    const newCustomer = {
                        id: Date.now(),
                        ...body,
                        createdAt: new Date().toISOString()
                    };
                    customers.push(newCustomer);
                    localStorage.setItem('customers', JSON.stringify(customers));
                    return newCustomer;
                }
                break;

            case '/orders':
                if (method === 'POST') {
                    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
                    const newOrder = {
                        id: Date.now(),
                        ...body,
                        createdAt: new Date().toISOString()
                    };
                    orders.push(newOrder);
                    localStorage.setItem('orders', JSON.stringify(orders));
                    return newOrder;
                }
                break;
        }

        throw new Error('Endpoint not found');
    }

    // Utility Methods
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'decimal',
            minimumFractionDigits: 0
        }).format(amount);
    }

    showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">
                    ${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
                </span>
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#2C5530' : type === 'error' ? '#DC143C' : '#DAA520'};
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 3000;
            animation: slideInRight 0.3s ease, fadeOut 0.3s ease 4.7s forwards;
            max-width: 400px;
            word-wrap: break-word;
        `;

        // Add to document
        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);

        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        });
    }

    validateForm(formElement) {
        let isValid = true;
        const requiredFields = formElement.querySelectorAll('[required]');

        requiredFields.forEach(field => {
            const errorElement = document.getElementById(field.name + 'Error');
            
            if (!field.value.trim()) {
                if (errorElement) {
                    errorElement.textContent = 'This field is required';
                }
                field.parentElement.classList.add('error');
                isValid = false;
            } else {
                if (errorElement) {
                    errorElement.textContent = '';
                }
                field.parentElement.classList.remove('error');
            }
        });

        return isValid;
    }
}

// Initialize the app
const app = new RestaurantApp();

// Add notification styles to head
const style = document.createElement('style');
style.textContent = `
    .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        margin-left: auto;
    }
    .notification-close:hover {
        opacity: 0.8;
    }
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);