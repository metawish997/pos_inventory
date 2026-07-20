import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css'; // Reusing styles
import { Search, FileText, FileSpreadsheet, RefreshCw, ChevronUp, Edit, Trash2, PlusCircle, Download } from 'lucide-react';
import AddTransferModal from '../components/modals/AddTransferModal';

const StockTransfer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Stock Transfer</h1>
          <p className={styles.subtitle}>Manage your stock transfer</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn}><FileText size={18} color="#EA5455" /></button>
          <button className={styles.iconBtn}><FileSpreadsheet size={18} color="#28C76F" /></button>
          <button className={styles.iconBtn}><RefreshCw size={18} /></button>
          <button className={styles.iconBtn}><ChevronUp size={18} /></button>
          <button className={styles.btnPrimary} onClick={() => setIsModalOpen(true)}>
            <PlusCircle size={18} /> Add New
          </button>
          <button className={styles.btnPrimary} style={{backgroundColor: '#1B2850'}}>
            <Download size={18} /> Import Transfer
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
              <option>From Warehouse</option>
            </select>
            <select className={styles.select}>
              <option>To Warehouse</option>
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
                <th>From Warehouse</th>
                <th>To Warehouse</th>
                <th>No of Products</th>
                <th>Quantity Transfered</th>
                <th>Ref Number</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { from: 'Lavish Warehouse', to: 'North Zone Warehouse', prods: '20', qty: '15', ref: '#458924', date: '24 Dec 2024' },
                { from: 'Lobar Handy', to: 'Nova Storage Hub', prods: '04', qty: '14', ref: '#145445', date: '25 Jul 2023' },
                { from: 'Quaint Warehouse', to: 'Cool Warehouse', prods: '21', qty: '10', ref: '#135478', date: '28 Jul 2023' },
                { from: 'Traditional Warehouse', to: 'Retail Supply Hub', prods: '15', qty: '14', ref: '#145124', date: '24 Jul 2023' },
                { from: 'Cool Warehouse', to: 'EdgeWare Solutions', prods: '14', qty: '74', ref: '#474541', date: '15 Jul 2023' },
                { from: 'Overflow Warehouse', to: 'Quaint Warehouse', prods: '30', qty: '20', ref: '#366713', date: '06 Nov 2024' },
                { from: 'Nova Storage Hub', to: 'Traditional Warehouse', prods: '10', qty: '06', ref: '#327814', date: '25 Oct 2024' },
                { from: 'Retail Supply Hub', to: 'Overflow Warehouse', prods: '70', qty: '60', ref: '#274509', date: '14 Oct 2024' },
                { from: 'EdgeWare Solutions', to: 'Lavish Warehouse', prods: '35', qty: '30', ref: '#239073', date: '03 Oct 2024' },
                { from: 'North Zone Warehouse', to: 'Fulfillment Hub', prods: '15', qty: '10', ref: '#187204', date: '20 Sep 2024' },
              ].map((item, i) => (
                <tr key={i}>
                  <td><input type="checkbox" /></td>
                  <td>{item.from}</td>
                  <td>{item.to}</td>
                  <td>{item.prods}</td>
                  <td>{item.qty}</td>
                  <td>{item.ref}</td>
                  <td>{item.date}</td>
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
              <button className={styles.pageBtn} style={{backgroundColor: '#F3F4F6', border: 'none', color: '#1B2850'}}>2</button>
              <button className={styles.pageBtn}>&gt;</button>
           </div>
        </div>
      </Card>

      <AddTransferModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </DashboardLayout>
  );
};

export default StockTransfer;
