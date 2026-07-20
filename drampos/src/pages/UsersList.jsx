import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { Edit, Trash2, Eye, Plus, X } from 'lucide-react';

const UsersList = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Users</h1>
          <p className={styles.subtitle}>Manage your users</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.btnPrimary} style={{backgroundColor: '#FF9F43', color: 'white', border: 'none'}} onClick={() => setShowAddModal(true)}>
            <Plus size={18} />
            <span>Add User</span>
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
                <th>User Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Henry Bryant', phone: '+12498345785', email: 'henry@example.com', role: 'Admin', status: 'Active', img: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=50' },
                { name: 'Jenny Ellis', phone: '+13178964582', email: 'jenny@example.com', role: 'Manager', status: 'Active', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50' },
                { name: 'Leon Baxter', phone: '+12796183487', email: 'leon@example.com', role: 'Salesman', status: 'Active', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50' },
                { name: 'Karen Flores', phone: '+17538647943', email: 'karen@example.com', role: 'Supervisor', status: 'Active', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50' },
                { name: 'Michael Dawson', phone: '+13798132475', email: 'michael@example.com', role: 'Store Keeper', status: 'Active', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50' },
                { name: 'Karen Galvan', phone: '+17596341894', email: 'karen@example.com', role: 'Purchase', status: 'Active', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50' },
                { name: 'Thomas Ward', phone: '+12973548678', email: 'thomas@example.com', role: 'Delivery Biker', status: 'Active', img: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=50' },
                { name: 'Aliza Duncan', phone: '+13147858357', email: 'aliza@example.com', role: 'Maintenance', status: 'Active', img: 'https://images.unsplash.com/photo-1547425260-76bcad8ce875?w=50' },
                { name: 'James Higham', phone: '+11978348626', email: 'james@example.com', role: 'Quality Analyst', status: 'Active', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=50' },
                { name: 'Jada Robinson', phone: '+12678934561', email: 'robinson@example.com', role: 'Accountant', status: 'Active', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=50' },
              ].map((item, i) => (
                <tr key={i}>
                  <td><input type="checkbox" /></td>
                  <td>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                      <img src={item.img} alt={item.name} style={{width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover'}} />
                      <span style={{color: '#1B2850', fontWeight: 500}}>{item.name}</span>
                    </div>
                  </td>
                  <td style={{color: '#6B7280'}}>{item.phone}</td>
                  <td style={{color: '#6B7280'}}>{item.email}</td>
                  <td style={{color: '#6B7280'}}>{item.role}</td>
                  <td>
                    <span style={{
                      backgroundColor: item.status === 'Active' ? '#E8F9F0' : '#FCEAEA', 
                      color: item.status === 'Active' ? '#28C76F' : '#EA5455', 
                      padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600
                    }}>&bull; {item.status}</span>
                  </td>
                  <td>
                    <div style={{display: 'flex', gap: '0.5rem'}}>
                      <button className={styles.iconBtn}><Eye size={16} /></button>
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
          <div style={{backgroundColor: 'white', borderRadius: '8px', width: '500px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid #E5E7EB'}}>
              <h2 style={{margin: 0, fontSize: '1.25rem', color: '#1B2850'}}>Add User</h2>
              <button onClick={() => setShowAddModal(false)} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#EA5455'}}><X size={24} /></button>
            </div>
            <div style={{padding: '1.5rem'}}>
              <div style={{display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem'}}>
                 <div style={{width: '100px', height: '100px', border: '2px dashed #E5E7EB', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#6B7280'}}>
                    <Plus size={24} />
                    <span style={{fontSize: '0.75rem'}}>Add Image</span>
                 </div>
                 <div>
                    <button style={{backgroundColor: '#FF9F43', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', marginBottom: '0.5rem'}}>Upload Image</button>
                    <div style={{fontSize: '0.75rem', color: '#6B7280'}}>JPEG, PNG up to 2 MB</div>
                 </div>
              </div>
              <div style={{marginBottom: '1rem'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#1B2850'}}>User <span style={{color: '#EA5455'}}>*</span></label>
                <input type="text" className={styles.input} style={{width: '100%', boxSizing: 'border-box'}} />
              </div>
              <div style={{marginBottom: '1rem'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#1B2850'}}>Role <span style={{color: '#EA5455'}}>*</span></label>
                <select className={styles.select} style={{width: '100%', boxSizing: 'border-box'}}><option>Select</option></select>
              </div>
              <div style={{marginBottom: '1rem'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#1B2850'}}>Email <span style={{color: '#EA5455'}}>*</span></label>
                <input type="email" className={styles.input} style={{width: '100%', boxSizing: 'border-box'}} />
              </div>
              <div style={{marginBottom: '1rem'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#1B2850'}}>Phone <span style={{color: '#EA5455'}}>*</span></label>
                <input type="text" className={styles.input} style={{width: '100%', boxSizing: 'border-box'}} />
              </div>
              <div style={{display: 'flex', gap: '1rem', marginBottom: '1rem'}}>
                <div style={{flex: 1}}>
                    <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#1B2850'}}>Password <span style={{color: '#EA5455'}}>*</span></label>
                    <input type="password" className={styles.input} style={{width: '100%', boxSizing: 'border-box'}} />
                </div>
                <div style={{flex: 1}}>
                    <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#1B2850'}}>Confirm Password <span style={{color: '#EA5455'}}>*</span></label>
                    <input type="password" className={styles.input} style={{width: '100%', boxSizing: 'border-box'}} />
                </div>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
                 <label style={{fontSize: '0.875rem', color: '#1B2850'}}>Status</label>
                 <div style={{width: '36px', height: '20px', backgroundColor: '#28C76F', borderRadius: '10px', position: 'relative', cursor: 'pointer'}}>
                    <div style={{width: '16px', height: '16px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', right: '2px', top: '2px'}}></div>
                 </div>
              </div>
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem'}}>
                <button onClick={() => setShowAddModal(false)} className={styles.btnSecondary} style={{backgroundColor: '#1B2850', color: 'white', border: 'none', padding: '0.5rem 1.5rem'}}>Cancel</button>
                <button className={styles.btnPrimary} style={{backgroundColor: '#FF9F43', color: 'white', border: 'none', padding: '0.5rem 1.5rem'}}>Add User</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default UsersList;
