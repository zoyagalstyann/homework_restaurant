const API_BASE_URL = 'http://localhost/api';

function getSessionId() {
    let sessionId = sessionStorage.getItem('browser_session_id');

    if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('browser_session_id', sessionId);
    }

    return sessionId;
}

function getAdminSessionToken() {
    let token = sessionStorage.getItem('admin_session_token');

    if (!token) {
        token = 'admin_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('admin_session_token', token);
    }

    return token;
}

export async function getCartFromDB() {
    const sessionId = getSessionId();

    try {
        const response = await fetch(`${API_BASE_URL}/cart.php?session_id=${sessionId}`);
        if (!response.ok) throw new Error('Failed to load cart');
        return await response.json();
    } catch (error) {
        console.error('Error loading cart:', error);
        return [];
    }
}

export async function saveCartToDB(cartData) {
    const sessionId = getSessionId();

    try {
        const response = await fetch(`${API_BASE_URL}/cart.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_id: sessionId, cart_data: cartData })
        });

        if (!response.ok) throw new Error('Failed to save cart');
        return await response.json();
    } catch (error) {
        console.error('Error saving cart:', error);
    }
}

export async function checkAdminLogin() {
    const token = getAdminSessionToken();

    try {
        const response = await fetch(`${API_BASE_URL}/admin.php?session_token=${token}`);
        if (!response.ok) throw new Error('Failed to check admin login');
        const data = await response.json();
        return data.is_logged_in;
    } catch (error) {
        console.error('Error checking admin login:', error);
        return false;
    }
}

export async function adminLogin(password) {
    const token = getAdminSessionToken();

    try {
        const response = await fetch(`${API_BASE_URL}/admin.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_token: token, password })
        });

        if (!response.ok) throw new Error('Failed to login');
        const data = await response.json();
        return data.success;
    } catch (error) {
        console.error('Error during login:', error);
        return false;
    }
}

export async function setAdminLogin(isLoggedIn) {
    const token = getAdminSessionToken();

    try {
        const response = await fetch(`${API_BASE_URL}/admin.php`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_token: token, is_logged_in: isLoggedIn })
        });

        if (!response.ok) throw new Error('Failed to update admin session');
        return await response.json();
    } catch (error) {
        console.error('Error updating admin session:', error);
    }
}

export async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'API request failed');
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}
