import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { Search, FileText, FileSpreadsheet, RefreshCw, ChevronUp, Eye, Edit, Trash2 } from 'lucide-react';

const BillersList = () => {
  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Billers</h1>
          <p className={styles.subtitle}>Manage your billers</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn}><FileText size={18} color="#EA5455" /></button>
          <button className={styles.iconBtn}><FileSpreadsheet size={18} color="#28C76F" /></button>
          <button className={styles.iconBtn}><RefreshCw size={18} /></button>
          <button className={styles.iconBtn}><ChevronUp size={18} /></button>
          <button className={styles.btnPrimary} style={{backgroundColor: '#FF9F43', color: 'white', border: 'none'}}>
            + Add Biller
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
                <th>Biller</th>
                <th>Company Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Country</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { code: 'BI001', name: 'Shaun Farley', company: 'GreenTech Industries', email: 'shaun@example.com', phone: '+18647961254', country: 'USA', status: 'Active', avatar: 'https://i.pravatar.cc/150?img=21' },
                { code: 'BI002', name: 'Jenny Ellis', company: 'BlueSky Logistics', email: 'jenny@example.com', phone: '+13197521863', country: 'Germany', status: 'Active', avatar: 'https://i.pravatar.cc/150?img=22' },
                { code: 'BI003', name: 'Leon Baxter', company: 'EcoFarm Organics', email: 'leon@example.com', phone: '+18496275831', country: 'Japan', status: 'Active', avatar: 'https://i.pravatar.cc/150?img=23' },
                { code: 'BI004', name: 'Karen Flores', company: 'SmartTech Solutions', email: 'karen@example.com', phone: '+18731498524', country: 'Austria', status: 'Active', avatar: 'https://i.pravatar.cc/150?img=24' },
                { code: 'BI005', name: 'Michael Dawson', company: 'Fresh Supplies', email: 'michael@example.com', phone: '+12876928738', country: 'Turkey', status: 'Active', avatar: 'https://i.pravatar.cc/150?img=25' },
                { code: 'BI006', name: 'Karen Galvan', company: 'BrightSource Lighting', email: 'karen@example.com', phone: '+17534896148', country: 'Mexico', status: 'Active', avatar: 'https://i.pravatar.cc/150?img=26' },
                { code: 'BI007', name: 'Thomas Ward', company: 'GlobalTech Industries', email: 'thomas@example.com', phone: '+16482479624', country: 'France', status: 'Active', avatar: 'https://i.pravatar.cc/150?img=27' },
                { code: 'BI008', name: 'Aliza Duncan', company: 'HealthWell Pharma', email: 'aliza@example.com', phone: '+13175964827', country: 'Greece', status: 'Active', avatar: 'https://i.pravatar.cc/150?img=28' },
                { code: 'BI009', name: 'James Higham', company: 'HomeStyle Furnishings', email: 'james@example.com', phone: '+13875196482', country: 'Italy', status: 'Active', avatar: 'https://i.pravatar.cc/150?img=29' },
                { code: 'BI010', name: 'Jada Robinson', company: 'EcoLogistics Partners', email: 'robinson@example.com', phone: '+17586143284', country: 'China', status: 'Active', avatar: 'https://i.pravatar.cc/150?img=30' },
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
                  <td style={{color: '#6B7280'}}>{item.company}</td>
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

export default BillersList;
