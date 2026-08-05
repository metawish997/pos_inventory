import { API_BASE_URL } from '../api/endpoints';

const fetchTemplatesApi = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Terms template request failed');
    }
    return response.json();
};

export const getTermsTemplates = async () => {
    return fetchTemplatesApi('/terms-templates', { method: 'GET' });
};

export const createOrUpdateTermsTemplate = async (templateData) => {
    return fetchTemplatesApi('/terms-templates', {
        method: 'POST',
        body: JSON.stringify(templateData)
    });
};

export const deleteTermsTemplate = async (id) => {
    return fetchTemplatesApi(`/terms-templates/${id}`, { method: 'DELETE' });
};
