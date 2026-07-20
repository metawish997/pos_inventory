import { API_BASE_URL } from '../../../api/endpoints';

const fetchApi = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Purchase API request failed');
    }
    return response.json();
};

// ============ VENDORS ============
export const getVendors = (params = '') => fetchApi(`/vendors${params}`);
export const getVendorById = (id) => fetchApi(`/vendors/${id}`);
export const createVendor = (data) => fetchApi('/vendors', { method: 'POST', body: JSON.stringify(data) });
export const updateVendor = (id, data) => fetchApi(`/vendors/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteVendor = (id) => fetchApi(`/vendors/${id}`, { method: 'DELETE' });

// ============ PURCHASES ============
export const getPurchases = (params = '') => fetchApi(`/purchases${params}`);
export const getPurchaseById = (id) => fetchApi(`/purchases/${id}`);
export const getDraftPurchases = () => fetchApi('/purchases/drafts');
export const createPurchase = (data) => fetchApi('/purchases', { method: 'POST', body: JSON.stringify(data) });
export const updatePurchase = (id, data) => fetchApi(`/purchases/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const approvePurchase = (id) => fetchApi(`/purchases/${id}/approve`, { method: 'PUT' });
export const deletePurchase = (id) => fetchApi(`/purchases/${id}`, { method: 'DELETE' });

// ============ PURCHASE RETURNS ============
export const getPurchaseReturns = (params = '') => fetchApi(`/purchase-returns${params}`);
export const getPurchaseReturnById = (id) => fetchApi(`/purchase-returns/${id}`);
export const createPurchaseReturn = (data) => fetchApi('/purchase-returns', { method: 'POST', body: JSON.stringify(data) });
export const deletePurchaseReturn = (id) => fetchApi(`/purchase-returns/${id}`, { method: 'DELETE' });

// ============ REPORTS ============
export const getVendorPurchaseReport = (params = '') => fetchApi(`/purchase-reports/vendor${params}`);
export const getPurchaseSummary = () => fetchApi('/purchase-reports/summary');
export const getGstSummary = () => fetchApi('/purchase-reports/gst');
export const getWarehousePurchaseReport = () => fetchApi('/purchase-reports/warehouse');
export const getPurchaseReturnReport = () => fetchApi('/purchase-reports/returns');

// ============ SHARED LOOKUPS ============
export const getProducts = () => fetchApi('/products');
export const getProductVariants = (productId) => fetchApi(`/products/${productId}/variants`);
export const getWarehouses = () => fetchApi('/inventory/warehouses');
export const getTaxes = () => fetchApi('/inventory/taxes');