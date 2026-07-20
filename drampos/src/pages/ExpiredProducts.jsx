import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css'; // Reusing styles
import { Search, FileText, FileSpreadsheet, RefreshCw, ChevronUp, Edit, Trash2 } from 'lucide-react';

const ExpiredProducts = () => {
  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Expired Products</h1>
          <p className={styles.subtitle}>Manage your expired products</p>
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
            <select className={styles.select}>
              <option>Product</option>
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
                <th>SKU</th>
                <th>Product</th>
                <th>Manufactured Date</th>
                <th>Expired Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { sku: 'PT001', name: 'Lenovo 3rd Generation', mfg: '24 Dec 2024', exp: '20 Dec 2026' },
                { sku: 'PT002', name: 'Beats Pro', mfg: '10 Dec 2024', exp: '07 Dec 2026' },
                { sku: 'PT003', name: 'Nike Jordan', mfg: '27 Nov 2024', exp: '20 Nov 2026' },
                { sku: 'PT004', name: 'Apple Series 5 Watch', mfg: '18 Nov 2024', exp: '15 Nov 2026' },
                { sku: 'PT005', name: 'Amazon Echo Dot', mfg: '06 Nov 2024', exp: '04 Nov 2026' },
              ].map((item, i) => (
                <tr key={i}>
                  <td><input type="checkbox" /></td>
                  <td>{item.sku}</td>
                  <td>
                    <div className={styles.productCell}>
                      <div className={styles.productImg} style={{width: '32px', height: '32px', minWidth: '32px'}}></div>
                      <span>{item.name}</span>
                    </div>
                  </td>
                  <td>{item.mfg}</td>
                  <td>{item.exp}</td>
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

export default ExpiredProducts;
