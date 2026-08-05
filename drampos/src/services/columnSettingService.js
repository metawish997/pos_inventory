import { API_BASE_URL } from '../api/endpoints';

const fetchColumnsApi = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Column settings request failed');
    }
    return response.json();
};

export const getColumnSettings = async (page) => {
    return fetchColumnsApi(`/column-settings/${page}`, { method: 'GET' });
};

export const saveColumnSettings = async (page, columnsData) => {
    return fetchColumnsApi(`/column-settings/${page}`, {
        method: 'POST',
        body: JSON.stringify({ columns: columnsData })
    });
};
