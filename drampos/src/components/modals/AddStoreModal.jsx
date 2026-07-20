import React, { useState } from 'react';
import Modal from '../ui/Modal';
import styles from './ModalForm.module.css';
import { createStore } from '../../services/inventoryService';

const AddStoreModal = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      setError('Store name is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const payload = {
        name,
        location
      };

      await createStore(payload);
      if (onSuccess) onSuccess();
      onClose();
      // Reset form
      setName('');
      setLocation('');
    } catch (err) {
      setError(err.message || 'Failed to create store');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Store">
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '14px' }}>{error}</div>}
        
        <div className={styles.formGroup}>
          <label>Store Name <span className={styles.required}>*</span></label>
          <input type="text" className={styles.input} value={name} onChange={e => setName(e.target.value)} required />
        </div>
        
        <div className={styles.formGroup}>
          <label>Location</label>
          <input type="text" className={styles.input} value={location} onChange={e => setLocation(e.target.value)} />
        </div>

        <div className={styles.footerActions}>
          <button type="button" className={styles.btnCancel} onClick={onClose} disabled={isSubmitting}>Cancel</button>
          <button type="submit" className={styles.btnSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Store'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddStoreModal;
