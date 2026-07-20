import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { FileText, FileSpreadsheet, RefreshCw, ChevronUp, Printer, Calendar } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const TaxReport = () => {
  const location = useLocation();
  
  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <div style={{display: 'flex', gap: '0.5rem', marginBottom: '1rem'}}>
            <Link to="/tax-report" style={{padding: '0.5rem 1rem', backgroundColor: location.pathname === '/tax-report' ? '#FF9F43' : '#E5E7EB', color: location.pathname === '/tax-report' ? 'white' : '#6B7280', textDecoration: 'none', borderRadius: '4px', fontSize: '0.875rem', fontWeight: 500}}>Purchase Tax</Link>
            <Link to="/tax-report-sales" style={{padding: '0.5rem 1rem', backgroundColor: location.pathname === '/tax-report-sales' ? '#FF9F43' : '#E5E7EB', color: location.pathname === '/tax-report-sales' ? 'white' : '#6B7280', textDecoration: 'none', borderRadius: '4px', fontSize: '0.875rem', fontWeight: 500}}>Sales Tax</Link>
          </div>
          <h1 className={styles.title}>Purchase Tax</h1>
          <p className={styles.subtitle}>View Reports of Purchase Tax</p>
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
            <label style={{display: 'block', fontSize: '0.875rem', color: '#1B2850', marginBottom: '0.5rem', fontWeight: 500}}>Store</label>
            <select className={styles.select}><option>All</option></select>
          </div>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', color: '#1B2850', marginBottom: '0.5rem', fontWeight: 500}}>Supplier</label>
            <select className={styles.select}><option>All</option></select>
          </div>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', color: '#1B2850', marginBottom: '0.5rem', fontWeight: 500}}>Payment Method</label>
            <select className={styles.select}><option>All</option></select>
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
          <h2 style={{fontSize: '1rem', fontWeight: 600, color: '#1B2850', margin: 0}}>Purchase Tax Report</h2>
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
                <th>Supplier</th>
                <th>Date</th>
                <th>Store</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Discount</th>
                <th>Tax Amount</th>
              </tr>
            </thead>
            <tbody>
              {[
                { ref: '#4237022', supplier: 'A-Z Store', date: '06 Nov 2024', store: 'Volt Vault', amount: '$700', method: 'Cash', discount: '$700', tax: '$700' },
                { ref: '#4237300', supplier: 'Apex Computers', date: '24 Dec 2024', store: 'Electro Mart', amount: '$200', method: 'Stripe', discount: '$200', tax: '$200' },
                { ref: '#7590321', supplier: 'Sigma Chairs', date: '20 Sep 2024', store: 'Urban Mart', amount: '$450', method: 'Stripe', discount: '$450', tax: '$450' },
                { ref: '#7590325', supplier: 'Beats Headphones', date: '10 Dec 2024', store: 'Quantum Gadgets', amount: '$50', method: 'Paypal', discount: '$50', tax: '$50' },
                { ref: '#7590365', supplier: 'Aesthetic Bags', date: '14 Oct 2024', store: 'Prime Mart', amount: '$1200', method: 'Paypal', discount: '$1200', tax: '$1200' },
                { ref: '#8744439', supplier: 'Hatimi Hardwares', date: '25 Oct 2024', store: 'Elite Retail', amount: '$1000', method: 'Cash', discount: '$1000', tax: '$1000' },
                { ref: '#8745225', supplier: 'Best Accessories', date: '18 Nov 2024', store: 'Gadget World', amount: '$100', method: 'Paypal', discount: '$100', tax: '$100' },
                { ref: '#8745245', supplier: 'Zenith Bags', date: '10 Sep 2024', store: 'Travel Mart', amount: '$300', method: 'Cash', discount: '$300', tax: '$300' },
                { ref: '#8745478', supplier: 'Alpha Mobiles', date: '03 Oct 2024', store: 'NeoTech Store', amount: '$750', method: 'Stripe', discount: '$750', tax: '$750' },
                { ref: '#9814521', supplier: 'Dazzle Shoes', date: '27 Nov 2024', store: 'Prime Bazaar', amount: '$800', method: 'Cash', discount: '$800', tax: '$800' },
              ].map((item, i) => (
                <tr key={i}>
                  <td style={{color: '#1B2850', fontWeight: 500}}>{item.ref}</td>
                  <td style={{color: '#6B7280'}}>{item.supplier}</td>
                  <td style={{color: '#6B7280'}}>{item.date}</td>
                  <td style={{color: '#6B7280'}}>{item.store}</td>
                  <td style={{color: '#6B7280'}}>{item.amount}</td>
                  <td style={{color: '#6B7280'}}>{item.method}</td>
                  <td style={{color: '#6B7280'}}>{item.discount}</td>
                  <td style={{color: '#6B7280'}}>{item.tax}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      
    </DashboardLayout>
  );
};

export default TaxReport;
