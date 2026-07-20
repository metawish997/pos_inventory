import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { FileText, FileSpreadsheet, RefreshCw, ChevronUp } from 'lucide-react';

const AccountStatement = () => {
  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Account Statement</h1>
          <p className={styles.subtitle}>View Your Statement</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn}><FileText size={18} color="#EA5455" /></button>
          <button className={styles.iconBtn}><FileSpreadsheet size={18} color="#28C76F" /></button>
          <button className={styles.iconBtn}><RefreshCw size={18} /></button>
          <button className={styles.iconBtn}><ChevronUp size={18} /></button>
        </div>
      </div>

      <Card style={{padding: '1.5rem', marginBottom: '1.5rem', backgroundColor: '#FAFAFA'}}>
        <div style={{display: 'flex', gap: '1.5rem', alignItems: 'flex-end', maxWidth: '600px'}}>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Choose Your Date</label>
            <div style={{border: '1px solid #E5E7EB', borderRadius: '4px', padding: '0.5rem', backgroundColor: 'white'}}>
              <span style={{fontSize: '0.875rem', color: '#4B5563'}}>01-Jan-2026 - 12-Dec-2026</span>
            </div>
          </div>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Account</label>
            <select className={styles.select}>
              <option>Select</option>
            </select>
          </div>
          <button style={{backgroundColor: '#FF9F43', color: 'white', border: 'none', borderRadius: '4px', padding: '0.6rem 1.5rem', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', height: '42px'}}>Submit</button>
        </div>
      </Card>

      <Card className={styles.tableCard}>
        <div style={{padding: '1.5rem', borderBottom: '1px solid #E5E7EB'}}>
          <h2 style={{fontSize: '1.125rem', color: '#1B2850', margin: 0}}>Statement of Account : <span style={{color: '#FF9F43'}}>HBSC - 3298784309485</span></h2>
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
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {[
                { ref: '#AS842', date: '24 Dec 2024', cat: 'Sale', desc: 'Sale of goods', amount: '+$200', type: 'Credit', bal: '$4365' },
                { ref: '#AS821', date: '10 Dec 2024', cat: 'Refund', desc: 'Refund Issued', amount: '-$50', type: 'Debit', bal: '$4444' },
                { ref: '#AS847', date: '27 Nov 2024', cat: 'Purchase', desc: 'Inventory restocking', amount: '-$800', type: 'Debit', bal: '$65145' },
                { ref: '#AS874', date: '18 Nov 2024', cat: 'Sale', desc: 'Sale of goods', amount: '+$100', type: 'Credit', bal: '$1848' },
                { ref: '#AS887', date: '06 Nov 2024', cat: 'Purchase', desc: 'Inventory restocking', amount: '-$700', type: 'Debit', bal: '$986' },
                { ref: '#AS856', date: '25 Oct 2024', cat: 'Utility Payment', desc: 'Electricity Bill', amount: '-$1000', type: 'Debit', bal: '$15547' },
                { ref: '#AS822', date: '14 Oct 2024', cat: 'Equipment Purchase', desc: 'New POS terminal purchased', amount: '-$1200', type: 'Debit', bal: '$141645' },
                { ref: '#AS844', date: '03 Oct 2024', cat: 'Refund', desc: 'Refund Issued', amount: '-$750', type: 'Debit', bal: '$4356' },
                { ref: '#AS832', date: '20 Sep 2024', cat: 'Withdraw', desc: 'Withdraw by accountant', amount: '-$450', type: 'Debit', bal: '$614389' },
              ].map((item, i) => (
                <tr key={i}>
                  <td style={{color: '#6B7280'}}>{item.ref}</td>
                  <td style={{color: '#6B7280'}}>{item.date}</td>
                  <td style={{color: '#6B7280'}}>{item.cat}</td>
                  <td style={{color: '#6B7280'}}>{item.desc}</td>
                  <td style={{color: '#6B7280'}}>{item.amount}</td>
                  <td>
                    <span style={{
                      backgroundColor: item.type === 'Credit' ? '#28C76F' : '#EA5455', 
                      color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'
                    }}>&bull; {item.type}</span>
                  </td>
                  <td style={{color: '#6B7280'}}>{item.bal}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="6" style={{fontWeight: 'bold', padding: '1rem'}}>Total</td>
                <td style={{fontWeight: 'bold', color: '#1B2850', padding: '1rem'}}>$33268.53</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
      
    </DashboardLayout>
  );
};

export default AccountStatement;
