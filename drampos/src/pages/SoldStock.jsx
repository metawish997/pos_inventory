import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { FileText, FileSpreadsheet, RefreshCw, ChevronUp, Printer, Calendar } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const SoldStock = () => {
  const location = useLocation();
  
  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <div style={{display: 'flex', gap: '0.5rem', marginBottom: '1rem'}}>
            <Link to="/inventory-report" style={{padding: '0.5rem 1rem', backgroundColor: location.pathname === '/inventory-report' ? '#FF9F43' : '#E5E7EB', color: location.pathname === '/inventory-report' ? 'white' : '#6B7280', textDecoration: 'none', borderRadius: '4px', fontSize: '0.875rem', fontWeight: 500}}>Inventory Report</Link>
            <Link to="/stock-history" style={{padding: '0.5rem 1rem', backgroundColor: location.pathname === '/stock-history' ? '#FF9F43' : '#E5E7EB', color: location.pathname === '/stock-history' ? 'white' : '#6B7280', textDecoration: 'none', borderRadius: '4px', fontSize: '0.875rem', fontWeight: 500}}>Stock History</Link>
            <Link to="/sold-stock" style={{padding: '0.5rem 1rem', backgroundColor: location.pathname === '/sold-stock' ? '#FF9F43' : '#E5E7EB', color: location.pathname === '/sold-stock' ? 'white' : '#6B7280', textDecoration: 'none', borderRadius: '4px', fontSize: '0.875rem', fontWeight: 500}}>Sold Stock</Link>
          </div>
          <h1 className={styles.title}>Sold Stock</h1>
          <p className={styles.subtitle}>View Reports of Sold Stock</p>
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
            <label style={{display: 'block', fontSize: '0.875rem', color: '#1B2850', marginBottom: '0.5rem', fontWeight: 500}}>Category</label>
            <select className={styles.select}>
              <option>All</option>
            </select>
          </div>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', color: '#1B2850', marginBottom: '0.5rem', fontWeight: 500}}>Products</label>
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
          <h2 style={{fontSize: '1rem', fontWeight: 600, color: '#1B2850', margin: 0}}>Customer Report</h2>
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
                <th>SKU</th>
                <th>Product Name</th>
                <th>Unit</th>
                <th>Quantity</th>
                <th>Tax Value</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {[
                { sku: 'PT001', name: 'Lenovo IdeaPad 3', unit: '6000', qty: '100', tax: '$300', total: '$300', img: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=50' },
                { sku: 'PT002', name: 'Beats Pro', unit: '10', qty: '140', tax: '$10', total: '$1600', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=50' },
                { sku: 'PT003', name: 'Nike Jordan', unit: '08', qty: '300', tax: '$80', total: '$880', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=50' },
                { sku: 'PT004', name: 'Apple Series 5 Watch', unit: '10', qty: '450', tax: '$100', total: '$1200', img: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=50' },
                { sku: 'PT005', name: 'Amazon Echo Dot', unit: '05', qty: '320', tax: '$400', total: '$400', img: 'https://images.unsplash.com/photo-1518444065439-e931662788e2?w=50' },
                { sku: 'PT006', name: 'Sanford Chair Sofa', unit: '07', qty: '650', tax: '$220', total: '$2240', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=50' },
                { sku: 'PT007', name: 'Red Premium Satchel', unit: '15', qty: '700', tax: '$90', total: '$900', img: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=50' },
                { sku: 'PT008', name: 'Iphone 14 Pro', unit: '12', qty: '630', tax: '$680', total: '$6480', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=50' },
                { sku: 'PT009', name: 'Gaming Chair', unit: '10', qty: '410', tax: '$200', total: '$2000', img: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=50' },
              ].map((item, i) => (
                <tr key={i}>
                  <td style={{color: '#6B7280'}}>{item.sku}</td>
                  <td>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                      <img src={item.img} alt={item.name} style={{width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover'}} />
                      <span style={{color: '#1B2850', fontWeight: 500}}>{item.name}</span>
                    </div>
                  </td>
                  <td style={{color: '#6B7280'}}>{item.unit}</td>
                  <td style={{color: '#6B7280'}}>{item.qty}</td>
                  <td style={{color: '#6B7280'}}>{item.tax}</td>
                  <td style={{color: '#6B7280'}}>{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      
    </DashboardLayout>
  );
};

export default SoldStock;
