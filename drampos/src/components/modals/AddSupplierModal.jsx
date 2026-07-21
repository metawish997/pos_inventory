import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import styles from './ModalForm.module.css';
import { API_BASE_URL } from '../../api/endpoints';

const AddSupplierModal = ({ isOpen, onClose, supplierToEdit = null, onSuccess }) => {
  const [formData, setFormData] = useState({
    vendorName: '',
    companyName: '',
    email: '',
    mobile: '',
    country: '',
    city: '',
    status: 'Active',
    type: 'supplier'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (supplierToEdit) {
      setFormData({
        vendorName: supplierToEdit.vendorName || '',
        companyName: supplierToEdit.companyName || '',
        email: supplierToEdit.email || '',
        mobile: supplierToEdit.mobile || supplierToEdit.phone || '',
        country: supplierToEdit.country || '',
        city: supplierToEdit.city || '',
        status: supplierToEdit.status || 'Active',
        type: 'supplier'
      });
    } else {
      setFormData({
        vendorName: '',
        companyName: '',
        email: '',
        mobile: '',
        country: '',
        city: '',
        status: 'Active',
        type: 'supplier'
      });
    }
    setError('');
  }, [supplierToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.vendorName) {
      setError('Supplier Name is required.');
      return;
    }

    try {
      setLoading(true);
      const url = supplierToEdit ? `${API_BASE_URL}/vendors/${supplierToEdit._id}` : `${API_BASE_URL}/vendors`;
      const method = supplierToEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || 'Failed to save supplier');

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={supplierToEdit ? "Edit Supplier" : "Add Supplier"} maxWidth="600px">
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div style={{ color: '#EA5455', fontSize: '13px', marginBottom: '1rem' }}>{error}</div>}

        <div className={styles.formGroup}>
          <label>Supplier Name <span className={styles.required}>*</span></label>
          <input 
            type="text" 
            className={styles.input} 
            value={formData.vendorName}
            onChange={(e) => setFormData({...formData, vendorName: e.target.value})}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Company Name</label>
          <input 
            type="text" 
            className={styles.input} 
            value={formData.companyName}
            onChange={(e) => setFormData({...formData, companyName: e.target.value})}
          />
        </div>

        <div className={styles.formRow} style={{display: 'flex', gap: '1rem'}}>
          <div className={styles.formGroup} style={{flex: 1}}>
            <label>Email</label>
            <input 
              type="email" 
              className={styles.input} 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className={styles.formGroup} style={{flex: 1}}>
            <label>Phone / Mobile</label>
            <input 
              type="text" 
              className={styles.input} 
              value={formData.mobile}
              onChange={(e) => setFormData({...formData, mobile: e.target.value})}
            />
          </div>
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
            <label>Country</label>
            <input 
              type="text" 
              className={styles.input} 
              value={formData.country}
              onChange={(e) => setFormData({...formData, country: e.target.value})}
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
            {loading ? 'Saving...' : supplierToEdit ? 'Update Supplier' : 'Add Supplier'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddSupplierModal;
