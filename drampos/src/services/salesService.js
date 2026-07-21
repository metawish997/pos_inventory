import { API_BASE_URL } from '../api/endpoints';

const fetchSalesApi = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Sales service request failed');
    }
    return response.json();
};

export const getSales = async (type = '') => {
    const query = type ? `?type=${type}` : '';
    return fetchSalesApi(`/sales${query}`, { method: 'GET' });
};

export const getAllSales = getSales;

export const getSaleById = async (id) => {
    return fetchSalesApi(`/sales/${id}`, { method: 'GET' });
};

export const createSale = async (saleData) => {
    return fetchSalesApi('/sales', {
        method: 'POST',
        body: JSON.stringify(saleData)
    });
};

export const updateSale = async (id, saleData) => {
    return fetchSalesApi(`/sales/${id}`, {
        method: 'PUT',
        body: JSON.stringify(saleData)
    });
};

export const deleteSale = async (id) => {
    return fetchSalesApi(`/sales/${id}`, { method: 'DELETE' });
};

export const getInvoices = async () => {
    return fetchSalesApi('/sales/invoices/list', { method: 'GET' });
};

export const getQuotations = async () => {
    return fetchSalesApi('/sales/quotations/list', { method: 'GET' });
};

export const createQuotation = async (quotationData) => {
    return fetchSalesApi('/sales/quotations', {
        method: 'POST',
        body: JSON.stringify(quotationData)
    });
};

export const updateQuotation = async (id, quotationData) => {
    return fetchSalesApi(`/sales/quotations/${id}`, {
        method: 'PUT',
        body: JSON.stringify(quotationData)
    });
};

export const getSalesReturns = async () => {
    return fetchSalesApi('/sales/returns/list', { method: 'GET' });
};

export const createSalesReturn = async (returnData) => {
    return fetchSalesApi('/sales/returns', {
        method: 'POST',
        body: JSON.stringify(returnData)
    });
};

export const updateSalesReturn = async (id, returnData) => {
    return fetchSalesApi(`/sales/returns/${id}`, {
        method: 'PUT',
        body: JSON.stringify(returnData)
    });
};
