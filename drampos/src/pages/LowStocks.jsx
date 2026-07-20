import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css'; // Reusing styles
import { Search, FileText, FileSpreadsheet, RefreshCw, ChevronUp, Edit, Trash2, Mail } from 'lucide-react';

const LowStocks = () => {
  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Low Stocks</h1>
          <p className={styles.subtitle}>Manage your low stocks</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn}><FileText size={18} color="#EA5455" /></button>
          <button className={styles.iconBtn}><FileSpreadsheet size={18} color="#28C76F" /></button>
          <button className={styles.iconBtn}><RefreshCw size={18} /></button>
          <button className={styles.iconBtn}><ChevronUp size={18} /></button>
          <button className={styles.btnDark}><Mail size={18} /> Send Email</button>
        </div>
      </div>

      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
        <div style={{display: 'flex', gap: '0.5rem'}}>
           <button style={{backgroundColor: '#FF9F43', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer'}}>Low Stocks</button>
           <button style={{backgroundColor: '#E5E7EB', color: '#4B5563', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer'}}>Out of Stocks</button>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'white', border: '1px solid #E5E7EB', padding: '0.25rem 0.75rem', borderRadius: '20px'}}>
           <div style={{width: '32px', height: '16px', backgroundColor: '#28C76F', borderRadius: '8px', position: 'relative', cursor: 'pointer'}}>
              <div style={{width: '12px', height: '12px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '2px', right: '2px'}}></div>
           </div>
           <span style={{fontWeight: 600, fontSize: '0.875rem', color: '#1B2850'}}>Notify</span>
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
              <option>Store</option>
            </select>
            <select className={styles.select}>
              <option>Category</option>
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
                <th>Product Name</th>
                <th>Category</th>
                <th>SKU</th>
                <th>Qty</th>
                <th>Qty Alert</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { wh: 'Lavish Warehouse', store: 'Electro Mart', name: 'Lenovo IdeaPad 3', cat: 'Computers', sku: 'PT001', qty: '20', alert: '15' },
                { wh: 'Quaint Warehouse', store: 'Quantum Gadgets', name: 'Beats Pro', cat: 'Electronics', sku: 'PT002', qty: '25', alert: '20' },
                { wh: 'Traditional Warehouse', store: 'Prime Bazaar', name: 'Nike Jordan', cat: 'Shoe', sku: 'PT003', qty: '40', alert: '35' },
                { wh: 'Cool Warehouse', store: 'Gadget World', name: 'Apple Series 5 Watch', cat: 'Electronics', sku: 'PT004', qty: '50', alert: '45' },
                { wh: 'Overflow Warehouse', store: 'Volt Vault', name: 'Amazon Echo Dot', cat: 'Electronics', sku: 'PT005', qty: '30', alert: '25' },
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
                  <td>{item.cat}</td>
                  <td>{item.sku}</td>
                  <td>{item.qty}</td>
                  <td>{item.alert}</td>
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

export default LowStocks;
