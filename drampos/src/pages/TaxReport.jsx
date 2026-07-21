import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { RefreshCw, Printer } from 'lucide-react';
import { getFinancialSummary } from '../services/financeService';

const TaxReport = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTaxData = async () => {
    try {
      setLoading(true);
      const res = await getFinancialSummary();
      if (res.success) {
        setSummary(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch tax data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaxData();
  }, []);

  const totalSales = summary?.totalSales || 0;
  const totalPurchases = summary?.totalPurchases || 0;

  // Standard 18% Tax Estimation
  const salesTax = Math.round(totalSales * 0.18);
  const purchaseTax = Math.round(totalPurchases * 0.18);
  const netTaxPayable = salesTax - purchaseTax;

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Tax Report</h1>
          <p className={styles.subtitle}>View Reports of Output Sales & Input Purchase Tax</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} onClick={fetchTaxData}><RefreshCw size={18} /></button>
          <button className={styles.iconBtn} onClick={() => window.print()}><Printer size={18} color="#6B7280" /></button>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '1.5rem'}}>
        <Card style={{padding: '1.5rem', border: '1px solid #28C76F'}}>
          <div style={{color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.25rem'}}>Output Sales Tax (Collected)</div>
          <div style={{fontSize: '1.5rem', fontWeight: 600, color: '#28C76F'}}>₹{salesTax}</div>
        </Card>
        <Card style={{padding: '1.5rem', border: '1px solid #00CFE8'}}>
          <div style={{color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.25rem'}}>Input Purchase Tax (Credit)</div>
          <div style={{fontSize: '1.5rem', fontWeight: 600, color: '#00CFE8'}}>₹{purchaseTax}</div>
        </Card>
        <Card style={{padding: '1.5rem', border: '1px solid #FF9F43'}}>
          <div style={{color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.25rem'}}>Net Tax Payable</div>
          <div style={{fontSize: '1.5rem', fontWeight: 600, color: '#FF9F43'}}>₹{netTaxPayable < 0 ? 0 : netTaxPayable}</div>
        </Card>
      </div>

      <Card className={styles.tableCard}>
        <div className={styles.tableResponsive}>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th>Tax Category</th>
                <th>Total Transaction Volume</th>
                <th>Estimated Rate</th>
                <th>Calculated Tax Amount</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" style={{textAlign: 'center', padding: '2rem'}}>Loading Tax Report...</td></tr>
              ) : (
                <>
                  <tr>
                    <td style={{color: '#1B2850', fontWeight: 500}}>Sales Output Tax (GST 18%)</td>
                    <td style={{color: '#6B7280'}}>₹{totalSales}</td>
                    <td style={{color: '#6B7280'}}>18%</td>
                    <td style={{color: '#28C76F', fontWeight: 600}}>₹{salesTax}</td>
                  </tr>
                  <tr>
                    <td style={{color: '#1B2850', fontWeight: 500}}>Purchase Input Tax Credit (GST 18%)</td>
                    <td style={{color: '#6B7280'}}>₹{totalPurchases}</td>
                    <td style={{color: '#6B7280'}}>18%</td>
                    <td style={{color: '#00CFE8', fontWeight: 600}}>₹{purchaseTax}</td>
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

export default TaxReport;
