import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { Search, RefreshCw, PlusCircle } from 'lucide-react';
import AddSalesReturnModal from '../components/modals/AddSalesReturnModal';
import EditSalesReturnModal from '../components/modals/EditSalesReturnModal';
import { getSalesReturns } from '../services/salesService';

const SalesReturnList = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  const fetchReturnsData = async () => {
    try {
      setLoading(true);
      const res = await getSalesReturns();
      if (res.success) {
        setReturns(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch sales returns:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturnsData();
  }, []);

  const getPaymentBadge = (status) => {
    switch (status) {
      case 'Refunded':
        return <span style={{backgroundColor: '#E8F9EE', color: '#28C76F', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px'}}><span style={{width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#28C76F'}}></span> {status}</span>;
      case 'Pending':
        return <span style={{backgroundColor: '#FCEAEA', color: '#EA5455', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px'}}><span style={{width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#EA5455'}}></span> {status}</span>;
      default:
        return <span>{status || 'Refunded'}</span>;
    }
  };

  const filteredReturns = returns.filter(r =>
    (r.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.returnNumber || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Sales Return</h1>
          <p className={styles.subtitle}>Manage Sales Returns & Restocking</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} onClick={fetchReturnsData}><RefreshCw size={18} /></button>
          <button className={styles.btnPrimary} onClick={() => setIsAddOpen(true)}>
            <PlusCircle size={18} /> Add Sales Return
          </button>
        </div>
      </div>

      <Card className={styles.tableCard}>
        <div className={styles.filterBar}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search Customer or Return No" 
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
                <th>Return No</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Refund Amount</th>
                <th>Refund Status</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>Loading Sales Returns...</td>
                </tr>
              ) : filteredReturns.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>No sales return records found</td>
                </tr>
              ) : (
                filteredReturns.map((item, i) => (
                  <tr key={item._id || i}>
                    <td><input type="checkbox" /></td>
                    <td>{item.returnNumber}</td>
                    <td>{new Date(item.returnDate || item.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                        <div style={{width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '12px'}}>
                          {(item.customerName || 'R')[0].toUpperCase()}
                        </div>
                        <span style={{fontSize: '0.875rem', color: '#1B2850', fontWeight: 500}}>{item.customerName}</span>
                      </div>
                    </td>
                    <td>₹{item.totalRefundAmount || 0}</td>
                    <td>{getPaymentBadge(item.refundStatus)}</td>
                    <td>{item.returnReason || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <AddSalesReturnModal isOpen={isAddOpen} onClose={() => { setIsAddOpen(false); fetchReturnsData(); }} />
    </DashboardLayout>
  );
};

export default SalesReturnList;
