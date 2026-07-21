import React, { useState } from 'react';
import Modal from '../ui/Modal';
import styles from './ModalForm.module.css';
import { createDiscount } from '../../services/promoService';

const AddDiscountModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [planType, setPlanType] = useState('General');
  const [discountType, setDiscountType] = useState('Percentage');
  const [value, setValue] = useState('');
  const [status, setStatus] = useState('Active');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !value) {
      alert('Please fill out discount name and value');
      return;
    }

    try {
      setLoading(true);
      const res = await createDiscount({
        name,
        planType,
        discountType,
        value: Number(value),
        status
      });

      if (res.success) {
        alert('Discount created successfully!');
        setName('');
        setValue('');
        onClose();
      }
    } catch (err) {
      alert(`Failed to create discount: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Discount" maxWidth="600px">
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup} style={{marginBottom: '1rem'}}>
          <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem'}}>
            Discount Name <span className={styles.required}>*</span>
          </label>
          <input 
            type="text" 
            className={styles.input} 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div style={{display: 'flex', gap: '1rem', marginBottom: '1rem'}}>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem'}}>Plan Type</label>
            <input 
              type="text" 
              className={styles.input} 
              value={planType} 
              onChange={(e) => setPlanType(e.target.value)}
            />
          </div>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem'}}>Discount Type</label>
            <select className={styles.select} value={discountType} onChange={(e) => setDiscountType(e.target.value)}>
              <option value="Percentage">Percentage (%)</option>
              <option value="Fixed">Fixed Amount (₹)</option>
            </select>
          </div>
        </div>

        <div style={{display: 'flex', gap: '1rem', marginBottom: '1.5rem'}}>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem'}}>
              Discount Value <span className={styles.required}>*</span>
            </label>
            <input 
              type="number" 
              className={styles.input} 
              value={value} 
              onChange={(e) => setValue(e.target.value)}
              required
            />
          </div>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem'}}>Status</label>
            <select className={styles.select} value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className={styles.footerActions}>
          <button type="button" className={styles.btnCancel} onClick={onClose}>Cancel</button>
          <button type="submit" className={styles.btnSubmit} disabled={loading}>
            {loading ? 'Submitting...' : 'Add Discount'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddDiscountModal;
