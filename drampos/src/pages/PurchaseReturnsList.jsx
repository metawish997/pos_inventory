import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css'; // Reusing styles
import { Search, FileText, FileSpreadsheet, RefreshCw, ChevronUp, PlusCircle, Edit, Trash2 } from 'lucide-react';
import AddPurchaseReturnModal from '../components/modals/AddPurchaseReturnModal';

const PurchaseReturnsList = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Received':
        return <span style={{backgroundColor: '#28C76F', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'}}>{status}</span>;
      case 'Pending':
        return <span style={{backgroundColor: '#00CFE8', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'}}>{status}</span>;
      default:
        return <span>{status}</span>;
    }
  };

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case 'Paid':
        return <span style={{backgroundColor: '#E5F8ED', color: '#28C76F', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '4px'}}><div style={{width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#28C76F'}}></div> Paid</span>;
      case 'Unpaid':
        return <span style={{backgroundColor: '#FCEAEA', color: '#EA5455', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '4px'}}><div style={{width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#EA5455'}}></div> Unpaid</span>;
      case 'Overdue':
        return <span style={{backgroundColor: '#FFF2E5', color: '#FF9F43', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '4px'}}><div style={{width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FF9F43'}}></div> Overdue</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Purchase Returns</h1>
          <p className={styles.subtitle}>Manage your purchase return</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn}><FileText size={18} color="#EA5455" /></button>
          <button className={styles.iconBtn}><FileSpreadsheet size={18} color="#28C76F" /></button>
          <button className={styles.iconBtn}><RefreshCw size={18} /></button>
          <button className={styles.iconBtn}><ChevronUp size={18} /></button>
          <button className={styles.btnPrimary} onClick={() => setIsAddOpen(true)}>
            <PlusCircle size={18} /> Add Sales Return
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
                <th>Product Image</th>
                <th>Date</th>
                <th>Supplier Name</th>
                <th>Reference</th>
                <th>Status</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Due</th>
                <th>Payment Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Electro Mart', ref: 'PT001', date: '24 Dec 2024', status: 'Received', total: '$1000', paid: '$1000', due: '$0.00', paymentStatus: 'Paid' },
                { name: 'Quantum Gadgets', ref: 'PT002', date: '10 Dec 2024', status: 'Pending', total: '$1500', paid: '$0.00', due: '$1500', paymentStatus: 'Unpaid' },
                { name: 'Prime Bazaar', ref: 'PT003', date: '27 Nov 2024', status: 'Received', total: '$1500', paid: '$1800', due: '$0.00', paymentStatus: 'Paid' },
                { name: 'Gadget World', ref: 'PT004', date: '18 Nov 2024', status: 'Received', total: '$2000', paid: '$1000', due: '$1000', paymentStatus: 'Overdue' },
                { name: 'Volt Vault', ref: 'PT005', date: '06 Nov 2024', status: 'Received', total: '$800', paid: '$800', due: '$0.00', paymentStatus: 'Paid' },
                { name: 'Elite Retail', ref: 'PT006', date: '25 Oct 2024', status: 'Pending', total: '$750', paid: '$0.00', due: '$750', paymentStatus: 'Unpaid' },
                { name: 'Prime Mart', ref: 'PT007', date: '14 Oct 2024', status: 'Received', total: '$1300', paid: '$1300', due: '$0.00', paymentStatus: 'Paid' },
                { name: 'NeoTech Store', ref: 'PT008', date: '14 Oct 2024', status: 'Received', total: '$1100', paid: '$1100', due: '$0.00', paymentStatus: 'Paid' },
                { name: 'Urban Mart', ref: 'PT009', date: '20 Sep 2024', status: 'Pending', total: '$2300', paid: '$2300', due: '$0.00', paymentStatus: 'Paid' },
                { name: 'Travel Mart', ref: 'PT010', date: '10 Sep 2024', status: 'Pending', total: '$1700', paid: '$1700', due: '$0.00', paymentStatus: 'Paid' },
              ].map((item, i) => (
                <tr key={i}>
                  <td><input type="checkbox" /></td>
                  <td>
                    <div style={{width: '32px', height: '32px', backgroundColor: '#F3F4F6', borderRadius: '4px'}}></div>
                  </td>
                  <td>{item.date}</td>
                  <td style={{color: '#1B2850', fontWeight: 500}}>{item.name}</td>
                  <td>{item.ref}</td>
                  <td>{getStatusBadge(item.status)}</td>
                  <td>{item.total}</td>
                  <td>{item.paid}</td>
                  <td>{item.due}</td>
                  <td>{getPaymentStatusBadge(item.paymentStatus)}</td>
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
      
      <AddPurchaseReturnModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </DashboardLayout>
  );
};

export default PurchaseReturnsList;
