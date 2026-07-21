import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { RefreshCw, Printer } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { getCustomers } from '../services/customerService';

const CustomerReport = () => {
  const location = useLocation();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomerReport = async () => {
    try {
      setLoading(true);
      const res = await getCustomers();
      if (res.success) {
        setCustomers(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch customer report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerReport();
  }, []);

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <div style={{display: 'flex', gap: '0.5rem', marginBottom: '1rem'}}>
            <Link to="/customer-report" style={{padding: '0.5rem 1rem', backgroundColor: location.pathname === '/customer-report' ? '#FF9F43' : '#E5E7EB', color: location.pathname === '/customer-report' ? 'white' : '#6B7280', textDecoration: 'none', borderRadius: '4px', fontSize: '0.875rem', fontWeight: 500}}>Customer Report</Link>
            <Link to="/customer-due-report" style={{padding: '0.5rem 1rem', backgroundColor: location.pathname === '/customer-due-report' ? '#FF9F43' : '#E5E7EB', color: location.pathname === '/customer-due-report' ? 'white' : '#6B7280', textDecoration: 'none', borderRadius: '4px', fontSize: '0.875rem', fontWeight: 500}}>Customer Due</Link>
          </div>
          <h1 className={styles.title}>Customer Report</h1>
          <p className={styles.subtitle}>View Live Customer Analytics</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} onClick={fetchCustomerReport}><RefreshCw size={18} /></button>
          <button className={styles.iconBtn} onClick={() => window.print()}><Printer size={18} color="#6B7280" /></button>
        </div>
      </div>

      <Card className={styles.tableCard}>
        <div className={styles.tableResponsive}>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th>Customer Code</th>
                <th>Customer Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Country</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>Loading Customer Report...</td></tr>
              ) : customers.length === 0 ? (
                <tr><td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>No customers found</td></tr>
              ) : (
                customers.map((item) => (
                  <tr key={item._id}>
                    <td style={{color: '#1B2850', fontWeight: 500}}>{item.customerCode}</td>
                    <td style={{color: '#1B2850', fontWeight: 500}}>{item.firstName} {item.lastName}</td>
                    <td style={{color: '#6B7280'}}>{item.email}</td>
                    <td style={{color: '#6B7280'}}>{item.phone}</td>
                    <td style={{color: '#6B7280'}}>{item.country || 'N/A'}</td>
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

export default CustomerReport;
