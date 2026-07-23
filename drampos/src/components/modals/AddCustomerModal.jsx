import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import styles from './ModalForm.module.css';
import { createCustomer, updateCustomer } from '../../services/customerService';

const AddCustomerModal = ({ isOpen, onClose, customerToEdit = null, onSuccess }) => {
  const [formData, setFormData] = useState({
    customerType: 'Individual',
    companyName: '',
    displayName: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    gstNumber: '',
    placeOfSupply: '',
    status: 'Active'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (customerToEdit) {
      setFormData({
        customerType: customerToEdit.customerType || 'Individual',
        companyName: customerToEdit.companyName || '',
        displayName: customerToEdit.displayName || '',
        firstName: customerToEdit.firstName || '',
        lastName: customerToEdit.lastName || '',
        email: customerToEdit.email || '',
        phone: customerToEdit.phone || '',
        address: customerToEdit.address || '',
        city: customerToEdit.city || '',
        state: customerToEdit.state || '',
        country: customerToEdit.country || '',
        postalCode: customerToEdit.postalCode || '',
        gstNumber: customerToEdit.gstNumber || '',
        placeOfSupply: customerToEdit.placeOfSupply || '',
        status: customerToEdit.status || 'Active'
      });
    } else {
      setFormData({
        customerType: 'Individual',
        companyName: '',
        displayName: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
        gstNumber: '',
        placeOfSupply: '',
        status: 'Active'
      });
    }
    setError('');
  }, [customerToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      setError('First Name, Last Name, Email, and Phone are required.');
      return;
    }

    // Default display name if none selected
    const finalDisplayName = formData.displayName || `${formData.firstName} ${formData.lastName}`.trim();
    const submitData = { ...formData, displayName: finalDisplayName };

    try {
      setLoading(true);
      if (customerToEdit) {
        await updateCustomer(customerToEdit._id, submitData);
      } else {
        await createCustomer(submitData);
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={customerToEdit ? "Edit Customer" : "Add Customer"} maxWidth="900px">
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div style={{ color: '#EA5455', fontSize: '13px', marginBottom: '1rem' }}>{error}</div>}

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <div className={styles.formGroup} style={{ flex: 1, minWidth: '220px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Customer Type</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', height: '38px' }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontWeight: 500, color: '#374151', fontSize: '0.875rem' }}>
                <input 
                  type="radio" 
                  name="customerType" 
                  value="Individual" 
                  checked={formData.customerType === 'Individual'} 
                  onChange={(e) => setFormData({ ...formData, customerType: e.target.value, companyName: '', displayName: '' })}
                />
                Individual
              </label>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontWeight: 500, color: '#374151', fontSize: '0.875rem' }}>
                <input 
                  type="radio" 
                  name="customerType" 
                  value="Company" 
                  checked={formData.customerType === 'Company'} 
                  onChange={(e) => setFormData({ ...formData, customerType: e.target.value, displayName: '' })}
                />
                Company
              </label>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <div className={styles.formGroup} style={{ flex: 1, minWidth: '220px' }}>
            <label>First Name <span className={styles.required}>*</span></label>
            <input 
              type="text" 
              className={styles.input} 
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              required
            />
          </div>
          <div className={styles.formGroup} style={{ flex: 1, minWidth: '220px' }}>
            <label>Last Name <span className={styles.required}>*</span></label>
            <input 
              type="text" 
              className={styles.input} 
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              required
            />
          </div>
        </div>

        {formData.customerType === 'Company' && (
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <div className={styles.formGroup} style={{ flex: 1, minWidth: '220px' }}>
              <label>Company Name <span className={styles.required}>*</span></label>
              <input 
                type="text" 
                className={styles.input} 
                placeholder="Company Name"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                required
              />
            </div>

            <div className={styles.formGroup} style={{ flex: 1, minWidth: '220px' }}>
              <label>Display Name Suggestions</label>
              <select 
                className={styles.select}
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              >
                <option value="">-- Select Display Name --</option>
                {(() => {
                  const fullName = `${formData.firstName} ${formData.lastName}`.trim();
                  const company = formData.companyName.trim();
                  const suggestions = [
                    company,
                    fullName,
                    company && fullName ? `${fullName} (${company})` : '',
                    company && fullName ? `${company} (${fullName})` : ''
                  ].filter(Boolean);
                  return suggestions.map((opt, i) => (
                    <option key={i} value={opt}>{opt}</option>
                  ));
                })()}
              </select>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <div className={styles.formGroup} style={{ flex: 1, minWidth: '220px' }}>
            <label>Email <span className={styles.required}>*</span></label>
            <input 
              type="email" 
              className={styles.input} 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          <div className={styles.formGroup} style={{ flex: 1, minWidth: '220px' }}>
            <label>Phone <span className={styles.required}>*</span></label>
            <input 
              type="text" 
              className={styles.input} 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <div className={styles.formGroup} style={{ flex: 1, minWidth: '220px' }}>
            <label>GST No. (Optional)</label>
            <input 
              type="text" 
              className={styles.input} 
              placeholder="Enter GST No."
              value={formData.gstNumber}
              onChange={(e) => setFormData({...formData, gstNumber: e.target.value})}
            />
          </div>
          <div className={styles.formGroup} style={{ flex: 1, minWidth: '220px' }}>
            <label>Place of Supply (Optional)</label>
            <input 
              type="text" 
              className={styles.input} 
              placeholder="State / Region"
              value={formData.placeOfSupply}
              onChange={(e) => setFormData({...formData, placeOfSupply: e.target.value})}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <div className={styles.formGroup} style={{ flex: 2, minWidth: '300px' }}>
            <label>Address</label>
            <input 
              type="text" 
              className={styles.input} 
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
          </div>
          <div className={styles.formGroup} style={{ flex: 1, minWidth: '150px' }}>
            <label>City</label>
            <input 
              type="text" 
              className={styles.input} 
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <div className={styles.formGroup} style={{ flex: 1, minWidth: '150px' }}>
            <label>State</label>
            <input 
              type="text" 
              className={styles.input} 
              value={formData.state}
              onChange={(e) => setFormData({...formData, state: e.target.value})}
            />
          </div>
          <div className={styles.formGroup} style={{ flex: 1, minWidth: '150px' }}>
            <label>Country</label>
            <input 
              type="text" 
              className={styles.input} 
              value={formData.country}
              onChange={(e) => setFormData({...formData, country: e.target.value})}
            />
          </div>
          <div className={styles.formGroup} style={{ flex: 1, minWidth: '150px' }}>
            <label>Postal Code</label>
            <input 
              type="text" 
              className={styles.input} 
              value={formData.postalCode}
              onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
            />
          </div>
        </div>

        <div className={styles.formGroup} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', marginBottom: '1rem' }}>
          <label style={{ margin: 0 }}>Status</label>
          <div 
            onClick={() => setFormData({...formData, status: formData.status === 'Active' ? 'Inactive' : 'Active'})}
            style={{
              width: '40px', 
              height: '20px', 
              backgroundColor: formData.status === 'Active' ? '#28C76F' : '#EA5455', 
              borderRadius: '20px', 
              position: 'relative', 
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <div 
              style={{
                width: '16px', 
                height: '16px', 
                backgroundColor: 'white', 
                borderRadius: '50%', 
                position: 'absolute', 
                top: '2px', 
                left: formData.status === 'Active' ? '22px' : '2px',
                transition: 'all 0.2s'
              }}
            ></div>
          </div>
        </div>

        <div className={styles.footerActions}>
          <button type="button" className={styles.btnCancel} onClick={onClose} style={{backgroundColor: '#002046', color: 'white'}}>Cancel</button>
          <button type="submit" className={styles.btnSubmit} disabled={loading}>
            {loading ? 'Saving...' : customerToEdit ? 'Update Customer' : 'Add Customer'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddCustomerModal;
