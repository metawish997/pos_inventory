import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css'; // Reusing styles
import { Search, FileText, FileSpreadsheet, RefreshCw, ChevronUp, Eye, Trash2, PlusCircle } from 'lucide-react';

const InvoiceList = () => {
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
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
          <h1 className={styles.title}>Balance Sheet</h1>
          <p className={styles.subtitle}>View Your Balance Sheet</p>
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
              <option>Customer</option>
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
                <th>Invoice No</th>
                <th>Customer</th>
                <th>Due Date</th>
                <th>Amount</th>
                <th>Paid</th>
                <th>Amount Due</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { inv: 'INV001', name: 'Carl Evans', date: '24 Dec 2024', amount: '$1000', paid: '$1000', due: '$0.00', status: 'Paid' },
                { inv: 'INV002', name: 'Minerva Rameriz', date: '24 Dec 2024', amount: '$1500', paid: '$0.00', due: '$1500', status: 'Unpaid' },
                { inv: 'INV003', name: 'Robert Lamon', date: '24 Dec 2024', amount: '$1500', paid: '$0.00', due: '$1500', status: 'Unpaid' },
                { inv: 'INV004', name: 'Patricia Lewis', date: '24 Dec 2024', amount: '$2000', paid: '$1000', due: '$1000', status: 'Overdue' },
                { inv: 'INV005', name: 'Mark Joslyn', date: '24 Dec 2024', amount: '$800', paid: '$800', due: '$0.00', status: 'Paid' },
                { inv: 'INV006', name: 'Marsha Betts', date: '24 Dec 2024', amount: '$750', paid: '$0.00', due: '$750', status: 'Unpaid' },
                { inv: 'INV007', name: 'Daniel Jude', date: '24 Dec 2024', amount: '$1300', paid: '$1300', due: '$0.00', status: 'Paid' },
                { inv: 'INV008', name: 'Emma Bates', date: '24 Dec 2024', amount: '$1100', paid: '$1100', due: '$0.00', status: 'Paid' },
                { inv: 'INV009', name: 'Richard Fralick', date: '24 Dec 2024', amount: '$2300', paid: '$2300', due: '$0.00', status: 'Paid' },
                { inv: 'INV010', name: 'Michelle Robison', date: '24 Dec 2024', amount: '$1700', paid: '$1700', due: '$0.00', status: 'Paid' },
              ].map((item, i) => (
                <tr key={i}>
                  <td><input type="checkbox" /></td>
                  <td>{item.inv}</td>
                  <td>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                      <div style={{width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#F3F4F6'}}></div>
                      <span style={{fontSize: '0.875rem', color: '#1B2850', fontWeight: 500}}>{item.name}</span>
                    </div>
                  </td>
                  <td>{item.date}</td>
                  <td>{item.amount}</td>
                  <td>{item.paid}</td>
                  <td>{item.due}</td>
                  <td>{getStatusBadge(item.status)}</td>
                  <td>
                    <div className={styles.actionCell}>
                      <button className={styles.actionBtn} onClick={() => navigate('/invoice-details')}><Eye size={16} /></button>
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
    </DashboardLayout>
  );
};

export default InvoiceList;
