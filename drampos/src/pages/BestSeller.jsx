import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { FileText, FileSpreadsheet, RefreshCw, ChevronUp, Printer, Calendar } from 'lucide-react';
import { API_BASE_URL } from '../api/endpoints';

const BestSeller = () => {
  const [bestSellers, setBestSellers] = useState([]);
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [storeId, setStoreId] = useState('All');
  const [productId, setProductId] = useState('All');

  // Fetch store and product metadata for filter dropdowns
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const storeRes = await fetch(`${API_BASE_URL}/inventory/stores`);
        const storeData = await storeRes.json();
        if (storeData.success) {
          setStores(storeData.data || []);
        }

        const productRes = await fetch(`${API_BASE_URL}/products`);
        const productData = await productRes.json();
        if (productData.success) {
          setProducts(productData.data || []);
        }
      } catch (err) {
        console.error('Error fetching metadata:', err);
      }
    };
    fetchMetadata();
  }, []);

  const fetchBestSellers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (storeId && storeId !== 'All') params.append('storeId', storeId);
      if (productId && productId !== 'All') params.append('productId', productId);

      const res = await fetch(`${API_BASE_URL}/sales/bestsellers?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setBestSellers(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching bestsellers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBestSellers();
  }, []);

  const handleGenerateReport = (e) => {
    e.preventDefault();
    fetchBestSellers();
  };

  const handleResetFilters = () => {
    setStartDate('');
    setEndDate('');
    setStoreId('All');
    setProductId('All');
    // We cannot wait for state set to complete, so we call with defaults directly.
    setTimeout(() => {
      fetchBestSellers();
    }, 0);
  };

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Bestseller Products Report</h1>
          <p className={styles.subtitle}>View Reports of Best Selling Products</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} onClick={fetchBestSellers} title="Reload"><RefreshCw size={18} /></button>
          <button className={styles.iconBtn} onClick={handleResetFilters} title="Reset Filters">Reset</button>
        </div>
      </div>

      <Card style={{padding: '1.5rem', marginBottom: '1.5rem'}}>
        <form onSubmit={handleGenerateReport} style={{display: 'flex', gap: '1.5rem', alignItems: 'flex-end', flexWrap: 'wrap'}}>
          <div style={{flex: '1 1 200px'}}>
            <label style={{display: 'block', fontSize: '0.875rem', color: '#1B2850', marginBottom: '0.5rem', fontWeight: 500}}>Start Date</label>
            <div style={{position: 'relative'}}>
              <input 
                type="date" 
                className={styles.input} 
                value={startDate} 
                onChange={e => setStartDate(e.target.value)} 
              />
            </div>
          </div>
          <div style={{flex: '1 1 200px'}}>
            <label style={{display: 'block', fontSize: '0.875rem', color: '#1B2850', marginBottom: '0.5rem', fontWeight: 500}}>End Date</label>
            <div style={{position: 'relative'}}>
              <input 
                type="date" 
                className={styles.input} 
                value={endDate} 
                onChange={e => setEndDate(e.target.value)} 
              />
            </div>
          </div>
          <div style={{flex: '1 1 200px'}}>
            <label style={{display: 'block', fontSize: '0.875rem', color: '#1B2850', marginBottom: '0.5rem', fontWeight: 500}}>Store</label>
            <select className={styles.select} value={storeId} onChange={e => setStoreId(e.target.value)}>
              <option value="All">All Stores</option>
              {stores.map(store => (
                <option key={store._id} value={store._id}>{store.name}</option>
              ))}
            </select>
          </div>
          <div style={{flex: '1 1 200px'}}>
            <label style={{display: 'block', fontSize: '0.875rem', color: '#1B2850', marginBottom: '0.5rem', fontWeight: 500}}>Products</label>
            <select className={styles.select} value={productId} onChange={e => setProductId(e.target.value)}>
              <option value="All">All Products</option>
              {products.map(prod => (
                <option key={prod._id} value={prod._id}>{prod.name}</option>
              ))}
            </select>
          </div>
          <div>
            <button type="submit" className={styles.btnPrimary} style={{backgroundColor: '#FF9F43', color: 'white', border: 'none', height: '40px', padding: '0 1.5rem', borderRadius: '4px', cursor: 'pointer'}}>
              Generate Report
            </button>
          </div>
        </form>
      </Card>

      <Card className={styles.tableCard}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid #F3F4F6'}}>
          <h2 style={{fontSize: '1rem', fontWeight: 600, color: '#1B2850', margin: 0}}>Best Sellers List</h2>
          <div style={{display: 'flex', gap: '0.5rem'}}>
             <button className={styles.iconBtn} onClick={() => window.print()} title="Print"><Printer size={18} color="#6B7280" /></button>
          </div>
        </div>

        <div className={styles.tableResponsive}>
          {loading ? (
            <div style={{padding: '3rem', textAlign: 'center', color: '#6B7280'}}>Loading bestseller report...</div>
          ) : bestSellers.length === 0 ? (
            <div style={{padding: '3rem', textAlign: 'center', color: '#6B7280'}}>No completed sales data found.</div>
          ) : (
            <table className={styles.productTable}>
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Product Name</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th>Sold Qty</th>
                  <th>Sold Amount</th>
                  <th>Instock Qty</th>
                </tr>
              </thead>
              <tbody>
                {bestSellers.map((item) => (
                  <tr key={item._id}>
                    <td style={{color: '#6B7280'}}>{item.sku || 'N/A'}</td>
                    <td>
                      <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                        {item.img ? (
                          <img src={item.img.startsWith('http') ? item.img : `${API_BASE_URL.replace('/api', '')}/${item.img}`} alt={item.name} style={{width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover'}} />
                        ) : (
                          <div style={{width: '32px', height: '32px', borderRadius: '4px', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#9CA3AF'}}>No Img</div>
                        )}
                        <span style={{color: '#1B2850', fontWeight: 500}}>{item.name}</span>
                      </div>
                    </td>
                    <td style={{color: '#6B7280'}}>{item.brand}</td>
                    <td style={{color: '#6B7280'}}>{item.category}</td>
                    <td style={{color: '#6B7280', fontWeight: 'bold'}}>{item.soldQty}</td>
                    <td style={{color: '#6B7280', fontWeight: 'bold'}}>₹{item.soldAmount.toFixed(2)}</td>
                    <td style={{color: '#6B7280'}}>{item.instockQty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default BestSeller;
