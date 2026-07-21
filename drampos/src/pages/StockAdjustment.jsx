import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { Search, RefreshCw, ChevronUp, Edit } from 'lucide-react';
import { getAllProducts, updateProduct } from '../services/productService';

const StockAdjustment = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchStock = async () => {
    try {
      setLoading(true);
      const res = await getAllProducts();
      if (res.success) {
        setProducts(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch stocks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

  const handleAdjustStock = async (product) => {
    const newQtyStr = prompt(`Enter Adjusted Stock Quantity for ${product.name}:`, product.quantity);
    if (newQtyStr === null) return;
    const newQty = parseInt(newQtyStr, 10);
    if (isNaN(newQty)) {
      alert('Please enter a valid number');
      return;
    }

    try {
      const res = await updateProduct(product._id, { quantity: newQty });
      if (res.success) {
        alert('Stock quantity adjusted successfully!');
        fetchStock();
      }
    } catch (err) {
      alert(`Adjustment failed: ${err.message}`);
    }
  };

  const filtered = products.filter(p =>
    (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.sku || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Stock Adjustment</h1>
          <p className={styles.subtitle}>Adjust Product Stock Quantities Directly</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} onClick={fetchStock}><RefreshCw size={18} /></button>
          <button className={styles.iconBtn}><ChevronUp size={18} /></button>
        </div>
      </div>

      <Card className={styles.tableCard}>
        <div className={styles.filterBar}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search by product name or SKU" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.tableResponsive}>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th>Warehouse</th>
                <th>Store</th>
                <th>Product</th>
                <th>SKU</th>
                <th>Current Qty</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>No product stocks found</td></tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item._id}>
                    <td style={{color: '#6B7280'}}>{item.warehouse?.name || 'Main Warehouse'}</td>
                    <td style={{color: '#6B7280'}}>{item.store?.name || 'Main Store'}</td>
                    <td>
                      <div className={styles.productCell}>
                        <div style={{
                          width: '32px', height: '32px', borderRadius: '4px', backgroundColor: '#7367F0',
                          color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                        }}>
                          {(item.name || 'P')[0]}
                        </div>
                        <span style={{fontWeight: 500, color: '#1B2850'}}>{item.name}</span>
                      </div>
                    </td>
                    <td style={{color: '#6B7280'}}>{item.sku}</td>
                    <td style={{fontWeight: 600, color: '#FF9F43'}}>{item.quantity}</td>
                    <td>
                      <button className={styles.actionBtn} onClick={() => handleAdjustStock(item)}>
                        <Edit size={16} /> Adjust Qty
                      </button>
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

export default StockAdjustment;
