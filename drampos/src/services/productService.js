import { API_BASE_URL } from '../api/endpoints';

const fetchProductApi = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Product service block breakdown exception');
    }
    return response.json();
};

export const createProduct = async (productPayload) => {
    return fetchProductApi('/products', {
        method: 'POST',
        body: JSON.stringify({
            ...productPayload,
            status: productPayload.status || 'Active' // Enforces standard Active status by default safely
        })
    });
};

export const getAllProducts = async () => {
    return fetchProductApi('/products', { method: 'GET' });
};

export const getProductById = async (id) => {
    return fetchProductApi(`/products/${id}`, { method: 'GET' });
};

export const updateProduct = async (id, updatedPayload) => {
    return fetchProductApi(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedPayload) // Status update can be triggered seamlessly via this array payload frame
    });
};

export const deleteProduct = async (id) => {
    return fetchProductApi(`/products/${id}`, { method: 'DELETE' });
};

export const getProductVariants = async (productId) => {
    return fetchProductApi(`/products/${productId}/variants`, { method: 'GET' });
};