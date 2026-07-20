import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { FileText, FileSpreadsheet, RefreshCw, ChevronUp } from 'lucide-react';

const TrialBalance = () => {
  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Trial Balance</h1>
          <p className={styles.subtitle}>View Your Balance Sheet</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn}><FileText size={18} color="#EA5455" /></button>
          <button className={styles.iconBtn}><FileSpreadsheet size={18} color="#28C76F" /></button>
          <button className={styles.iconBtn}><RefreshCw size={18} /></button>
          <button className={styles.iconBtn}><ChevronUp size={18} /></button>
        </div>
      </div>

      <Card style={{padding: '1.5rem', marginBottom: '1.5rem', backgroundColor: '#FAFAFA'}}>
        <div style={{display: 'flex', gap: '1.5rem', alignItems: 'flex-end'}}>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Choose Your Date</label>
            <div style={{border: '1px solid #E5E7EB', borderRadius: '4px', padding: '0.5rem', backgroundColor: 'white'}}>
              <span style={{fontSize: '0.875rem', color: '#4B5563'}}>01-Jan-2026 - 12-Dec-2026</span>
            </div>
          </div>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Store</label>
            <select className={styles.select}>
              <option>Select</option>
            </select>
          </div>
          <button style={{backgroundColor: '#FF9F43', color: 'white', border: 'none', borderRadius: '4px', padding: '0.6rem 1.5rem', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', height: '42px'}}>Submit</button>
        </div>
      </Card>

      <Card className={styles.tableCard}>
        <div className={styles.tableResponsive}>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th style={{width: '60%'}}>Account Name</th>
                <th>Debit</th>
                <th>Credit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="3" style={{fontWeight: 'bold', backgroundColor: '#F9FAFB', color: '#1B2850'}}>Assets</td>
              </tr>
              <tr>
                <td style={{color: '#6B7280', paddingLeft: '1.5rem'}}>Cash in register</td>
                <td style={{color: '#6B7280'}}>$5,000</td>
                <td></td>
              </tr>
              <tr>
                <td style={{color: '#6B7280', paddingLeft: '1.5rem'}}>Bank Accounts</td>
                <td style={{color: '#6B7280'}}>$12,000</td>
                <td></td>
              </tr>
              <tr>
                <td style={{color: '#6B7280', paddingLeft: '1.5rem'}}>Accounts Receivable</td>
                <td style={{color: '#6B7280'}}>$3,000</td>
                <td></td>
              </tr>
              <tr>
                <td style={{color: '#6B7280', paddingLeft: '1.5rem'}}>Inventory (POS stock)</td>
                <td style={{color: '#6B7280'}}>$10,000</td>
                <td></td>
              </tr>
              <tr style={{borderBottom: '1px solid #E5E7EB'}}>
                <td style={{fontWeight: 'bold', color: '#1B2850'}}>Total Assets</td>
                <td style={{fontWeight: 'bold', color: '#1B2850'}}>$37,000</td>
                <td></td>
              </tr>
              
              <tr>
                <td colSpan="3" style={{fontWeight: 'bold', backgroundColor: '#F9FAFB', color: '#1B2850', paddingTop: '1.5rem'}}>Liabilities</td>
              </tr>
              <tr>
                <td style={{color: '#6B7280', paddingLeft: '1.5rem'}}>Accounts Payable</td>
                <td></td>
                <td style={{color: '#6B7280'}}>$2,000</td>
              </tr>
              <tr>
                <td style={{color: '#6B7280', paddingLeft: '1.5rem'}}>Short-term Loans</td>
                <td></td>
                <td style={{color: '#6B7280'}}>$4,000</td>
              </tr>
              <tr>
                <td style={{color: '#6B7280', paddingLeft: '1.5rem'}}>Sales Tax Payable</td>
                <td></td>
                <td style={{color: '#6B7280'}}>$500</td>
              </tr>
              <tr>
                <td style={{color: '#6B7280', paddingLeft: '1.5rem'}}>Wages Payable</td>
                <td></td>
                <td style={{color: '#6B7280'}}>$1,200</td>
              </tr>
              <tr style={{borderBottom: '1px solid #E5E7EB'}}>
                <td style={{fontWeight: 'bold', color: '#1B2850'}}>Total Assets</td>
                <td></td>
                <td style={{fontWeight: 'bold', color: '#1B2850'}}>$20,700</td>
              </tr>

            </tbody>
            <tfoot>
              <tr>
                <td style={{fontWeight: 'bold', color: '#1B2850', padding: '1rem', fontSize: '1rem'}}>Total</td>
                <td style={{fontWeight: 'bold', color: '#1B2850', padding: '1rem', fontSize: '1rem'}}>$37,000</td>
                <td style={{fontWeight: 'bold', color: '#1B2850', padding: '1rem', fontSize: '1rem'}}>$37,000</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
      
    </DashboardLayout>
  );
};

export default TrialBalance;
