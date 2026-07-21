import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { FileText, FileSpreadsheet, RefreshCw, ChevronUp } from 'lucide-react';
import { getBankAccounts, getExpenses, getIncomes, getMoneyTransfers } from '../services/financeService';

const AccountStatement = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [statementData, setStatementData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBankAccounts().then(res => {
      if (res.success && res.data.length > 0) {
        setAccounts(res.data);
        setSelectedAccountId(res.data[0]._id);
        setSelectedAccount(res.data[0]);
      }
    }).catch(console.error);
  }, []);

  const loadStatement = async () => {
    try {
      setLoading(true);
      const [expRes, incRes, transRes] = await Promise.all([
        getExpenses().catch(() => ({ data: [] })),
        getIncomes().catch(() => ({ data: [] })),
        getMoneyTransfers().catch(() => ({ data: [] }))
      ]);

      const expenses = expRes.data || [];
      const incomes = incRes.data || [];
      const transfers = transRes.data || [];

      const list = [];

      incomes.forEach(inc => {
        list.push({
          ref: `#INC-${inc._id.slice(-4).toUpperCase()}`,
          date: new Date(inc.createdAt).toLocaleDateString(),
          cat: inc.category?.name || 'Income',
          desc: inc.notes || 'Income Received',
          amount: `+₹${inc.amount}`,
          type: 'Credit',
          rawAmount: inc.amount
        });
      });

      expenses.forEach(exp => {
        list.push({
          ref: `#EXP-${exp._id.slice(-4).toUpperCase()}`,
          date: new Date(exp.createdAt).toLocaleDateString(),
          cat: exp.category?.name || 'Expense',
          desc: exp.notes || 'Expense Paid',
          amount: `-₹${exp.amount}`,
          type: 'Debit',
          rawAmount: -exp.amount
        });
      });

      transfers.forEach(tr => {
        list.push({
          ref: `#TR-${tr._id.slice(-4).toUpperCase()}`,
          date: new Date(tr.createdAt).toLocaleDateString(),
          cat: 'Transfer',
          desc: `Transfer from ${tr.fromAccount?.accountName || 'Account'} to ${tr.toAccount?.accountName || 'Account'}`,
          amount: `-₹${tr.amount}`,
          type: 'Debit',
          rawAmount: -tr.amount
        });
      });

      setStatementData(list);
    } catch (err) {
      console.error('Failed to load statement:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatement();
  }, [selectedAccountId]);

  const handleAccountChange = (e) => {
    const id = e.target.value;
    setSelectedAccountId(id);
    const acc = accounts.find(a => a._id === id);
    setSelectedAccount(acc);
  };

  const totalBalance = statementData.reduce((acc, curr) => acc + curr.rawAmount, selectedAccount?.openingBalance || 0);

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Account Statement</h1>
          <p className={styles.subtitle}>View your persistent transaction statement</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn}><FileText size={18} color="#EA5455" /></button>
          <button className={styles.iconBtn}><FileSpreadsheet size={18} color="#28C76F" /></button>
          <button className={styles.iconBtn} onClick={loadStatement}><RefreshCw size={18} /></button>
          <button className={styles.iconBtn}><ChevronUp size={18} /></button>
        </div>
      </div>

      <Card style={{padding: '1.5rem', marginBottom: '1.5rem', backgroundColor: '#FAFAFA'}}>
        <div style={{display: 'flex', gap: '1.5rem', alignItems: 'flex-end', maxWidth: '600px'}}>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Select Account</label>
            <select className={styles.select} value={selectedAccountId} onChange={handleAccountChange}>
              {accounts.length === 0 ? (
                <option value="">No Accounts Found</option>
              ) : (
                accounts.map(acc => (
                  <option key={acc._id} value={acc._id}>{acc.accountName} - {acc.accountNo}</option>
                ))
              )}
            </select>
          </div>
          <button onClick={loadStatement} style={{backgroundColor: '#FF9F43', color: 'white', border: 'none', borderRadius: '4px', padding: '0.6rem 1.5rem', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', height: '42px'}}>Refresh Statement</button>
        </div>
      </Card>

      <Card className={styles.tableCard}>
        <div style={{padding: '1.5rem', borderBottom: '1px solid #E5E7EB'}}>
          <h2 style={{fontSize: '1.125rem', color: '#1B2850', margin: 0}}>
            Statement of Account : <span style={{color: '#FF9F43'}}>{selectedAccount ? `${selectedAccount.accountName} - ${selectedAccount.accountNo}` : 'All Accounts'}</span>
          </h2>
        </div>

        <div className={styles.tableResponsive}>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th>Reference Number</th>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Transaction Type</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>Loading statement...</td></tr>
              ) : statementData.length === 0 ? (
                <tr><td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>No statement records found for this account</td></tr>
              ) : (
                statementData.map((item, i) => (
                  <tr key={i}>
                    <td style={{color: '#6B7280', fontWeight: 500}}>{item.ref}</td>
                    <td style={{color: '#6B7280'}}>{item.date}</td>
                    <td style={{color: '#6B7280'}}>{item.cat}</td>
                    <td style={{color: '#6B7280'}}>{item.desc}</td>
                    <td style={{color: item.type === 'Credit' ? '#28C76F' : '#EA5455', fontWeight: 600}}>{item.amount}</td>
                    <td>
                      <span style={{
                        backgroundColor: item.type === 'Credit' ? '#28C76F' : '#EA5455', 
                        color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'
                      }}>&bull; {item.type}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="4" style={{fontWeight: 'bold', padding: '1rem'}}>Net Calculated Balance</td>
                <td colSpan="2" style={{fontWeight: 'bold', color: '#1B2850', padding: '1rem'}}>₹{totalBalance}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default AccountStatement;
