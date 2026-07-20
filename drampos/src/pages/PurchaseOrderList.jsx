import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css'; // Reusing styles
import { Search, FileText, FileSpreadsheet, RefreshCw, ChevronUp } from 'lucide-react';

const PurchaseOrderList = () => {
  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Purchase order</h1>
          <p className={styles.subtitle}>Manage your Purchase order</p>
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
              <option>Sort By : Last 7 Days</option>
            </select>
          </div>
        </div>

        <div className={styles.tableResponsive}>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>Product</th>
                <th>Purchased Amount</th>
                <th>Purchased QTY</th>
                <th>Instock QTY</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Lenovo IdeaPad 3', amount: '$1000', pQty: '40', iQty: '30' },
                { name: 'Beats Pro', amount: '$1500', pQty: '25', iQty: '18' },
                { name: 'Nike Jordan', amount: '$1500', pQty: '30', iQty: '35' },
                { name: 'Apple Series 5 Watch', amount: '$2000', pQty: '28', iQty: '30' },
                { name: 'Amazon Echo Dot', amount: '$800', pQty: '15', iQty: '10' },
                { name: 'Sanford Chair Sofa', amount: '$750', pQty: '20', iQty: '15' },
                { name: 'Red Premium Satchel', amount: '$1300', pQty: '35', iQty: '40' },
                { name: 'Iphone 14 Pro', amount: '$1100', pQty: '45', iQty: '35' },
                { name: 'Gaming Chair', amount: '$2300', pQty: '22', iQty: '20' },
                { name: 'Borealis Backpack', amount: '$1700', pQty: '18', iQty: '25' },
              ].map((item, i) => (
                <tr key={i}>
                  <td><input type="checkbox" /></td>
                  <td style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1B2850', fontWeight: 500}}>
                     <div style={{width: '24px', height: '24px', backgroundColor: '#F3F4F6', borderRadius: '4px'}}></div>
                     {item.name}
                  </td>
                  <td>{item.amount}</td>
                  <td>{item.pQty}</td>
                  <td>{item.iQty}</td>
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

export default PurchaseOrderList;
