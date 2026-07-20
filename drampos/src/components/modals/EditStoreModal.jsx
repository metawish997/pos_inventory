import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import styles from './ModalForm.module.css';
import { updateStore } from '../../services/inventoryService';

const EditStoreModal = ({ isOpen, onClose, onSuccess, store }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (store) {
      setName(store.name || '');
      setLocation(store.location || '');
      setError(null);
    }
  }, [store]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) { setError('Store name is required'); return; }
    setIsSubmitting(true);
    setError(null);
    try {
      await updateStore(store._id, { name, location });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update store');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Store">
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
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditStoreModal;
