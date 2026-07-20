// src/services/inventoryService.js
import { API_BASE_URL, ENDPOINTS } from '../api/endpoints';

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
    throw new Error(errorData.error || errorData.message || 'API request failed');
  }
  return response.json();
};

const { INVENTORY, UPLOAD } = ENDPOINTS;

// ==========================================
// UPLOADS
// ==========================================
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const token = localStorage.getItem('token');
  const headers = {
    ...(token && { Authorization: `Bearer ${token}` })
  };

  const response = await fetch(`${API_BASE_URL}${UPLOAD}`, {
    method: 'POST',
    headers,
    body: formData
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Image upload failed');
  }

  return response.json();
};

// ==========================================
// STORES
// ==========================================
export const getStores = () => fetchApi(INVENTORY.STORES);
export const getStoreById = (id) => fetchApi(`${INVENTORY.STORES}/${id}`);
export const createStore = (data) => fetchApi(INVENTORY.STORES, { method: 'POST', body: JSON.stringify(data) });
export const updateStore = (id, data) => fetchApi(`${INVENTORY.STORES}/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteStore = (id) => fetchApi(`${INVENTORY.STORES}/${id}`, { method: 'DELETE' });

// ==========================================
// WAREHOUSES
// ==========================================
export const getWarehouses = () => fetchApi(INVENTORY.WAREHOUSES);
export const getWarehouseById = (id) => fetchApi(`${INVENTORY.WAREHOUSES}/${id}`);
export const createWarehouse = (data) => fetchApi(INVENTORY.WAREHOUSES, { method: 'POST', body: JSON.stringify(data) });
export const updateWarehouse = (id, data) => fetchApi(`${INVENTORY.WAREHOUSES}/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteWarehouse = (id) => fetchApi(`${INVENTORY.WAREHOUSES}/${id}`, { method: 'DELETE' });

// ==========================================
// CATEGORIES
// ==========================================
export const getCategories = () => fetchApi(INVENTORY.CATEGORIES);
export const getCategoryById = (id) => fetchApi(`${INVENTORY.CATEGORIES}/${id}`);
export const createCategory = (data) => fetchApi(INVENTORY.CATEGORIES, { method: 'POST', body: JSON.stringify(data) });
export const updateCategory = (id, data) => fetchApi(`${INVENTORY.CATEGORIES}/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteCategory = (id) => fetchApi(`${INVENTORY.CATEGORIES}/${id}`, { method: 'DELETE' });

// ==========================================
// SUBCATEGORIES
// ==========================================
export const getSubCategories = () => fetchApi(INVENTORY.SUB_CATEGORIES);
export const getSubCategoryById = (id) => fetchApi(`${INVENTORY.SUB_CATEGORIES}/${id}`);
export const createSubCategory = (data) => fetchApi(INVENTORY.SUB_CATEGORIES, { method: 'POST', body: JSON.stringify(data) });
export const updateSubCategory = (id, data) => fetchApi(`${INVENTORY.SUB_CATEGORIES}/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteSubCategory = (id) => fetchApi(`${INVENTORY.SUB_CATEGORIES}/${id}`, { method: 'DELETE' });

// ==========================================
// BRANDS
// ==========================================
export const getBrands = () => fetchApi(INVENTORY.BRANDS);
export const getBrandById = (id) => fetchApi(`${INVENTORY.BRANDS}/${id}`);
export const createBrand = (data) => fetchApi(INVENTORY.BRANDS, { method: 'POST', body: JSON.stringify(data) });
export const updateBrand = (id, data) => fetchApi(`${INVENTORY.BRANDS}/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteBrand = (id) => fetchApi(`${INVENTORY.BRANDS}/${id}`, { method: 'DELETE' });

// ==========================================
// VARIANT ATTRIBUTES
// ==========================================
export const getVariantAttributes = () => fetchApi(INVENTORY.VARIANT_ATTRIBUTES);
export const getVariantAttributeById = (id) => fetchApi(`${INVENTORY.VARIANT_ATTRIBUTES}/${id}`);
export const createVariantAttribute = (data) => fetchApi(INVENTORY.VARIANT_ATTRIBUTES, { method: 'POST', body: JSON.stringify(data) });
export const updateVariantAttribute = (id, data) => fetchApi(`${INVENTORY.VARIANT_ATTRIBUTES}/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteVariantAttribute = (id) => fetchApi(`${INVENTORY.VARIANT_ATTRIBUTES}/${id}`, { method: 'DELETE' });


// ==========================================
// TAXES
// ==========================================
export const getTaxes = () => fetchApi('/inventory/taxes');
export const getTaxById = (id) => fetchApi(`/inventory/taxes/${id}`);
export const createTax = (data) => fetchApi('/inventory/taxes', { method: 'POST', body: JSON.stringify(data) });
export const updateTax = (id, data) => fetchApi(`/inventory/taxes/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteTax = (id) => fetchApi(`/inventory/taxes/${id}`, { method: 'DELETE' });


// ==========================================
// WARRANTIES
// ==========================================
export const getWarranties = () => fetchApi('/inventory/warranties');
export const getWarrantyById = (id) => fetchApi(`/inventory/warranties/${id}`);
export const createWarranty = (data) => fetchApi('/inventory/warranties', { method: 'POST', body: JSON.stringify(data) });
export const updateWarranty = (id, data) => fetchApi(`/inventory/warranties/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteWarranty = (id) => fetchApi(`/inventory/warranties/${id}`, { method: 'DELETE' });