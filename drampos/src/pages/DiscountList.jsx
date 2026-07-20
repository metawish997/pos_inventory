import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css'; // Reusing styles
import { Search, FileText, FileSpreadsheet, RefreshCw, ChevronUp, PlusCircle, Edit, Trash2 } from 'lucide-react';
import AddDiscountModal from '../components/modals/AddDiscountModal';

const DiscountList = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Discount</h1>
          <p className={styles.subtitle}>Manage your discount</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn}><FileText size={18} color="#EA5455" /></button>
          <button className={styles.iconBtn}><FileSpreadsheet size={18} color="#28C76F" /></button>
          <button className={styles.iconBtn}><RefreshCw size={18} /></button>
          <button className={styles.iconBtn}><ChevronUp size={18} /></button>
          <button className={styles.btnPrimary} onClick={() => setIsAddOpen(true)}>
            <PlusCircle size={18} /> Add Discount
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
                <th>Name</th>
                <th>Value</th>
                <th>Discount Plan</th>
                <th>Valididy</th>
                <th>Days</th>
                <th>Products</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Weekend Deal', value: '70 (Percentage)', plan: 'Standard', valid: '22 May 2026 - 24 Jun 2026', days: 'Sat, Sun', prod: 'All Products', status: 'Active' },
                { name: 'Loyalty Reward', value: '40 (Flat)', plan: 'Membership', valid: '16 Apr 2026 - 16 May 2026', days: 'Mon, Tue, Thu, Fri', prod: 'Specific Products', status: 'Active' },
                { name: 'Flash Sale', value: '60 (Percentage)', plan: 'Standard', valid: '20 Mar 2026 - 20 Apr 2026', days: 'Thu, Fri, Sat, Sun', prod: 'All Products', status: 'Active' },
                { name: 'Super Saver', value: '80 (Percentage)', plan: 'Standard', valid: '15 Feb 2026 - 15 Apr 2026', days: 'Mon, Tue, Wed', prod: 'All Products', status: 'Active' },
                { name: 'Surprise Savings', value: '50 (Flat)', plan: 'Standard', valid: '24 Jan 2026 - 24 Mar 2026', days: 'Mon, Thu, Sat', prod: 'Specific Products', status: 'Active' },
              ].map((item, i) => (
                <tr key={i}>
                  <td><input type="checkbox" /></td>
                  <td style={{color: '#1B2850', fontWeight: 500}}>{item.name}</td>
                  <td>{item.value}</td>
                  <td>{item.plan}</td>
                  <td>{item.valid}</td>
                  <td>{item.days}</td>
                  <td>{item.prod}</td>
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
      
      <AddDiscountModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </DashboardLayout>
  );
};

export default DiscountList;
