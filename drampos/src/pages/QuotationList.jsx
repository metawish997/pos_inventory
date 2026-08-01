import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { Search, RefreshCw, PlusCircle } from 'lucide-react';
import { getQuotations } from '../services/salesService';

const QuotationList = () => {
  const navigate = useNavigate();
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter States
  const [statusFilter, setStatusFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [storeFilter, setStoreFilter] = useState('All');

  const fetchQuotationsData = async () => {
    try {
      setLoading(true);
      const res = await getQuotations();
      if (res.success) {
        setQuotations(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch quotations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotationsData();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Sent':
        return <span style={{backgroundColor: '#E8F9EE', color: '#28C76F', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'}}>{status}</span>;
      case 'Draft':
        return <span style={{backgroundColor: '#E5F8FA', color: '#00CFE8', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'}}>{status}</span>;
      case 'Accepted':
      case 'Converted':
        return <span style={{backgroundColor: '#FFF1E6', color: '#FF9F43', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'}}>{status}</span>;
      default:
        return <span style={{backgroundColor: '#E8F9EE', color: '#28C76F', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'}}>{status || 'Sent'}</span>;
    }
  };

  const filteredQuotations = quotations.filter(q => {
    const matchesSearch = (q.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (q.quotationNumber || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || (q.status || 'Sent') === statusFilter;

    const storeName = q.store?.name || q.store;
    const matchesStore = storeFilter === 'All' || storeName === storeFilter;

    const dateVal = new Date(q.validUntil || q.createdAt);
    const matchesStartDate = !startDate || dateVal >= new Date(startDate);
    const matchesEndDate = !endDate || dateVal <= new Date(endDate);

    return matchesSearch && matchesStatus && matchesStore && matchesStartDate && matchesEndDate;
  });

  const uniqueStores = Array.from(new Set(quotations.map(q => q.store?.name || q.store).filter(Boolean)));

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Quotation List</h1>
          <p className={styles.subtitle}>Manage Sales Quotations</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} onClick={fetchQuotationsData}><RefreshCw size={18} /></button>
          <button className={styles.btnPrimary} onClick={() => navigate('/create-quotation')}>
            <PlusCircle size={18} /> Add Quotation
          </button>
        </div>
      </div>

      <Card className={styles.tableCard}>
        <div className={styles.filterBar}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search Customer or Quotation No" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className={styles.filters}>
            {/* Status Filter */}
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.select}
            >
              <option value="All">All Statuses</option>
              <option value="Sent">Sent</option>
              <option value="Draft">Draft</option>
              <option value="Accepted">Accepted</option>
              <option value="Converted">Converted</option>
            </select>

            {/* Store Filter */}
            <select 
              value={storeFilter} 
              onChange={(e) => setStoreFilter(e.target.value)}
              className={styles.select}
            >
              <option value="All">All Stores</option>
              {uniqueStores.map((st, idx) => (
                <option key={idx} value={st}>{st}</option>
              ))}
            </select>

            {/* Date Start Filter */}
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={styles.select}
              style={{ color: startDate ? '#1F2937' : '#9CA3AF' }}
              placeholder="Start Date"
            />

            {/* Date End Filter */}
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={styles.select}
              style={{ color: endDate ? '#1F2937' : '#9CA3AF' }}
              placeholder="End Date"
            />

            {/* Reset Button */}
            <button 
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('All');
                setStartDate('');
                setEndDate('');
                setStoreFilter('All');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #D1D5DB',
                backgroundColor: 'white',
                color: '#4B5563',
                cursor: 'pointer',
                fontSize: '0.875rem',
                gap: '6px'
              }}
            >
              Reset
            </button>
          </div>
        </div>

        <div className={styles.tableResponsive}>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>Quotation No</th>
                <th>Customer Name</th>
                <th>Valid Until</th>
                <th>Status</th>
                <th>Grand Total</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>Loading Quotations...</td>
                </tr>
              ) : filteredQuotations.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>No quotation records found</td>
                </tr>
              ) : (
                filteredQuotations.map((item, i) => (
                  <tr key={item._id || i}>
                    <td><input type="checkbox" /></td>
                    <td 
                      onClick={() => navigate(`/quotation-details/${item._id}`)} 
                      style={{ color: '#FF9F43', fontWeight: 600, cursor: 'pointer' }}
                    >
                      {item.quotationNumber}
                    </td>
                    <td>
                      <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                        <div style={{width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '12px'}}>
                          {(item.customerName || 'Q')[0].toUpperCase()}
                        </div>
                        <span style={{fontSize: '0.875rem', color: '#1B2850', fontWeight: 500}}>{item.customerName}</span>
                      </div>
                    </td>
                    <td>{new Date(item.validUntil || item.createdAt).toLocaleDateString()}</td>
                    <td>{getStatusBadge(item.status)}</td>
                    <td>₹{item.grandTotal || 0}</td>
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

export default QuotationList;
