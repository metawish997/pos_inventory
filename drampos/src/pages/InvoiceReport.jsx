import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { FileText, FileSpreadsheet, RefreshCw, ChevronUp, Printer, Calendar } from 'lucide-react';

const InvoiceReport = () => {
  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Invoice Report</h1>
          <p className={styles.subtitle}>Manage Your Invoice Report</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn}><RefreshCw size={18} /></button>
          <button className={styles.iconBtn}><ChevronUp size={18} /></button>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '1.5rem'}}>
        <Card style={{padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid #28C76F'}}>
          <div style={{backgroundColor: '#28C76F', color: 'white', width: '48px', height: '48px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <FileText size={24} />
          </div>
          <div>
            <div style={{color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.25rem'}}>Total Amount</div>
            <div style={{fontSize: '1.25rem', fontWeight: 600, color: '#1B2850'}}>$4,56,000</div>
          </div>
        </Card>
        <Card style={{padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid #00CFE8'}}>
          <div style={{backgroundColor: '#00CFE8', color: 'white', width: '48px', height: '48px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <FileText size={24} />
          </div>
          <div>
            <div style={{color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.25rem'}}>Total Paid</div>
            <div style={{fontSize: '1.25rem', fontWeight: 600, color: '#1B2850'}}>$2,56,42</div>
          </div>
        </Card>
        <Card style={{padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid #FF9F43'}}>
          <div style={{backgroundColor: '#FF9F43', color: 'white', width: '48px', height: '48px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <FileText size={24} />
          </div>
          <div>
            <div style={{color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.25rem'}}>Total Unpaid</div>
            <div style={{fontSize: '1.25rem', fontWeight: 600, color: '#1B2850'}}>$1,52,45</div>
          </div>
        </Card>
        <Card style={{padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid #EA5455'}}>
          <div style={{backgroundColor: '#EA5455', color: 'white', width: '48px', height: '48px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <FileText size={24} />
          </div>
          <div>
            <div style={{color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.25rem'}}>Overdue</div>
            <div style={{fontSize: '1.25rem', fontWeight: 600, color: '#1B2850'}}>$2,56,12</div>
          </div>
        </Card>
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
            <label style={{display: 'block', fontSize: '0.875rem', color: '#1B2850', marginBottom: '0.5rem', fontWeight: 500}}>Customer</label>
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
          <h2 style={{fontSize: '1rem', fontWeight: 600, color: '#1B2850', margin: 0}}>Invoice Report</h2>
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
                <th>Invoice No</th>
                <th>Customer</th>
                <th>Due Date</th>
                <th>Amount</th>
                <th>Paid</th>
                <th>Amount Due</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { no: 'INV001', customer: 'Carl Evans', date: '24 Dec 2024', amount: '$500', paid: '$500', due: '$0', status: 'Paid' },
                { no: 'INV002', customer: 'Minerva Rameriz', date: '10 Dec 2024', amount: '$1500', paid: '$1500', due: '$0', status: 'Paid' },
                { no: 'INV003', customer: 'Robert Lamon', date: '27 Nov 2024', amount: '$600', paid: '$600', due: '$0', status: 'Paid' },
                { no: 'INV004', customer: 'Patricia Lewis', date: '18 Nov 2024', amount: '$1000', paid: '$1000', due: '$0', status: 'Paid' },
                { no: 'INV005', customer: 'Mark Joslyn', date: '06 Nov 2024', amount: '$1200', paid: '$1200', due: '$0', status: 'Paid' },
                { no: 'INV006', customer: 'Marsha Betts', date: '25 Oct 2024', amount: '$800', paid: '$800', due: '$0', status: 'Paid' },
                { no: 'INV007', customer: 'Daniel Jude', date: '14 Oct 2024', amount: '$2000', paid: '$2000', due: '$0', status: 'Paid' },
                { no: 'INV008', customer: 'Emma Bates', date: '03 Oct 2024', amount: '$100', paid: '$100', due: '$0', status: 'Paid' },
                { no: 'INV009', customer: 'Richard Fralick', date: '20 Sep 2024', amount: '$300', paid: '$300', due: '$0', status: 'Paid' },
                { no: 'INV010', customer: 'Michelle Robison', date: '10 Sep 2024', amount: '$5000', paid: '$5000', due: '$0', status: 'Unpaid' },
              ].map((item, i) => (
                <tr key={i}>
                  <td style={{color: '#1B2850', fontWeight: 500}}>{item.no}</td>
                  <td style={{color: '#6B7280'}}>{item.customer}</td>
                  <td style={{color: '#6B7280'}}>{item.date}</td>
                  <td style={{color: '#6B7280'}}>{item.amount}</td>
                  <td style={{color: '#6B7280'}}>{item.paid}</td>
                  <td style={{color: '#6B7280'}}>{item.due}</td>
                  <td>
                    <span style={{
                      backgroundColor: item.status === 'Paid' ? '#E8F9F0' : '#FCEAEA', 
                      color: item.status === 'Paid' ? '#28C76F' : '#EA5455', 
                      padding: '4px 8px', borderRadius: '4px', fontSize: '12px',
                      fontWeight: 600
                    }}>&bull; {item.status}</span>
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

export default InvoiceReport;
