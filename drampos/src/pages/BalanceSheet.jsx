import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { RefreshCw } from 'lucide-react';
import { getFinancialSummary } from '../services/financeService';

const BalanceSheet = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const res = await getFinancialSummary();
      if (res.success) setSummary(res.data);
    } catch (err) {
      console.error('Failed to fetch financial summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Balance Sheet</h1>
          <p className={styles.subtitle}>Financial Overview & Profit / Loss Statement</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} onClick={fetchSummary}><RefreshCw size={18} /></button>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem'}}>
        <Card style={{padding: '1.5rem', backgroundColor: '#E8F9EE'}}>
          <span style={{fontSize: '0.875rem', color: '#28C76F', fontWeight: 600}}>Total Revenue (Sales)</span>
          <h2 style={{fontSize: '1.75rem', color: '#1B2850', marginTop: '0.5rem'}}>₹{summary?.totalSales || 0}</h2>
        </Card>

        <Card style={{padding: '1.5rem', backgroundColor: '#E5F8FA'}}>
          <span style={{fontSize: '0.875rem', color: '#00CFE8', fontWeight: 600}}>Other Incomes</span>
          <h2 style={{fontSize: '1.75rem', color: '#1B2850', marginTop: '0.5rem'}}>₹{summary?.totalIncomes || 0}</h2>
        </Card>

        <Card style={{padding: '1.5rem', backgroundColor: '#FFF1E6'}}>
          <span style={{fontSize: '0.875rem', color: '#FF9F43', fontWeight: 600}}>Purchases Cost</span>
          <h2 style={{fontSize: '1.75rem', color: '#1B2850', marginTop: '0.5rem'}}>₹{summary?.totalPurchases || 0}</h2>
        </Card>

        <Card style={{padding: '1.5rem', backgroundColor: '#FCEAEA'}}>
          <span style={{fontSize: '0.875rem', color: '#EA5455', fontWeight: 600}}>Total Expenses</span>
          <h2 style={{fontSize: '1.75rem', color: '#1B2850', marginTop: '0.5rem'}}>₹{summary?.totalExpenses || 0}</h2>
        </Card>
      </div>

      <Card className={styles.tableCard} style={{padding: '1.5rem'}}>
        <h3 style={{fontSize: '1.125rem', color: '#1B2850', marginBottom: '1rem'}}>Net Financial Statement</h3>
        <table className={styles.productTable}>
          <thead>
            <tr>
              <th>Account Line</th>
              <th>Calculation</th>
              <th>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Gross Sales Revenue</td>
              <td>Sales Invoices Generated</td>
              <td style={{color: '#28C76F', fontWeight: 600}}>+ ₹{summary?.totalSales || 0}</td>
            </tr>
            <tr>
              <td>Other Income Records</td>
              <td>Incomes Logged</td>
              <td style={{color: '#28C76F', fontWeight: 600}}>+ ₹{summary?.totalIncomes || 0}</td>
            </tr>
            <tr>
              <td>Inventory Purchases</td>
              <td>Vendor Purchase Orders</td>
              <td style={{color: '#EA5455', fontWeight: 600}}>- ₹{summary?.totalPurchases || 0}</td>
            </tr>
            <tr>
              <td>Operating Expenses</td>
              <td>Utilities, Repairs, Supplies</td>
              <td style={{color: '#EA5455', fontWeight: 600}}>- ₹{summary?.totalExpenses || 0}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr style={{backgroundColor: '#F9FAFB', fontWeight: 'bold'}}>
              <td colSpan="2" style={{padding: '1rem'}}>Net Profit / Balance</td>
              <td style={{padding: '1rem', fontSize: '1.125rem', color: (summary?.netProfit || 0) >= 0 ? '#28C76F' : '#EA5455'}}>
                ₹{summary?.netProfit || 0}
              </td>
            </tr>
          </tfoot>
        </table>
      </Card>
    </DashboardLayout>
  );
};

export default BalanceSheet;
