import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { Search, RefreshCw, Eye, CheckCircle, PlusCircle } from 'lucide-react';
import { getInvoices } from '../services/salesService';
import { API_BASE_URL } from '../api/endpoints';

const ProformaInvoiceList = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter States
  const [statusFilter, setStatusFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [storeFilter, setStoreFilter] = useState('All');

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await getInvoices('Proforma Invoice');
      if (res.success) {
        setInvoices(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch proforma invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleConvert = async (id) => {
    if (!window.confirm('Convert this Proforma Invoice to a final Tax Invoice?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/sales/invoices/${id}/convert`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        alert('Successfully converted to Tax Invoice!');
        fetchInvoices();
      } else {
        alert(data.message || 'Conversion failed');
      }
    } catch (e) {
      alert('Error occurred during conversion');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid':
        return <span style={{backgroundColor: '#E8F9EE', color: '#28C76F', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px'}}><span style={{width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#28C76F'}}></span> {status}</span>;
      case 'Unpaid':
        return <span style={{backgroundColor: '#FCEAEA', color: '#EA5455', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px'}}><span style={{width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#EA5455'}}></span> {status}</span>;
      case 'Overdue':
        return <span style={{backgroundColor: '#FFF1E6', color: '#FF9F43', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px'}}><span style={{width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FF9F43'}}></span> {status}</span>;
      default:
        return <span>{status || 'Unpaid'}</span>;
    }
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = (inv.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (inv.invoiceNumber || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;

    const invStoreName = inv.store?.name || inv.store;
    const matchesStore = storeFilter === 'All' || invStoreName === storeFilter;

    const invDate = new Date(inv.dueDate || inv.createdAt);
    const matchesStartDate = !startDate || invDate >= new Date(startDate);
    const matchesEndDate = !endDate || invDate <= new Date(endDate);

    return matchesSearch && matchesStatus && matchesStore && matchesStartDate && matchesEndDate;
  });

  const uniqueStores = Array.from(new Set(invoices.map(inv => inv.store?.name || inv.store).filter(Boolean)));

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Proforma Invoices</h1>
          <p className={styles.subtitle}>Manage Preliminary Invoices</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} onClick={fetchInvoices}><RefreshCw size={18} /></button>
          <button className={styles.btnPrimary} onClick={() => navigate('/create-invoice?type=Proforma Invoice')}>
            <PlusCircle size={18} /> Create Proforma Invoice
          </button>
        </div>
      </div>

      <Card className={styles.tableCard}>
        <div className={styles.filterBar}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search Proforma Invoice No or Customer" 
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
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Overdue">Overdue</option>
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
                <th>Proforma No</th>
                <th>Customer</th>
                <th>Due Date</th>
                <th>Amount</th>
                <th>Paid</th>
                <th>Amount Due</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" style={{textAlign: 'center', padding: '2rem'}}>Loading Proforma Invoices...</td>
                </tr>
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{textAlign: 'center', padding: '2rem'}}>No proforma invoice records found</td>
                </tr>
              ) : (
                filteredInvoices.map((item, i) => (
                  <tr key={item._id || i}>
                    <td><input type="checkbox" /></td>
                    <td>{item.invoiceNumber}</td>
                    <td>
                      <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                        <div style={{width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '12px'}}>
                          {(item.customerName || 'C')[0].toUpperCase()}
                        </div>
                        <span style={{fontSize: '0.875rem', color: '#1B2850', fontWeight: 500}}>{item.customerName}</span>
                      </div>
                    </td>
                    <td>{new Date(item.dueDate || item.createdAt).toLocaleDateString()}</td>
                    <td>₹{item.totalAmount || 0}</td>
                    <td>₹{item.paidAmount || 0}</td>
                    <td>₹{item.dueAmount || 0}</td>
                    <td>{getStatusBadge(item.status)}</td>
                    <td>
                      <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
                        <button 
                          style={{border: 'none', background: 'none', cursor: 'pointer', color: '#6B7280', display: 'inline-flex', alignItems: 'center'}}
                          onClick={() => navigate(`/invoice-details/${item._id}`)}
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          style={{border: 'none', background: 'none', cursor: 'pointer', color: '#28C76F', display: 'inline-flex', alignItems: 'center'}}
                          onClick={() => handleConvert(item._id)}
                          title="Convert to Tax Invoice"
                        >
                          <CheckCircle size={16} />
                        </button>
                      </div>
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

export default ProformaInvoiceList;
