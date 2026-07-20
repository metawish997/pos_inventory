import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';

const Profile = () => {
  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Profile</h1>
          <p className={styles.subtitle}>User Profile</p>
        </div>
      </div>

      <Card style={{padding: '1.5rem'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem'}}>
           <div style={{color: '#FF9F43'}}>
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
           </div>
           <h2 style={{fontSize: '1.125rem', fontWeight: 600, color: '#1B2850', margin: 0}}>Basic Information</h2>
        </div>

        <div style={{display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '2rem'}}>
           <div style={{position: 'relative'}}>
              <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100" alt="Profile" style={{width: '100px', height: '100px', borderRadius: '8px', objectFit: 'cover'}} />
              <div style={{position: 'absolute', top: '-8px', right: '-8px', backgroundColor: '#EA5455', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '12px'}}>×</div>
           </div>
           <div>
              <button style={{backgroundColor: '#FF9F43', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', marginBottom: '0.5rem'}}>Change Image</button>
              <div style={{fontSize: '0.875rem', color: '#6B7280'}}>Upload an image below 2 MB, Accepted File format JPG, PNG</div>
           </div>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem'}}>
           <div>
             <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#1B2850'}}>First Name <span style={{color: '#EA5455'}}>*</span></label>
             <input type="text" className={styles.input} defaultValue="Jeffry" style={{width: '100%', boxSizing: 'border-box'}} />
           </div>
           <div>
             <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#1B2850'}}>Last Name <span style={{color: '#EA5455'}}>*</span></label>
             <input type="text" className={styles.input} defaultValue="Jordan" style={{width: '100%', boxSizing: 'border-box'}} />
           </div>
           <div>
             <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#1B2850'}}>Email <span style={{color: '#EA5455'}}>*</span></label>
             <input type="email" className={styles.input} defaultValue="jeffry@example.com" style={{width: '100%', boxSizing: 'border-box'}} />
           </div>
           <div>
             <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#1B2850'}}>Phone Number <span style={{color: '#EA5455'}}>*</span></label>
             <input type="text" className={styles.input} defaultValue="+17468314286" style={{width: '100%', boxSizing: 'border-box'}} />
           </div>
           <div>
             <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#1B2850'}}>User Name <span style={{color: '#EA5455'}}>*</span></label>
             <input type="text" className={styles.input} defaultValue="Jeffry Jordan" style={{width: '100%', boxSizing: 'border-box'}} />
           </div>
           <div>
             <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#1B2850'}}>Password <span style={{color: '#EA5455'}}>*</span></label>
             <input type="password" className={styles.input} defaultValue="password" style={{width: '100%', boxSizing: 'border-box'}} />
           </div>
        </div>

        <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem'}}>
          <button className={styles.btnSecondary} style={{backgroundColor: '#1B2850', color: 'white', border: 'none', padding: '0.5rem 1.5rem'}}>Cancel</button>
          <button className={styles.btnPrimary} style={{backgroundColor: '#FF9F43', color: 'white', border: 'none', padding: '0.5rem 1.5rem'}}>Save Changes</button>
        </div>
      </Card>
      
    </DashboardLayout>
  );
};

export default Profile;
