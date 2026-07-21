import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { RefreshCw, Printer } from 'lucide-react';
import { getFinancialSummary } from '../services/financeService';

const ProfitAndLoss = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPNL = async () => {
    try {
      setLoading(true);
      const res = await getFinancialSummary();
      if (res.success) {
        setSummary(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch P&L data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPNL();
  }, []);

  const monthlyTrends = summary?.monthlyTrends || [];

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Profit / Loss Report</h1>
          <p className={styles.subtitle}>Monthly Profit and Loss Breakdown</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} onClick={fetchPNL}><RefreshCw size={18} /></button>
          <button className={styles.iconBtn} onClick={() => window.print()}><Printer size={18} color="#6B7280" /></button>
        </div>
      </div>

      <Card className={styles.tableCard}>
        <div className={styles.tableResponsive}>
          <table className={styles.productTable} style={{borderCollapse: 'collapse', width: '100%'}}>
            <thead>
              <tr style={{borderBottom: '1px solid #E5E7EB'}}>
                <th style={{padding: '1rem', textAlign: 'left', color: '#1B2850', fontWeight: 600}}>Metric</th>
                {monthlyTrends.map((m, i) => (
                  <th key={i} style={{padding: '1rem', textAlign: 'left', color: '#1B2850', fontWeight: 600}}>{m.month}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={monthlyTrends.length + 1} style={{textAlign: 'center', padding: '2rem'}}>Loading P&L Report...</td></tr>
              ) : (
                <>
                  <tr><td colSpan={monthlyTrends.length + 1} style={{fontWeight: 700, padding: '1rem', color: '#1B2850', backgroundColor: '#F9FAFB'}}>Income</td></tr>
                  <tr style={{borderBottom: '1px solid #E5E7EB'}}>
                    <td style={{padding: '1rem', color: '#6B7280', fontWeight: 500}}>Sales Revenue</td>
                    {monthlyTrends.map((m, i) => (
                      <td key={i} style={{padding: '1rem', color: '#28C76F', fontWeight: 600}}>₹{m.sales}</td>
                    ))}
                  </tr>
                  
                  <tr><td colSpan={monthlyTrends.length + 1} style={{fontWeight: 700, padding: '1rem', color: '#1B2850', backgroundColor: '#F9FAFB'}}>Expenses</td></tr>
                  <tr style={{borderBottom: '1px solid #E5E7EB'}}>
                    <td style={{padding: '1rem', color: '#6B7280', fontWeight: 500}}>Purchases</td>
                    {monthlyTrends.map((m, i) => (
                      <td key={i} style={{padding: '1rem', color: '#EA5455', fontWeight: 600}}>₹{m.purchases}</td>
                    ))}
                  </tr>
                  
                  <tr style={{borderTop: '2px solid #1B2850', backgroundColor: '#F8F9FA'}}>
                    <td style={{padding: '1rem', fontWeight: 700, color: '#1B2850'}}>Net Operating Margin</td>
                    {monthlyTrends.map((m, i) => {
                      const net = m.sales - m.purchases;
                      return (
                        <td key={i} style={{padding: '1rem', fontWeight: 700, color: net >= 0 ? '#28C76F' : '#EA5455'}}>
                          ₹{net}
                        </td>
                      );
                    })}
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default ProfitAndLoss;
