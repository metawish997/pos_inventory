export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005/api';

export const ENDPOINTS = {
  INVENTORY: {
    STORES: '/inventory/stores',
    WAREHOUSES: '/inventory/warehouses',
    CATEGORIES: '/inventory/categories',
    SUB_CATEGORIES: '/inventory/subcategories',
    BRANDS: '/inventory/brands',
    VARIANT_ATTRIBUTES: '/inventory/variant-attributes',
  },
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  UPLOAD: '/upload'
};
