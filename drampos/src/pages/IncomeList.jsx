import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css'; // Reusing styles
import { Search, FileText, FileSpreadsheet, RefreshCw, ChevronUp, Edit, Trash2 } from 'lucide-react';
import EditIncomeModal from '../components/modals/EditIncomeModal';

const IncomeList = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Income</h1>
          <p className={styles.subtitle}>View Your Income</p>
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
            <Search size={18} className={styles.searchIcon} />
            <input type="text" placeholder="Search" />
          </div>
          <div className={styles.filters}>
            <div style={{display: 'flex', alignItems: 'center', border: '1px solid #E5E7EB', borderRadius: '4px', padding: '0.5rem', backgroundColor: 'white'}}>
              <span style={{fontSize: '0.875rem', color: '#4B5563'}}>01-Jan-2026 - 12-Dec-2026</span>
            </div>
            <select className={styles.select}>
              <option>Select Store</option>
            </select>
          </div>
        </div>

        <div className={styles.tableResponsive}>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>Date</th>
                <th>Reference</th>
                <th>Store</th>
                <th>Category</th>
                <th>Notes</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { date: '24 Dec 2024', ref: 'IN849', store: 'Distribution center', category: 'Foreign investment', notes: 'Categorize income derived', amount: '$200' },
                { date: '10 Dec 2024', ref: 'IN848', store: 'Intelligent warehouse', category: 'Product Export', notes: 'Services that have been verified', amount: '$50' },
                { date: '27 Nov 2024', ref: 'IN847', store: 'Mahin Logistics', category: 'Installation', notes: 'POS Installation for Store', amount: '$800' },
                { date: '06 Nov 2024', ref: 'IN845', store: 'Bonded warehouse', category: 'Local Sale', notes: 'Travel fare for client meeting', amount: '$700' },
                { date: '25 Oct 2024', ref: 'IN844', store: 'Budget warehouse', category: 'Service Fees', notes: 'Services that have been verified', amount: '$1000' },
                { date: '14 Oct 2024', ref: 'IN843', store: 'Gati Limited', category: 'Return/Refund Income', notes: 'Flight tickets for meetings', amount: '$1200' },
                { date: '03 Oct 2024', ref: 'IN842', store: 'Storeroom Halls', category: 'Foreign investment', notes: 'Services that have been verified', amount: '$750' },
                { date: '20 Sep 2024', ref: 'IN841', store: 'Strongbox', category: 'Product Export', notes: 'Categorize income derived in office', amount: '$450' },
                { date: '10 Sep 2024', ref: 'IN840', store: 'Total Quality Logistics', category: 'Return/Refund Income', notes: 'Services that have been verified', amount: '$300' },
              ].map((item, i) => (
                <tr key={i}>
                  <td><input type="checkbox" /></td>
                  <td>{item.date}</td>
                  <td>{item.ref}</td>
                  <td style={{color: '#1B2850', fontWeight: 500}}>{item.store}</td>
                  <td style={{color: '#6B7280'}}>{item.category}</td>
                  <td style={{color: '#6B7280'}}>{item.notes}</td>
                  <td>{item.amount}</td>
                  <td>
                    <div className={styles.actionCell}>
                      <button className={styles.actionBtn} onClick={() => setIsEditOpen(true)}><Edit size={16} /></button>
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
      
      <EditIncomeModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />
    </DashboardLayout>
  );
};

export default IncomeList;
