import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css'; // Reusing styles
import { Search, FileText, FileSpreadsheet, RefreshCw, ChevronUp, PlusCircle, Edit, Trash2 } from 'lucide-react';
import AddCouponModal from '../components/modals/AddCouponModal';
import EditCouponModal from '../components/modals/EditCouponModal';

const CouponsList = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return <span style={{backgroundColor: '#28C76F', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'}}>{status}</span>;
      case 'Inactive':
        return <span style={{backgroundColor: '#EA5455', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'}}>{status}</span>;
      default:
        return <span>{status}</span>;
    }
  };

  const getCodeBadge = (code) => {
    return <span style={{backgroundColor: '#F3E8FF', color: '#A855F7', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 500}}>{code}</span>;
  }

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Coupons</h1>
          <p className={styles.subtitle}>Manage Your Coupons</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn}><FileText size={18} color="#EA5455" /></button>
          <button className={styles.iconBtn}><FileSpreadsheet size={18} color="#28C76F" /></button>
          <button className={styles.iconBtn}><RefreshCw size={18} /></button>
          <button className={styles.iconBtn}><ChevronUp size={18} /></button>
          <button className={styles.btnPrimary} onClick={() => setIsAddOpen(true)}>
            <PlusCircle size={18} /> Add Coupons
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
              <option>Type</option>
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
                <th>Name</th>
                <th>Code</th>
                <th>Description</th>
                <th>Type</th>
                <th>Discount</th>
                <th>Limit</th>
                <th>Valid</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'New Year Blast', code: 'NEWYEAR30', desc: '30% off on New Year', type: 'Percentage', discount: '30%', limit: '01', valid: '04 Jan 2026', status: 'Active' },
                { name: 'Christmas Cheer', code: 'CHRISTMAS100', desc: '$100 off holiday packages', type: 'Fixed Amount', discount: '$100', limit: '01', valid: '27 Dec 2024', status: 'Active' },
                { name: 'Spooky Savings', code: 'HALLOWEEN20', desc: '20% off on Halloween items', type: 'Percentage', discount: '20%', limit: '02', valid: '28 Nov 2024', status: 'Active' },
                { name: 'Black Friday', code: 'BLACKFRIDAY50', desc: '50% off electronics', type: 'Percentage', discount: '50%', limit: '04', valid: '18 Nov 2024', status: 'Inactive' },
                { name: 'Golden Years Deal', code: 'SENIOR20', desc: '20% off for senior citizens', type: 'Percentage', discount: '20%', limit: '03', valid: '06 Nov 2024', status: 'Active' },
                { name: 'Thanksgiving Special', code: 'THANKS10', desc: '10% off for Thanksgiving', type: 'Percentage', discount: '10%', limit: '01', valid: '31 Oct 2024', status: 'Active' },
                { name: 'New Year Blast', code: 'STUDENT10', desc: '10% off for students', type: 'Percentage', discount: '10%', limit: '02', valid: '14 Oct 2024', status: 'Active' },
                { name: 'Big Saver Deal', code: 'SAVE50', desc: '$50 off orders over $300', type: 'Fixed Amount', discount: '$50', limit: '03', valid: '03 Oct 2024', status: 'Inactive' },
                { name: 'Weekend Exclusive', code: 'WEEKENDSALE', desc: 'Exclusive15% off on weekends', type: 'Percentage', discount: '15%', limit: '04', valid: '29 Sep 2024', status: 'Active' },
                { name: 'Welcome Delight', code: 'WELCOME10', desc: '10% off for first-time users', type: 'Percentage', discount: '10%', limit: '01', valid: '10 Sep 2024', status: 'Active' },
              ].map((item, i) => (
                <tr key={i}>
                  <td><input type="checkbox" /></td>
                  <td style={{color: '#1B2850', fontWeight: 500}}>{item.name}</td>
                  <td>{getCodeBadge(item.code)}</td>
                  <td>{item.desc}</td>
                  <td>{item.type}</td>
                  <td style={{fontWeight: 500, color: '#1B2850'}}>{item.discount}</td>
                  <td>{item.limit}</td>
                  <td>{item.valid}</td>
                  <td>{getStatusBadge(item.status)}</td>
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
              <button className={styles.pageBtn} style={{backgroundColor: '#F3F4F6', border: 'none', color: '#1B2850'}}>2</button>
              <button className={styles.pageBtn}>&gt;</button>
           </div>
        </div>
      </Card>

      <AddCouponModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
      <EditCouponModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />
    </DashboardLayout>
  );
};

export default CouponsList;
