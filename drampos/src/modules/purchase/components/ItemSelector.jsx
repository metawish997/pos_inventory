import React, { useState, useRef, useEffect } from 'react';
import styles from '../purchase.module.css';
import { getProducts, getProductVariants } from '../services/purchaseService';
import { API_BASE_URL } from '../../../api/endpoints';

/**
 * ItemSelector: search products (and their variants) to add purchase line items.
 * Shows image, name, SKU, available variants, purchase price, GST, stock.
 */
const ItemSelector = ({ onAddItem }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [loading, setLoading] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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

    const handleSelectProduct = async (product) => {
        // For variable products, fetch variants and let user pick one
        if (product.productType === 'variable') {
            try {
                const variants = await getProductVariants(product._id);
                if (variants && variants.length > 0) {
                    // Show variant picker inline
                    setResults(variants.map((v) => ({ ...v, _isVariant: true, _parentProduct: product })));
                    return;
                }
            } catch (err) {
                // fall through to single
            }
        }
        onAddItem({
            product: product._id,
            productName: product.name,
            sku: product.sku,
            barcode: product.itemBarcode,
            purchasePrice: product.price || 0,
            tax: product.tax || null,
            variant: null,
            variantLabel: ''
        });
        setQuery('');
        setResults([]);
        setShowResults(false);
    };

    const handleSelectVariant = (variant, parentProduct) => {
        onAddItem({
            product: parentProduct._id,
            productName: parentProduct.name,
            sku: variant.sku,
            barcode: variant.barcode || '',
            purchasePrice: variant.price || 0,
            tax: variant.tax || parentProduct.tax || null,
            variant: variant._id,
            variantLabel: Object.entries(variant.selections || {}).map(([, v]) => v).join(' / ')
        });
        setQuery('');
        setResults([]);
        setShowResults(false);
    };

    return (
        <div ref={wrapperRef} style={{ position: 'relative' }}>
            <input
                type="text"
                className={styles.input}
                placeholder="Search product by name, SKU or barcode..."
                value={query}
                onChange={(e) => { setQuery(e.target.value); setShowResults(true); }}
                onFocus={() => setShowResults(true)}
            />
            {showResults && (results.length > 0 || loading) && (
                <div className={styles.searchResults}>
                    {loading && <div className={styles.searchResultItem}>Searching...</div>}
                    {results.map((item, i) =>
                        item._isVariant ? (
                            <div
                                key={i}
                                className={styles.searchResultItem}
                                onClick={() => handleSelectVariant(item, item._parentProduct)}
                            >
                                <div>
                                    <div style={{ fontWeight: 500 }}>{item._parentProduct.name}</div>
                                    <div className={styles.searchResultMeta}>
                                        {item.variantLabel || item.sku} — ₹{item.price} {item.barcode ? `| ${item.barcode}` : ''}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div
                                key={i}
                                className={styles.searchResultItem}
                                onClick={() => handleSelectProduct(item)}
                            >
                                {item.images && item.images[0] && (
                                    <img src={item.images[0].startsWith('http') ? item.images[0] : `${API_BASE_URL.replace('/api', '')}${item.images[0]}`} alt="" />
                                )}
                                <div>
                                    <div style={{ fontWeight: 500 }}>{item.name}</div>
                                    <div className={styles.searchResultMeta}>
                                        {item.sku} — ₹{item.price} {item.productType === 'variable' ? '| Variants available' : ''}
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
};

export default ItemSelector;