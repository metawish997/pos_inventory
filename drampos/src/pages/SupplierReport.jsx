import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { RefreshCw, Printer } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../api/endpoints';

const SupplierReport = () => {
  const location = useLocation();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSupplierReport = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/vendors?type=supplier`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setSuppliers(data);
      }
    } catch (err) {
      console.error('Failed to fetch supplier report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupplierReport();
  }, []);

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <div style={{display: 'flex', gap: '0.5rem', marginBottom: '1rem'}}>
            <Link to="/supplier-report" style={{padding: '0.5rem 1rem', backgroundColor: location.pathname === '/supplier-report' ? '#FF9F43' : '#E5E7EB', color: location.pathname === '/supplier-report' ? 'white' : '#6B7280', textDecoration: 'none', borderRadius: '4px', fontSize: '0.875rem', fontWeight: 500}}>Supplier Report</Link>
            <Link to="/supplier-due-report" style={{padding: '0.5rem 1rem', backgroundColor: location.pathname === '/supplier-due-report' ? '#FF9F43' : '#E5E7EB', color: location.pathname === '/supplier-due-report' ? 'white' : '#6B7280', textDecoration: 'none', borderRadius: '4px', fontSize: '0.875rem', fontWeight: 500}}>Supplier Due</Link>
          </div>
          <h1 className={styles.title}>Supplier Report</h1>
          <p className={styles.subtitle}>View Live Supplier Analytics</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} onClick={fetchSupplierReport}><RefreshCw size={18} /></button>
          <button className={styles.iconBtn} onClick={() => window.print()}><Printer size={18} color="#6B7280" /></button>
        </div>
      </div>

      <Card className={styles.tableCard}>
        <div className={styles.tableResponsive}>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th>Code</th>
                <th>Supplier Name</th>
                <th>Company</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>Loading Supplier Report...</td></tr>
              ) : suppliers.length === 0 ? (
                <tr><td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>No suppliers found</td></tr>
              ) : (
                suppliers.map((item) => (
                  <tr key={item._id}>
                    <td style={{color: '#1B2850', fontWeight: 500}}>{item.vendorCode || 'VEN-001'}</td>
                    <td style={{color: '#1B2850', fontWeight: 500}}>{item.vendorName}</td>
                    <td style={{color: '#6B7280'}}>{item.companyName || 'N/A'}</td>
                    <td style={{color: '#6B7280'}}>{item.email || 'N/A'}</td>
                    <td style={{color: '#6B7280'}}>{item.mobile || item.phone || 'N/A'}</td>
                    <td>
                      <span style={{
                        backgroundColor: item.status === 'Active' ? '#28C76F' : '#EA5455', 
                        color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'
                      }}>&bull; {item.status}</span>
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

export default SupplierReport;
