import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Settings, Globe, Smartphone, Monitor, DollarSign, List, ChevronDown, ChevronUp } from 'lucide-react';
import styles from './POSSettings.module.css';

const POSSettings = () => {
  const [activeSection, setActiveSection] = useState('POS');
  
  // App Settings Dropdown Toggle
  const [appSettingsOpen, setAppSettingsOpen] = useState(true);

  // POS Settings States
  const [printer, setPrinter] = useState('Thermal Receipt Printer (80mm)');
  const [paymentMethods, setPaymentMethods] = useState(['Cash', 'Card', 'UPI', 'Bank Transfer']);
  const [enableSound, setEnableSound] = useState(true);

  // General Settings States
  const [storeName, setStoreName] = useState('Freshmart');
  const [storeEmail, setStoreEmail] = useState('freshmart@pos.com');
  const [storePhone, setStorePhone] = useState('9876543210');
  const [currency, setCurrency] = useState('INR (₹)');

  // Website Settings States
  const [systemName, setSystemName] = useState('Eronix Retail');
  const [websiteTitle, setWebsiteTitle] = useState('Eronix POS - Ultimate Inventory & Point of Sale System');

  // Invoice Settings States
  const [invoicePrefix, setInvoicePrefix] = useState('INV-');
  const [invoiceFooter, setInvoiceFooter] = useState('Thank you for shopping with us!');

  // Invoice Template States
  const [selectedTemplate, setSelectedTemplate] = useState('Modern');

  // Printer Connection States
  const [connectionType, setConnectionType] = useState('USB');

  // Signatures
  const [signatureName, setSignatureName] = useState('Manager');

  // Financial Settings
  const [taxRate, setTaxRate] = useState(18);
  const [financialYear, setFinancialYear] = useState('April');

  // System Settings
  const [timeZone, setTimeZone] = useState('IST (UTC+5:30)');

  // Load all settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('pos_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.printer) setPrinter(parsed.printer);
        if (parsed.paymentMethods) setPaymentMethods(parsed.paymentMethods);
        if (parsed.enableSound !== undefined) setEnableSound(parsed.enableSound);
        if (parsed.storeName) setStoreName(parsed.storeName);
        if (parsed.storeEmail) setStoreEmail(parsed.storeEmail);
        if (parsed.storePhone) setStorePhone(parsed.storePhone);
        if (parsed.currency) setCurrency(parsed.currency);
        if (parsed.systemName) setSystemName(parsed.systemName);
        if (parsed.websiteTitle) setWebsiteTitle(parsed.websiteTitle);
        if (parsed.invoicePrefix) setInvoicePrefix(parsed.invoicePrefix);
        if (parsed.invoiceFooter) setInvoiceFooter(parsed.invoiceFooter);
        if (parsed.selectedTemplate) setSelectedTemplate(parsed.selectedTemplate);
        if (parsed.connectionType) setConnectionType(parsed.connectionType);
        if (parsed.signatureName) setSignatureName(parsed.signatureName);
        if (parsed.taxRate) setTaxRate(parsed.taxRate);
        if (parsed.financialYear) setFinancialYear(parsed.financialYear);
        if (parsed.timeZone) setTimeZone(parsed.timeZone);
      } catch (e) {
        console.error('Failed to parse settings', e);
      }
    }
  }, []);

  const handleMethodToggle = (method) => {
    if (paymentMethods.includes(method)) {
      setPaymentMethods(paymentMethods.filter(m => m !== method));
    } else {
      setPaymentMethods([...paymentMethods, method]);
    }
  };

  const handleSave = (sectionName) => {
    const settings = {
      printer, paymentMethods, enableSound,
      storeName, storeEmail, storePhone, currency,
      systemName, websiteTitle,
      invoicePrefix, invoiceFooter,
      selectedTemplate, connectionType,
      signatureName, taxRate, financialYear, timeZone
    };
    localStorage.setItem('pos_settings', JSON.stringify(settings));
    alert(`${sectionName} saved successfully!`);
  };

  const renderActiveCard = () => {
    switch (activeSection) {
      case 'General Settings':
        return (
          <div className={styles.card}>
            <div className={styles.cardHeader}>General Settings</div>
            <div className={styles.cardBody}>
              <div className={styles.formGroup}>
                <div className={styles.formLabel}>Store Name</div>
                <div className={styles.formControl} style={{ maxWidth: '400px' }}>
                  <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} className={styles.input} />
                </div>
              </div>
              <div className={styles.formGroup}>
                <div className={styles.formLabel}>Store Email</div>
                <div className={styles.formControl} style={{ maxWidth: '400px' }}>
                  <input type="email" value={storeEmail} onChange={(e) => setStoreEmail(e.target.value)} className={styles.input} />
                </div>
              </div>
              <div className={styles.formGroup}>
                <div className={styles.formLabel}>Store Phone</div>
                <div className={styles.formControl} style={{ maxWidth: '400px' }}>
                  <input type="text" value={storePhone} onChange={(e) => setStorePhone(e.target.value)} className={styles.input} />
                </div>
              </div>
              <div className={styles.formGroup}>
                <div className={styles.formLabel}>Base Currency</div>
                <div className={styles.formControl} style={{ maxWidth: '200px' }}>
                  <select value={currency} onChange={(e) => setCurrency(e.target.value)} className={styles.select}>
                    <option value="INR (₹)">INR (₹)</option>
                    <option value="USD ($)">USD ($)</option>
                    <option value="EUR (€)">EUR (€)</option>
                  </select>
                </div>
              </div>
              <div className={styles.actions}>
                <button className={styles.saveBtn} onClick={() => handleSave('General Settings')}>Save Changes</button>
              </div>
            </div>
          </div>
        );
      case 'Website Settings':
        return (
          <div className={styles.card}>
            <div className={styles.cardHeader}>Website Settings</div>
            <div className={styles.cardBody}>
              <div className={styles.formGroup}>
                <div className={styles.formLabel}>System Name</div>
                <div className={styles.formControl} style={{ maxWidth: '400px' }}>
                  <input type="text" value={systemName} onChange={(e) => setSystemName(e.target.value)} className={styles.input} />
                </div>
              </div>
              <div className={styles.formGroup}>
                <div className={styles.formLabel}>Website Meta Title</div>
                <div className={styles.formControl} style={{ maxWidth: '400px' }}>
                  <input type="text" value={websiteTitle} onChange={(e) => setWebsiteTitle(e.target.value)} className={styles.input} />
                </div>
              </div>
              <div className={styles.actions}>
                <button className={styles.saveBtn} onClick={() => handleSave('Website Settings')}>Save Changes</button>
              </div>
            </div>
          </div>
        );
      case 'Invoice Settings':
        return (
          <div className={styles.card}>
            <div className={styles.cardHeader}>Invoice Settings</div>
            <div className={styles.cardBody}>
              <div className={styles.formGroup}>
                <div className={styles.formLabel}>Invoice Prefix</div>
                <div className={styles.formControl} style={{ maxWidth: '200px' }}>
                  <input type="text" value={invoicePrefix} onChange={(e) => setInvoicePrefix(e.target.value)} className={styles.input} />
                </div>
              </div>
              <div className={styles.formGroup}>
                <div className={styles.formLabel}>Invoice Footer Text</div>
                <div className={styles.formControl} style={{ maxWidth: '400px' }}>
                  <textarea value={invoiceFooter} onChange={(e) => setInvoiceFooter(e.target.value)} className={styles.textarea} style={{ width: '100%', minHeight: '80px', padding: '0.5rem' }} />
                </div>
              </div>
              <div className={styles.actions}>
                <button className={styles.saveBtn} onClick={() => handleSave('Invoice Settings')}>Save Changes</button>
              </div>
            </div>
          </div>
        );
      case 'Invoice Templates':
        return (
          <div className={styles.card}>
            <div className={styles.cardHeader}>Invoice Templates</div>
            <div className={styles.cardBody}>
              <div className={styles.formGroup}>
                <div className={styles.formLabel}>Choose Design Template</div>
                <div className={styles.formControl} style={{ maxWidth: '300px' }}>
                  <select value={selectedTemplate} onChange={(e) => setSelectedTemplate(e.target.value)} className={styles.select}>
                    <option value="Classic">Classic Layout</option>
                    <option value="Modern">Modern Clean Layout</option>
                    <option value="Elegant">Elegant Layout</option>
                  </select>
                </div>
              </div>
              <div className={styles.actions}>
                <button className={styles.saveBtn} onClick={() => handleSave('Invoice Templates')}>Save Template</button>
              </div>
            </div>
          </div>
        );
      case 'Printer':
        return (
          <div className={styles.card}>
            <div className={styles.cardHeader}>Printer Interface Settings</div>
            <div className={styles.cardBody}>
              <div className={styles.formGroup}>
                <div className={styles.formLabel}>Connection Mode</div>
                <div className={styles.formControl} style={{ maxWidth: '200px' }}>
                  <select value={connectionType} onChange={(e) => setConnectionType(e.target.value)} className={styles.select}>
                    <option value="USB">USB Cable</option>
                    <option value="Network">Ethernet / Wi-Fi (LAN)</option>
                    <option value="Bluetooth">Bluetooth Pairing</option>
                  </select>
                </div>
              </div>
              <div className={styles.actions}>
                <button className={styles.saveBtn} onClick={() => handleSave('Printer Connection Settings')}>Save Configuration</button>
              </div>
            </div>
          </div>
        );
      case 'Signatures':
        return (
          <div className={styles.card}>
            <div className={styles.cardHeader}>Signature Settings</div>
            <div className={styles.cardBody}>
              <div className={styles.formGroup}>
                <div className={styles.formLabel}>Signatory Title</div>
                <div className={styles.formControl} style={{ maxWidth: '400px' }}>
                  <input type="text" value={signatureName} onChange={(e) => setSignatureName(e.target.value)} className={styles.input} />
                </div>
              </div>
              <div className={styles.actions}>
                <button className={styles.saveBtn} onClick={() => handleSave('Signature Settings')}>Save Signatory</button>
              </div>
            </div>
          </div>
        );
      case 'Custom Fields':
        return (
          <div className={styles.card}>
            <div className={styles.cardHeader}>Custom Fields</div>
            <div className={styles.cardBody}>
              <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: '1.5rem' }}>No custom fields added yet. Setup extra properties for products, batches or sales here.</p>
              <button className={styles.saveBtn} style={{ backgroundColor: '#1B2850' }}>+ Add Custom Field</button>
            </div>
          </div>
        );
      case 'System Settings':
        return (
          <div className={styles.card}>
            <div className={styles.cardHeader}>System Configuration</div>
            <div className={styles.cardBody}>
              <div className={styles.formGroup}>
                <div className={styles.formLabel}>System Timezone</div>
                <div className={styles.formControl} style={{ maxWidth: '300px' }}>
                  <select value={timeZone} onChange={(e) => setTimeZone(e.target.value)} className={styles.select}>
                    <option value="IST (UTC+5:30)">IST (UTC+5:30)</option>
                    <option value="EST (UTC-5:00)">EST (UTC-5:00)</option>
                    <option value="GMT (UTC+0:00)">GMT (UTC+0:00)</option>
                  </select>
                </div>
              </div>
              <div className={styles.actions}>
                <button className={styles.saveBtn} onClick={() => handleSave('System Settings')}>Save Config</button>
              </div>
            </div>
          </div>
        );
      case 'Financial Settings':
        return (
          <div className={styles.card}>
            <div className={styles.cardHeader}>Financial Settings</div>
            <div className={styles.cardBody}>
              <div className={styles.formGroup}>
                <div className={styles.formLabel}>Standard Tax Rate (%)</div>
                <div className={styles.formControl} style={{ maxWidth: '150px' }}>
                  <input type="number" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} className={styles.input} />
                </div>
              </div>
              <div className={styles.formGroup}>
                <div className={styles.formLabel}>Financial Year Start</div>
                <div className={styles.formControl} style={{ maxWidth: '200px' }}>
                  <select value={financialYear} onChange={(e) => setFinancialYear(e.target.value)} className={styles.select}>
                    <option value="April">April</option>
                    <option value="January">January</option>
                  </select>
                </div>
              </div>
              <div className={styles.actions}>
                <button className={styles.saveBtn} onClick={() => handleSave('Financial Settings')}>Save Financials</button>
              </div>
            </div>
          </div>
        );
      case 'Other Settings':
        return (
          <div className={styles.card}>
            <div className={styles.cardHeader}>Maintenance & Other Actions</div>
            <div className={styles.cardBody}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className={styles.saveBtn} style={{ backgroundColor: '#10B981' }} onClick={() => alert('Database Backup Initiated!')}>Download Database Backup</button>
                <button className={styles.saveBtn} style={{ backgroundColor: '#EF4444' }} onClick={() => { if(confirm('Are you sure you want to reset the cache and local system configurations?')) localStorage.clear(); window.location.reload(); }}>Reset Local Storage Cache</button>
              </div>
            </div>
          </div>
        );
      case 'POS':
      default:
        return (
          <div className={styles.card}>
            <div className={styles.cardHeader}>POS Settings</div>
            <div className={styles.cardBody}>
              
              <div className={styles.formGroup}>
                <div className={styles.formLabel}>POS Printer</div>
                <div className={styles.formControl} style={{ maxWidth: '300px' }}>
                  <select 
                    className={styles.select} 
                    value={printer} 
                    onChange={(e) => setPrinter(e.target.value)}
                    style={{ border: '1px solid #E5E7EB', borderRadius: '4px', padding: '0.5rem', width: '100%' }}
                  >
                    <option value="Thermal Receipt Printer (80mm)">Thermal Receipt Printer (80mm)</option>
                    <option value="Thermal Receipt Printer (58mm)">Thermal Receipt Printer (58mm)</option>
                    <option value="Standard Laser Jet A4">Standard Laser Jet A4</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <div className={styles.formLabel}>Payment Method</div>
                <div className={styles.formControl}>
                  <div className={styles.checkboxGroup}>
                    {['COD', 'Cheque', 'Card', 'Paypal', 'Bank Transfer', 'Cash', 'UPI'].map(method => (
                      <label key={method} className={styles.checkboxLabel} style={{ display: 'inline-flex', alignItems: 'center', marginRight: '1.5rem', cursor: 'pointer', gap: '0.5rem' }}>
                        <input 
                          type="checkbox" 
                          checked={paymentMethods.includes(method)}
                          onChange={() => handleMethodToggle(method)}
                          style={{ width: '16px', height: '16px', accentColor: '#FF9F43' }} 
                        /> {method}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.formGroup}>
                <div className={styles.formLabel}>Enable Sound Effect</div>
                <div className={styles.formControl}>
                  <div 
                    className={styles.toggleSwitch} 
                    onClick={() => setEnableSound(!enableSound)}
                    style={{ 
                      width: '50px', 
                      height: '24px', 
                      borderRadius: '12px', 
                      backgroundColor: enableSound ? '#FF9F43' : '#E5E7EB', 
                      position: 'relative', 
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <div 
                      className={styles.toggleKnob}
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        position: 'absolute',
                        top: '2px',
                        left: enableSound ? '28px' : '2px',
                        transition: 'left 0.2s'
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className={styles.actions}>
                <button className={styles.cancelBtn} onClick={() => window.history.back()}>Cancel</button>
                <button className={styles.saveBtn} onClick={() => handleSave('POS Settings')}>Save Changes</button>
              </div>
              
            </div>
          </div>
        );
    }
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Settings</h1>
        <p style={{ color: '#6B7280', fontSize: '0.9rem', marginTop: '0.25rem' }}>Manage your settings on portal</p>
      </div>

      <div className={styles.container}>
        {/* Sidebar */}
        <div className={styles.sidebar}>
          <div className={`${styles.sidebarItem} ${activeSection === 'General Settings' ? styles.active : ''}`} onClick={() => setActiveSection('General Settings')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Settings size={18} /> General Settings
            </div>
          </div>
          <div className={`${styles.sidebarItem} ${activeSection === 'Website Settings' ? styles.active : ''}`} onClick={() => setActiveSection('Website Settings')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Globe size={18} /> Website Settings
            </div>
          </div>
          <div>
            <div className={styles.sidebarItem} style={{ color: '#FF9F43', cursor: 'pointer' }} onClick={() => setAppSettingsOpen(!appSettingsOpen)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Smartphone size={18} /> App Settings
              </div>
              {appSettingsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            {appSettingsOpen && (
              <div className={styles.subList}>
                <div className={`${styles.subItem} ${activeSection === 'Invoice Settings' ? styles.active : ''}`} onClick={() => setActiveSection('Invoice Settings')}>Invoice Settings</div>
                <div className={`${styles.subItem} ${activeSection === 'Invoice Templates' ? styles.active : ''}`} onClick={() => setActiveSection('Invoice Templates')}>Invoice Templates</div>
                <div className={`${styles.subItem} ${activeSection === 'Printer' ? styles.active : ''}`} onClick={() => setActiveSection('Printer')}>Printer</div>
                <div className={`${styles.subItem} ${activeSection === 'POS' ? styles.active : ''}`} onClick={() => setActiveSection('POS')}>
                  POS <span style={{ marginLeft: 'auto', width: '6px', height: '6px', backgroundColor: '#FF9F43', borderRadius: '50%' }}></span>
                </div>
                <div className={`${styles.subItem} ${activeSection === 'Signatures' ? styles.active : ''}`} onClick={() => setActiveSection('Signatures')}>Signatures</div>
                <div className={`${styles.subItem} ${activeSection === 'Custom Fields' ? styles.active : ''}`} onClick={() => setActiveSection('Custom Fields')}>Custom Fields</div>
              </div>
            )}
          </div>
          <div className={`${styles.sidebarItem} ${activeSection === 'System Settings' ? styles.active : ''}`} onClick={() => setActiveSection('System Settings')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Monitor size={18} /> System Settings
            </div>
          </div>
          <div className={`${styles.sidebarItem} ${activeSection === 'Financial Settings' ? styles.active : ''}`} onClick={() => setActiveSection('Financial Settings')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <DollarSign size={18} /> Financial Settings
            </div>
          </div>
          <div className={`${styles.sidebarItem} ${activeSection === 'Other Settings' ? styles.active : ''}`} onClick={() => setActiveSection('Other Settings')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <List size={18} /> Other Settings
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className={styles.main}>
          {renderActiveCard()}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default POSSettings;
