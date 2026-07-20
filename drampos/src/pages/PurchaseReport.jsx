import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { FileText, FileSpreadsheet, RefreshCw, Printer, Calendar } from 'lucide-react';

const PurchaseReport = () => {
  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Purchase report</h1>
          <p className={styles.subtitle}>Manage your Purchase report</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn}><RefreshCw size={18} /></button>
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
          {/* Note: The UI screenshot shows 'Customer Report' as the table title inside the purchase report page */}
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
                <th>Reference</th>
                <th>SKU</th>
                <th>Due Date</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Instock Qty</th>
                <th>Purchase Qty</th>
                <th>Purchase Amount</th>
              </tr>
            </thead>
            <tbody>
              {[
                { ref: 'PO2026', sku: 'PT001', date: '24 Dec 2024', name: 'Lenovo IdeaPad 3', category: 'Computers', instock: '100', qty: '05', amount: '$500', img: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=50' },
                { ref: 'PO2026', sku: 'PT002', date: '10 Dec 2024', name: 'Beats Pro', category: 'Electronics', instock: '140', qty: '10', amount: '$1500', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=50' },
                { ref: 'PO2026', sku: 'PT003', date: '27 Nov 2024', name: 'Nike Jordan', category: 'Shoe', instock: '300', qty: '08', amount: '$600', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=50' },
                { ref: 'PO2026', sku: 'PT004', date: '18 Nov 2024', name: 'Apple Series 5 Watch', category: 'Electronics', instock: '450', qty: '10', amount: '$1000', img: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=50' },
                { ref: 'PO2026', sku: 'PT005', date: '18 Nov 2024', name: 'Amazon Echo Dot', category: 'Electronics', instock: '320', qty: '05', amount: '$1200', img: 'https://images.unsplash.com/photo-1518444065439-e931662788e2?w=50' },
                { ref: 'PO2026', sku: 'PT006', date: '25 Oct 2024', name: 'Sanford Chair Sofa', category: 'Furniture', instock: '650', qty: '07', amount: '$800', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=50' },
                { ref: 'PO2026', sku: 'PT007', date: '14 Oct 2024', name: 'Red Premium Satchel', category: 'Bags', instock: '700', qty: '15', amount: '$2000', img: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=50' },
                { ref: 'PO2026', sku: 'PT008', date: '03 Oct 2024', name: 'Iphone 14 Pro', category: 'Phone', instock: '630', qty: '12', amount: '$2000', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=50' },
                { ref: 'PO2026', sku: 'PT009', date: '20 Sep 2024', name: 'Gaming Chair', category: 'Furniture', instock: '410', qty: '10', amount: '$3000', img: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=50' },
                { ref: 'PO2026', sku: 'PT010', date: '10 Sep 2024', name: 'Borealis Backpack', category: 'Bags', instock: '550', qty: '20', amount: '$5000', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=50' },
              ].map((item, i) => (
                <tr key={i}>
                  <td style={{color: '#1B2850', fontWeight: 500}}>{item.ref}</td>
                  <td style={{color: '#6B7280'}}>{item.sku}</td>
                  <td style={{color: '#6B7280'}}>{item.date}</td>
                  <td>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                      <img src={item.img} alt={item.name} style={{width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover'}} />
                      <span style={{color: '#1B2850', fontWeight: 500}}>{item.name}</span>
                    </div>
                  </td>
                  <td style={{color: '#6B7280'}}>{item.category}</td>
                  <td style={{color: '#6B7280'}}>{item.instock}</td>
                  <td style={{color: '#6B7280'}}>{item.qty}</td>
                  <td style={{color: '#6B7280'}}>{item.amount}</td>
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

export default PurchaseReport;
