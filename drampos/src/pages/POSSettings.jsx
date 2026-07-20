import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Settings, Globe, Smartphone, Monitor, DollarSign, List, ChevronDown, ChevronUp } from 'lucide-react';
import styles from './POSSettings.module.css';

const POSSettings = () => {
  return (
    <DashboardLayout>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Settings</h1>
        <p style={{ color: '#6B7280', fontSize: '0.9rem', marginTop: '0.25rem' }}>Manage your settings on portal</p>
      </div>

      <div className={styles.container}>
        {/* Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarItem}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Settings size={18} /> General Settings
            </div>
            <ChevronDown size={16} />
          </div>
          <div className={styles.sidebarItem}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Globe size={18} /> Website Settings
            </div>
            <ChevronDown size={16} />
          </div>
          <div>
            <div className={styles.sidebarItem} style={{ color: '#FF9F43' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Smartphone size={18} /> App Settings
              </div>
              <ChevronUp size={16} />
            </div>
            <div className={styles.subList}>
              <div className={styles.subItem}>Invoice Settings</div>
              <div className={styles.subItem}>Invoice Templates</div>
              <div className={styles.subItem}>Printer</div>
              <div className={`${styles.subItem} ${styles.active}`}>
                POS <span style={{ marginLeft: 'auto', width: '6px', height: '6px', backgroundColor: '#FF9F43', borderRadius: '50%' }}></span>
              </div>
              <div className={styles.subItem}>Signatures</div>
              <div className={styles.subItem}>Custom Fields</div>
            </div>
          </div>
          <div className={styles.sidebarItem}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Monitor size={18} /> System Settings
            </div>
            <ChevronDown size={16} />
          </div>
          <div className={styles.sidebarItem}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <DollarSign size={18} /> Financial Settings
            </div>
            <ChevronDown size={16} />
          </div>
          <div className={styles.sidebarItem}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <List size={18} /> Other Settings
            </div>
            <ChevronDown size={16} />
          </div>
        </div>

        {/* Main Content */}
        <div className={styles.main}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>POS Settings</div>
            <div className={styles.cardBody}>
              
              <div className={styles.formGroup}>
                <div className={styles.formLabel}>POS Printer</div>
                <div className={styles.formControl} style={{ maxWidth: '300px' }}>
                  <select className={styles.select}>
                    <option>Select</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <div className={styles.formLabel}>Payment Method</div>
                <div className={styles.formControl}>
                  <div className={styles.checkboxGroup}>
                    {['COD', 'Cheque', 'Card', 'Paypal', 'Bank Transfer', 'Cash'].map(method => (
                      <label key={method} className={styles.checkboxLabel}>
                        <input type="checkbox" style={{ width: '16px', height: '16px', accentColor: '#FF9F43' }} /> {method}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.formGroup}>
                <div className={styles.formLabel}>Enable Sound Effect</div>
                <div className={styles.formControl}>
                  <div className={styles.toggleSwitch}>
                    <div className={styles.toggleKnob}></div>
                  </div>
                </div>
              </div>

              <div className={styles.actions}>
                <button className={styles.cancelBtn}>Cancel</button>
                <button className={styles.saveBtn}>Save Changes</button>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default POSSettings;
