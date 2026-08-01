import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { FileText, FileSpreadsheet, RefreshCw, ChevronUp, Printer } from 'lucide-react';
import { API_BASE_URL } from '../api/endpoints';

const CashFlow = () => {
  const [flows, setFlows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('All');

  const fetchCashFlow = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/finance/cash-flow`);
      const data = await res.json();
      if (data.success) {
        setFlows(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching cash flows:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCashFlow();
  }, []);

  const filteredFlows = flows.filter(flow => {
    const matchesSearch = 
      (flow.reference || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (flow.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPayment = paymentMethod === 'All' || flow.paymentMethod === paymentMethod;
    
    return matchesSearch && matchesPayment;
  });

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Cash Flow</h1>
          <p className={styles.subtitle}>Dynamic real-time statement of cash inflows and outflows</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} onClick={() => window.print()} title="Print"><Printer size={18} color="#6B7280" /></button>
          <button className={styles.iconBtn} onClick={fetchCashFlow} title="Reload"><RefreshCw size={18} /></button>
        </div>
      </div>

      <Card className={styles.tableCard}>
        <div className={styles.filterBar}>
          <div className={styles.searchBox}>
            <input 
              type="text" 
              placeholder="Search reference or description" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className={styles.filters}>
            <select 
              className={styles.select}
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="All">All Payment Methods</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="UPI">UPI</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>
        </div>

        <div className={styles.tableResponsive}>
          {loading ? (
            <div style={{padding: '3rem', textAlign: 'center', color: '#6B7280'}}>Loading cash flows...</div>
          ) : filteredFlows.length === 0 ? (
            <div style={{padding: '3rem', textAlign: 'center', color: '#6B7280'}}>No transaction history found.</div>
          ) : (
            <table className={styles.productTable}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Reference Number</th>
                  <th>Description</th>
                  <th>Credit (Inflow)</th>
                  <th>Debit (Outflow)</th>
                  <th>Running Balance</th>
                  <th>Payment Method</th>
                </tr>
              </thead>
              <tbody>
                {filteredFlows.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{color: '#6B7280'}}>{new Date(item.date).toLocaleDateString('en-GB')}</td>
                    <td style={{color: '#1B2850', fontWeight: 600}}>{item.reference}</td>
                    <td style={{color: '#6B7280'}}>{item.description}</td>
                    <td style={{color: item.credit > 0 ? '#28C76F' : '#6B7280', fontWeight: item.credit > 0 ? '600' : 'normal'}}>
                      {item.credit > 0 ? `₹${item.credit.toFixed(2)}` : '—'}
                    </td>
                    <td style={{color: item.debit > 0 ? '#EA5455' : '#6B7280', fontWeight: item.debit > 0 ? '600' : 'normal'}}>
                      {item.debit > 0 ? `₹${item.debit.toFixed(2)}` : '—'}
                    </td>
                    <td style={{color: '#1B2850', fontWeight: 'bold'}}>
                      ₹{item.runningBalance.toFixed(2)}
                    </td>
                    <td style={{color: '#6B7280'}}>{item.paymentMethod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default CashFlow;
