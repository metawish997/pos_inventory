import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { RefreshCw, ChevronUp, Calendar } from 'lucide-react';

const ProfitAndLoss = () => {
  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Profit / Loss Report</h1>
          <p className={styles.subtitle}>View Reports of Profit / Loss Report</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn}><RefreshCw size={18} /></button>
          <button className={styles.iconBtn}><ChevronUp size={18} /></button>
        </div>
      </div>

      <div style={{display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', justifyContent: 'flex-end'}}>
        <div style={{position: 'relative', width: '300px'}}>
          <Calendar size={18} style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6B7280'}} />
          <input type="text" className={styles.input} defaultValue="07/04/2026 - 07/10/2026" style={{paddingLeft: '2.5rem', width: '100%', boxSizing: 'border-box'}} />
        </div>
        <button className={styles.btnPrimary} style={{backgroundColor: '#FF9F43', color: 'white', border: 'none', height: '40px', padding: '0 1.5rem'}}>
          Generate Report
        </button>
      </div>

      <Card className={styles.tableCard}>
        <div className={styles.tableResponsive}>
          <table className={styles.productTable} style={{borderCollapse: 'collapse', width: '100%'}}>
            <thead>
              <tr style={{borderBottom: '1px solid #E5E7EB'}}>
                <th style={{padding: '1rem', textAlign: 'left', color: '#6B7280', fontWeight: 600}}></th>
                <th style={{padding: '1rem', textAlign: 'left', color: '#1B2850', fontWeight: 600}}>Jan 2026</th>
                <th style={{padding: '1rem', textAlign: 'left', color: '#1B2850', fontWeight: 600}}>Feb 2026</th>
                <th style={{padding: '1rem', textAlign: 'left', color: '#1B2850', fontWeight: 600}}>Mar 2026</th>
                <th style={{padding: '1rem', textAlign: 'left', color: '#1B2850', fontWeight: 600}}>Apr 2026</th>
                <th style={{padding: '1rem', textAlign: 'left', color: '#1B2850', fontWeight: 600}}>May 2026</th>
                <th style={{padding: '1rem', textAlign: 'left', color: '#1B2850', fontWeight: 600}}>Jun 2026</th>
              </tr>
            </thead>
            <tbody>
              <tr><td colSpan={7} style={{fontWeight: 700, padding: '1rem', color: '#1B2850', backgroundColor: '#F9FAFB'}}>Income</td></tr>
              <tr style={{borderBottom: '1px solid #E5E7EB'}}><td style={{padding: '1rem', color: '#6B7280'}}>Sales</td><td style={{padding: '1rem'}}>$50,000</td><td style={{padding: '1rem'}}>$50,000</td><td style={{padding: '1rem'}}>$50,000</td><td style={{padding: '1rem'}}>$50,000</td><td style={{padding: '1rem'}}>$50,000</td><td style={{padding: '1rem'}}>$50,000</td></tr>
              <tr style={{borderBottom: '1px solid #E5E7EB'}}><td style={{padding: '1rem', color: '#6B7280'}}>Service</td><td style={{padding: '1rem'}}>$30,000</td><td style={{padding: '1rem'}}>$30,000</td><td style={{padding: '1rem'}}>$30,000</td><td style={{padding: '1rem'}}>$30,000</td><td style={{padding: '1rem'}}>$30,000</td><td style={{padding: '1rem'}}>$30,000</td></tr>
              <tr style={{borderBottom: '1px solid #E5E7EB'}}><td style={{padding: '1rem', color: '#6B7280'}}>Purchase Return</td><td style={{padding: '1rem'}}>$7,000</td><td style={{padding: '1rem'}}>$7,000</td><td style={{padding: '1rem'}}>$7,000</td><td style={{padding: '1rem'}}>$7,000</td><td style={{padding: '1rem'}}>$7,000</td><td style={{padding: '1rem'}}>$7,000</td></tr>
              <tr style={{borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB'}}><td style={{padding: '1rem', fontWeight: 700, color: '#1B2850'}}>Gross Profit</td><td style={{padding: '1rem', fontWeight: 600}}>$8,000</td><td style={{padding: '1rem', fontWeight: 600}}>$8,000</td><td style={{padding: '1rem', fontWeight: 600}}>$8,000</td><td style={{padding: '1rem', fontWeight: 600}}>$8,000</td><td style={{padding: '1rem', fontWeight: 600}}>$8,000</td><td style={{padding: '1rem', fontWeight: 600}}>$8,000</td></tr>
              
              <tr><td colSpan={7} style={{fontWeight: 700, padding: '1rem', color: '#1B2850', backgroundColor: '#F9FAFB'}}>Expenses</td></tr>
              <tr style={{borderBottom: '1px solid #E5E7EB'}}><td style={{padding: '1rem', color: '#6B7280'}}>Sales</td><td style={{padding: '1rem'}}>$50,000</td><td style={{padding: '1rem'}}>$50,000</td><td style={{padding: '1rem'}}>$50,000</td><td style={{padding: '1rem'}}>$50,000</td><td style={{padding: '1rem'}}>$50,000</td><td style={{padding: '1rem'}}>$50,000</td></tr>
              <tr style={{borderBottom: '1px solid #E5E7EB'}}><td style={{padding: '1rem', color: '#6B7280'}}>Purchase</td><td style={{padding: '1rem'}}>$30,000</td><td style={{padding: '1rem'}}>$30,000</td><td style={{padding: '1rem'}}>$30,000</td><td style={{padding: '1rem'}}>$30,000</td><td style={{padding: '1rem'}}>$30,000</td><td style={{padding: '1rem'}}>$30,000</td></tr>
              <tr style={{borderBottom: '1px solid #E5E7EB'}}><td style={{padding: '1rem', color: '#6B7280'}}>Sales Return</td><td style={{padding: '1rem'}}>$7,000</td><td style={{padding: '1rem'}}>$7,000</td><td style={{padding: '1rem'}}>$7,000</td><td style={{padding: '1rem'}}>$7,000</td><td style={{padding: '1rem'}}>$7,000</td><td style={{padding: '1rem'}}>$7,000</td></tr>
              <tr style={{borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB'}}><td style={{padding: '1rem', fontWeight: 700, color: '#1B2850'}}>Total Expense</td><td style={{padding: '1rem', color: '#6B7280'}}>$8,000</td><td style={{padding: '1rem', color: '#6B7280'}}>$8,000</td><td style={{padding: '1rem', color: '#6B7280'}}>$8,000</td><td style={{padding: '1rem', color: '#6B7280'}}>$8,000</td><td style={{padding: '1rem', color: '#6B7280'}}>$8,000</td><td style={{padding: '1rem', color: '#6B7280'}}>$8,000</td></tr>
              <tr style={{borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB'}}><td style={{padding: '1rem', fontWeight: 700, color: '#1B2850'}}>Net Profit</td><td style={{padding: '1rem', color: '#6B7280'}}>$8,000</td><td style={{padding: '1rem', color: '#6B7280'}}>$8,000</td><td style={{padding: '1rem', color: '#6B7280'}}>$8,000</td><td style={{padding: '1rem', color: '#6B7280'}}>$8,000</td><td style={{padding: '1rem', color: '#6B7280'}}>$8,000</td><td style={{padding: '1rem', color: '#6B7280'}}>$8,000</td></tr>
            </tbody>
          </table>
        </div>
      </Card>
      
    </DashboardLayout>
  );
};

export default ProfitAndLoss;
