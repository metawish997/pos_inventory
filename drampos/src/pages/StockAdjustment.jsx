import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css'; // Reusing styles
import { Search, FileText, FileSpreadsheet, RefreshCw, ChevronUp, Edit, Trash2, PlusCircle } from 'lucide-react';
import AddAdjustmentModal from '../components/modals/AddAdjustmentModal';

const StockAdjustment = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Stock Adjustment</h1>
          <p className={styles.subtitle}>Manage your stock adjustment</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn}><FileText size={18} color="#EA5455" /></button>
          <button className={styles.iconBtn}><FileSpreadsheet size={18} color="#28C76F" /></button>
          <button className={styles.iconBtn}><RefreshCw size={18} /></button>
          <button className={styles.iconBtn}><ChevronUp size={18} /></button>
          <button className={styles.btnPrimary} onClick={() => setIsModalOpen(true)}>
            <PlusCircle size={18} /> Add Adjustment
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
              <option>Warehouse</option>
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
                <th>Warehouse</th>
                <th>Store</th>
                <th>Product</th>
                <th>Date</th>
                <th>Person</th>
                <th>Qty</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { wh: 'Lavish Warehouse', store: 'Electro Mart', name: 'Lenovo IdeaPad 3', date: '24 Dec 2024', person: 'James Kirwin', qty: '100' },
                { wh: 'Quaint Warehouse', store: 'Quantum Gadgets', name: 'Beats Pro', date: '10 Dec 2024', person: 'Francis Chang', qty: '140' },
                { wh: 'Overflow Warehouse', store: 'Prime Bazaar', name: 'Nike Jordan', date: '25 Jul 2023', person: 'Antonio Engle', qty: '120' },
                { wh: 'Quaint Warehouse', store: 'Gadget World', name: 'Apple Series 5 Watch', date: '28 Jul 2023', person: 'Leo Kelly', qty: '130' },
                { wh: 'Traditional Warehouse', store: 'Volt Vault', name: 'Amazon Echo Dot', date: '24 Jul 2023', person: 'Annette Walker', qty: '140' },
                { wh: 'Cool Warehouse', store: 'Elite Retail', name: 'Lobar Handy', date: '15 Jul 2023', person: 'John Weaver', qty: '150' },
                { wh: 'Retail Supply Hub', store: 'Prime Mart', name: 'Red Premium Satchel', date: '14 Oct 2024', person: 'Gary Hennessy', qty: '700' },
              ].map((item, i) => (
                <tr key={i}>
                  <td><input type="checkbox" /></td>
                  <td>{item.wh}</td>
                  <td>{item.store}</td>
                  <td>
                    <div className={styles.productCell}>
                      <div className={styles.productImg} style={{width: '32px', height: '32px', minWidth: '32px'}}></div>
                      <span>{item.name}</span>
                    </div>
                  </td>
                  <td>{item.date}</td>
                  <td>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                      <div style={{width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#F3F4F6'}}></div>
                      <span style={{fontSize: '0.875rem', color: '#1B2850', fontWeight: 500}}>{item.person}</span>
                    </div>
                  </td>
                  <td>{item.qty}</td>
                  <td>
                    <div className={styles.actionCell}>
                      <button className={styles.actionBtn}><FileText size={16} /></button>
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

      <AddAdjustmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </DashboardLayout>
  );
};

export default StockAdjustment;
