import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { Search, RefreshCw, Trash2 } from 'lucide-react';
import { API_BASE_URL } from '../api/endpoints';

const ExpiredProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchExpired = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/products/expired`);
      const data = await res.json();
      if (data.success) setProducts(data.data);
    } catch (err) {
      console.error('Failed to fetch expired products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpired();
  }, []);

  const filteredProducts = products.filter(p =>
    (p.productName || p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.sku || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Expired Products</h1>
          <p className={styles.subtitle}>View & Manage Expired Stock Items</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} onClick={fetchExpired}><RefreshCw size={18} /></button>
        </div>
      </div>

      <Card className={styles.tableCard}>
        <div className={styles.filterBar}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search Product Name or SKU" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.tableResponsive}>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>SKU</th>
                <th>Product Name</th>
                <th>Manufactured Date</th>
                <th>Expired Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>Loading Expired Products...</td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>No expired product records found</td>
                </tr>
              ) : (
                filteredProducts.map((item) => (
                  <tr key={item._id}>
                    <td><input type="checkbox" /></td>
                    <td>{item.sku || 'SKU001'}</td>
                    <td style={{color: '#1B2850', fontWeight: 600}}>{item.productName || item.name}</td>
                    <td>{item.manufacturedDate ? new Date(item.manufacturedDate).toLocaleDateString() : '-'}</td>
                    <td style={{color: '#EA5455', fontWeight: 600}}>{item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'Expired'}</td>
                    <td>
                      <span style={{backgroundColor: '#FCEAEA', color: '#EA5455', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600}}>Expired</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default ExpiredProducts;
