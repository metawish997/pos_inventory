import { API_BASE_URL } from '../api/endpoints';

const fetchUserApi = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'User service request failed');
    }
    return response.json();
};

// Users
export const getUsers = async () => fetchUserApi('/users', { method: 'GET' });
export const createUser = async (data) => fetchUserApi('/users', { method: 'POST', body: JSON.stringify(data) });
export const updateUser = async (id, data) => fetchUserApi(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteUser = async (id) => fetchUserApi(`/users/${id}`, { method: 'DELETE' });

// Roles & Permissions
export const getRoles = async () => fetchUserApi('/users/roles', { method: 'GET' });
export const createRole = async (data) => fetchUserApi('/users/roles', { method: 'POST', body: JSON.stringify(data) });

// Delete Requests
export const getDeleteRequests = async () => fetchUserApi('/users/delete-requests', { method: 'GET' });
export const createDeleteRequest = async (data) => fetchUserApi('/users/delete-requests', { method: 'POST', body: JSON.stringify(data) });
export const processDeleteRequest = async (id, status) => fetchUserApi(`/users/delete-requests/${id}`, { method: 'PUT', body: JSON.stringify({ status }) });
