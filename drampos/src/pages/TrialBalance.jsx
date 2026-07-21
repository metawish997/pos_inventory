import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { FileText, FileSpreadsheet, RefreshCw, ChevronUp } from 'lucide-react';
import { getFinancialSummary } from '../services/financeService';

const TrialBalance = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTrialBalanceData = async () => {
    try {
      setLoading(true);
      const res = await getFinancialSummary();
      if (res.success) {
        setSummary(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch trial balance data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrialBalanceData();
  }, []);

  const totalSales = summary?.totalSales || 0;
  const totalPurchases = summary?.totalPurchases || 0;
  const totalExpenses = summary?.totalExpenses || 0;
  const totalIncomes = summary?.totalIncomes || 0;

  const totalDebits = totalPurchases + totalExpenses;
  const totalCredits = totalSales + totalIncomes;

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Trial Balance</h1>
          <p className={styles.subtitle}>View Your Dynamic Debit & Credit Balances</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn}><FileText size={18} color="#EA5455" /></button>
          <button className={styles.iconBtn}><FileSpreadsheet size={18} color="#28C76F" /></button>
          <button className={styles.iconBtn} onClick={fetchTrialBalanceData}><RefreshCw size={18} /></button>
          <button className={styles.iconBtn}><ChevronUp size={18} /></button>
        </div>
      </div>

      <Card className={styles.tableCard}>
        <div className={styles.tableResponsive}>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th style={{width: '60%'}}>Account Name</th>
                <th>Debit (₹)</th>
                <th>Credit (₹)</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="3" style={{textAlign: 'center', padding: '2rem'}}>Loading Trial Balance...</td></tr>
              ) : (
                <>
                  <tr>
                    <td colSpan="3" style={{fontWeight: 'bold', backgroundColor: '#F9FAFB', color: '#1B2850'}}>Revenue & Incomes</td>
                  </tr>
                  <tr>
                    <td style={{color: '#6B7280', paddingLeft: '1.5rem'}}>Sales Revenue</td>
                    <td>-</td>
                    <td style={{color: '#28C76F', fontWeight: 600}}>₹{totalSales}</td>
                  </tr>
                  <tr>
                    <td style={{color: '#6B7280', paddingLeft: '1.5rem'}}>Other Incomes</td>
                    <td>-</td>
                    <td style={{color: '#28C76F', fontWeight: 600}}>₹{totalIncomes}</td>
                  </tr>

                  <tr>
                    <td colSpan="3" style={{fontWeight: 'bold', backgroundColor: '#F9FAFB', color: '#1B2850', paddingTop: '1.5rem'}}>Expenses & Purchases</td>
                  </tr>
                  <tr>
                    <td style={{color: '#6B7280', paddingLeft: '1.5rem'}}>Product Purchases</td>
                    <td style={{color: '#EA5455', fontWeight: 600}}>₹{totalPurchases}</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <td style={{color: '#6B7280', paddingLeft: '1.5rem'}}>Operating Expenses</td>
                    <td style={{color: '#EA5455', fontWeight: 600}}>₹{totalExpenses}</td>
                    <td>-</td>
                  </tr>

                  <tr style={{borderTop: '2px solid #1B2850', backgroundColor: '#F8F9FA'}}>
                    <td style={{fontWeight: 'bold', color: '#1B2850', padding: '1rem'}}>Total Trial Balance</td>
                    <td style={{fontWeight: 'bold', color: '#1B2850', padding: '1rem'}}>₹{totalDebits}</td>
                    <td style={{fontWeight: 'bold', color: '#1B2850', padding: '1rem'}}>₹{totalCredits}</td>
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

export default TrialBalance;
