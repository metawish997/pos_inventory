import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import styles from './ModalForm.module.css';
import { createCustomer, updateCustomer } from '../../services/customerService';

const AddCustomerModal = ({ isOpen, onClose, customerToEdit = null, onSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    status: 'Active'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (customerToEdit) {
      setFormData({
        firstName: customerToEdit.firstName || '',
        lastName: customerToEdit.lastName || '',
        email: customerToEdit.email || '',
        phone: customerToEdit.phone || '',
        address: customerToEdit.address || '',
        city: customerToEdit.city || '',
        state: customerToEdit.state || '',
        country: customerToEdit.country || '',
        postalCode: customerToEdit.postalCode || '',
        status: customerToEdit.status || 'Active'
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
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

    try {
      setLoading(true);
      if (customerToEdit) {
        await updateCustomer(customerToEdit._id, formData);
      } else {
        await createCustomer(formData);
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
    <Modal isOpen={isOpen} onClose={onClose} title={customerToEdit ? "Edit Customer" : "Add Customer"} maxWidth="700px">
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div style={{ color: '#EA5455', fontSize: '13px', marginBottom: '1rem' }}>{error}</div>}

        <div className={styles.formRow} style={{display: 'flex', gap: '1rem'}}>
          <div className={styles.formGroup} style={{flex: 1}}>
            <label>First Name <span className={styles.required}>*</span></label>
            <input 
              type="text" 
              className={styles.input} 
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              required
            />
          </div>
          <div className={styles.formGroup} style={{flex: 1}}>
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
        
        <div className={styles.formGroup}>
          <label>Email <span className={styles.required}>*</span></label>
          <input 
            type="email" 
            className={styles.input} 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label>Phone <span className={styles.required}>*</span></label>
          <input 
            type="text" 
            className={styles.input} 
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label>Address</label>
          <input 
            type="text" 
            className={styles.input} 
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
          />
        </div>

        <div className={styles.formRow} style={{display: 'flex', gap: '1rem'}}>
          <div className={styles.formGroup} style={{flex: 1}}>
            <label>City</label>
            <input 
              type="text" 
              className={styles.input} 
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
            />
          </div>
          <div className={styles.formGroup} style={{flex: 1}}>
            <label>State</label>
            <input 
              type="text" 
              className={styles.input} 
              value={formData.state}
              onChange={(e) => setFormData({...formData, state: e.target.value})}
            />
          </div>
        </div>

        <div className={styles.formRow} style={{display: 'flex', gap: '1rem'}}>
          <div className={styles.formGroup} style={{flex: 1}}>
            <label>Country</label>
            <input 
              type="text" 
              className={styles.input} 
              value={formData.country}
              onChange={(e) => setFormData({...formData, country: e.target.value})}
            />
          </div>
          <div className={styles.formGroup} style={{flex: 1}}>
            <label>Postal Code</label>
            <input 
              type="text" 
              className={styles.input} 
              value={formData.postalCode}
              onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
            />
          </div>
        </div>

        <div className={styles.formGroup} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem'}}>
          <label style={{margin: 0}}>Status</label>
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
