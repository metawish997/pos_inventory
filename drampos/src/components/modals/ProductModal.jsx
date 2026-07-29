import React, { useState, useEffect, useRef } from 'react';
import ProductForm from '../ProductForm';
import { getProducts, getProductVariants } from '../../modules/purchase/services/purchaseService';
import { getProductById } from '../../services/productService';
import { Search, X } from 'lucide-react';

const ProductModal = ({ isOpen, onClose, onSuccess, onSelectProduct, editProductId = null, editUnsavedPayload = null }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editProductData, setEditProductData] = useState(null);
    const [editVariantsData, setEditVariantsData] = useState([]);
    const wrapperRef = useRef(null);
    const modalContentRef = useRef(null);

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

    return (
        <div 
            onClick={(e) => {
                if (modalContentRef.current && !modalContentRef.current.contains(e.target)) {
                    onClose();
                }
            }}
            style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.4)', zIndex: 9999,
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                padding: '1.5rem', backdropFilter: 'blur(4px)'
            }}
        >
            <div 
                ref={modalContentRef}
                style={{
                    backgroundColor: '#fff', borderRadius: '12px',
                    width: '100%', maxWidth: '900px', maxHeight: '90vh',
                    display: 'flex', flexDirection: 'column',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    overflow: 'hidden'
                }}
            >
                
                {/* Premium Modal Header */}
                <div style={{
                    padding: '1.25rem 1.75rem', borderBottom: '1px solid #E5E7EB',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    backgroundColor: 'white'
                }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.025em' }}>
                            {editProductData ? 'Edit Product Item' : 'Create / Select Product'}
                        </h2>
                        <div style={{ height: '3px', width: '40px', backgroundColor: '#FF9F43', marginTop: '0.35rem', borderRadius: '2px' }} />
                    </div>
                    <button 
                        onClick={onClose}
                        style={{
                            background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF',
                            padding: '4px', borderRadius: '50%', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#F3F4F6';
                            e.currentTarget.style.color = '#111827';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#9CA3AF';
                        }}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Subheader Search Section */}
                <div style={{ padding: '1.25rem 1.75rem', backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                    <div style={{ marginBottom: '0.6rem', fontWeight: 600, color: '#4B5563', fontSize: '0.825rem' }}>
                        Search for an existing product to add, or type a name to create a new one:
                    </div>
                    <div ref={wrapperRef} style={{ position: 'relative', display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', display: 'flex', alignItems: 'center' }}>
                                <Search size={16} />
                            </span>
                            <input
                                type="text"
                                style={{
                                    width: '100%',
                                    padding: '0.65rem 0.85rem 0.65rem 2.25rem',
                                    border: '1px solid #D1D5DB',
                                    borderRadius: '6px',
                                    fontSize: '0.875rem',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    backgroundColor: 'white',
                                    transition: 'border-color 0.2s'
                                }}
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
                                    borderRadius: '8px', zIndex: 10, marginTop: '6px',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                    maxHeight: '220px', overflowY: 'auto'
                                }}>
                                    {loading && <div style={{ padding: '0.75rem 1rem', color: '#6B7280', fontSize: '0.875rem' }}>Searching products...</div>}
                                    {results.map((item, i) => (
                                        <div
                                            key={i}
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                handleResultClick(item);
                                            }}
                                            style={{
                                                padding: '0.75rem 1.25rem', cursor: 'pointer',
                                                borderBottom: i < results.length - 1 ? '1px solid #F3F4F6' : 'none',
                                                display: 'flex', alignItems: 'center', justifyBetween: 'space-between',
                                                transition: 'background-color 0.15s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFF7ED'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 600, color: '#1F2937', fontSize: '0.875rem' }}>{item.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.15rem' }}>
                                                    SKU: {item.sku} | Barcode: {item.itemBarcode || 'N/A'}
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontWeight: 700, color: '#FF9F43', fontSize: '0.875rem' }}>₹{item.price}</div>
                                                <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>
                                                    {item.productType === 'variable' ? 'Variants' : 'Single'}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Form scroll container */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '1.75rem', backgroundColor: '#FCFDFD' }}>
                    {loading ? (
                        <div style={{ padding: '4rem', textAlign: 'center', color: '#9CA3AF', fontSize: '0.9rem' }}>Loading product details...</div>
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
