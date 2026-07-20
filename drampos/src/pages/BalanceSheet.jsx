import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { FileText, FileSpreadsheet, RefreshCw, ChevronUp } from 'lucide-react';

const BalanceSheet = () => {
  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
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

      <Card className={styles.tableCard}>
        <div className={styles.filterBar}>
          <div className={styles.searchBox}>
            <input type="text" placeholder="Search" />
          </div>
        </div>

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
                { name: 'Ava Mason', no: 'SWIZ - 3456565767787', credit: '$614848', debit: '-$450', bal: '$614389' },
                { name: 'Caspian Marigold', no: 'NBC - 4324356677889', credit: '$1686', debit: '-$700', bal: '$986' },
                { name: 'Emma James', no: 'NBC - 2343547586900', credit: '$16547', debit: '-$1000', bal: '$15547' },
                { name: 'Isabella Jackson', no: 'IBO - 3434565776768', credit: '$77818', debit: '-$300', bal: '$77518' },
                { name: 'Olivia Ethan', no: 'IBO - 3453647664889', credit: '$141845', debit: '-$1200', bal: '$141645' },
                { name: 'Orion Astrid', no: 'IBO - 4353689870544', credit: '$1948', debit: '-$100', bal: '$1848' },
                { name: 'Quillon Elysia', no: 'SWIZ - 5475878970090', credit: '$4494', debit: '-$50', bal: '$4444' },
                { name: 'Sophia Liam', no: 'SWIZ - 3354456565687', credit: '$44188', debit: '-$750', bal: '$4356' },
                { name: 'Thaddeus Juniper', no: 'SWIZ - 3255465758698', credit: '$65945', debit: '-$800', bal: '$65145' },
                { name: 'Zephyr Indira', no: 'HBSC - 3298784309485', credit: '$4565', debit: '-$200', bal: '$4365' },
              ].map((item, i) => (
                <tr key={i}>
                  <td style={{color: '#6B7280'}}>{item.name}</td>
                  <td style={{color: '#6B7280'}}>{item.no}</td>
                  <td style={{color: '#6B7280'}}>{item.credit}</td>
                  <td style={{color: '#6B7280'}}>{item.debit}</td>
                  <td style={{color: '#6B7280'}}>{item.bal}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="2" style={{fontWeight: 'bold', padding: '1rem'}}>Total</td>
                <td style={{fontWeight: 'bold', color: '#1B2850', padding: '1rem'}}>$332642.53</td>
                <td style={{fontWeight: 'bold', color: '#1B2850', padding: '1rem'}}>- $16590.96</td>
                <td style={{fontWeight: 'bold', color: '#1B2850', padding: '1rem'}}>$332687442.53</td>
              </tr>
            </tfoot>
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

export default BalanceSheet;
