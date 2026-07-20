import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { FileText, FileSpreadsheet, RefreshCw, ChevronUp, Printer } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const InventoryReport = () => {
  const location = useLocation();
  
  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <div style={{display: 'flex', gap: '0.5rem', marginBottom: '1rem'}}>
            <Link to="/inventory-report" style={{padding: '0.5rem 1rem', backgroundColor: location.pathname === '/inventory-report' ? '#FF9F43' : '#E5E7EB', color: location.pathname === '/inventory-report' ? 'white' : '#6B7280', textDecoration: 'none', borderRadius: '4px', fontSize: '0.875rem', fontWeight: 500}}>Inventory Report</Link>
            <Link to="/stock-history" style={{padding: '0.5rem 1rem', backgroundColor: location.pathname === '/stock-history' ? '#FF9F43' : '#E5E7EB', color: location.pathname === '/stock-history' ? 'white' : '#6B7280', textDecoration: 'none', borderRadius: '4px', fontSize: '0.875rem', fontWeight: 500}}>Stock History</Link>
            <Link to="/sold-stock" style={{padding: '0.5rem 1rem', backgroundColor: location.pathname === '/sold-stock' ? '#FF9F43' : '#E5E7EB', color: location.pathname === '/sold-stock' ? 'white' : '#6B7280', textDecoration: 'none', borderRadius: '4px', fontSize: '0.875rem', fontWeight: 500}}>Sold Stock</Link>
          </div>
          <h1 className={styles.title}>Balance Sheet</h1>
          <p className={styles.subtitle}>View Your Balance Sheet</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn}><FileText size={18} color="#EA5455" /></button>
          <button className={styles.iconBtn}><FileSpreadsheet size={18} color="#28C76F" /></button>
          <button className={styles.iconBtn}><RefreshCw size={18} /></button>
          <button className={styles.iconBtn}><ChevronUp size={18} /></button>
        </div>
      </div>

      <Card className={styles.tableCard} style={{marginTop: '1.5rem'}}>
        <div className={styles.tableResponsive}>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Bank & Account Number</th>
                <th>Credit</th>
                <th>Debit</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Ava Mason', bank: 'SWIZ - 3456565767787', credit: '$614848', debit: '-$450', balance: '$614389' },
                { name: 'Caspian Marigold', bank: 'NBC - 4324356677889', credit: '$1686', debit: '-$700', balance: '$986' },
                { name: 'Emma James', bank: 'NBC - 2343547586900', credit: '$16547', debit: '-$1000', balance: '$15547' },
                { name: 'Isabella Jackson', bank: 'IBO - 3434565776768', credit: '$77818', debit: '-$300', balance: '$77518' },
                { name: 'Olivia Ethan', bank: 'IBO - 3453647664889', credit: '$141845', debit: '-$1200', balance: '$141645' },
                { name: 'Orion Astrid', bank: 'IBO - 4353689870544', credit: '$1948', debit: '-$100', balance: '$1848' },
                { name: 'Quillon Elysia', bank: 'SWIZ - 5475878970090', credit: '$4494', debit: '-$50', balance: '$4444' },
                { name: 'Sophia Liam', bank: 'SWIZ - 3354456565687', credit: '$44188', debit: '-$750', balance: '$4356' },
                { name: 'Thaddeus Juniper', bank: 'SWIZ - 3255465758698', credit: '$65945', debit: '-$800', balance: '$65145' },
                { name: 'Zephyr Indira', bank: 'HBSC - 3298784309485', credit: '$4565', debit: '-$200', balance: '$4365' },
              ].map((item, i) => (
                <tr key={i}>
                  <td style={{color: '#6B7280'}}>{item.name}</td>
                  <td style={{color: '#6B7280'}}>{item.bank}</td>
                  <td style={{color: '#6B7280'}}>{item.credit}</td>
                  <td style={{color: '#6B7280'}}>{item.debit}</td>
                  <td style={{color: '#6B7280'}}>{item.balance}</td>
                </tr>
              ))}
              <tr style={{borderTop: '2px solid #E5E7EB', fontWeight: 600}}>
                 <td colSpan="2" style={{color: '#1B2850'}}>Total</td>
                 <td style={{color: '#1B2850'}}>$332642.53</td>
                 <td style={{color: '#1B2850'}}>- $16590.96</td>
                 <td style={{color: '#1B2850'}}>$332687442.53</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className={styles.pagination}>
           <div className={styles.pageInfo}>
              Row Per Page <select style={{margin: '0 0.5rem', padding: '0.25rem', border: '1px solid #e5e7eb', borderRadius: '4px'}}><option>10</option></select> Entries
           </div>
           <div className={styles.pageControls}>
              <button className={styles.pageBtn}>&lt;</button>
              <button className={`${styles.pageBtn} ${styles.activePage}`} style={{backgroundColor: '#FF9F43', color: 'white', border: 'none'}}>1</button>
              <button className={styles.pageBtn}>&gt;</button>
           </div>
        </div>
      </Card>
      
    </DashboardLayout>
  );
};

export default InventoryReport;
