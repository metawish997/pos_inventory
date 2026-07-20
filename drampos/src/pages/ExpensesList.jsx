import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css'; // Reusing styles
import { Search, FileText, FileSpreadsheet, RefreshCw, ChevronUp, Edit, Trash2, Eye } from 'lucide-react';
import AddExpenseModal from '../components/modals/AddExpenseModal';
import EditExpenseModal from '../components/modals/EditExpenseModal';

const ExpensesList = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return <span style={{backgroundColor: '#28C76F', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'}}>{status}</span>;
      case 'Pending':
        return <span style={{backgroundColor: '#00CFE8', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'}}>{status}</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Expenses</h1>
          <p className={styles.subtitle}>Manage Your Expenses</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn}><FileText size={18} color="#EA5455" /></button>
          <button className={styles.iconBtn}><FileSpreadsheet size={18} color="#28C76F" /></button>
          <button className={styles.iconBtn}><RefreshCw size={18} /></button>
          <button className={styles.iconBtn}><ChevronUp size={18} /></button>
          <button className={styles.btnPrimary} onClick={() => setIsAddOpen(true)}>
            + Add Expense
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
              <option>Category</option>
            </select>
            <select className={styles.select}>
              <option>Status</option>
            </select>
          </div>
        </div>

        <div className={styles.tableResponsive}>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>Reference</th>
                <th>Expense Name</th>
                <th>Category</th>
                <th>Description</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { ref: 'EX849', name: 'Electricity Payment', category: 'Utilities', desc: 'Electricity Bill', date: '24 Dec 2024', amount: '$200', status: 'Approved' },
                { ref: 'EX848', name: 'Stationery Purchase', category: 'Office Supplies', desc: 'Stationery items for office', date: '10 Dec 2024', amount: '$50', status: 'Pending' },
                { ref: 'EX847', name: 'AC Repair Service', category: 'Repairs & Maintenance', desc: 'AC Repair for Office', date: '27 Nov 2024', amount: '$800', status: 'Approved' },
                { ref: 'EX846', name: 'Social Media Promotion', category: 'Marketing', desc: 'Social Media Ads Campaign', date: '18 Nov 2024', amount: '$100', status: 'Approved' },
                { ref: 'EX845', name: 'Client Meeting', category: 'Travel Expenses', desc: 'Travel fare for client meeting', date: '06 Nov 2024', amount: '$700', status: 'Approved' },
                { ref: 'EX844', name: 'Team Lunch', category: 'Employee Benefits', desc: 'Team Lunch at Restaurant', date: '25 Oct 2024', amount: '$1000', status: 'Pending' },
                { ref: 'EX843', name: 'Business Flight Ticket', category: 'Travel Expenses', desc: 'Flight tickets for meetings', date: '14 Oct 2024', amount: '$1200', status: 'Approved' },
                { ref: 'EX842', name: 'Chair Purchase', category: 'Office Supplies', desc: 'Ergonomic chairs for staff', date: '03 Oct 2024', amount: '$750', status: 'Approved' },
                { ref: 'EX841', name: 'Plumbing Service', category: 'Repairs & Maintenance', desc: 'Plumbing repairs in office', date: '20 Sep 2024', amount: '$450', status: 'Approved' },
                { ref: 'EX840', name: 'Internet Bill Payment', category: 'Utilities', desc: 'Monthly internet subscription', date: '10 Sep 2024', amount: '$300', status: 'Pending' },
              ].map((item, i) => (
                <tr key={i}>
                  <td><input type="checkbox" /></td>
                  <td>{item.ref}</td>
                  <td style={{color: '#1B2850', fontWeight: 500}}>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.desc}</td>
                  <td>{item.date}</td>
                  <td>{item.amount}</td>
                  <td>{getStatusBadge(item.status)}</td>
                  <td>
                    <div className={styles.actionCell}>
                      <button className={styles.actionBtn}><Eye size={16} /></button>
                      <button className={styles.actionBtn} onClick={() => setIsEditOpen(true)}><Edit size={16} /></button>
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
      
      <AddExpenseModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
      <EditExpenseModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />
    </DashboardLayout>
  );
};

export default ExpensesList;
