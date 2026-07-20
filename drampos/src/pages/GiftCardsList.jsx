import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css'; // Reusing styles
import { Search, FileText, FileSpreadsheet, RefreshCw, ChevronUp, PlusCircle, Eye, Edit, Trash2 } from 'lucide-react';

const GiftCardsList = () => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return <span style={{backgroundColor: '#28C76F', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'}}>{status}</span>;
      case 'Inactive':
        return <span style={{backgroundColor: '#EA5455', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'}}>{status}</span>;
      case 'Redeemed':
        return <span style={{backgroundColor: '#E83E8C', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'}}>{status}</span>;
      case 'Expired':
        return <span style={{backgroundColor: '#6C757D', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'}}>{status}</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Gift Cards</h1>
          <p className={styles.subtitle}>Manage your gift cards</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn}><FileText size={18} color="#EA5455" /></button>
          <button className={styles.iconBtn}><FileSpreadsheet size={18} color="#28C76F" /></button>
          <button className={styles.iconBtn}><RefreshCw size={18} /></button>
          <button className={styles.iconBtn}><ChevronUp size={18} /></button>
          <button className={styles.btnPrimary}>
            <PlusCircle size={18} /> Add Gift Card
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
                <th>Gift Card</th>
                <th>Customer</th>
                <th>Issued Date</th>
                <th>Expiry Date</th>
                <th>Amount</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { card: 'GFT1110', name: 'Carl Evans', issued: '24 Dec 2024', expiry: '24 Jan 2026', amount: '$200', balance: '$100', status: 'Active' },
                { card: 'GFT1109', name: 'Minerva Rameriz', issued: '10 Dec 2024', expiry: '10 Jan 2026', amount: '$300', balance: '$200', status: 'Active' },
                { card: 'GFT1108', name: 'Robert Lamon', issued: '27 Nov 2024', expiry: '27 Dec 2024', amount: '$200', balance: '$150', status: 'Active' },
                { card: 'GFT1107', name: 'Patricia Lewis', issued: '18 Nov 2024', expiry: '18 Dec 2024', amount: '$120', balance: '$0', status: 'Redeemed' },
                { card: 'GFT1106', name: 'Mark Joslyn', issued: '06 Nov 2024', expiry: '06 Dec 2024', amount: '$350', balance: '$300', status: 'Active' },
                { card: 'GFT1105', name: 'Marsha Betts', issued: '25 Oct 2024', expiry: '25 Nov 2024', amount: '$500', balance: '$400', status: 'Active' },
                { card: 'GFT1104', name: 'Daniel Jude', issued: '14 Oct 2024', expiry: '14 Nov 2024', amount: '$220', balance: '$150', status: 'Active' },
                { card: 'GFT1103', name: 'Emma Bates', issued: '03 Oct 2024', expiry: '03 Nov 2024', amount: '$260', balance: '$220', status: 'Inactive' },
                { card: 'GFT1102', name: 'Richard Fralick', issued: '20 Sep 2024', expiry: '20 Oct 2024', amount: '$200', balance: '$160', status: 'Active' },
                { card: 'GFT1101', name: 'Michelle Robison', issued: '10 Sep 2024', expiry: '10 Oct 2024', amount: '$400', balance: '$350', status: 'Expired' },
              ].map((item, i) => (
                <tr key={i}>
                  <td><input type="checkbox" /></td>
                  <td style={{color: '#1B2850', fontWeight: 500}}>{item.card}</td>
                  <td>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                      <div style={{width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#F3F4F6'}}></div>
                      <span style={{fontSize: '0.875rem', color: '#1B2850', fontWeight: 500}}>{item.name}</span>
                    </div>
                  </td>
                  <td>{item.issued}</td>
                  <td>{item.expiry}</td>
                  <td>{item.amount}</td>
                  <td>{item.balance}</td>
                  <td>{getStatusBadge(item.status)}</td>
                  <td>
                    <div className={styles.actionCell}>
                      <button className={styles.actionBtn}><Eye size={16} /></button>
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
    </DashboardLayout>
  );
};

export default GiftCardsList;
