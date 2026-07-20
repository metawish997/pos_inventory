import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css'; // Reusing styles
import { Search, FileText, FileSpreadsheet, RefreshCw, ChevronUp, Edit, Trash2 } from 'lucide-react';
import AddExpenseCategoryModal from '../components/modals/AddExpenseCategoryModal';
import EditExpenseCategoryModal from '../components/modals/EditExpenseCategoryModal';

const ExpenseCategoryList = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Expense Category</h1>
          <p className={styles.subtitle}>Manage your expense categories</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn}><FileText size={18} color="#EA5455" /></button>
          <button className={styles.iconBtn}><FileSpreadsheet size={18} color="#28C76F" /></button>
          <button className={styles.iconBtn}><RefreshCw size={18} /></button>
          <button className={styles.iconBtn}><ChevronUp size={18} /></button>
          <button className={styles.btnPrimary} onClick={() => setIsAddOpen(true)}>
            + Add Expense Category
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
              <option>Status</option>
            </select>
          </div>
        </div>

        <div className={styles.tableResponsive}>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>Category</th>
                <th>Description</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { category: 'Utilities', desc: 'Bills for electricity, water, gas, and internet' },
                { category: 'Office Supplies', desc: 'Items like stationery, chairs, and printers' },
                { category: 'Repairs & Maintenance', desc: 'Expenses for repairs and equipment maintenance' },
                { category: 'Marketing', desc: 'Promotional and advertising costs' },
                { category: 'Travel Expenses', desc: 'Travel and transport-related costs' },
                { category: 'Employee Benefits', desc: 'Perks and benefits provided to employees' },
                { category: 'Vehicle Maintenance', desc: 'Fuel, repairs, and maintenance of vehicles' },
                { category: 'Rent', desc: 'Office or building rental payments' },
                { category: 'Subscriptions', desc: 'Costs for tools or software licenses' },
                { category: 'Miscellaneous', desc: 'Unplanned or uncategorized expenses' },
              ].map((item, i) => (
                <tr key={i}>
                  <td><input type="checkbox" /></td>
                  <td style={{color: '#1B2850', fontWeight: 500}}>{item.category}</td>
                  <td style={{color: '#6B7280'}}>{item.desc}</td>
                  <td>
                    <span style={{backgroundColor: '#28C76F', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'}}>Active</span>
                  </td>
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
      
      <AddExpenseCategoryModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
      <EditExpenseCategoryModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />
    </DashboardLayout>
  );
};

export default ExpenseCategoryList;
