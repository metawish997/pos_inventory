import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { API_BASE_URL } from '../api/endpoints';

const Profile = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        setFirstName(u.firstName || u.name || 'Admin');
        setLastName(u.lastName || '');
        setEmail(u.email || 'admin@pos.com');
        setPhone(u.phone || '+1234567890');
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          ...(password && { password })
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert('Profile updated successfully!');
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = { ...storedUser, firstName, lastName, email, phone };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setPassword('');
      } else {
        alert(`Failed to update profile: ${data.message || 'Unknown error'}`);
      }
    } catch (err) {
      alert(`Error updating profile: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Profile</h1>
          <p className={styles.subtitle}>Manage Profile Settings</p>
        </div>
      </div>

      <Card style={{padding: '1.5rem'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem'}}>
           <div style={{color: '#FF9F43'}}>
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
           </div>
           <h2 style={{fontSize: '1.125rem', fontWeight: 600, color: '#1B2850', margin: 0}}>Personal Information</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem'}}>
             <div>
               <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#1B2850'}}>First Name <span style={{color: '#EA5455'}}>*</span></label>
               <input type="text" className={styles.input} value={firstName} onChange={(e) => setFirstName(e.target.value)} required style={{width: '100%', boxSizing: 'border-box'}} />
             </div>
             <div>
               <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#1B2850'}}>Last Name</label>
               <input type="text" className={styles.input} value={lastName} onChange={(e) => setLastName(e.target.value)} style={{width: '100%', boxSizing: 'border-box'}} />
             </div>
             <div>
               <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#1B2850'}}>Email <span style={{color: '#EA5455'}}>*</span></label>
               <input type="email" className={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} required style={{width: '100%', boxSizing: 'border-box'}} />
             </div>
             <div>
               <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#1B2850'}}>Phone Number</label>
               <input type="text" className={styles.input} value={phone} onChange={(e) => setPhone(e.target.value)} style={{width: '100%', boxSizing: 'border-box'}} />
             </div>
             <div style={{gridColumn: 'span 2'}}>
               <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#1B2850'}}>New Password (leave blank to keep current)</label>
               <input type="password" className={styles.input} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter new password" style={{width: '100%', boxSizing: 'border-box'}} />
             </div>
          </div>

          <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem'}}>
            <button type="submit" disabled={saving} className={styles.btnPrimary} style={{backgroundColor: '#FF9F43', color: 'white', border: 'none', padding: '0.5rem 1.5rem', cursor: 'pointer'}}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Card>
    </DashboardLayout>
  );
};

export default Profile;
