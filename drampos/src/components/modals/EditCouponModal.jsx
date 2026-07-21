import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import styles from './ModalForm.module.css';
import { updateCoupon } from '../../services/promoService';

const EditCouponModal = ({ isOpen, onClose, coupon }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('Percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [status, setStatus] = useState('Active');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (coupon) {
      setName(coupon.name || '');
      setCode(coupon.code || '');
      setDiscountType(coupon.discountType || 'Percentage');
      setDiscountValue(coupon.discountValue || '');
      setStatus(coupon.status || 'Active');
    }
  }, [coupon]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!coupon?._id) return;
    try {
      setLoading(true);
      const res = await updateCoupon(coupon._id, {
        name,
        code: code.toUpperCase(),
        discountType,
        discountValue: Number(discountValue),
        status
      });
      if (res.success) {
        alert('Coupon updated successfully!');
        onClose();
      }
    } catch (err) {
      alert(`Failed to update coupon: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Coupon" maxWidth="600px">
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup} style={{marginBottom: '1rem'}}>
          <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem'}}>Coupon Name</label>
          <input type="text" className={styles.input} value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className={styles.formGroup} style={{marginBottom: '1rem'}}>
          <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem'}}>Coupon Code</label>
          <input type="text" className={styles.input} value={code} onChange={(e) => setCode(e.target.value)} required />
        </div>

        <div style={{display: 'flex', gap: '1rem', marginBottom: '1.5rem'}}>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem'}}>Discount Value</label>
            <input type="number" className={styles.input} value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} required />
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
            {loading ? 'Saving...' : 'Update Coupon'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditCouponModal;
