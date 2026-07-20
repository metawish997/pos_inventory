import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { Filter, Search, PlusCircle, Download, FileText, FileSpreadsheet, RefreshCw, ChevronUp, Edit, Trash2, Eye } from 'lucide-react';
import { getAllProducts, deleteProduct } from '../services/productService';

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts();
      setProducts(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete product');
    }
  };

  const categories = useMemo(
    () => Array.from(new Set(products.map(p => p.category?.name).filter(Boolean))),
    [products]
  );
  const brands = useMemo(
    () => Array.from(new Set(products.map(p => p.brand?.name).filter(Boolean))),
    [products]
  );

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.sku?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !categoryFilter || p.category?.name === categoryFilter;
      const matchesBrand = !brandFilter || p.brand?.name === brandFilter;
      return matchesSearch && matchesCategory && matchesBrand;
    });
  }, [products, search, categoryFilter, brandFilter]);

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Product List</h1>
          <p className={styles.subtitle}>Manage your products</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn}><FileText size={18} color="#EA5455" /></button>
          <button className={styles.iconBtn}><FileSpreadsheet size={18} color="#28C76F" /></button>
          <button className={styles.iconBtn} onClick={loadProducts}><RefreshCw size={18} /></button>
          <button className={styles.iconBtn}><ChevronUp size={18} /></button>
          <button className={styles.btnPrimary} onClick={() => navigate('/create-product')}>
            <PlusCircle size={18} /> Add Product
          </button>
          <button className={styles.btnDark}><Download size={18} /> Import Product</button>
        </div>
      </div>

      <Card className={styles.tableCard}>
        <div className={styles.filterBar}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by name or SKU"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className={styles.filters}>
            <select className={styles.select} value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className={styles.select} value={brandFilter} onChange={e => setBrandFilter(e.target.value)}>
              <option value="">All Brands</option>
              {brands.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <button className={styles.btnFilter}><Filter size={18} /></button>
          </div>
        </div>

        {error && (
          <div style={{ padding: '1rem 1.5rem', color: '#EA5455' }}>{error}</div>
        )}

        <div className={styles.tableResponsive}>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Unit</th>
                <th>Qty</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} style={{ textAlign: 'center', padding: '2rem', color: '#6B7280' }}>Loading products...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign: 'center', padding: '2rem', color: '#6B7280' }}>No products found.</td></tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item._id}>
                    <td><input type="checkbox" /></td>
                    <td>
                      <div className={styles.productCell}>
                        <div className={styles.productImg}>
                          {item.images && item.images.length > 0 ? (
                            <img
                              src={item.images[0]}
                              alt={item.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                            />
                          ) : null}
                        </div>
                        <Link
                          to={`/product-details/${item._id}`}
                          style={{ color: '#1B2850', fontWeight: 600, textDecoration: 'none' }}
                        >
                          {item.name}
                        </Link>
                      </div>
                    </td>
                    <td>{item.sku}</td>
                    <td>{item.category?.name || '-'}</td>
                    <td>{item.brand?.name || '-'}</td>
                    <td>${Number(item.price || 0).toFixed(2)}</td>
                    <td>{item.unit || 'pc'}</td>
                    <td>{item.quantity ?? '-'}</td>
                    <td>
                      <div className={styles.actionCell}>
                        <Link to={`/product-details/${item._id}`} className={styles.actionBtn}><Eye size={16} /></Link>
                        <Link to={`/edit-product/${item._id}`} className={styles.actionBtn}><Edit size={16} /></Link>
                        <button
                          className={`${styles.actionBtn} ${styles.danger}`}
                          onClick={() => handleDelete(item._id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className={styles.pagination}>
          <div className={styles.pageInfo}>
            Showing {filtered.length} of {products.length} entries
          </div>
          <div className={styles.pageControls}>
            <button className={styles.pageBtn}>Previous</button>
            <button className={`${styles.pageBtn} ${styles.activePage}`}>1</button>
            <button className={styles.pageBtn}>Next</button>
          </div>
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default ProductList;