import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { Search, RefreshCw, PlusCircle, Trash2 } from 'lucide-react';
import AddAccountModal from '../components/modals/AddAccountModal';
import { getBankAccounts, deleteBankAccount } from '../services/financeService';

const BankAccountsList = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const res = await getBankAccounts();
      if (res.success) setAccounts(res.data);
    } catch (err) {
      console.error('Failed to fetch bank accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bank account?')) {
      try {
        await deleteBankAccount(id);
        fetchAccounts();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const filteredAccounts = accounts.filter(a =>
    (a.accountName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.accountNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.bankName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Bank Accounts</h1>
          <p className={styles.subtitle}>Manage Bank Accounts & Balances</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} onClick={fetchAccounts}><RefreshCw size={18} /></button>
          <button className={styles.btnPrimary} onClick={() => setIsAddOpen(true)}>
            <PlusCircle size={18} /> Add Account
          </button>
        </div>
      </div>

      <Card className={styles.tableCard}>
        <div className={styles.filterBar}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search Account Name, Number or Bank" 
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
                <th>Account Holder Name</th>
                <th>Account No</th>
                <th>Bank Name</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>Loading Bank Accounts...</td>
                </tr>
              ) : filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>No bank accounts found</td>
                </tr>
              ) : (
                filteredAccounts.map((item) => (
                  <tr key={item._id}>
                    <td><input type="checkbox" /></td>
                    <td style={{color: '#1B2850', fontWeight: 600}}>{item.accountName}</td>
                    <td>{item.accountNumber}</td>
                    <td>{item.bankName}</td>
                    <td style={{color: '#28C76F', fontWeight: 600}}>₹{item.balance}</td>
                    <td>
                      <span style={{backgroundColor: '#28C76F', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'}}>{item.status || 'Active'}</span>
                    </td>
                    <td>
                      <button 
                        style={{border: 'none', background: 'none', cursor: 'pointer', color: '#EA5455'}}
                        onClick={() => handleDelete(item._id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <AddAccountModal isOpen={isAddOpen} onClose={() => { setIsAddOpen(false); fetchAccounts(); }} />
    </DashboardLayout>
  );
};

export default BankAccountsList;
