import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { Edit, Trash2, Shield, Plus, X } from 'lucide-react';

const RolesPermissions = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Roles & Permission</h1>
          <p className={styles.subtitle}>Manage your roles</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.btnPrimary} style={{backgroundColor: '#FF9F43', color: 'white', border: 'none'}} onClick={() => setShowAddModal(true)}>
            <Plus size={18} />
            <span>Add Role</span>
          </button>
        </div>
      </div>

      <Card className={styles.tableCard}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid #F3F4F6'}}>
          <div style={{position: 'relative', width: '300px'}}>
            <input type="text" placeholder="Search" className={styles.input} style={{paddingLeft: '2.5rem', width: '100%', boxSizing: 'border-box'}} />
          </div>
          <div>
            <select className={styles.select} style={{width: 'auto'}}>
              <option>Status</option>
            </select>
          </div>
        </div>

        <div className={styles.tableResponsive}>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>Role</th>
                <th>Created Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Admin', date: '12 Sep 2024', status: 'Active' },
                { name: 'Manager', date: '24 Oct 2024', status: 'Active' },
                { name: 'Salesman', date: '18 Feb 2024', status: 'Active' },
                { name: 'Supervisor', date: '17 Oct 2024', status: 'Active' },
                { name: 'Store Keeper', date: '20 Jul 2024', status: 'Active' },
                { name: 'Inventory Manager', date: '10 Apr 2024', status: 'Active' },
                { name: 'Delivery Biker', date: '29 Aug 2024', status: 'Active' },
                { name: 'Employee', date: '22 Feb 2024', status: 'Active' },
                { name: 'Cashier', date: '03 Nov 2024', status: 'Active' },
                { name: 'Quality Analyst', date: '17 Dec 2024', status: 'Active' },
              ].map((item, i) => (
                <tr key={i}>
                  <td><input type="checkbox" /></td>
                  <td style={{color: '#1B2850', fontWeight: 500}}>{item.name}</td>
                  <td style={{color: '#6B7280'}}>{item.date}</td>
                  <td>
                    <span style={{
                      backgroundColor: item.status === 'Active' ? '#E8F9F0' : '#FCEAEA', 
                      color: item.status === 'Active' ? '#28C76F' : '#EA5455', 
                      padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600
                    }}>&bull; {item.status}</span>
                  </td>
                  <td>
                    <div style={{display: 'flex', gap: '0.5rem'}}>
                      <button className={styles.iconBtn}><Shield size={16} /></button>
                      <button className={styles.iconBtn}><Edit size={16} /></button>
                      <button className={styles.iconBtn}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {showAddModal && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
          <div style={{backgroundColor: 'white', borderRadius: '8px', width: '500px', maxWidth: '90%'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid #E5E7EB'}}>
              <h2 style={{margin: 0, fontSize: '1.25rem', color: '#1B2850'}}>Create Role</h2>
              <button onClick={() => setShowAddModal(false)} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#EA5455'}}><X size={24} /></button>
            </div>
            <div style={{padding: '1.5rem'}}>
              <div style={{marginBottom: '1.5rem'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#1B2850'}}>Role Name</label>
                <input type="text" className={styles.input} style={{width: '100%', boxSizing: 'border-box'}} />
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
                 <label style={{fontSize: '0.875rem', color: '#1B2850'}}>Status</label>
                 <div style={{width: '36px', height: '20px', backgroundColor: '#28C76F', borderRadius: '10px', position: 'relative', cursor: 'pointer'}}>
                    <div style={{width: '16px', height: '16px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', right: '2px', top: '2px'}}></div>
                 </div>
              </div>
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem'}}>
                <button onClick={() => setShowAddModal(false)} className={styles.btnSecondary} style={{backgroundColor: '#1B2850', color: 'white', border: 'none', padding: '0.5rem 1.5rem'}}>Cancel</button>
                <button className={styles.btnPrimary} style={{backgroundColor: '#FF9F43', color: 'white', border: 'none', padding: '0.5rem 1.5rem'}}>Create Role</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default RolesPermissions;
