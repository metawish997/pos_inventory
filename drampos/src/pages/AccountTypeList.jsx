import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { Search, RefreshCw, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getBankAccounts } from '../services/financeService';

const AccountTypeList = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTypes = async () => {
    try {
      setLoading(true);
      const res = await getBankAccounts();
      if (res.success) {
        setAccounts(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch account types:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const filtered = accounts.filter(acc =>
    (acc.accountName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (acc.accountNo || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Accounts Type</h1>
          <p className={styles.subtitle}>Manage your Accounts Type</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} onClick={fetchTypes}><RefreshCw size={18} /></button>
          <button className={styles.iconBtn}><ChevronUp size={18} /></button>
        </div>
      </div>

      <div style={{display: 'flex', gap: '0.5rem', marginBottom: '1.5rem'}}>
        <button onClick={() => navigate('/bank-accounts')} style={{backgroundColor: '#E5E7EB', color: '#4B5563', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer'}}>Bank Accounts</button>
        <button style={{backgroundColor: '#FF9F43', color: 'white', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer'}}>Account Type</button>
      </div>

      <Card className={styles.tableCard}>
        <div className={styles.filterBar}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search Account Type" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.tableResponsive}>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th>Account Name</th>
                <th>Account Number</th>
                <th>Created Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" style={{textAlign: 'center', padding: '2rem'}}>Loading Account Types...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="4" style={{textAlign: 'center', padding: '2rem'}}>No Accounts Found</td></tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item._id}>
                    <td style={{color: '#1B2850', fontWeight: 500}}>{item.accountName}</td>
                    <td style={{color: '#6B7280'}}>{item.accountNo}</td>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span style={{
                        backgroundColor: '#28C76F', 
                        color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'
                      }}>&bull; Active</span>
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

export default AccountTypeList;
