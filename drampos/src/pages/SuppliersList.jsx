import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { Search, FileText, FileSpreadsheet, RefreshCw, ChevronUp, Eye, Edit, Trash2 } from 'lucide-react';

const SuppliersList = () => {
  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Suppliers</h1>
          <p className={styles.subtitle}>Manage your suppliers</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn}><FileText size={18} color="#EA5455" /></button>
          <button className={styles.iconBtn}><FileSpreadsheet size={18} color="#28C76F" /></button>
          <button className={styles.iconBtn}><RefreshCw size={18} /></button>
          <button className={styles.iconBtn}><ChevronUp size={18} /></button>
          <button className={styles.btnPrimary} style={{backgroundColor: '#FF9F43', color: 'white', border: 'none'}}>
            + Add Supplier
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
              <option>Status</option>
            </select>
          </div>
        </div>

        <div className={styles.tableResponsive}>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>Code</th>
                <th>Supplier</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Country</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { code: 'SU001', name: 'Apex Computers', email: 'apexcomputers@example.com', phone: '+15964712634', country: 'Germany', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Apex+Computers&background=random' },
                { code: 'SU002', name: 'Beats Headphones', email: 'beatsheadphone@example.com', phone: '+16372895190', country: 'Japan', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Beats+Headphones&background=random' },
                { code: 'SU003', name: 'Dazzle Shoes', email: 'dazzleshoes@example.com', phone: '+17589201739', country: 'USA', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Dazzle+Shoes&background=random' },
                { code: 'SU004', name: 'Best Accessories', email: 'bestaccessories@example.com', phone: '+18934092467', country: 'Austria', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Best+Accessories&background=random' },
                { code: 'SU005', name: 'A-Z Store', email: 'a2zstore@example.com', phone: '+12568749035', country: 'Turkey', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=A-Z+Store&background=random' },
                { code: 'SU006', name: 'Hatimi Hardwares', email: 'hatimihardware@example.com', phone: '+19054674627', country: 'Mexico', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Hatimi+Hardwares&background=random' },
                { code: 'SU007', name: 'Aesthetic Bags', email: 'aestheticbags@example.com', phone: '+18943670365', country: 'France', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Aesthetic+Bags&background=random' },
                { code: 'SU008', name: 'Alpha Mobiles', email: 'alphamobiles@example.com', phone: '+16473894103', country: 'Greece', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Alpha+Mobiles&background=random' },
                { code: 'SU009', name: 'Sigma Chairs', email: 'sigmachair@example.com', phone: '+17590274536', country: 'Italy', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Sigma+Chairs&background=random' },
                { code: 'SU010', name: 'Zenith Bags', email: 'zenithbags@example.com', phone: '+12564098473', country: 'China', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Zenith+Bags&background=random' },
              ].map((item, i) => (
                <tr key={i}>
                  <td><input type="checkbox" /></td>
                  <td style={{color: '#6B7280'}}>{item.code}</td>
                  <td>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                      <img src={item.avatar} alt={item.name} style={{width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover'}} />
                      <span style={{color: '#1B2850', fontWeight: 500}}>{item.name}</span>
                    </div>
                  </td>
                  <td style={{color: '#6B7280'}}>{item.email}</td>
                  <td style={{color: '#6B7280'}}>{item.phone}</td>
                  <td style={{color: '#6B7280'}}>{item.country}</td>
                  <td>
                    <span style={{
                      backgroundColor: item.status === 'Active' ? '#28C76F' : '#EA5455', 
                      color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'
                    }}>&bull; {item.status}</span>
                  </td>
                  <td>
                    <div className={styles.actionCell}>
                      <button className={styles.actionBtn}><Eye size={16} /></button>
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
      
    </DashboardLayout>
  );
};

export default SuppliersList;
