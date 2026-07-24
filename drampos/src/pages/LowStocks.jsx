import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { Search, RefreshCw, Mail } from 'lucide-react';
import { API_BASE_URL } from '../api/endpoints';

const LowStocks = () => {
  const [activeTab, setActiveTab] = useState('low'); // 'low' or 'out'
  const [lowStockData, setLowStockData] = useState([]);
  const [outOfStockData, setOutOfStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sendingMail, setSendingMail] = useState(false);

  const fetchLowStocks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/products/low-stocks`);
      const data = await res.json();
      if (data.success) {
        setLowStockData(data.data.lowStocks || []);
        setOutOfStockData(data.data.outOfStocks || []);
      }
    } catch (err) {
      console.error('Failed to fetch low stocks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLowStocks();
  }, []);

  const handleSendEmail = async () => {
    try {
      setSendingMail(true);
      const res = await fetch(`${API_BASE_URL}/products/send-low-stock-email`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) alert(data.message || 'Low stock email alert sent!');
    } catch (err) {
      alert(`Failed to send email: ${err.message}`);
    } finally {
      setSendingMail(false);
    }
  };

  const currentList = activeTab === 'low' ? lowStockData : outOfStockData;

  const filteredProducts = currentList.filter(p => {
    const matchesSearch = (p.productName || p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.sku || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.category?.categoryName || p.category?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const cat = p.category?.categoryName || p.category?.name || '';
    const matchesCategory = categoryFilter === 'All' || cat === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const uniqueCategories = Array.from(new Set(currentList.map(p => p.category?.categoryName || p.category?.name).filter(Boolean)));

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Low Stocks Alert</h1>
          <p className={styles.subtitle}>Monitor Low Stock & Out of Stock Inventory</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} onClick={fetchLowStocks}><RefreshCw size={18} /></button>
          <button className={styles.btnDark} onClick={handleSendEmail} disabled={sendingMail}>
            <Mail size={18} /> {sendingMail ? 'Sending...' : 'Send Email Alert'}
          </button>
        </div>
      </div>

      <div style={{display: 'flex', gap: '0.5rem', marginBottom: '1.5rem'}}>
        <button 
          onClick={() => setActiveTab('low')}
          style={{
            backgroundColor: activeTab === 'low' ? '#FF9F43' : '#E5E7EB', 
            color: activeTab === 'low' ? 'white' : '#4B5563', 
            border: 'none', padding: '0.5rem 1.25rem', borderRadius: '4px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer'
          }}
        >
          Low Stocks ({lowStockData.length})
        </button>
        <button 
          onClick={() => setActiveTab('out')}
          style={{
            backgroundColor: activeTab === 'out' ? '#EA5455' : '#E5E7EB', 
            color: activeTab === 'out' ? 'white' : '#4B5563', 
            border: 'none', padding: '0.5rem 1.25rem', borderRadius: '4px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer'
          }}
        >
          Out of Stocks ({outOfStockData.length})
        </button>
      </div>

      <Card className={styles.tableCard}>
        <div className={styles.filterBar}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search Product Name, SKU or Category" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className={styles.filters}>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className={styles.select}>
              <option value="All">All Categories</option>
              {uniqueCategories.map((c, i) => <option key={i} value={c}>{c}</option>)}
            </select>
            <button onClick={() => { setSearchTerm(''); setCategoryFilter('All'); }} style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', backgroundColor: 'white', color: '#4B5563', cursor: 'pointer', fontSize: '0.875rem' }}>Reset</button>
          </div>
        </div>

        <div className={styles.tableResponsive}>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>Product Name</th>
                <th>Category</th>
                <th>SKU</th>
                <th>Available Qty</th>
                <th>Alert Limit</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>Loading Stock Alert Items...</td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>No product records found</td>
                </tr>
              ) : (
                filteredProducts.map((item) => (
                  <tr key={item._id}>
                    <td><input type="checkbox" /></td>
                    <td style={{color: '#1B2850', fontWeight: 600}}>{item.productName || item.name}</td>
                    <td>{item.category?.categoryName || item.category?.name || 'General'}</td>
                    <td>{item.sku || 'SKU001'}</td>
                    <td style={{fontWeight: 700, color: (item.quantity || item.stock || 0) === 0 ? '#EA5455' : '#FF9F43'}}>
                      {item.quantity || item.stock || 0}
                    </td>
                    <td>{item.quantityAlert || 10}</td>
                    <td>
                      <span style={{
                        backgroundColor: (item.quantity || item.stock || 0) === 0 ? '#FCEAEA' : '#FFF1E6',
                        color: (item.quantity || item.stock || 0) === 0 ? '#EA5455' : '#FF9F43',
                        padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600
                      }}>
                        {(item.quantity || item.stock || 0) === 0 ? 'Out of Stock' : 'Low Stock'}
                      </span>
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

export default LowStocks;
