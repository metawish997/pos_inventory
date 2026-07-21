import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { Trash2, Plus, X, RefreshCw, Search } from 'lucide-react';
import { getUsers, createUser, deleteUser } from '../services/userService';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsers();
      if (res.success) setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      alert('Please fill out name and email');
      return;
    }
    try {
      setSubmitting(true);
      const res = await createUser({
        name,
        email,
        phone,
        password: password || '123456',
        status: 'Active'
      });
      if (res.success) {
        alert('User created successfully!');
        setName('');
        setEmail('');
        setPhone('');
        setPassword('');
        setShowAddModal(false);
        fetchUsers();
      }
    } catch (err) {
      alert(`Failed to create user: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        fetchUsers();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const filteredUsers = users.filter(u =>
    (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Users</h1>
          <p className={styles.subtitle}>Manage System Users & Roles</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} onClick={fetchUsers}><RefreshCw size={18} /></button>
          <button className={styles.btnPrimary} style={{backgroundColor: '#FF9F43', color: 'white', border: 'none'}} onClick={() => setShowAddModal(true)}>
            <Plus size={18} />
            <span>Add User</span>
          </button>
        </div>
      </div>

      <Card className={styles.tableCard}>
        <div className={styles.filterBar}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search User Name or Email" 
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
                <th>User Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>Loading Users...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>No user records found</td>
                </tr>
              ) : (
                filteredUsers.map((item) => (
                  <tr key={item._id}>
                    <td><input type="checkbox" /></td>
                    <td>
                      <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                        <div style={{width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600}}>
                          {(item.name || 'U')[0].toUpperCase()}
                        </div>
                        <span style={{color: '#1B2850', fontWeight: 500}}>{item.name}</span>
                      </div>
                    </td>
                    <td style={{color: '#6B7280'}}>{item.phone || '-'}</td>
                    <td style={{color: '#6B7280'}}>{item.email}</td>
                    <td style={{color: '#6B7280'}}>{item.role?.name || 'Admin'}</td>
                    <td>
                      <span style={{
                        backgroundColor: '#E8F9F0', color: '#28C76F', 
                        padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600
                      }}>&bull; {item.status || 'Active'}</span>
                    </td>
                    <td>
                      <button 
                        style={{border: 'none', background: 'none', cursor: 'pointer', color: '#EA5455'}}
                        onClick={() => handleDelete(item._id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
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
            <form onSubmit={handleCreateUser} style={{padding: '1.5rem'}}>
              <div style={{marginBottom: '1rem'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#1B2850'}}>User Name <span style={{color: '#EA5455'}}>*</span></label>
                <input type="text" className={styles.input} value={name} onChange={(e) => setName(e.target.value)} required style={{width: '100%', boxSizing: 'border-box'}} />
              </div>
              <div style={{marginBottom: '1rem'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#1B2850'}}>Email <span style={{color: '#EA5455'}}>*</span></label>
                <input type="email" className={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} required style={{width: '100%', boxSizing: 'border-box'}} />
              </div>
              <div style={{marginBottom: '1rem'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#1B2850'}}>Phone</label>
                <input type="text" className={styles.input} value={phone} onChange={(e) => setPhone(e.target.value)} style={{width: '100%', boxSizing: 'border-box'}} />
              </div>
              <div style={{marginBottom: '1.5rem'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#1B2850'}}>Password</label>
                <input type="password" className={styles.input} placeholder="Default: 123456" value={password} onChange={(e) => setPassword(e.target.value)} style={{width: '100%', boxSizing: 'border-box'}} />
              </div>
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem'}}>
                <button type="button" onClick={() => setShowAddModal(false)} className={styles.btnSecondary} style={{backgroundColor: '#1B2850', color: 'white', border: 'none', padding: '0.5rem 1.5rem', cursor: 'pointer'}}>Cancel</button>
                <button type="submit" disabled={submitting} className={styles.btnPrimary} style={{backgroundColor: '#FF9F43', color: 'white', border: 'none', padding: '0.5rem 1.5rem', cursor: 'pointer'}}>
                  {submitting ? 'Creating...' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default UsersList;
