import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { Search, FileText, FileSpreadsheet, RefreshCw, ChevronUp, Edit, Trash2 } from 'lucide-react';
import AddAccountModal from '../components/modals/AddAccountModal';
import { useNavigate } from 'react-router-dom';

const BankAccountsList = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Bank Accounts</h1>
          <p className={styles.subtitle}>Manage your Accounts List</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn}><FileText size={18} color="#EA5455" /></button>
          <button className={styles.iconBtn}><FileSpreadsheet size={18} color="#28C76F" /></button>
          <button className={styles.iconBtn}><RefreshCw size={18} /></button>
          <button className={styles.iconBtn}><ChevronUp size={18} /></button>
          <button className={styles.btnPrimary} onClick={() => setIsAddOpen(true)}>
            + Add Account
          </button>
        </div>
      </div>

      <div style={{display: 'flex', gap: '0.5rem', marginBottom: '1.5rem'}}>
        <button style={{backgroundColor: '#FF9F43', color: 'white', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer'}}>Bank Accounts</button>
        <button onClick={() => navigate('/account-type')} style={{backgroundColor: '#E5E7EB', color: '#4B5563', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer'}}>Account Type</button>
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
              <option>Sort By : Latest</option>
            </select>
          </div>
        </div>

        <div className={styles.tableResponsive}>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>Account Holder Name</th>
                <th>Account No</th>
                <th>Type</th>
                <th>Opening Balance</th>
                <th>Notes</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Zephyr Indira', no: '3298784309485', type: 'Savings Account', bal: '$200', notes: 'Account for Business', status: 'Active' },
                { name: 'Quillon Elysia', no: '5475878970090', type: 'Current Account', bal: '$50', notes: 'Account for Business', status: 'Closed' },
                { name: 'Thaddeus Juniper', no: '3255465758698', type: 'Salary Account', bal: '$800', notes: 'Current Account', status: 'Active' },
                { name: 'Orion Astrid', no: '4353689870544', type: 'Current Account', bal: '$100', notes: 'Account for Business', status: 'Active' },
                { name: 'Caspian Marigold', no: '4324356677889', type: 'Current Account', bal: '$700', notes: 'Account for Business', status: 'Active' },
                { name: 'Emma James', no: '2343547586900', type: 'Salary Account', bal: '$1000', notes: 'Account for Business', status: 'Active' },
                { name: 'Olivia Ethan', no: '3453647664889', type: 'Current Account', bal: '$1200', notes: 'A type of bank account.', status: 'Active' },
                { name: 'Sophia Liam', no: '3354456565687', type: 'Current Account', bal: '$750', notes: 'Account for Business', status: 'Closed' },
                { name: 'Ava Mason', no: '3456565767787', type: 'Salary Account', bal: '$450', notes: 'A type of bank account.', status: 'Active' },
                { name: 'Isabella Jackson', no: '3434565776768', type: 'Salary Account', bal: '$300', notes: 'A type of bank account.', status: 'Active' },
              ].map((item, i) => (
                <tr key={i}>
                  <td><input type="checkbox" /></td>
                  <td style={{color: '#1B2850', fontWeight: 500}}>{item.name}</td>
                  <td>{item.no}</td>
                  <td>{item.type}</td>
                  <td>{item.bal}</td>
                  <td style={{color: '#6B7280'}}>{item.notes}</td>
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
      
      <AddAccountModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </DashboardLayout>
  );
};

export default BankAccountsList;
