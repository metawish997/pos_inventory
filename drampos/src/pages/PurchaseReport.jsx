import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { RefreshCw, Printer } from 'lucide-react';
import { API_BASE_URL } from '../api/endpoints';

const PurchaseReport = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/purchases`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setPurchases(data);
      } else if (data.success) {
        setPurchases(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch purchase report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const totalAmount = purchases.reduce((acc, curr) => acc + (curr.grandTotal || 0), 0);

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Purchase Report</h1>
          <p className={styles.subtitle}>Comprehensive Live Purchase Analytics</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} onClick={fetchPurchases}><RefreshCw size={18} /></button>
        </div>
      </div>

      <Card style={{padding: '1.5rem', marginBottom: '1.5rem', backgroundColor: '#FAFAFA'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <div style={{color: '#6B7280', fontSize: '0.875rem'}}>Total Purchase Volume</div>
            <div style={{fontSize: '1.5rem', fontWeight: 600, color: '#1B2850'}}>₹{totalAmount}</div>
          </div>
          <button className={styles.iconBtn} onClick={() => window.print()}><Printer size={18} color="#6B7280" /></button>
        </div>
      </Card>

      <Card className={styles.tableCard}>
        <div className={styles.tableResponsive}>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th>Reference</th>
                <th>Supplier</th>
                <th>Date</th>
                <th>Grand Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{textAlign: 'center', padding: '2rem'}}>Loading Purchase Report...</td></tr>
              ) : purchases.length === 0 ? (
                <tr><td colSpan="5" style={{textAlign: 'center', padding: '2rem'}}>No purchase records logged yet</td></tr>
              ) : (
                purchases.map((item) => (
                  <tr key={item._id}>
                    <td style={{color: '#1B2850', fontWeight: 500}}>{item.referenceNo || item.reference || 'PUR-001'}</td>
                    <td style={{color: '#6B7280'}}>{item.supplier?.vendorName || item.supplierName || 'General Supplier'}</td>
                    <td style={{color: '#6B7280'}}>{new Date(item.purchaseDate || item.createdAt).toLocaleDateString()}</td>
                    <td style={{color: '#EA5455', fontWeight: 600}}>₹{item.grandTotal}</td>
                    <td>
                      <span style={{
                        backgroundColor: '#28C76F', 
                        color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'
                      }}>&bull; {item.status || 'Received'}</span>
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

export default PurchaseReport;
