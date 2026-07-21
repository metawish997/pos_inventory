import { API_BASE_URL } from '../api/endpoints';

const fetchCustomerApi = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || 'Customer API request failed');
  }
  return response.json();
};

export const getCustomers = async (search = '', status = '') => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (status) params.append('status', status);
  const queryStr = params.toString() ? `?${params.toString()}` : '';
  return fetchCustomerApi(`/customers${queryStr}`, { method: 'GET' });
};

export const createCustomer = async (data) => {
  return fetchCustomerApi('/customers', { method: 'POST', body: JSON.stringify(data) });
};

export const updateCustomer = async (id, data) => {
  return fetchCustomerApi(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) });
};

export const deleteCustomer = async (id) => {
  return fetchCustomerApi(`/customers/${id}`, { method: 'DELETE' });
};
