import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { FileText, FileSpreadsheet, RefreshCw, ChevronUp, Printer } from 'lucide-react';
import { getAllSales } from '../services/salesService';

const SalesReport = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSalesReport = async () => {
    try {
      setLoading(true);
      const res = await getAllSales();
      if (res.success) {
        setSales(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch sales report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesReport();
  }, []);

  const totalAmount = sales.reduce((acc, curr) => acc + (curr.grandTotal || 0), 0);
  const totalPaid = sales.reduce((acc, curr) => acc + (curr.paidAmount || curr.grandTotal || 0), 0);
  const totalUnpaid = sales.reduce((acc, curr) => acc + (curr.dueAmount || 0), 0);

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Sales Report</h1>
          <p className={styles.subtitle}>Comprehensive Live Sales Analytics</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} onClick={fetchSalesReport}><RefreshCw size={18} /></button>
          <button className={styles.iconBtn}><ChevronUp size={18} /></button>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '1.5rem'}}>
        <Card style={{padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid #28C76F'}}>
          <div style={{backgroundColor: '#28C76F', color: 'white', width: '48px', height: '48px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <FileText size={24} />
          </div>
          <div>
            <div style={{color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.25rem'}}>Total Sales Volume</div>
            <div style={{fontSize: '1.25rem', fontWeight: 600, color: '#1B2850'}}>₹{totalAmount}</div>
          </div>
        </Card>
        <Card style={{padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid #00CFE8'}}>
          <div style={{backgroundColor: '#00CFE8', color: 'white', width: '48px', height: '48px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <FileText size={24} />
          </div>
          <div>
            <div style={{color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.25rem'}}>Total Amount Received</div>
            <div style={{fontSize: '1.25rem', fontWeight: 600, color: '#1B2850'}}>₹{totalPaid}</div>
          </div>
        </Card>
        <Card style={{padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid #FF9F43'}}>
          <div style={{backgroundColor: '#FF9F43', color: 'white', width: '48px', height: '48px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <FileText size={24} />
          </div>
          <div>
            <div style={{color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.25rem'}}>Total Outstanding Due</div>
            <div style={{fontSize: '1.25rem', fontWeight: 600, color: '#1B2850'}}>₹{totalUnpaid}</div>
          </div>
        </Card>
      </div>

      <Card className={styles.tableCard}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid #F3F4F6'}}>
          <h2 style={{fontSize: '1rem', fontWeight: 600, color: '#1B2850', margin: 0}}>Sales Transaction Report</h2>
          <div style={{display: 'flex', gap: '0.5rem'}}>
             <button className={styles.iconBtn} onClick={() => window.print()}><Printer size={18} color="#6B7280" /></button>
          </div>
        </div>

        <div className={styles.tableResponsive}>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th>Reference / Invoice</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Payment Mode</th>
                <th>Grand Total</th>
                <th>Paid Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>Loading Sales Report...</td></tr>
              ) : sales.length === 0 ? (
                <tr><td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>No sales records logged yet</td></tr>
              ) : (
                sales.map((item) => (
                  <tr key={item._id}>
                    <td style={{color: '#1B2850', fontWeight: 500}}>{item.reference || item.invoiceNumber}</td>
                    <td style={{color: '#6B7280'}}>{new Date(item.saleDate || item.createdAt).toLocaleDateString()}</td>
                    <td style={{color: '#6B7280'}}>{item.customerName || 'Walk-in Customer'}</td>
                    <td style={{color: '#6B7280'}}>{item.paymentType || 'Cash'}</td>
                    <td style={{color: '#1B2850', fontWeight: 600}}>₹{item.grandTotal}</td>
                    <td style={{color: '#28C76F', fontWeight: 600}}>₹{item.paidAmount || item.grandTotal}</td>
                    <td>
                      <span style={{
                        backgroundColor: '#28C76F', 
                        color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'
                      }}>&bull; Completed</span>
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

export default SalesReport;
