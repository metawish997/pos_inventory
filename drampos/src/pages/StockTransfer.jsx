import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { Search, RefreshCw, ChevronUp, ArrowRightLeft } from 'lucide-react';
import { getAllProducts, updateProduct } from '../services/productService';
import { getWarehouses } from '../services/inventoryService';

const StockTransfer = () => {
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [prodRes, whRes] = await Promise.all([
        getAllProducts(),
        getWarehouses()
      ]);
      if (prodRes.success) setProducts(prodRes.data);
      if (whRes.success) setWarehouses(whRes.data);
    } catch (err) {
      console.error('Failed to load transfer data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTransfer = async (product) => {
    const targetWHName = prompt(`Enter Target Warehouse name to transfer ${product.name} to:\nAvailable: ${warehouses.map(w => w.name).join(', ')}`);
    if (!targetWHName) return;

    const targetWH = warehouses.find(w => w.name.toLowerCase() === targetWHName.toLowerCase());
    if (!targetWH) {
      alert('Warehouse not found. Please type one of the available warehouses.');
      return;
    }

    try {
      const res = await updateProduct(product._id, { warehouse: targetWH._id });
      if (res.success) {
        alert('Stock transferred successfully!');
        loadData();
      }
    } catch (err) {
      alert(`Transfer failed: ${err.message}`);
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
          <h1 className={styles.title}>Stock Transfer</h1>
          <p className={styles.subtitle}>Transfer products to different warehouses dynamically</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} onClick={loadData}><RefreshCw size={18} /></button>
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
                <th>Current Warehouse</th>
                <th>Current Store</th>
                <th>Product</th>
                <th>SKU</th>
                <th>Quantity</th>
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
                    <td style={{color: '#6B7280', fontWeight: 500}}>{item.warehouse?.name || 'Main Warehouse'}</td>
                    <td style={{color: '#6B7280'}}>{item.store?.name || 'Main Store'}</td>
                    <td>
                      <div className={styles.productCell}>
                        <div style={{
                          width: '32px', height: '32px', borderRadius: '4px', backgroundColor: '#28C76F',
                          color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                        }}>
                          {(item.name || 'P')[0]}
                        </div>
                        <span style={{fontWeight: 500, color: '#1B2850'}}>{item.name}</span>
                      </div>
                    </td>
                    <td style={{color: '#6B7280'}}>{item.sku}</td>
                    <td style={{color: '#6B7280'}}>{item.quantity}</td>
                    <td>
                      <button className={styles.actionBtn} onClick={() => handleTransfer(item)}>
                        <ArrowRightLeft size={16} /> Transfer Warehouse
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

export default StockTransfer;
