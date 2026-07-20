import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { Search, RefreshCw, ChevronUp, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AccountTypeList = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Accounts Type</h1>
          <p className={styles.subtitle}>Manage your Accounts Type</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn}><RefreshCw size={18} /></button>
          <button className={styles.iconBtn}><ChevronUp size={18} /></button>
          <button className={styles.btnPrimary}>
            + Add Account Type
          </button>
        </div>
      </div>

      <div style={{display: 'flex', gap: '0.5rem', marginBottom: '1.5rem'}}>
        <button onClick={() => navigate('/bank-accounts')} style={{backgroundColor: '#E5E7EB', color: '#4B5563', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer'}}>Bank Accounts</button>
        <button style={{backgroundColor: '#FF9F43', color: 'white', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer'}}>Account Type</button>
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
          </div>
        </div>

        <div className={styles.tableResponsive}>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th>Type</th>
                <th>Created Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { type: 'Savings account', date: '24 Dec 2024', status: 'Active' },
                { type: 'Current Account', date: '10 Dec 2024', status: 'Inactive' },
                { type: 'Salary Account', date: '27 Nov 2024', status: 'Active' },
              ].map((item, i) => (
                <tr key={i}>
                  <td style={{color: '#6B7280'}}>{item.type}</td>
                  <td>{item.date}</td>
                  <td>
                    <span style={{
                      backgroundColor: item.status === 'Active' ? '#28C76F' : '#EA5455', 
                      color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'
                    }}>{item.status}</span>
                  </td>
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
      </Card>
      
    </DashboardLayout>
  );
};

export default AccountTypeList;
