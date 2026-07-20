import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css'; // Reusing styles
import { Search, FileText, FileSpreadsheet, RefreshCw, ChevronUp, PlusCircle, Edit, Trash2 } from 'lucide-react';
import AddDiscountPlanModal from '../components/modals/AddDiscountPlanModal';

const DiscountPlanList = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Discount Plan</h1>
          <p className={styles.subtitle}>Manage your discount plans</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn}><FileText size={18} color="#EA5455" /></button>
          <button className={styles.iconBtn}><FileSpreadsheet size={18} color="#28C76F" /></button>
          <button className={styles.iconBtn}><RefreshCw size={18} /></button>
          <button className={styles.iconBtn}><ChevronUp size={18} /></button>
          <button className={styles.btnPrimary} onClick={() => setIsAddOpen(true)}>
            <PlusCircle size={18} /> Add Discount Plan
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
              <option>Customer</option>
            </select>
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
                <th>Plan Name</th>
                <th>Customers</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Standard Plan', customers: 'All Customers', status: 'Active' },
                { name: 'Membership Plan', customers: 'Members Only', status: 'Active' },
                { name: 'Premium Plan', customers: 'High-Spending Customers', status: 'Active' },
                { name: 'Seasonal Plan', customers: 'All Customers', status: 'Active' },
                { name: 'Student Plan', customers: 'Students', status: 'Active' },
                { name: 'Free Shipping Plan', customers: 'Online Customers', status: 'Active' },
                { name: 'Celebration Plan', customers: 'All Customers', status: 'Active' },
              ].map((item, i) => (
                <tr key={i}>
                  <td><input type="checkbox" /></td>
                  <td style={{color: '#1B2850', fontWeight: 500}}>{item.name}</td>
                  <td>{item.customers}</td>
                  <td>
                    <span style={{backgroundColor: '#28C76F', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'}}>{item.status}</span>
                  </td>
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
      </Card>
      
      <AddDiscountPlanModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </DashboardLayout>
  );
};

export default DiscountPlanList;
