import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { Plus, X, RefreshCw, Search } from 'lucide-react';
import { getRoles, createRole } from '../services/userService';

const RolesPermissions = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [roleName, setRoleName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const res = await getRoles();
      if (res.success) setRoles(res.data);
    } catch (err) {
      console.error('Failed to fetch roles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleCreateRole = async (e) => {
    e.preventDefault();
    if (!roleName) return;
    try {
      setSubmitting(true);
      const res = await createRole({ name: roleName, description: `${roleName} Role` });
      if (res.success) {
        alert('Role created successfully!');
        setRoleName('');
        setShowAddModal(false);
        fetchRoles();
      }
    } catch (err) {
      alert(`Failed to create role: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRoles = roles.filter(r => (r.name || '').toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Roles & Permissions</h1>
          <p className={styles.subtitle}>Manage System Roles</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} onClick={fetchRoles}><RefreshCw size={18} /></button>
          <button className={styles.btnPrimary} style={{backgroundColor: '#FF9F43', color: 'white', border: 'none'}} onClick={() => setShowAddModal(true)}>
            <Plus size={18} />
            <span>Add Role</span>
          </button>
        </div>
      </div>

      <Card className={styles.tableCard}>
        <div className={styles.filterBar}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search Role Name" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.tableResponsive}>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>Role Name</th>
                <th>Description</th>
                <th>Created Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" style={{textAlign: 'center', padding: '2rem'}}>Loading Roles...</td>
                </tr>
              ) : filteredRoles.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{textAlign: 'center', padding: '2rem'}}>No roles found</td>
                </tr>
              ) : (
                filteredRoles.map((item) => (
                  <tr key={item._id}>
                    <td><input type="checkbox" /></td>
                    <td style={{color: '#1B2850', fontWeight: 600}}>{item.name}</td>
                    <td style={{color: '#6B7280'}}>{item.description || 'System Role'}</td>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {showAddModal && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
          <div style={{backgroundColor: 'white', borderRadius: '8px', width: '450px', maxWidth: '90%'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid #E5E7EB'}}>
              <h2 style={{margin: 0, fontSize: '1.25rem', color: '#1B2850'}}>Create Role</h2>
              <button onClick={() => setShowAddModal(false)} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#EA5455'}}><X size={24} /></button>
            </div>
            <form onSubmit={handleCreateRole} style={{padding: '1.5rem'}}>
              <div style={{marginBottom: '1.5rem'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#1B2850'}}>Role Name <span style={{color: '#EA5455'}}>*</span></label>
                <input type="text" className={styles.input} value={roleName} onChange={(e) => setRoleName(e.target.value)} required style={{width: '100%', boxSizing: 'border-box'}} />
              </div>
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem'}}>
                <button type="button" onClick={() => setShowAddModal(false)} className={styles.btnSecondary} style={{backgroundColor: '#1B2850', color: 'white', border: 'none', padding: '0.5rem 1.5rem', cursor: 'pointer'}}>Cancel</button>
                <button type="submit" disabled={submitting} className={styles.btnPrimary} style={{backgroundColor: '#FF9F43', color: 'white', border: 'none', padding: '0.5rem 1.5rem', cursor: 'pointer'}}>
                  {submitting ? 'Creating...' : 'Add Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default RolesPermissions;
