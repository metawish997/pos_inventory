import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { FileText, FileSpreadsheet, RefreshCw, ChevronUp } from 'lucide-react';

const CashFlow = () => {
  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Cash Flow</h1>
          <p className={styles.subtitle}>View Your Cashflows</p>
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
          <div className={styles.filters}>
            <select className={styles.select}>
              <option>Payment Method</option>
            </select>
          </div>
        </div>

        <div className={styles.tableResponsive}>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Bank & Account Number</th>
                <th>Description</th>
                <th>Credit</th>
                <th>Debit</th>
                <th>Account balance <span style={{fontSize: '10px', color: '#1B2850', backgroundColor: '#E5E7EB', padding: '0 4px', borderRadius: '50%'}}>i</span></th>
                <th>Total Balance <span style={{fontSize: '10px', color: '#1B2850', backgroundColor: '#E5E7EB', padding: '0 4px', borderRadius: '50%'}}>i</span></th>
                <th>Payment Method</th>
              </tr>
            </thead>
            <tbody>
              {[
                { date: '03 Oct 2024', no: 'SWIZ - 3354456565687', desc: 'Cash payments for operating', credit: '$1100', debit: '$0.00', accBal: '$1100', totBal: '$5899', pay: 'Stripe' },
                { date: '06 Nov 2024', no: 'NBC - 4324356677889', desc: 'Loan received (short-term)', credit: '$800', debit: '$0.00', accBal: '$800', totBal: '$6896', pay: 'Cash' },
                { date: '10 Dec 2024', no: 'SWIZ - 5475878970090', desc: 'Cash payments to employees', credit: '$0.00', debit: '$1500', accBal: '$1500', totBal: '$9899', pay: 'Paypal' },
                { date: '10 Sep 2024', no: 'IBO - 3434565776768', desc: 'Cash receipts from sales', credit: '$1700', debit: '$0.00', accBal: '$1700', totBal: '$4568', pay: 'Cash' },
                { date: '14 Oct 2024', no: 'IBO - 3453647664889', desc: 'Owner\'s equity contribution', credit: '$1300', debit: '$0.00', accBal: '$1300', totBal: '$4568', pay: 'Paypal' },
                { date: '18 Nov 2024', no: 'IBO - 4353689870544', desc: 'Sale of old equipment', credit: '$1000', debit: '$1000', accBal: '$1000', totBal: '$1562', pay: 'Paypal' },
                { date: '20 Sep 2024', no: 'SWIZ - 3456565767787', desc: 'Cash payments to suppliers', credit: '$2300', debit: '$0.00', accBal: '$2300', totBal: '$4568', pay: 'Stripe' },
                { date: '24 Dec 2024', no: 'HBSC - 3298784309485', desc: 'Cash receipts from sales', credit: '$1000', debit: '$0.00', accBal: '$1000', totBal: '$889898', pay: 'Stripe' },
                { date: '25 Oct 2024', no: 'NBC - 2343547586900', desc: 'Repayment of long-term loan', credit: '$0.00', debit: '$750', accBal: '$0.00', totBal: '$8963', pay: 'Cash' },
                { date: '27 Nov 2024', no: 'SWIZ - 3255465758698', desc: 'Purchase of POS equipment', credit: '$1800', debit: '$0.00', accBal: '$1800', totBal: '$35656', pay: 'Cash' },
              ].map((item, i) => (
                <tr key={i}>
                  <td style={{color: '#6B7280'}}>{item.date}</td>
                  <td style={{color: '#6B7280'}}>{item.no}</td>
                  <td style={{color: '#6B7280'}}>{item.desc}</td>
                  <td style={{color: '#6B7280'}}>{item.credit}</td>
                  <td style={{color: '#6B7280'}}>{item.debit}</td>
                  <td style={{color: '#6B7280'}}>{item.accBal}</td>
                  <td style={{color: '#6B7280'}}>{item.totBal}</td>
                  <td style={{color: '#6B7280'}}>{item.pay}</td>
                </tr>
              ))}
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

export default CashFlow;
