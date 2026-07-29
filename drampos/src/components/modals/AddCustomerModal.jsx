import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import styles from './ModalForm.module.css';
import { createCustomer, updateCustomer } from '../../services/customerService';
import { ChevronDown, ChevronRight, Upload, X, HelpCircle, Edit2 } from 'lucide-react';

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

const AddCustomerModal = ({ isOpen, onClose, customerToEdit = null, onSuccess }) => {
  // Section toggle states
  const [basicOpen, setBasicOpen] = useState(true);
  const [taxOpen, setTaxOpen] = useState(false);
  const [addressOpen, setAddressOpen] = useState(false);

  // Accordion Handlers
  const handleToggleBasic = () => {
    setBasicOpen(prev => {
      const next = !prev;
      if (next) {
        setTaxOpen(false);
        setAddressOpen(false);
      }
      return next;
    });
  };

  const handleToggleTax = () => {
    setTaxOpen(prev => {
      const next = !prev;
      if (next) {
        setBasicOpen(false);
        setAddressOpen(false);
      }
      return next;
    });
  };

  const handleToggleAddress = () => {
    setAddressOpen(prev => {
      const next = !prev;
      if (next) {
        setBasicOpen(false);
        setTaxOpen(false);
      }
      return next;
    });
  };

  // Form states
  const [businessName, setBusinessName] = useState('');
  const [clientIndustry, setClientIndustry] = useState('');
  const [country, setCountry] = useState('India');
  const [city, setCity] = useState('');
  const [logo, setLogo] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Tax states
  const [gstNumber, setGstNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [clientType, setClientType] = useState('Individual');
  const [taxTreatment, setTaxTreatment] = useState('');

  // Address states
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [address, setAddress] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (customerToEdit) {
      setBusinessName(customerToEdit.companyName || customerToEdit.displayName || '');
      setClientIndustry(customerToEdit.placeOfSupply || '');
      setCountry(customerToEdit.country || 'India');
      setCity(customerToEdit.city || '');
      setLogo(customerToEdit.avatar || '');
      setGstNumber(customerToEdit.gstNumber || '');
      setPanNumber(customerToEdit.storePan || '');
      setClientType(customerToEdit.customerType || 'Individual');
      setTaxTreatment(customerToEdit.taxTreatment || '');
      setState(customerToEdit.state || '');
      setPostalCode(customerToEdit.postalCode || '');
      setAddress(customerToEdit.address || '');
      setEmail(customerToEdit.email || '');
      setPhone(customerToEdit.phone || '');
    } else {
      setBusinessName('');
      setClientIndustry('');
      setCountry('India');
      setCity('');
      setLogo('');
      setGstNumber('');
      setPanNumber('');
      setClientType('Individual');
      setTaxTreatment('');
      setState('');
      setPostalCode('');
      setAddress('');
      setEmail('');
      setPhone('');
    }
    setError('');
  }, [customerToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!businessName) {
      setError('Business Name is required.');
      return;
    }

    // Split businessName into dummy first/last name to satisfy backend schema
    const nameParts = businessName.trim().split(/\s+/);
    const firstName = nameParts[0] || 'Client';
    const lastName = nameParts.slice(1).join(' ') || '.';
    const finalEmail = email || `info@${businessName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'client'}.com`;
    const finalPhone = phone || '9999999999';

    const submitData = {
      customerType: clientType,
      companyName: businessName,
      displayName: businessName,
      firstName,
      lastName,
      email: finalEmail,
      phone: finalPhone,
      address,
      city,
      state,
      country,
      postalCode,
      avatar: logo,
      gstNumber,
      storePan: panNumber,
      placeOfSupply: clientIndustry,
      taxTreatment,
      status: 'Active'
    };

    try {
      setLoading(true);
      if (customerToEdit) {
        await updateCustomer(customerToEdit._id, submitData);
      } else {
        await createCustomer(submitData);
      }
      if (onSuccess) onSuccess(businessName);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save customer');
    } finally {
      setLoading(false);
    }
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 0',
    borderTop: '1px solid #F3F4F6',
    cursor: 'pointer',
    userSelect: 'none'
  };

  const labelStyle = {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#374151',
    marginBottom: '0.4rem',
    display: 'block'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.6rem 0.85rem',
    border: '1px solid #D1D5DB',
    borderRadius: '6px',
    fontSize: '0.875rem',
    outline: 'none',
    backgroundColor: '#FCFDFD',
    boxSizing: 'border-box'
  };

  const selectStyle = {
    ...inputStyle,
    appearance: 'none',
    backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 20 20\' fill=\'none\'%3E%3Cpath d=\'M7 9l3 3 3-3\' stroke=\'%236B7280\' stroke-width=\'1.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E")',
    backgroundPosition: 'right 0.75rem center',
    backgroundSize: '1.25rem',
    backgroundRepeat: 'no-repeat',
    paddingRight: '2rem'
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={customerToEdit ? "Edit Client" : "Add New Client"} maxWidth="700px">
      <form onSubmit={handleSubmit} style={{ padding: '0.5rem 1rem' }}>
        {error && <div style={{ color: '#EA5455', fontSize: '13px', marginBottom: '1rem', fontWeight: 500 }}>{error}</div>}

        {/* 1. Basic Information Section */}
        <div style={headerStyle} onClick={handleToggleBasic}>
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1F2937' }}>Basic Information</span>
          {basicOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </div>

        {basicOpen && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '0.5rem 0 1.5rem 0' }}>
            {/* Logo upload box */}
            <div style={{ border: '1.5px dashed #D1D5DB', borderRadius: '8px', padding: '1.5rem', textAlign: 'center', backgroundColor: '#F9FAFB', position: 'relative' }}>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      removeImageBackground(reader.result).then(processed => {
                        setLogo(processed);
                      });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0, cursor: 'pointer' }}
              />
              {logo ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <img src={logo} alt="Client Logo" style={{ maxHeight: '80px', objectFit: 'contain' }} />
                  <button type="button" onClick={() => setLogo('')} style={{ border: 'none', background: 'none', color: '#EF4444', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>Remove</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                  <Upload size={24} style={{ color: '#FF9F43', marginBottom: '0.25rem' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>Upload Logo</span>
                  <span style={{ fontSize: '0.7rem', color: '#6B7280' }}>JPG or PNG, Dimensions 1080×1080px and file size up to 20MB</span>
                </div>
              )}
            </div>

            {/* Client Type Selector */}
            <div style={{ marginBottom: '0.25rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>Client Type</span>
                <HelpCircle size={14} style={{ color: '#9CA3AF', cursor: 'help' }} />
              </div>
              <div style={{ display: 'flex', gap: '2rem', marginTop: '0.25rem' }}>
                <div 
                  onClick={() => setClientType('Individual')} 
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer', userSelect: 'none' }}
                >
                  <div style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    border: `2px solid ${clientType === 'Individual' ? '#FF9F43' : '#D1D5DB'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'white',
                    flexShrink: 0
                  }}>
                    {clientType === 'Individual' && (
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FF9F43' }} />
                    )}
                  </div>
                  Individual
                </div>

                <div 
                  onClick={() => setClientType('Company')} 
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer', userSelect: 'none' }}
                >
                  <div style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    border: `2px solid ${clientType === 'Company' ? '#FF9F43' : '#D1D5DB'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'white',
                    flexShrink: 0
                  }}>
                    {clientType === 'Company' && (
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FF9F43' }} />
                    )}
                  </div>
                  Organization
                </div>
              </div>
            </div>

            {/* Fields Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>{clientType === 'Individual' ? 'Customer Name' : 'Business Name'}<span style={{ color: '#EA5455' }}>*</span></label>
                <input 
                  type="text" 
                  placeholder={clientType === 'Individual' ? 'Customer Name (Required)' : 'Business Name (Required)'} 
                  value={businessName} 
                  onChange={(e) => setBusinessName(e.target.value)} 
                  style={inputStyle}
                  required 
                />
              </div>
              <div>
                <label style={labelStyle}>Client Industry</label>
                <select 
                  value={clientIndustry} 
                  onChange={(e) => setClientIndustry(e.target.value)} 
                  style={selectStyle}
                >
                  <option value="">-Select an Industry-</option>
                  <option value="Retail">Retail</option>
                  <option value="Wholesale">Wholesale</option>
                  <option value="Technology & Software">Technology & Software</option>
                  <option value="Healthcare & Pharmaceuticals">Healthcare & Pharmaceuticals</option>
                  <option value="Real Estate & Construction">Real Estate & Construction</option>
                  <option value="Food & Beverage">Food & Beverage</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Logistics & Transportation">Logistics & Transportation</option>
                  <option value="Hospitality & Tourism">Hospitality & Tourism</option>
                  <option value="Education">Education</option>
                  <option value="Finance & Banking">Finance & Banking</option>
                  <option value="Services">Services</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Select Country<span style={{ color: '#EA5455' }}>*</span></label>
                <select 
                  value={country} 
                  onChange={(e) => setCountry(e.target.value)} 
                  style={selectStyle}
                >
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>City/Town</label>
                <input 
                  type="text" 
                  placeholder="City/Town Name" 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)} 
                  style={inputStyle} 
                />
              </div>
            </div>

            {/* Optional Email/Phone for completeness */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Email Address (Optional)</label>
                <input 
                  type="email" 
                  placeholder="email@company.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  style={inputStyle} 
                />
              </div>
              <div>
                <label style={labelStyle}>Phone Number (Optional)</label>
                <input 
                  type="text" 
                  placeholder="Phone number" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  style={inputStyle} 
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. Tax Information Section */}
        <div style={headerStyle} onClick={handleToggleTax}>
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1F2937' }}>Tax Information <span style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 400 }}>(optional)</span></span>
          {taxOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </div>

        {taxOpen && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '0.5rem 0 1.5rem 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Business GSTIN</label>
                <input 
                  type="text" 
                  placeholder="Business GSTIN (Optional)" 
                  value={gstNumber} 
                  onChange={(e) => setGstNumber(e.target.value)} 
                  style={inputStyle} 
                />
              </div>
              <div>
                <label style={labelStyle}>Business PAN Number</label>
                <input 
                  type="text" 
                  placeholder="Business PAN Number (Optional)" 
                  value={panNumber} 
                  onChange={(e) => setPanNumber(e.target.value)} 
                  style={inputStyle} 
                />
              </div>
            </div>


            {/* Tax Treatment */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>Tax Treatment</span>
                <HelpCircle size={14} style={{ color: '#9CA3AF', cursor: 'help' }} />
              </div>
              <select 
                value={taxTreatment} 
                onChange={(e) => setTaxTreatment(e.target.value)} 
                style={selectStyle}
              >
                <option value="">Select Tax Treatment</option>
                <option value="Registered Business">Registered Business - Regular</option>
                <option value="Registered Business - Composition">Registered Business - Composition</option>
                <option value="Unregistered Business">Unregistered Business</option>
                <option value="Consumer">Consumer</option>
              </select>
            </div>
          </div>
        )}

        {/* 3. Address Section */}
        <div style={headerStyle} onClick={handleToggleAddress}>
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1F2937' }}>Address <span style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 400 }}>(optional)</span></span>
          {addressOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </div>

        {addressOpen && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '0.5rem 0 1.5rem 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Select Country</label>
                <select 
                  value={country} 
                  onChange={(e) => setCountry(e.target.value)} 
                  style={selectStyle}
                >
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>State / Province</label>
                <select 
                  value={state} 
                  onChange={(e) => setState(e.target.value)} 
                  style={selectStyle}
                >
                  <option value="">Select State / Province</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Karnataka">Karnataka</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>City/Town</label>
                <input 
                  type="text" 
                  placeholder="City/Town Name" 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)} 
                  style={inputStyle} 
                />
              </div>
              <div>
                <label style={labelStyle}>Postal Code / Zip Code</label>
                <input 
                  type="text" 
                  placeholder="Postal Code / Zip Code" 
                  value={postalCode} 
                  onChange={(e) => setPostalCode(e.target.value)} 
                  style={inputStyle} 
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Street Address</label>
              <input 
                type="text" 
                placeholder="Street Address" 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                style={inputStyle} 
              />
            </div>
          </div>
        )}


        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid #F3F4F6', paddingTop: '1.25rem', marginTop: '1.5rem' }}>
          <button type="button" onClick={onClose} style={{ border: 'none', backgroundColor: '#F3F4F6', color: '#4B5563', padding: '0.6rem 1.25rem', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <button type="submit" disabled={loading} style={{ border: 'none', backgroundColor: '#FF9F43', color: 'white', padding: '0.6rem 1.5rem', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 4px rgba(255, 159, 67, 0.2)' }}>
            {loading ? 'Saving...' : customerToEdit ? 'Update Client' : 'Add Client'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddCustomerModal;
