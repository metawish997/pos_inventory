import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { FileText, FileSpreadsheet, RefreshCw, ChevronUp, Printer, Calendar } from 'lucide-react';

const ExpenseReport = () => {
  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Expense Report</h1>
          <p className={styles.subtitle}>View Reports of Expenses</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn}><RefreshCw size={18} /></button>
          <button className={styles.iconBtn}><ChevronUp size={18} /></button>
        </div>
      </div>

      <Card style={{padding: '1.5rem', marginBottom: '1.5rem'}}>
        <div style={{display: 'flex', gap: '1.5rem', alignItems: 'flex-end'}}>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', color: '#1B2850', marginBottom: '0.5rem', fontWeight: 500}}>Choose Date</label>
            <div style={{position: 'relative'}}>
              <Calendar size={18} style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6B7280'}} />
              <input type="text" className={styles.input} defaultValue="07/04/2026 - 07/10/2026" style={{paddingLeft: '2.5rem'}} />
            </div>
          </div>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', color: '#1B2850', marginBottom: '0.5rem', fontWeight: 500}}>Expense Category</label>
            <select className={styles.select}>
              <option>All</option>
            </select>
          </div>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', color: '#1B2850', marginBottom: '0.5rem', fontWeight: 500}}>Payment Method</label>
            <select className={styles.select}>
              <option>All</option>
            </select>
          </div>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', color: '#1B2850', marginBottom: '0.5rem', fontWeight: 500}}>Status</label>
            <select className={styles.select}>
              <option>All</option>
            </select>
          </div>
          <div>
            <button className={styles.btnPrimary} style={{backgroundColor: '#FF9F43', color: 'white', border: 'none', height: '40px', padding: '0 1.5rem'}}>
              Generate Report
            </button>
          </div>
        </div>
      </Card>

      <Card className={styles.tableCard}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid #F3F4F6'}}>
          <h2 style={{fontSize: '1rem', fontWeight: 600, color: '#1B2850', margin: 0}}>Expense Report</h2>
          <div style={{display: 'flex', gap: '0.5rem'}}>
             <button className={styles.iconBtn}><FileText size={18} color="#EA5455" /></button>
             <button className={styles.iconBtn}><FileSpreadsheet size={18} color="#28C76F" /></button>
             <button className={styles.iconBtn}><Printer size={18} color="#6B7280" /></button>
          </div>
        </div>

        <div className={styles.tableResponsive}>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th>Expense Name</th>
                <th>Category</th>
                <th>Description</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'AC Repair Service', category: 'Repairs & Maintenance', desc: 'AC Repair for Office', date: '27 Nov 2024', amount: '$800', status: 'Approved' },
                { name: 'Business Flight Ticket', category: 'Travel Expenses', desc: 'Flight tickets for meetings', date: '14 Oct 2024', amount: '$1200', status: 'Approved' },
                { name: 'Chair Purchase', category: 'Office Supplies', desc: 'Ergonomic chairs for staff', date: '03 Oct 2024', amount: '$750', status: 'Approved' },
                { name: 'Client Meeting', category: 'Travel Expenses', desc: 'Travel fare for client meeting', date: '06 Nov 2024', amount: '$700', status: 'Approved' },
                { name: 'Electricity Payment', category: 'Utilities', desc: 'Electricity Bill', date: '24 Dec 2024', amount: '$200', status: 'Approved' },
                { name: 'Internet Bill Payment', category: 'Utilities', desc: 'Monthly internet subscription', date: '10 Sep 2024', amount: '$300', status: 'Pending' },
                { name: 'Plumbing Service', category: 'Repairs & Maintenance', desc: 'Plumbing repairs in office', date: '20 Sep 2024', amount: '$450', status: 'Approved' },
                { name: 'Social Media Promotion', category: 'Marketing', desc: 'Social Media Ads Campaign', date: '18 Nov 2024', amount: '$100', status: 'Approved' },
                { name: 'Stationery Purchase', category: 'Office Supplies', desc: 'Stationery items for office', date: '10 Dec 2024', amount: '$50', status: 'Pending' },
                { name: 'Team Lunch', category: 'Employee Benefits', desc: 'Team Lunch at Restaurant', date: '25 Oct 2024', amount: '$1000', status: 'Pending' },
              ].map((item, i) => (
                <tr key={i}>
                  <td style={{color: '#6B7280'}}>{item.name}</td>
                  <td style={{color: '#6B7280'}}>{item.category}</td>
                  <td style={{color: '#6B7280'}}>{item.desc}</td>
                  <td style={{color: '#6B7280'}}>{item.date}</td>
                  <td style={{color: '#6B7280'}}>{item.amount}</td>
                  <td>
                    <span style={{
                      backgroundColor: item.status === 'Approved' ? '#E8F9F0' : '#E8F6FA', 
                      color: item.status === 'Approved' ? '#28C76F' : '#00CFE8', 
                      padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600
                    }}>{item.status}</span>
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

export default ExpenseReport;
