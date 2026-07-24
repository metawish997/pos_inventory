import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { Search, FileText, FileSpreadsheet, RefreshCw, ChevronUp, PlusCircle, MoreVertical, Eye, Edit, DollarSign, Download, Trash2, Plus } from 'lucide-react';
import AddSalesModal from '../components/modals/AddSalesModal';
import SalesDetailModal from '../components/modals/SalesDetailModal';
import EditSalesModal from '../components/modals/EditSalesModal';
import ShowPaymentsModal from '../components/modals/ShowPaymentsModal';
import CreatePaymentModal from '../components/modals/CreatePaymentModal';
import { getSales, deleteSale } from '../services/salesService';

const SalesList = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter States
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isShowPaymentOpen, setIsShowPaymentOpen] = useState(false);
  const [isCreatePaymentOpen, setIsCreatePaymentOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  
  const [activeMenu, setActiveMenu] = useState(null);
  const menuRef = useRef(null);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      const res = await getSales('Online');
      if (res.success) {
        setSales(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch sales:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <span style={{backgroundColor: '#28C76F', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'}}>{status}</span>;
      case 'Pending':
        return <span style={{backgroundColor: '#00CFE8', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'}}>{status}</span>;
      case 'Cancelled':
        return <span style={{backgroundColor: '#EA5455', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'}}>{status}</span>;
      default:
        return <span>{status || 'Completed'}</span>;
    }
  };

  const getPaymentBadge = (status) => {
    switch (status) {
      case 'Paid':
        return <span style={{backgroundColor: '#E8F9EE', color: '#28C76F', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px'}}><span style={{width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#28C76F'}}></span> {status}</span>;
      case 'Unpaid':
        return <span style={{backgroundColor: '#FCEAEA', color: '#EA5455', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px'}}><span style={{width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#EA5455'}}></span> {status}</span>;
      case 'Overdue':
        return <span style={{backgroundColor: '#FFF1E6', color: '#FF9F43', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px'}}><span style={{width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FF9F43'}}></span> {status}</span>;
      default:
        return <span>{status || 'Paid'}</span>;
    }
  };

  const handleAction = async (action, sale) => {
    setActiveMenu(null);
    setSelectedSale(sale);
    if (action === 'detail') setIsDetailOpen(true);
    if (action === 'edit') setIsEditOpen(true);
    if (action === 'show-payment') setIsShowPaymentOpen(true);
    if (action === 'create-payment') setIsCreatePaymentOpen(true);
    if (action === 'delete') {
      if (window.confirm('Are you sure you want to delete this sale?')) {
        try {
          await deleteSale(sale._id);
          fetchSalesData();
        } catch (err) {
          alert(err.message);
        }
      }
    }
  };

  const filteredSales = sales.filter(s => {
    const matchesSearch = (s.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (s.saleNumber || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || (s.orderStatus || 'Completed') === statusFilter;
    const matchesPayment = paymentFilter === 'All' || (s.paymentStatus || 'Paid') === paymentFilter;
    const dateVal = new Date(s.createdAt || s.saleDate);
    const matchesStartDate = !startDate || dateVal >= new Date(startDate);
    const matchesEndDate = !endDate || dateVal <= new Date(endDate);
    return matchesSearch && matchesStatus && matchesPayment && matchesStartDate && matchesEndDate;
  });

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Sales (Online Orders)</h1>
          <p className={styles.subtitle}>Manage Online Orders & Sales</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} onClick={fetchSalesData}><RefreshCw size={18} /></button>
          <button className={styles.btnPrimary} onClick={() => setIsAddOpen(true)}>
            <PlusCircle size={18} /> Add Sales
          </button>
        </div>
      </div>

      <Card className={styles.tableCard}>
        <div className={styles.filterBar}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search Customer or Ref" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className={styles.filters}>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={styles.select}>
              <option value="All">All Order Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)} className={styles.select}>
              <option value="All">All Payment Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Overdue">Overdue</option>
            </select>

            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={styles.select} style={{ color: startDate ? '#1F2937' : '#9CA3AF' }} />
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={styles.select} style={{ color: endDate ? '#1F2937' : '#9CA3AF' }} />

            <button
              onClick={() => { setSearchTerm(''); setStatusFilter('All'); setPaymentFilter('All'); setStartDate(''); setEndDate(''); }}
              style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', backgroundColor: 'white', color: '#4B5563', cursor: 'pointer', fontSize: '0.875rem' }}
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
                <th>Customer</th>
                <th>Reference</th>
                <th>Date</th>
                <th>Status</th>
                <th>Grand Total</th>
                <th>Paid</th>
                <th>Due</th>
                <th>Payment Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="10" style={{textAlign: 'center', padding: '2rem'}}>Loading Sales...</td>
                </tr>
              ) : filteredSales.length === 0 ? (
                <tr>
                  <td colSpan="10" style={{textAlign: 'center', padding: '2rem'}}>No sales records found</td>
                </tr>
              ) : (
                filteredSales.map((item, i) => (
                  <tr key={item._id || i}>
                    <td><input type="checkbox" /></td>
                    <td>
                      <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                        <div style={{width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '12px'}}>
                          {(item.customerName || 'W')[0].toUpperCase()}
                        </div>
                        <span style={{fontSize: '0.875rem', color: '#1B2850', fontWeight: 500}}>{item.customerName || 'Walk-in Customer'}</span>
                      </div>
                    </td>
                    <td>{item.saleNumber}</td>
                    <td>{new Date(item.createdAt || item.saleDate).toLocaleDateString()}</td>
                    <td>{getStatusBadge(item.orderStatus)}</td>
                    <td>₹{item.grandTotal || 0}</td>
                    <td>₹{item.paidAmount || 0}</td>
                    <td>₹{item.dueAmount || 0}</td>
                    <td>{getPaymentBadge(item.paymentStatus)}</td>
                    <td style={{position: 'relative'}}>
                      <button 
                        style={{border: 'none', background: 'none', cursor: 'pointer', color: '#6B7280'}}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenu(activeMenu === i ? null : i);
                        }}
                      >
                        <MoreVertical size={16} />
                      </button>
                      {activeMenu === i && (
                        <div ref={menuRef} style={{position: 'absolute', right: '100%', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', padding: '0.5rem', zIndex: 10, minWidth: '180px'}}>
                          <button onClick={() => handleAction('detail', item)} style={{display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.5rem', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '0.875rem', color: '#374151', borderRadius: '4px'}}>
                            <Eye size={16} /> Sale Detail
                          </button>
                          <button onClick={() => handleAction('delete', item)} style={{display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.5rem', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '0.875rem', color: '#EA5455', borderRadius: '4px'}}>
                            <Trash2 size={16} /> Delete Sale
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <AddSalesModal isOpen={isAddOpen} onClose={() => { setIsAddOpen(false); fetchSalesData(); }} />
      <SalesDetailModal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} sale={selectedSale} />
    </DashboardLayout>
  );
};

export default SalesList;
