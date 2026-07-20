import React, { useState, useEffect, useRef } from 'react';
import ProductForm from '../ProductForm';
import { getProducts, getProductVariants } from '../../modules/purchase/services/purchaseService';
import { getProductById } from '../../services/productService';

const ProductModal = ({ isOpen, onClose, onSuccess, onSelectProduct, editProductId = null, editUnsavedPayload = null }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editProductData, setEditProductData] = useState(null);
    const [editVariantsData, setEditVariantsData] = useState([]);
    const wrapperRef = useRef(null);

    // Reset state and fetch product if editProductId is provided
    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setResults([]);
            setShowResults(false);
            if (editUnsavedPayload) {
                setEditProductData(editUnsavedPayload);
                setEditVariantsData(editUnsavedPayload.variantRows || []);
                setLoading(false);
            } else if (editProductId) {
                setLoading(true);
                // Fetch product details
                Promise.all([
                    getProductById(editProductId),
                    getProductVariants(editProductId)
                ]).then(([prod, vars]) => {
                    setEditProductData(prod);
                    setEditVariantsData(vars || []);
                    setLoading(false);
                }).catch((e) => {
                    console.error('Failed to load product details:', e);
                    setLoading(false);
                });
            } else {
                setEditProductData(null);
                setEditVariantsData([]);
            }
        }
    }, [isOpen, editProductId]);

    // Handle click outside for autocomplete
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Search logic
    useEffect(() => {
        const delay = setTimeout(async () => {
            if (query.trim().length < 1) {
                setResults([]);
                return;
            }
            setLoading(true);
            try {
                const products = await getProducts();
                const q = query.toLowerCase();
                const filtered = products.filter((p) =>
                    p.name.toLowerCase().includes(q) ||
                    (p.sku && p.sku.toLowerCase().includes(q)) ||
                    (p.itemBarcode && p.itemBarcode.toLowerCase().includes(q))
                ).slice(0, 8);
                setResults(filtered);
            } catch (err) {
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 250);
        return () => clearTimeout(delay);
    }, [query]);

    const handleResultClick = async (product) => {
        setShowResults(false);
        setLoading(true);
        try {
            const [prod, vars] = await Promise.all([
                getProductById(product._id),
                getProductVariants(product._id)
            ]);
            setEditProductData(prod);
            setEditVariantsData(vars || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const inputStyles = {
        width: '100%',
        padding: '0.6rem',
        border: '1px solid #D1D5DB',
        borderRadius: '4px',
        fontSize: '0.875rem'
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            padding: '2rem'
        }}>
            <div style={{
                backgroundColor: '#fff', borderRadius: '8px',
                width: '100%', maxWidth: '900px', maxHeight: '90vh',
                display: 'flex', flexDirection: 'column',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}>
                <div style={{
                    padding: '1rem 1.5rem', borderBottom: '1px solid #E5E7EB',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#111827' }}>
                        Create / Select Product
                    </h2>
                    <button 
                        onClick={onClose}
                        style={{
                            background: 'none', border: 'none', fontSize: '1.5rem', 
                            cursor: 'pointer', color: '#6B7280'
                        }}
                    >
                        &times;
                    </button>
                </div>

                <div style={{ padding: '1rem 1.5rem', backgroundColor: '#F8F9FA', borderBottom: '1px solid #E5E7EB' }}>
                    <div style={{ marginBottom: '0.5rem', fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>
                        Search existing product to add, OR enter new name to create
                    </div>
                    <div ref={wrapperRef} style={{ position: 'relative', display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <input
                                type="text"
                                style={inputStyles}
                                placeholder="Search by name, SKU or barcode..."
                                value={query}
                                onChange={(e) => { 
                                    setQuery(e.target.value); 
                                    setShowResults(true);
                                }}
                                onFocus={() => setShowResults(true)}
                            />
                            {showResults && (results.length > 0 || loading) && (
                                <div style={{
                                    position: 'absolute', top: '100%', left: 0, right: 0,
                                    backgroundColor: 'white', border: '1px solid #E5E7EB',
                                    borderRadius: '4px', zIndex: 10, marginTop: '4px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    maxHeight: '200px', overflowY: 'auto'
                                }}>
                                    {loading && <div style={{ padding: '0.5rem 1rem', color: '#6B7280' }}>Searching...</div>}
                                    {results.map((item, i) => (
                                        <div
                                            key={i}
                                            onMouseDown={(e) => {
                                                e.preventDefault(); // Prevent input from losing focus immediately
                                                handleResultClick(item);
                                            }}
                                            style={{
                                                padding: '0.5rem 1rem', cursor: 'pointer',
                                                borderBottom: i < results.length - 1 ? '1px solid #F3F4F6' : 'none',
                                                display: 'flex', alignItems: 'center', gap: '1rem'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            <div>
                                                <div style={{ fontWeight: 500, color: '#111827' }}>{item.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                                                    {item.sku} — ₹{item.price} {item.productType === 'variable' ? '| Variants available' : ''}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                    {loading ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#6B7280' }}>Loading product details...</div>
                    ) : editProductData ? (
                        <ProductForm 
                            key={editProductData._id || 'unsaved-edit'}
                            mode="edit"
                            initialData={editProductData}
                            initialVariants={editVariantsData}
                            asModal={true} 
                            onSuccess={onSuccess} 
                        />
                    ) : (
                        <ProductForm 
                            key="create"
                            mode="create"
                            initialData={{ name: query }} 
                            asModal={true} 
                            onSuccess={onSuccess} 
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductModal;
