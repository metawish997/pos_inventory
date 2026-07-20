import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { FileText, FileSpreadsheet, RefreshCw, ChevronUp, Printer, Calendar } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const SupplierReport = () => {
  const location = useLocation();
  
  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <div style={{display: 'flex', gap: '0.5rem', marginBottom: '1rem'}}>
            <Link to="/supplier-report" style={{padding: '0.5rem 1rem', backgroundColor: location.pathname === '/supplier-report' ? '#FF9F43' : '#E5E7EB', color: location.pathname === '/supplier-report' ? 'white' : '#6B7280', textDecoration: 'none', borderRadius: '4px', fontSize: '0.875rem', fontWeight: 500}}>Supplier Report</Link>
            <Link to="/supplier-due-report" style={{padding: '0.5rem 1rem', backgroundColor: location.pathname === '/supplier-due-report' ? '#FF9F43' : '#E5E7EB', color: location.pathname === '/supplier-due-report' ? 'white' : '#6B7280', textDecoration: 'none', borderRadius: '4px', fontSize: '0.875rem', fontWeight: 500}}>Supplier Due</Link>
          </div>
          <h1 className={styles.title}>Supplier Report</h1>
          <p className={styles.subtitle}>View Reports of Supplier</p>
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
            <label style={{display: 'block', fontSize: '0.875rem', color: '#1B2850', marginBottom: '0.5rem', fontWeight: 500}}>Supplier</label>
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
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', color: '#1B2850', marginBottom: '0.5rem', fontWeight: 500}}>Payment Method</label>
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
          <h2 style={{fontSize: '1rem', fontWeight: 600, color: '#1B2850', margin: 0}}>Supplier Report</h2>
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
                <th>ID</th>
                <th>Supplier</th>
                <th>Total Items</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { ref: 'INV/PO2011', id: 'SU006', name: 'Hatimi Hardwares', items: '45', amount: '$750', method: 'Cash', status: 'Pending', img: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=50' },
                { ref: 'INV/PO2014', id: 'SU007', name: 'Aesthetic Bags', items: '21', amount: '$1300', method: 'Credit Card', status: 'Received', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=50' },
                { ref: 'INV/PO2017', id: 'SU010', name: 'Zenith Bags', items: '15', amount: '$1700', method: 'Stripe', status: 'Pending', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=50' },
                { ref: 'INV/PO2026', id: 'SU001', name: 'Apex Computers', items: '10', amount: '$1000', method: 'Cash', status: 'Received', img: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=50' },
                { ref: 'INV/PO2031', id: 'SU002', name: 'Beats Headphones', items: '15', amount: '$1500', method: 'Paypal', status: 'Pending', img: 'https://images.unsplash.com/photo-1518444065439-e931662788e2?w=50' },
                { ref: 'INV/PO2033', id: 'SU004', name: 'Best Accessories', items: '14', amount: '$2000', method: 'Stripe', status: 'Ordered', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=50' },
                { ref: 'INV/PO2042', id: 'SU003', name: 'Dazzle Shoes', items: '22', amount: '$1500', method: 'Paypal', status: 'Received', img: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=50' },
                { ref: 'INV/PO2042', id: 'SU005', name: 'A-Z Store', items: '12', amount: '$800', method: 'Paypal', status: 'Received', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=50' },
                { ref: 'INV/PO2047', id: 'SU009', name: 'Sigma Chairs', items: '25', amount: '$2300', method: 'Credit Card', status: 'Ordered', img: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=50' },
              ].map((item, i) => (
                <tr key={i}>
                  <td style={{color: '#1B2850', fontWeight: 500}}>{item.ref}</td>
                  <td style={{color: '#6B7280'}}>{item.id}</td>
                  <td>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                      <img src={item.img} alt={item.name} style={{width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover'}} />
                      <span style={{color: '#1B2850', fontWeight: 500}}>{item.name}</span>
                    </div>
                  </td>
                  <td style={{color: '#6B7280'}}>{item.items}</td>
                  <td style={{color: '#6B7280'}}>{item.amount}</td>
                  <td style={{color: '#6B7280'}}>{item.method}</td>
                  <td>
                    <span style={{
                      backgroundColor: item.status === 'Received' ? '#E8F9F0' : item.status === 'Ordered' ? '#FFF5E8' : '#E8F6FA', 
                      color: item.status === 'Received' ? '#28C76F' : item.status === 'Ordered' ? '#FF9F43' : '#00CFE8', 
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

export default SupplierReport;
