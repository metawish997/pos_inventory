import React, { useState } from 'react';
import Modal from '../ui/Modal';
import styles from './ModalForm.module.css';
import { createVariantAttribute } from '../../services/inventoryService';

const AddVariantModal = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [valuesStr, setValuesStr] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) { setError('Variant name is required'); return; }

    setIsSubmitting(true);
    setError(null);

    // Convert comma-separated string into a clean array of strings
    const valuesArray = valuesStr
      .split(',')
      .map(v => v.trim())
      .filter(Boolean);

    try {
      await createVariantAttribute({ name, values: valuesArray });
      if (onSuccess) onSuccess();
      onClose();
      setName('');
      setValuesStr('');
    } catch (err) {
      setError(err.message || 'Failed to create variant attribute');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Variant Attribute" maxWidth="500px">
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '14px' }}>{error}</div>}

        <div className={styles.formGroup}>
          <label>Variant Name <span className={styles.required}>*</span></label>
          <input
            type="text"
            className={styles.input}
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Size, Color, Material"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Variant Values</label>
          <input
            type="text"
            className={styles.input}
            value={valuesStr}
            onChange={e => setValuesStr(e.target.value)}
            placeholder="e.g. XS, S, M, L, XL"
          />
        </div>

        <div className={styles.footerActions}>
          <button type="button" className={styles.btnCancel} onClick={onClose} disabled={isSubmitting}>Cancel</button>
          <button type="submit" className={styles.btnSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Variant'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddVariantModal;