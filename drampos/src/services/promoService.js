import { API_BASE_URL } from '../api/endpoints';

const fetchPromoApi = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Promo service request failed');
    }
    return response.json();
};

// Coupons
export const getCoupons = async () => fetchPromoApi('/promo/coupons', { method: 'GET' });
export const createCoupon = async (data) => fetchPromoApi('/promo/coupons', { method: 'POST', body: JSON.stringify(data) });
export const updateCoupon = async (id, data) => fetchPromoApi(`/promo/coupons/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteCoupon = async (id) => fetchPromoApi(`/promo/coupons/${id}`, { method: 'DELETE' });

// Gift Cards
export const getGiftCards = async () => fetchPromoApi('/promo/gift-cards', { method: 'GET' });
export const createGiftCard = async (data) => fetchPromoApi('/promo/gift-cards', { method: 'POST', body: JSON.stringify(data) });
export const updateGiftCard = async (id, data) => fetchPromoApi(`/promo/gift-cards/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteGiftCard = async (id) => fetchPromoApi(`/promo/gift-cards/${id}`, { method: 'DELETE' });

// Discounts
export const getDiscounts = async () => fetchPromoApi('/promo/discounts', { method: 'GET' });
export const createDiscount = async (data) => fetchPromoApi('/promo/discounts', { method: 'POST', body: JSON.stringify(data) });
export const updateDiscount = async (id, data) => fetchPromoApi(`/promo/discounts/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteDiscount = async (id) => fetchPromoApi(`/promo/discounts/${id}`, { method: 'DELETE' });
