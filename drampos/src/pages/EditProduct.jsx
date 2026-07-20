import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProductForm from '../components/ProductForm';
import { getProductById, getProductVariants } from '../services/productService';

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [initialData, setInitialData] = useState(null);
    const [initialVariants, setInitialVariants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const [product, variants] = await Promise.all([
                    getProductById(id),
                    getProductVariants(id).catch(() => [])
                ]);
                setInitialData(product);
                setInitialVariants(Array.isArray(variants) ? variants : []);
            } catch (err) {
                setError(err.message || 'Failed to load product');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    if (loading) {
        return (
            <DashboardLayout>
                <div style={{ padding: '2rem', color: '#6B7280' }}>Loading product...</div>
            </DashboardLayout>
        );
    }

    if (error || !initialData) {
        return (
            <DashboardLayout>
                <div style={{ padding: '2rem', color: '#EA5455' }}>
                    {error || 'Product not found.'}{' '}
                    <a href="/products" style={{ color: '#1B2850', textDecoration: 'underline' }}>Back to products</a>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <ProductForm
            mode="edit"
            initialData={initialData}
            initialVariants={initialVariants}
            onSuccess={() => navigate('/products')}
        />
    );
};

export default EditProduct;