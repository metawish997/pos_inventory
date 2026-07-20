import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import styles from './ModalForm.module.css';
import { updateWarehouse, getStores } from '../../services/inventoryService';

const EditWarehouseModal = ({ isOpen, onClose, onSuccess, warehouse }) => {
  const [name, setName] = useState('');
  const [storeId, setStoreId] = useState('');
  const [location, setLocation] = useState('');
  const [stores, setStores] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      getStores().then(setStores).catch(err => console.error(err));
    }
  }, [isOpen]);

  useEffect(() => {
    if (warehouse) {
      setName(warehouse.name || '');
      setStoreId(warehouse.storeId?._id || warehouse.storeId || '');
      setLocation(warehouse.location || '');
      setError(null);
    }
  }, [warehouse]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !storeId) { setError('Warehouse name and Store are required'); return; }
    setIsSubmitting(true);
    setError(null);
    try {
      await updateWarehouse(warehouse._id, { name, storeId, location });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update warehouse');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Warehouse">
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '14px' }}>{error}</div>}
        <div className={styles.formGroup}>
          <label>Warehouse Name <span className={styles.required}>*</span></label>
          <input type="text" className={styles.input} value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className={styles.formGroup}>
          <label>Store <span className={styles.required}>*</span></label>
          <select className={styles.select} value={storeId} onChange={e => setStoreId(e.target.value)} required>
            <option value="">Select</option>
            {stores.map(s => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>
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

export default EditWarehouseModal;
