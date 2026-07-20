import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css'; // Reusing styles
import { Search, FileText, FileSpreadsheet, RefreshCw, ChevronUp, PlusCircle, Edit, Trash2 } from 'lucide-react';
import AddSalesReturnModal from '../components/modals/AddSalesReturnModal';
import EditSalesReturnModal from '../components/modals/EditSalesReturnModal';

const SalesReturnList = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

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

  const getPaymentBadge = (status) => {
    switch (status) {
      case 'Paid':
        return <span style={{backgroundColor: '#E8F9EE', color: '#28C76F', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px'}}><span style={{width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#28C76F'}}></span> {status}</span>;
      case 'Unpaid':
        return <span style={{backgroundColor: '#FCEAEA', color: '#EA5455', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px'}}><span style={{width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#EA5455'}}></span> {status}</span>;
      case 'Overdue':
        return <span style={{backgroundColor: '#FFF1E6', color: '#FF9F43', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px'}}><span style={{width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FF9F43'}}></span> {status}</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Sales Return</h1>
          <p className={styles.subtitle}>Manage your returns</p>
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
              <option>Customer</option>
            </select>
            <select className={styles.select}>
              <option>Status</option>
            </select>
            <select className={styles.select}>
              <option>Payment Status</option>
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
                <th>Product</th>
                <th>Date</th>
                <th>Customer</th>
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
                { product: 'Lenovo IdeaPad 3', date: '19 Nov 2022', name: 'Carl Evans', status: 'Received', total: '$1000', paid: '$1000', due: '$0.00', pstatus: 'Paid' },
                { product: 'Apple tablet', date: '19 Nov 2022', name: 'Minerva Rameriz', status: 'Pending', total: '$1500', paid: '$0.00', due: '$1500', pstatus: 'Unpaid' },
                { product: 'Headphone', date: '19 Nov 2022', name: 'Robert Lamon', status: 'Received', total: '$2000', paid: '$1000', due: '$1000', pstatus: 'Overdue' },
                { product: 'Nike Jordan', date: '19 Nov 2022', name: 'Mark Joslyn', status: 'Received', total: '$1500', paid: '$1500', due: '$0.00', pstatus: 'Paid' },
                { product: 'Macbook Pro', date: '19 Nov 2022', name: 'Patricia Lewis', status: 'Received', total: '$800', paid: '$800', due: '$0.00', pstatus: 'Paid' },
                { product: 'Red Premium Satchel', date: '19 Nov 2022', name: 'Marsha Betts', status: 'Pending', total: '$750', paid: '$0.00', due: '$750', pstatus: 'Unpaid' },
                { product: 'Apple Earpods', date: '19 Nov 2022', name: 'Daniel Jude', status: 'Received', total: '$1300', paid: '$1300', due: '$0.00', pstatus: 'Paid' },
                { product: 'Iphone 14 Pro', date: '19 Nov 2022', name: 'Emma Bates', status: 'Received', total: '$1100', paid: '$1100', due: '$0.00', pstatus: 'Paid' },
                { product: 'Gaming Chair', date: '19 Nov 2022', name: 'Richard Fralick', status: 'Pending', total: '$2300', paid: '$2300', due: '$0.00', pstatus: 'Paid' },
                { product: 'Borealis Backpack', date: '19 Nov 2022', name: 'Michelle Robison', status: 'Pending', total: '$1700', paid: '$1700', due: '$0.00', pstatus: 'Paid' },
              ].map((item, i) => (
                <tr key={i}>
                  <td><input type="checkbox" /></td>
                  <td>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                      <div style={{width: '24px', height: '24px', borderRadius: '4px', backgroundColor: '#F3F4F6'}}></div>
                      <span style={{fontSize: '0.875rem', color: '#1B2850', fontWeight: 500}}>{item.product}</span>
                    </div>
                  </td>
                  <td>{item.date}</td>
                  <td>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                      <div style={{width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#F3F4F6'}}></div>
                      <span style={{fontSize: '0.875rem', color: '#1B2850', fontWeight: 500}}>{item.name}</span>
                    </div>
                  </td>
                  <td>{getStatusBadge(item.status)}</td>
                  <td>{item.total}</td>
                  <td>{item.paid}</td>
                  <td>{item.due}</td>
                  <td>{getPaymentBadge(item.pstatus)}</td>
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
      </Card>

      <AddSalesReturnModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
      <EditSalesReturnModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />
    </DashboardLayout>
  );
};

export default SalesReturnList;
