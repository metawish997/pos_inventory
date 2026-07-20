import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { Search, FileText, FileSpreadsheet, RefreshCw, ChevronUp, Eye, Edit, Trash2 } from 'lucide-react';
import AddCustomerModal from '../components/modals/AddCustomerModal';

const CustomersList = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Customers</h1>
          <p className={styles.subtitle}>Manage your customers</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn}><FileText size={18} color="#EA5455" /></button>
          <button className={styles.iconBtn}><FileSpreadsheet size={18} color="#28C76F" /></button>
          <button className={styles.iconBtn}><RefreshCw size={18} /></button>
          <button className={styles.iconBtn}><ChevronUp size={18} /></button>
          <button className={styles.btnPrimary} onClick={() => setIsAddOpen(true)} style={{backgroundColor: '#FF9F43', color: 'white', border: 'none'}}>
            + Add Customer
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
                <th>Customer</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Country</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { code: 'CU001', name: 'Carl Evans', email: 'carlevans@example.com', phone: '+12163547758', country: 'Germany', status: 'Active', avatar: 'https://i.pravatar.cc/150?img=11' },
                { code: 'CU002', name: 'Minerva Rameriz', email: 'rameriz@example.com', phone: '+11367529510', country: 'Japan', status: 'Active', avatar: 'https://i.pravatar.cc/150?img=12' },
                { code: 'CU003', name: 'Robert Lamon', email: 'robert@example.com', phone: '+15362789414', country: 'USA', status: 'Active', avatar: 'https://i.pravatar.cc/150?img=13' },
                { code: 'CU004', name: 'Patricia Lewis', email: 'patricia@example.com', phone: '+18513094627', country: 'Austria', status: 'Active', avatar: 'https://i.pravatar.cc/150?img=14' },
                { code: 'CU005', name: 'Mark Joslyn', email: 'markjoslyn@example.com', phone: '+14678219025', country: 'Turkey', status: 'Active', avatar: 'https://i.pravatar.cc/150?img=15' },
                { code: 'CU006', name: 'Marsha Betts', email: 'marshabetts@example.com', phone: '+10913278319', country: 'Mexico', status: 'Active', avatar: 'https://i.pravatar.cc/150?img=16' },
                { code: 'CU007', name: 'Daniel Jude', email: 'danieljude@example.com', phone: '+19125852947', country: 'France', status: 'Active', avatar: 'https://i.pravatar.cc/150?img=17' },
                { code: 'CU008', name: 'Emma Bates', email: 'emmabates@example.com', phone: '+13671835209', country: 'Greece', status: 'Active', avatar: 'https://i.pravatar.cc/150?img=18' },
                { code: 'CU009', name: 'Richard Fralick', email: 'richard@example.com', phone: '+19756194733', country: 'Italy', status: 'Active', avatar: 'https://i.pravatar.cc/150?img=19' },
                { code: 'CU010', name: 'Michelle Robison', email: 'robinson@example.com', phone: '+19167850925', country: 'China', status: 'Active', avatar: 'https://i.pravatar.cc/150?img=20' },
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
      
      <AddCustomerModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </DashboardLayout>
  );
};

export default CustomersList;
