import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { Search, RefreshCw, PlusCircle } from 'lucide-react';
import AddTransferModal from '../components/modals/AddTransferModal';
import { getMoneyTransfers } from '../services/financeService';

const MoneyTransferList = () => {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  const fetchTransfers = async () => {
    try {
      setLoading(true);
      const res = await getMoneyTransfers();
      if (res.success) setTransfers(res.data);
    } catch (err) {
      console.error('Failed to fetch money transfers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransfers();
  }, []);

  const filteredTransfers = transfers.filter(t =>
    (t.transferNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.fromAccount?.accountName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.toAccount?.accountName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Money Transfer</h1>
          <p className={styles.subtitle}>Manage Bank Account Transfers</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} onClick={fetchTransfers}><RefreshCw size={18} /></button>
          <button className={styles.btnPrimary} onClick={() => setIsAddOpen(true)}>
            <PlusCircle size={18} /> Add Money Transfer
          </button>
        </div>
      </div>

      <Card className={styles.tableCard}>
        <div className={styles.filterBar}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search Transfer No or Account" 
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
                <th>Transfer No</th>
                <th>Date</th>
                <th>From Account</th>
                <th>To Account</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>Loading Transfers...</td>
                </tr>
              ) : filteredTransfers.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>No money transfer records found</td>
                </tr>
              ) : (
                filteredTransfers.map((item) => (
                  <tr key={item._id}>
                    <td><input type="checkbox" /></td>
                    <td style={{color: '#1B2850', fontWeight: 600}}>{item.transferNumber}</td>
                    <td>{new Date(item.transferDate || item.createdAt).toLocaleDateString()}</td>
                    <td>{item.fromAccount?.accountName} ({item.fromAccount?.bankName})</td>
                    <td>{item.toAccount?.accountName} ({item.toAccount?.bankName})</td>
                    <td style={{color: '#7367F0', fontWeight: 600}}>₹{item.amount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <AddTransferModal isOpen={isAddOpen} onClose={() => { setIsAddOpen(false); fetchTransfers(); }} />
    </DashboardLayout>
  );
};

export default MoneyTransferList;
