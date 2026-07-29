import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Settings, Globe, Smartphone, Monitor, DollarSign, List, ChevronDown, ChevronUp, Edit2, Upload, X, RotateCw } from 'lucide-react';
import styles from './POSSettings.module.css';
import { API_BASE_URL } from '../api/endpoints';

const removeImageBackground = (base64Str) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      
      const threshold = 240;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];
        if (r > threshold && g > threshold && b > threshold) {
          data[i+3] = 0; // Transparent
        }
      }
      ctx.putImageData(imgData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => resolve(base64Str);
  });
};

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
  const [storeAddress, setStoreAddress] = useState('3099 Kennedy Court Framingham, MA 01702');
  const [currency, setCurrency] = useState('INR (₹)');

  // Organization Specific Settings (Billed By Details)
  const [orgName, setOrgName] = useState('Naarendra singh');
  const [orgLocation, setOrgLocation] = useState('India');
  const [orgAddress1, setOrgAddress1] = useState('702, Shagun Arcade');
  const [orgAddress2, setOrgAddress2] = useState('Above Apna swetts');
  const [orgCity, setOrgCity] = useState('Indore');
  const [orgPincode, setOrgPincode] = useState('452001');
  const [orgState, setOrgState] = useState('Madhya Pradesh');
  const [orgPhone, setOrgPhone] = useState('8817440858');
  const [orgWebsite, setOrgWebsite] = useState('');
  const [orgGst, setOrgGst] = useState('23AAQCM8058H2Z1');
  const [storePan, setStorePan] = useState('AAQCM8058H');
  const [orgLogo, setOrgLogo] = useState('');
  const [reportBasis, setReportBasis] = useState('Accrual');

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
  const [globalSignature, setGlobalSignature] = useState(() => localStorage.getItem('globalSignatureImage') || null);
  const [isDrawPadModalOpen, setIsDrawPadModalOpen] = useState(false);
  const [canvasDrawingActive, setCanvasDrawingActive] = useState(false);
  const canvasRef = React.useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000000';
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Financial Settings
  const [taxRate, setTaxRate] = useState(18);
  const [financialYear, setFinancialYear] = useState('April - March');

  // System Settings
  const [timeZone, setTimeZone] = useState('IST (UTC+5:30)');

  // Load all settings from localStorage and database API
  useEffect(() => {
    // 1. Load general settings from localStorage
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
        if (parsed.storeAddress) setStoreAddress(parsed.storeAddress);
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

        // Fallback Organization Details
        if (parsed.orgName) setOrgName(parsed.orgName);
        if (parsed.orgLocation) setOrgLocation(parsed.orgLocation);
        if (parsed.orgAddress1) setOrgAddress1(parsed.orgAddress1);
        if (parsed.orgAddress2) setOrgAddress2(parsed.orgAddress2);
        if (parsed.orgCity) setOrgCity(parsed.orgCity);
        if (parsed.orgPincode) setOrgPincode(parsed.orgPincode);
        if (parsed.orgState) setOrgState(parsed.orgState);
        if (parsed.orgPhone) setOrgPhone(parsed.orgPhone);
        if (parsed.orgWebsite) setOrgWebsite(parsed.orgWebsite);
        if (parsed.orgGst) setOrgGst(parsed.orgGst);
        if (parsed.storePan) setStorePan(parsed.storePan);
        if (parsed.orgLogo) setOrgLogo(parsed.orgLogo);
        if (parsed.reportBasis) setReportBasis(parsed.reportBasis);
      } catch (e) {
        console.error('Failed to parse settings from localStorage', e);
      }
    }

    // 2. Load live Organization details from backend DB
    fetch(`${API_BASE_URL}/company-settings`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch from DB');
        return res.json();
      })
      .then(parsed => {
        if (parsed) {
          if (parsed.orgName) setOrgName(parsed.orgName);
          if (parsed.orgLocation) setOrgLocation(parsed.orgLocation);
          if (parsed.orgAddress1) setOrgAddress1(parsed.orgAddress1);
          if (parsed.orgAddress2) setOrgAddress2(parsed.orgAddress2);
          if (parsed.orgCity) setOrgCity(parsed.orgCity);
          if (parsed.orgPincode) setOrgPincode(parsed.orgPincode);
          if (parsed.orgState) setOrgState(parsed.orgState);
          if (parsed.orgPhone) setOrgPhone(parsed.orgPhone);
          if (parsed.orgWebsite) setOrgWebsite(parsed.orgWebsite);
          if (parsed.orgGst) setOrgGst(parsed.orgGst);
          if (parsed.storePan) setStorePan(parsed.storePan);
          if (parsed.orgLogo) setOrgLogo(parsed.orgLogo);
          if (parsed.reportBasis) setReportBasis(parsed.reportBasis);
          if (parsed.financialYear) setFinancialYear(parsed.financialYear);
        }
      })
      .catch(err => console.error('Failed to load live settings from database:', err));
  }, []);

  const handleMethodToggle = (method) => {
    if (paymentMethods.includes(method)) {
      setPaymentMethods(paymentMethods.filter(m => m !== method));
    } else {
      setPaymentMethods([...paymentMethods, method]);
    }
  };

  const handleSave = (sectionName) => {
    const orgPayload = {
      orgName, orgLocation, orgAddress1, orgAddress2, orgCity, orgPincode, orgState, orgPhone, orgWebsite, orgGst, storePan, orgLogo: orgLogo || '', reportBasis, financialYear
    };

    if (sectionName === 'General Settings') {
      // Save Org settings to backend DB first
      fetch(`${API_BASE_URL}/company-settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orgPayload)
      })
      .then(res => {
        if (!res.ok) throw new Error('API save failed');
        return res.json();
      })
      .then(() => {
        // Also save pos_settings to localStorage
        const settings = {
          printer, paymentMethods, enableSound,
          storeName, storeEmail, storePhone, storeAddress, currency,
          systemName, websiteTitle,
          invoicePrefix, invoiceFooter,
          selectedTemplate, connectionType,
          signatureName, taxRate, financialYear, timeZone,
          ...orgPayload
        };
        localStorage.setItem('pos_settings', JSON.stringify(settings));
        alert('General Settings saved successfully to database!');
      })
      .catch(err => {
        console.error(err);
        alert('Failed to save settings to database');
      });
      return;
    }

    const settings = {
      printer, paymentMethods, enableSound,
      storeName, storeEmail, storePhone, storeAddress, currency,
      systemName, websiteTitle,
      invoicePrefix, invoiceFooter,
      selectedTemplate, connectionType,
      signatureName, taxRate, financialYear, timeZone,
      ...orgPayload
    };
    localStorage.setItem('pos_settings', JSON.stringify(settings));
    alert(`${sectionName} saved successfully!`);
  };

  const renderActiveCard = () => {
    switch (activeSection) {
      case 'General Settings':
        return (
          <div className={styles.card}>
            <div className={styles.cardHeader}>Organization Profile</div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Row 1: Org Name & Org Location */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr 1.2fr', gap: '1rem 1.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#374151' }}>Organization Name</span>
                <input 
                  type="text" 
                  value={orgName} 
                  onChange={(e) => setOrgName(e.target.value)} 
                  style={{ backgroundColor: '#FCFDFD', border: '1px solid #D1D5DB', borderRadius: '6px', padding: '0.6rem 0.85rem', fontSize: '0.875rem', color: '#1F2937', outline: 'none' }} 
                />

                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#374151' }}>Organization Location</span>
                <input 
                  type="text" 
                  value={orgLocation} 
                  onChange={(e) => setOrgLocation(e.target.value)} 
                  style={{ backgroundColor: '#FCFDFD', border: '1px solid #D1D5DB', borderRadius: '6px', padding: '0.6rem 0.85rem', fontSize: '0.875rem', color: '#1F2937', outline: 'none' }} 
                />
              </div>

              {/* Row 2: Logo Box & GST/PAN Container */}
              <div style={{ border: '1px solid #E5E7EB', borderRadius: '10px', backgroundColor: '#F9FAFB', padding: '1.25rem 1.5rem', display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
                {/* Logo Upload Box */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '96px', height: '96px', border: '1.5px dashed #D1D5DB', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', position: 'relative', flexShrink: 0 }}>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            removeImageBackground(reader.result).then(processed => {
                              setOrgLogo(processed);
                            });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0, cursor: 'pointer' }}
                    />
                    {orgLogo ? (
                      <img src={orgLogo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 500 }}>Upload Logo</span>
                    )}
                  </div>
                  {orgLogo && (
                    <button 
                      type="button" 
                      onClick={() => setOrgLogo(null)} 
                      style={{ border: 'none', background: 'none', color: '#EF4444', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600, padding: 0 }}
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* GST / PAN inputs */}
                <div style={{ flex: 1, display: 'flex', gap: '2rem', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#374151', whiteSpace: 'nowrap' }}>GSTIN (GST No)</span>
                    <input 
                      type="text" 
                      value={orgGst} 
                      onChange={(e) => setOrgGst(e.target.value)} 
                      style={{ flex: 1, backgroundColor: 'white', border: '1px solid #D1D5DB', borderRadius: '6px', padding: '0.55rem 0.75rem', fontSize: '0.875rem', color: '#1F2937', outline: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#374151', whiteSpace: 'nowrap' }}>PAN Number</span>
                    <input 
                      type="text" 
                      value={storePan} 
                      onChange={(e) => setStorePan(e.target.value)} 
                      style={{ flex: 1, backgroundColor: 'white', border: '1px solid #D1D5DB', borderRadius: '6px', padding: '0.55rem 0.75rem', fontSize: '0.875rem', color: '#1F2937', outline: 'none' }}
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Address Split Layout */}
              <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1.5rem', alignItems: 'start' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.925rem', fontWeight: 700, color: '#1B2850' }}>Organization Address</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxWidth: '560px' }}>
                  {/* Address fields */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input 
                      type="text" 
                      placeholder="Organization / Biller Name" 
                      value={orgName} 
                      onChange={(e) => setOrgName(e.target.value)} 
                      style={{ flex: 1, backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '6px', padding: '0.55rem 0.75rem', fontSize: '0.875rem', color: '#374151', outline: 'none' }} 
                    />
                    <Edit2 size={16} style={{ color: '#FF9F43', cursor: 'pointer' }} />
                  </div>

                  <input 
                    type="text" 
                    placeholder="Address Line 1" 
                    value={orgAddress1} 
                    onChange={(e) => setOrgAddress1(e.target.value)} 
                    style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '6px', padding: '0.55rem 0.75rem', fontSize: '0.875rem', color: '#374151', outline: 'none' }} 
                  />
                  <input 
                    type="text" 
                    placeholder="Address Line 2" 
                    value={orgAddress2} 
                    onChange={(e) => setOrgAddress2(e.target.value)} 
                    style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '6px', padding: '0.55rem 0.75rem', fontSize: '0.875rem', color: '#374151', outline: 'none' }} 
                  />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <input 
                      type="text" 
                      placeholder="City" 
                      value={orgCity} 
                      onChange={(e) => setOrgCity(e.target.value)} 
                      style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '6px', padding: '0.55rem 0.75rem', fontSize: '0.875rem', color: '#374151', outline: 'none' }} 
                    />
                    <input 
                      type="text" 
                      placeholder="Pincode" 
                      value={orgPincode} 
                      onChange={(e) => setOrgPincode(e.target.value)} 
                      style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '6px', padding: '0.55rem 0.75rem', fontSize: '0.875rem', color: '#374151', outline: 'none' }} 
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <select 
                      value={orgState} 
                      onChange={(e) => setOrgState(e.target.value)} 
                      style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '6px', padding: '0.55rem 0.75rem', fontSize: '0.875rem', color: '#374151', outline: 'none' }}
                    >
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Karnataka">Karnataka</option>
                    </select>
                    
                    <input 
                      type="text" 
                      placeholder="Phone" 
                      value={orgPhone} 
                      onChange={(e) => setOrgPhone(e.target.value)} 
                      style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '6px', padding: '0.55rem 0.75rem', fontSize: '0.875rem', color: '#374151', outline: 'none' }} 
                    />
                  </div>

                  <input 
                    type="text" 
                    placeholder="Website URL" 
                    value={orgWebsite} 
                    onChange={(e) => setOrgWebsite(e.target.value)} 
                    style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '6px', padding: '0.55rem 0.75rem', fontSize: '0.875rem', color: '#374151', outline: 'none' }} 
                  />
                </div>
              </div>

              {/* Row 4: Fiscal Year & Report Basis */}
              <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1.5rem', borderTop: '1px solid #F3F4F6', paddingTop: '2rem', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#374151', marginTop: '0.5rem' }}>Fiscal Year</span>
                <select 
                  value={financialYear} 
                  onChange={(e) => setFinancialYear(e.target.value)} 
                  style={{ maxWidth: '280px', backgroundColor: 'white', border: '1px solid #D1D5DB', borderRadius: '6px', padding: '0.55rem 0.75rem', fontSize: '0.875rem', color: '#1F2937', outline: 'none' }}
                >
                  <option value="April - March">April - March</option>
                  <option value="January - December">January - December</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1.5rem', borderTop: '1px solid #F3F4F6', paddingTop: '2rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#374151', marginTop: '0.25rem' }}>Report Basis</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', color: '#374151' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="reportBasis" 
                      value="Accrual" 
                      checked={reportBasis === 'Accrual'} 
                      onChange={() => setReportBasis('Accrual')} 
                      style={{ display: 'none' }} 
                    />
                    <span style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      border: reportBasis === 'Accrual' ? '2px solid #FF9F43' : '2px solid #D1D5DB',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'white',
                      flexShrink: 0
                    }}>
                      {reportBasis === 'Accrual' && (
                        <span style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          backgroundColor: '#FF9F43'
                        }} />
                      )}
                    </span>
                    <span><strong>Accrual</strong> • You owe tax as of invoice date</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="reportBasis" 
                      value="Cash" 
                      checked={reportBasis === 'Cash'} 
                      onChange={() => setReportBasis('Cash')} 
                      style={{ display: 'none' }} 
                    />
                    <span style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      border: reportBasis === 'Cash' ? '2px solid #FF9F43' : '2px solid #D1D5DB',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'white',
                      flexShrink: 0
                    }}>
                      {reportBasis === 'Cash' && (
                        <span style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          backgroundColor: '#FF9F43'
                        }} />
                      )}
                    </span>
                    <span><strong>Cash</strong> • You owe tax upon payment receipt</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={styles.actions} style={{ borderTop: '1px solid #F3F4F6', paddingTop: '1.5rem', marginTop: '1rem' }}>
                <button 
                  onClick={() => handleSave('General Settings')} 
                  className={styles.saveBtn}
                >
                  Save Changes
                </button>
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
              
              <div className={styles.formGroup} style={{ marginTop: '1.5rem' }}>
                <div className={styles.formLabel}>Global Signature Image</div>
                <div style={{
                  border: '1px dashed #D1D5DB',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#F9FAFB',
                  maxWidth: '400px',
                  height: '180px',
                  cursor: 'pointer',
                  position: 'relative'
                }}>
                  {globalSignature ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <img src={globalSignature} alt="Global Signature" style={{ maxHeight: '80px', objectFit: 'contain' }} />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setGlobalSignature(null);
                        }}
                        style={{
                          backgroundColor: '#EF4444',
                          color: 'white',
                          border: 'none',
                          padding: '4px 12px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          marginTop: '0.5rem'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: '#9CA3AF' }}>
                      <Upload size={32} style={{ color: '#9CA3AF' }} />
                      <span style={{ fontSize: '0.875rem', color: '#9CA3AF', fontWeight: 500 }}>Upload</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Switcher Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '400px', marginTop: '1rem' }}>
                <label style={{
                  width: '100%',
                  padding: '0.6rem',
                  borderRadius: '6px',
                  border: '1px dashed #D1D5DB',
                  backgroundColor: 'white',
                  color: '#7367F0',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  boxSizing: 'border-box'
                }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setGlobalSignature(reader.result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    style={{ display: 'none' }}
                  />
                  <Upload size={16} /> Upload Signature
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsDrawPadModalOpen(true);
                    setCanvasDrawingActive(false);
                    setTimeout(() => {
                      const canvas = canvasRef.current;
                      if (canvas) {
                        const ctx = canvas.getContext('2d');
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                      }
                    }, 100);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    borderRadius: '6px',
                    border: '1px dashed #D1D5DB',
                    backgroundColor: 'white',
                    color: '#7367F0',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    boxSizing: 'border-box'
                  }}
                >
                  ✎ Use Signature Pad
                </button>
              </div>

              <div className={styles.actions} style={{ marginTop: '1.5rem' }}>
                <button 
                  className={styles.saveBtn} 
                  onClick={() => {
                    if (globalSignature) {
                      localStorage.setItem('globalSignatureImage', globalSignature);
                    } else {
                      localStorage.removeItem('globalSignatureImage');
                    }
                    // Save title to settings
                    try {
                      const saved = localStorage.getItem('pos_settings') || '{}';
                      const parsed = JSON.parse(saved);
                      parsed.signatureName = signatureName;
                      localStorage.setItem('pos_settings', JSON.stringify(parsed));
                      
                      // also sync settings structure
                      const posSettings = JSON.parse(localStorage.getItem('posSettings') || '{}');
                      posSettings.signatureName = signatureName;
                      localStorage.setItem('posSettings', JSON.stringify(posSettings));
                    } catch(e) {}
                    
                    handleSave('Signature Settings');
                  }}
                >
                  Save Signatory
                </button>
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

      {/* Draw Signature Modal popup for POS Settings page */}
      {isDrawPadModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10040,
          backdropFilter: 'blur(2px)'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '450px',
            maxWidth: '90%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid #F3F4F6'
            }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1F2937' }}>Draw Signature</span>
              <button 
                type="button" 
                onClick={() => setIsDrawPadModalOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#000',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                height: '220px',
                backgroundColor: 'white',
                position: 'relative'
              }}>
                {!canvasDrawingActive && (
                  <div style={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: '#9CA3AF',
                    fontSize: '0.9rem',
                    pointerEvents: 'none',
                    fontWeight: 500
                  }}>
                    Draw your Signature Here
                  </div>
                )}
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={220}
                  onMouseDown={(e) => {
                    setCanvasDrawingActive(true);
                    startDrawing(e);
                  }}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={(e) => {
                    setCanvasDrawingActive(true);
                    startDrawing(e);
                  }}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  style={{ cursor: 'crosshair', width: '100%', height: '100%' }}
                />
              </div>

              {/* Reset button */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => {
                    clearCanvas();
                    setCanvasDrawingActive(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    color: '#7367F0',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none'
                  }}
                >
                  <RotateCw size={14} /> Reset
                </button>
              </div>
            </div>

            {/* Footer */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem 1.5rem',
              borderTop: '1px solid #F3F4F6',
              backgroundColor: '#FAFAFA'
            }}>
              <button 
                type="button" 
                onClick={() => setIsDrawPadModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6B7280',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={() => {
                  const canvas = canvasRef.current;
                  if (canvas && canvasDrawingActive) {
                    const dataUrl = canvas.toDataURL('image/png');
                    setGlobalSignature(dataUrl);
                  }
                  setIsDrawPadModalOpen(false);
                }}
                style={{
                  backgroundColor: '#7367F0',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Upload Signature
              </button>
            </div>

          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default POSSettings;
