import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function getSessionId() {
    let sessionId = sessionStorage.getItem('browser_session_id');

    if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('browser_session_id', sessionId);
    }

    return sessionId;
}

export async function getCartFromDB() {
    const sessionId = getSessionId();

    const { data, error } = await supabase
        .from('cart_sessions')
        .select('cart_data')
        .eq('session_id', sessionId)
        .maybeSingle();

    if (error) {
        console.error('Error loading cart:', error);
        return [];
    }

    return data ? data.cart_data : [];
}

export async function saveCartToDB(cartData) {
    const sessionId = getSessionId();

    const { data: existing } = await supabase
        .from('cart_sessions')
        .select('id')
        .eq('session_id', sessionId)
        .maybeSingle();

    if (existing) {
        const { error } = await supabase
            .from('cart_sessions')
            .update({
                cart_data: cartData,
                updated_at: new Date().toISOString()
            })
            .eq('session_id', sessionId);

        if (error) {
            console.error('Error updating cart:', error);
        }
    } else {
        const { error } = await supabase
            .from('cart_sessions')
            .insert({
                session_id: sessionId,
                cart_data: cartData
            });

        if (error) {
            console.error('Error creating cart:', error);
        }
    }
}

export function getAdminSessionToken() {
    let token = sessionStorage.getItem('admin_session_token');

    if (!token) {
        token = 'admin_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('admin_session_token', token);
    }

    return token;
}

export async function checkAdminLogin() {
    const token = getAdminSessionToken();

    const { data, error } = await supabase
        .from('admin_sessions')
        .select('is_logged_in')
        .eq('session_token', token)
        .maybeSingle();

    if (error) {
        console.error('Error checking admin login:', error);
        return false;
    }

    return data ? data.is_logged_in : false;
}

export async function setAdminLogin(isLoggedIn) {
    const token = getAdminSessionToken();

    const { data: existing } = await supabase
        .from('admin_sessions')
        .select('id')
        .eq('session_token', token)
        .maybeSingle();

    if (existing) {
        const { error } = await supabase
            .from('admin_sessions')
            .update({
                is_logged_in: isLoggedIn,
                last_active: new Date().toISOString()
            })
            .eq('session_token', token);

        if (error) {
            console.error('Error updating admin session:', error);
        }
    } else {
        const { error } = await supabase
            .from('admin_sessions')
            .insert({
                session_token: token,
                is_logged_in: isLoggedIn
            });

        if (error) {
            console.error('Error creating admin session:', error);
        }
    }
}
