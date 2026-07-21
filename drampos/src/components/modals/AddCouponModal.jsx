import React, { useState } from 'react';
import Modal from '../ui/Modal';
import styles from './ModalForm.module.css';
import { createCoupon } from '../../services/promoService';

const AddCouponModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('Percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [limit, setLimit] = useState(100);
  const [status, setStatus] = useState('Active');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !code || !discountValue) {
      alert('Please fill out all required fields');
      return;
    }
    try {
      setLoading(true);
      const res = await createCoupon({
        name,
        code: code.toUpperCase(),
        discountType,
        discountValue: Number(discountValue),
        limit: Number(limit),
        status
      });
      if (res.success) {
        alert('Coupon created successfully!');
        setName('');
        setCode('');
        setDiscountValue('');
        onClose();
      }
    } catch (err) {
      alert(`Failed to create coupon: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Coupon" maxWidth="600px">
      <form onSubmit={handleSubmit} className={styles.form}>
        <div style={{display: 'flex', gap: '1rem', marginBottom: '1rem'}}>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem'}}>
              Coupon Name <span className={styles.required}>*</span>
            </label>
            <input 
              type="text" 
              className={styles.input} 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem'}}>
              Coupon Code <span className={styles.required}>*</span>
            </label>
            <input 
              type="text" 
              className={styles.input} 
              placeholder="e.g. SUMMER50"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
        </div>

        <div style={{display: 'flex', gap: '1rem', marginBottom: '1rem'}}>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem'}}>
              Discount Type
            </label>
            <select className={styles.select} value={discountType} onChange={(e) => setDiscountType(e.target.value)}>
              <option value="Percentage">Percentage (%)</option>
              <option value="Fixed">Fixed Amount (₹)</option>
            </select>
          </div>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem'}}>
              Discount Value <span className={styles.required}>*</span>
            </label>
            <input 
              type="number" 
              className={styles.input} 
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              required
            />
          </div>
        </div>

        <div style={{display: 'flex', gap: '1rem', marginBottom: '1.5rem'}}>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem'}}>
              Usage Limit
            </label>
            <input 
              type="number" 
              className={styles.input} 
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
            />
          </div>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem'}}>
              Status
            </label>
            <select className={styles.select} value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className={styles.footerActions}>
          <button type="button" className={styles.btnCancel} onClick={onClose}>Cancel</button>
          <button type="submit" className={styles.btnSubmit} disabled={loading}>
            {loading ? 'Submitting...' : 'Add Coupon'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddCouponModal;
