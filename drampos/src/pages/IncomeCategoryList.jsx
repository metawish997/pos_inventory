import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css'; // Reusing styles
import { Search, FileText, FileSpreadsheet, RefreshCw, ChevronUp, Edit, Trash2 } from 'lucide-react';
import AddIncomeCategoryModal from '../components/modals/AddIncomeCategoryModal';
import EditIncomeCategoryModal from '../components/modals/EditIncomeCategoryModal';

const IncomeCategoryList = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Income Category</h1>
          <p className={styles.subtitle}>Manage your income category</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn}><FileText size={18} color="#EA5455" /></button>
          <button className={styles.iconBtn}><FileSpreadsheet size={18} color="#28C76F" /></button>
          <button className={styles.iconBtn}><RefreshCw size={18} /></button>
          <button className={styles.iconBtn}><ChevronUp size={18} /></button>
          <button className={styles.btnPrimary} onClick={() => setIsAddOpen(true)}>
            + Add New
          </button>
        </div>
      </div>

      <Card className={styles.tableCard}>
        <div className={styles.filterBar}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input type="text" placeholder="Search" />
          </div>
          <div className={styles.filters}>
            <select className={styles.select}>
              <option>Category</option>
            </select>
            <select className={styles.select}>
              <option>Status</option>
            </select>
            <select className={styles.select}>
              <option>Sort By : Last 7 Days</option>
            </select>
          </div>
        </div>

        <div className={styles.tableResponsive}>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>Code</th>
                <th>Category</th>
                <th>Added Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { code: 'INCAB49', category: 'Foreign investment', date: '24 Dec 2024' },
                { code: 'INCAB48', category: 'Product Export', date: '10 Dec 2024' },
                { code: 'INCAB47', category: 'Installation', date: '27 Nov 2024' },
                { code: 'INCAB46', category: 'Product Sales', date: '18 Nov 2024' },
                { code: 'INCAB45', category: 'Local Sale', date: '06 Nov 2024' },
                { code: 'INCAB44', category: 'Service Fees', date: '25 Oct 2024' },
                { code: 'INCAB43', category: 'Return/Refund Income', date: '14 Oct 2024' },
                { code: 'INCAB42', category: 'Foreign investment', date: '03 Oct 2024' },
                { code: 'INCAB41', category: 'Product Export', date: '20 Sep 2024' },
                { code: 'INCAB40', category: 'Return/Refund Income', date: '10 Sep 2024' },
              ].map((item, i) => (
                <tr key={i}>
                  <td><input type="checkbox" /></td>
                  <td>{item.code}</td>
                  <td style={{color: '#6B7280'}}>{item.category}</td>
                  <td>{item.date}</td>
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
      
      <AddIncomeCategoryModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
      <EditIncomeCategoryModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />
    </DashboardLayout>
  );
};

export default IncomeCategoryList;
