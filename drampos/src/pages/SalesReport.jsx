import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { FileText, FileSpreadsheet, RefreshCw, ChevronUp, Printer, Calendar } from 'lucide-react';

const SalesReport = () => {
  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Sales Report</h1>
          <p className={styles.subtitle}>Manage your Sales report</p>
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
          <h2 style={{fontSize: '1rem', fontWeight: 600, color: '#1B2850', margin: 0}}>Sales Report</h2>
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
                <th>Brand</th>
                <th>Category</th>
                <th>Sold Qty</th>
                <th>Sold Amount</th>
                <th>Instock Qty</th>
              </tr>
            </thead>
            <tbody>
              {[
                { sku: 'PT001', name: 'Lenovo IdeaPad 3', brand: 'Lenovo', category: 'Computers', sold: '05', amount: '$3000', instock: '100', img: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=50' },
                { sku: 'PT002', name: 'Beats Pro', brand: 'Beats', category: 'Electronics', sold: '10', amount: '$1600', instock: '140', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=50' },
                { sku: 'PT003', name: 'Nike Jordan', brand: 'Nike', category: 'Shoe', sold: '08', amount: '$880', instock: '300', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=50' },
                { sku: 'PT004', name: 'Apple Series 5 Watch', brand: 'Apple', category: 'Electronics', sold: '10', amount: '$1200', instock: '450', img: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=50' },
                { sku: 'PT005', name: 'Amazon Echo Dot', brand: 'Amazon', category: 'Electronics', sold: '05', amount: '$400', instock: '320', img: 'https://images.unsplash.com/photo-1518444065439-e931662788e2?w=50' },
                { sku: 'PT006', name: 'Sanford Chair Sofa', brand: 'Modern Wave', category: 'Furniture', sold: '07', amount: '$2240', instock: '650', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=50' },
                { sku: 'PT007', name: 'Red Premium Satchel', brand: 'Dior', category: 'Bags', sold: '15', amount: '$900', instock: '700', img: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=50' },
                { sku: 'PT008', name: 'Iphone 14 Pro', brand: 'Apple', category: 'Phone', sold: '12', amount: '$6480', instock: '630', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=50' },
              ].map((item, i) => (
                <tr key={i}>
                  <td style={{color: '#6B7280'}}>{item.sku}</td>
                  <td>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                      <img src={item.img} alt={item.name} style={{width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover'}} />
                      <span style={{color: '#1B2850', fontWeight: 500}}>{item.name}</span>
                    </div>
                  </td>
                  <td style={{color: '#6B7280'}}>{item.brand}</td>
                  <td style={{color: '#6B7280'}}>{item.category}</td>
                  <td style={{color: '#6B7280'}}>{item.sold}</td>
                  <td style={{color: '#6B7280'}}>{item.amount}</td>
                  <td style={{color: '#6B7280'}}>{item.instock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      
    </DashboardLayout>
  );
};

export default SalesReport;
