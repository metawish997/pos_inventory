import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import styles from './ModalForm.module.css';
import { updateDiscount } from '../../services/promoService';

const EditDiscountModal = ({ isOpen, onClose, discount }) => {
  const [name, setName] = useState('');
  const [discountType, setDiscountType] = useState('Percentage');
  const [value, setValue] = useState('');
  const [status, setStatus] = useState('Active');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (discount) {
      setName(discount.name || '');
      setDiscountType(discount.discountType || 'Percentage');
      setValue(discount.value || '');
      setStatus(discount.status || 'Active');
    }
  }, [discount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!discount?._id) return;
    try {
      setLoading(true);
      const res = await updateDiscount(discount._id, {
        name,
        discountType,
        value: Number(value),
        status
      });

      if (res.success) {
        alert('Discount updated successfully!');
        onClose();
      }
    } catch (err) {
      alert(`Failed to update discount: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Discount" maxWidth="600px">
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup} style={{marginBottom: '1rem'}}>
          <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem'}}>Discount Name</label>
          <input type="text" className={styles.input} value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div style={{display: 'flex', gap: '1rem', marginBottom: '1.5rem'}}>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem'}}>Discount Value</label>
            <input type="number" className={styles.input} value={value} onChange={(e) => setValue(e.target.value)} required />
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
            {loading ? 'Saving...' : 'Update Discount'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditDiscountModal;
