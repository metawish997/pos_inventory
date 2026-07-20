import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { FileText, FileSpreadsheet, RefreshCw, ChevronUp, Printer, Calendar } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const CustomerDueReport = () => {
  const location = useLocation();
  
  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <div style={{display: 'flex', gap: '0.5rem', marginBottom: '1rem'}}>
            <Link to="/customer-report" style={{padding: '0.5rem 1rem', backgroundColor: location.pathname === '/customer-report' ? '#FF9F43' : '#E5E7EB', color: location.pathname === '/customer-report' ? 'white' : '#6B7280', textDecoration: 'none', borderRadius: '4px', fontSize: '0.875rem', fontWeight: 500}}>Customer Report</Link>
            <Link to="/customer-due-report" style={{padding: '0.5rem 1rem', backgroundColor: location.pathname === '/customer-due-report' ? '#FF9F43' : '#E5E7EB', color: location.pathname === '/customer-due-report' ? 'white' : '#6B7280', textDecoration: 'none', borderRadius: '4px', fontSize: '0.875rem', fontWeight: 500}}>Customer Due</Link>
          </div>
          <h1 className={styles.title}>Customer Due Report</h1>
          <p className={styles.subtitle}>View Reports of Customer</p>
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
            <label style={{display: 'block', fontSize: '0.875rem', color: '#1B2850', marginBottom: '0.5rem', fontWeight: 500}}>Customer</label>
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
            <label style={{display: 'block', fontSize: '0.875rem', color: '#1B2850', marginBottom: '0.5rem', fontWeight: 500}}>Payment Status</label>
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
          <h2 style={{fontSize: '1rem', fontWeight: 600, color: '#1B2850', margin: 0}}>Customer Due Report</h2>
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
                <th>Reference</th>
                <th>Code</th>
                <th>Customer</th>
                <th>Total Amount</th>
                <th>Paid</th>
                <th>Due</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { ref: 'INV2011', code: 'CU006', name: 'Marsha Betts', amount: '$2000', paid: '$2000', due: '$0.0', status: 'Paid', img: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=50' },
                { ref: 'INV2014', code: 'CU007', name: 'Daniel Jude', amount: '$600', paid: '$600', due: '$0.0', status: 'Overdue', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=50' },
                { ref: 'INV2026', code: 'CU001', name: 'Carl Evans', amount: '$1000', paid: '$1000', due: '$0.0', status: 'Paid', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=50' },
                { ref: 'INV2031', code: 'CU002', name: 'Minerva Rameriz', amount: '$1500', paid: '$1500', due: '$0.0', status: 'Paid', img: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=50' },
                { ref: 'INV2033', code: 'CU004', name: 'Patricia Lewis', amount: '$700', paid: '$700', due: '$0.0', status: 'Paid', img: 'https://images.unsplash.com/photo-1518444065439-e931662788e2?w=50' },
                { ref: 'INV2042', code: 'CU003', name: 'Robert Lamon', amount: '$1600', paid: '$1600', due: '$0.0', status: 'Paid', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=50' },
                { ref: 'INV2042', code: 'CU005', name: 'Mark Joslyn', amount: '$1000', paid: '$1000', due: '$0.0', status: 'Paid', img: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=50' },
                { ref: 'INV2047', code: 'CU009', name: 'Richard Fralick', amount: '$500', paid: '$500', due: '$0.0', status: 'Completed', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=50' },
                { ref: 'INV2056', code: 'CU008', name: 'Emma Bates', amount: '$1000', paid: '$1000', due: '$0.0', status: 'Unpaid', img: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=50' },
              ].map((item, i) => (
                <tr key={i}>
                  <td style={{color: '#1B2850', fontWeight: 500}}>{item.ref}</td>
                  <td style={{color: '#6B7280'}}>{item.code}</td>
                  <td>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                      <img src={item.img} alt={item.name} style={{width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover'}} />
                      <span style={{color: '#1B2850', fontWeight: 500}}>{item.name}</span>
                    </div>
                  </td>
                  <td style={{color: '#6B7280'}}>{item.amount}</td>
                  <td style={{color: '#6B7280'}}>{item.paid}</td>
                  <td style={{color: '#6B7280'}}>{item.due}</td>
                  <td>
                    <span style={{
                      backgroundColor: item.status === 'Paid' || item.status === 'Completed' ? '#E8F9F0' : item.status === 'Unpaid' ? '#FCEAEA' : '#F4E8FC', 
                      color: item.status === 'Paid' || item.status === 'Completed' ? '#28C76F' : item.status === 'Unpaid' ? '#EA5455' : '#7367F0', 
                      padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600
                    }}>&bull; {item.status}</span>
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

export default CustomerDueReport;
