import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import styles from './ProductDetails.module.css';
import { Printer, ChevronLeft, ChevronRight, Edit } from 'lucide-react';
import { getProductById, getProductVariants } from '../services/productService';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data);
        const v = await getProductVariants(id).catch(() => []);
        setVariants(Array.isArray(v) ? v : []);
      } catch (err) {
        setError(err.message || 'Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ padding: '2rem', color: '#6B7280' }}>Loading product details...</div>
      </DashboardLayout>
    );
  }

  if (error || !product) {
    return (
      <DashboardLayout>
        <div style={{ padding: '2rem', color: '#EA5455' }}>
          {error || 'Product not found.'}{' '}
          <Link to="/products" style={{ color: '#1B2850', textDecoration: 'underline' }}>Back to products</Link>
        </div>
      </DashboardLayout>
    );
  }

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : ['https://placehold.co/500x400?text=No+Product+Image'];

  const currentImage = images[imageIndex] || images[0];

  const goPrev = () => setImageIndex(i => (i - 1 + images.length) % images.length);
  const goNext = () => setImageIndex(i => (i + 1) % images.length);

  const detailRows = [
    ['Product', product.name],
    ['Category', product.category?.name || 'None'],
    ['Sub Category', product.subCategory?.name || 'None'],
    ['Brand', product.brand?.name || 'None'],
    ['Unit', product.unit || 'Piece'],
    ['SKU', product.sku],
    ['Minimum Qty', product.quantityAlert ?? 0],
    ['Quantity', product.quantity ?? 0],
    ['Tax Type', product.taxType || 'Exclusive'],
    ['Tax', product.tax?.taxValue ? `${product.tax.taxValue} %` : '0.00 %'],
    ['Discount Type', product.discountType || 'None'],
    ['Discount Value', product.discountValue ?? 0],
    ['Base Price', `$${Number(product.basePrice || product.price || 0).toFixed(2)}`],
    ['Tax Amount', `$${Number(product.taxAmount || 0).toFixed(2)}`],
    ['Discount Amount', `$${Number(product.discountAmount || 0).toFixed(2)}`],
    ['Final Price', `$${Number(product.finalPrice || product.price || 0).toFixed(2)}`],
    ['Status', product.status],
    ['Description', product.description || 'No description provided.']
  ];

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Product Details</h1>
          <p className={styles.subtitle}>Full details of a product</p>
        </div>
        <Link to={`/edit-product/${product._id}`} className={styles.btnPrimary} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#1B2850', color: 'white', padding: '0 1rem', height: '36px', borderRadius: '4px', textDecoration: 'none', fontWeight: 500, fontSize: '0.875rem' }}>
          <Edit size={16} /> Edit Product
        </Link>
      </div>

      <div className={styles.mainContainer}>
        {/* Left Column: Details */}
        <div className={styles.card}>
          {/* Barcode box */}
          <div className={styles.barcodeBox}>
            <div style={{ display: 'flex' }}>
              {[1, 2, 4, 1, 3, 2, 1, 5, 2, 1, 4, 2, 3, 1, 2, 1, 4, 2, 3].map((w, i) => (
                <div key={i} style={{ width: `${w * 2}px`, height: '48px', backgroundColor: '#000', marginRight: '3px' }}></div>
              ))}
            </div>
            <button className={styles.printBtn} onClick={() => window.print()}>
              <Printer size={20} />
            </button>
          </div>

          {/* Details Table */}
          <table className={styles.detailsTable}>
            <tbody>
              {detailRows.map(([label, value]) => (
                <tr key={label}>
                  <td className={styles.propName}>{label}</td>
                  <td className={styles.propValue}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* First Variant Details (highlighted) */}
          {product.productType === 'variable' && variants.length > 0 && (() => {
            const first = variants[0];
            const firstRows = [
              ['SKU', first.sku],
              ['Attributes', first.selections && Object.keys(first.selections).length > 0
                ? Object.entries(first.selections).map(([k, val]) => `${val}`).join(', ')
                : '-'],
              ['Quantity', first.quantity ?? 0],
              ['Price', `$${Number(first.price || 0).toFixed(2)}`],
              ['Tax', `${first.taxType === 'Inclusive' ? 'Incl' : 'Excl'}${first.tax?.taxValue ? ` ${first.tax.taxValue}%` : ''}`],
              ['Discount', first.discountType === 'Percentage'
                ? `${first.discountValue || 0}%`
                : first.discountType === 'Fixed'
                  ? `$${Number(first.discountValue || 0).toFixed(2)}`
                  : '-'],
              ['Final Price', `$${Number(first.finalPrice || first.price || 0).toFixed(2)}`],
              ['Status', first.status || 'Active']
            ];
            return (
              <div style={{ marginTop: '1.5rem', border: '1px solid #C7D2FE', backgroundColor: '#F0F4FF', borderRadius: '8px', padding: '1rem' }}>
                <h3 style={{ color: '#1B2850', marginBottom: '0.75rem', fontSize: '1rem' }}>First Variant Details</h3>
                <table className={styles.detailsTable} style={{ border: 'none' }}>
                  <tbody>
                    {firstRows.map(([label, value]) => (
                      <tr key={label}>
                        <td className={styles.propName}>{label}</td>
                        <td className={styles.propValue}>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })()}

          {/* Variant Items Table */}
          {product.productType === 'variable' && (
            <div style={{ marginTop: '1.5rem' }}>
              <h3 style={{ color: '#1B2850', marginBottom: '0.75rem', fontSize: '1rem' }}>Variant Items</h3>
              {variants.length === 0 ? (
                <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>No variant items found.</p>
              ) : (
                <table className={styles.detailsTable}>
                  <thead>
                    <tr>
                      <td className={styles.propName}>SKU</td>
                      <td className={styles.propName}>Attributes</td>
                      <td className={styles.propName}>Qty</td>
                      <td className={styles.propName}>Price</td>
                      <td className={styles.propName}>Tax</td>
                      <td className={styles.propName}>Discount</td>
                      <td className={styles.propName}>Final Price</td>
                    </tr>
                  </thead>
                  <tbody>
                    {variants.map(v => (
                      <tr key={v._id}>
                        <td className={styles.propValue}>{v.sku}</td>
                        <td className={styles.propValue}>
                          {v.selections && Object.keys(v.selections).length > 0
                            ? Object.entries(v.selections).map(([k, val]) => `${val}`).join(', ')
                            : '-'}
                        </td>
                        <td className={styles.propValue}>{v.quantity}</td>
                        <td className={styles.propValue}>${Number(v.price || 0).toFixed(2)}</td>
                        <td className={styles.propValue}>
                          {v.taxType === 'Inclusive' ? 'Incl' : 'Excl'}
                          {v.tax?.taxValue ? ` ${v.tax.taxValue}%` : ''}
                        </td>
                        <td className={styles.propValue}>
                          {v.discountType === 'Percentage'
                            ? `${v.discountValue || 0}%`
                            : v.discountType === 'Fixed'
                              ? `$${Number(v.discountValue || 0).toFixed(2)}`
                              : '-'}
                        </td>
                        <td className={styles.propValue}>${Number(v.finalPrice || v.price || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Image */}
        <div className={styles.imageCard}>
          <div className={styles.imageContainer}>
            <img src={currentImage} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
          </div>
          <div className={styles.imageInfo}>
            <p className={styles.fileName}>{product.name}</p>
            <p className={styles.fileSize}>{images.length} image(s)</p>
          </div>
          {images.length > 1 && (
            <>
              <button className={`${styles.navBtn} ${styles.navBtnLeft}`} onClick={goPrev}><ChevronLeft size={20} /></button>
              <button className={`${styles.navBtn} ${styles.navBtnRight}`} onClick={goNext}><ChevronRight size={20} /></button>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProductDetails;