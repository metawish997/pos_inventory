import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { FileText, FileSpreadsheet, RefreshCw, ChevronUp, Edit, Trash2 } from 'lucide-react';

const MoneyTransferList = () => {
  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Money Transfer</h1>
          <p className={styles.subtitle}>Manage Money Transfer List</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn}><FileText size={18} color="#EA5455" /></button>
          <button className={styles.iconBtn}><FileSpreadsheet size={18} color="#28C76F" /></button>
          <button className={styles.iconBtn}><RefreshCw size={18} /></button>
          <button className={styles.iconBtn}><ChevronUp size={18} /></button>
          <button className={styles.btnPrimary}>
            + Add Money Transfer
          </button>
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
                <th><input type="checkbox" /></th>
                <th>Date</th>
                <th>Reference Number</th>
                <th>From Account</th>
                <th>To Account</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { date: '24 Dec 2024', ref: '#MTB42', from: '3298784309485', to: '4598489498498', amount: '$200' },
                { date: '10 Dec 2024', ref: '#MTB21', from: '5475878970090', to: '4494048448994', amount: '$50' },
                { date: '27 Nov 2024', ref: '#MTB47', from: '3255465758698', to: '6599481186468', amount: '$800' },
                { date: '18 Nov 2024', ref: '#MTB74', from: '4353689870544', to: '1948948498149', amount: '$100' },
                { date: '06 Nov 2024', ref: '#MTB87', from: '4324356677889', to: '1686941868478', amount: '$700' },
                { date: '25 Oct 2024', ref: '#MTB56', from: '2343547586900', to: '1658179744894', amount: '$1000' },
                { date: '14 Oct 2024', ref: '#MTB22', from: '3453647664889', to: '1418454896454', amount: '$1200' },
                { date: '03 Oct 2024', ref: '#MTB44', from: '3354456565687', to: '4418848484848', amount: '$750' },
                { date: '20 Sep 2024', ref: '#MTB32', from: '3456565767787', to: '6148484454564', amount: '$450' },
                { date: '10 Sep 2024', ref: '#MTB55', from: '3434565776768', to: '7781848484894', amount: '$300' },
              ].map((item, i) => (
                <tr key={i}>
                  <td><input type="checkbox" /></td>
                  <td>{item.date}</td>
                  <td style={{color: '#1B2850'}}>{item.ref}</td>
                  <td style={{color: '#6B7280'}}>{item.from}</td>
                  <td style={{color: '#6B7280'}}>{item.to}</td>
                  <td>{item.amount}</td>
                  <td>
                    <div className={styles.actionCell}>
                      <button className={styles.actionBtn}><Edit size={16} /></button>
                      <button className={`${styles.actionBtn} ${styles.danger}`}><Trash2 size={16} /></button>
                    </div>
                  </td>
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

export default MoneyTransferList;
