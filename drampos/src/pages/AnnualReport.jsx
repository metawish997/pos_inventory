import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { RefreshCw, ChevronUp, Calendar } from 'lucide-react';

const AnnualReport = () => {
  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Annual Report</h1>
          <p className={styles.subtitle}>View Reports of Annual Report</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn}><RefreshCw size={18} /></button>
          <button className={styles.iconBtn}><ChevronUp size={18} /></button>
        </div>
      </div>

      <Card style={{padding: '1.5rem', marginBottom: '1.5rem'}}>
        <div style={{display: 'flex', gap: '1.5rem', alignItems: 'flex-end'}}>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', color: '#1B2850', marginBottom: '0.5rem', fontWeight: 500}}>Date</label>
            <div style={{position: 'relative'}}>
              <Calendar size={18} style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6B7280'}} />
              <input type="text" className={styles.input} defaultValue="2026" style={{paddingLeft: '2.5rem'}} />
            </div>
          </div>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', color: '#1B2850', marginBottom: '0.5rem', fontWeight: 500}}>Store</label>
            <select className={styles.select}><option>All Stores</option></select>
          </div>
          <div>
            <button className={styles.btnPrimary} style={{backgroundColor: '#FF9F43', color: 'white', border: 'none', height: '40px', padding: '0 1.5rem'}}>
              Generate Report
            </button>
          </div>
          <div style={{flex: 2}}></div>
        </div>
      </Card>

      <Card className={styles.tableCard}>
        <div style={{padding: '1.5rem', borderBottom: '1px solid #F3F4F6'}}>
          <h2 style={{fontSize: '1.125rem', fontWeight: 600, color: '#1B2850', margin: 0}}>2026 Reports</h2>
        </div>
        <div className={styles.tableResponsive}>
          <table className={styles.productTable} style={{borderCollapse: 'collapse', width: '100%'}}>
            <thead>
              <tr style={{borderBottom: '1px solid #E5E7EB'}}>
                <th style={{padding: '1rem', textAlign: 'left', color: '#6B7280', fontWeight: 600}}></th>
                <th style={{padding: '1rem', textAlign: 'left', color: '#1B2850', fontWeight: 600}}>Jan 2026</th>
                <th style={{padding: '1rem', textAlign: 'left', color: '#1B2850', fontWeight: 600}}>Feb 2026</th>
                <th style={{padding: '1rem', textAlign: 'left', color: '#1B2850', fontWeight: 600}}>Mar 2026</th>
                <th style={{padding: '1rem', textAlign: 'left', color: '#1B2850', fontWeight: 600}}>Apr 2026</th>
              </tr>
            </thead>
            <tbody>
              {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, i) => (
                <tr key={i} style={{borderBottom: '1px solid #E5E7EB'}}>
                  <td style={{padding: '1rem', color: '#6B7280'}}>{month}</td>
                  <td style={{padding: '1rem', color: '#6B7280'}}>${month === 'February' ? '30,000' : month === 'January' ? '50,000' : '7,000'}</td>
                  <td style={{padding: '1rem', color: '#6B7280'}}>${month === 'February' ? '30,000' : month === 'January' ? '50,000' : '7,000'}</td>
                  <td style={{padding: '1rem', color: '#6B7280'}}>${month === 'February' ? '30,000' : month === 'January' ? '50,000' : '7,000'}</td>
                  <td style={{padding: '1rem', color: '#6B7280'}}>${month === 'February' ? '30,000' : month === 'January' ? '50,000' : '7,000'}</td>
                </tr>
              ))}
              <tr style={{borderTop: '2px solid #E5E7EB', backgroundColor: '#F9FAFB'}}>
                <td style={{padding: '1rem', fontWeight: 700, color: '#1B2850'}}>Total</td>
                <td style={{padding: '1rem', fontWeight: 700, color: '#1B2850'}}>$8,000</td>
                <td style={{padding: '1rem', fontWeight: 700, color: '#1B2850'}}>$8,000</td>
                <td style={{padding: '1rem', fontWeight: 700, color: '#1B2850'}}>$8,000</td>
                <td style={{padding: '1rem', fontWeight: 700, color: '#1B2850'}}>$8,000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
      
    </DashboardLayout>
  );
};

export default AnnualReport;
