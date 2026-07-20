import React, { useState } from 'react';
import Modal from '../ui/Modal';
import styles from './ModalForm.module.css';
import { createCategory, uploadImage } from '../../services/inventoryService';

const AddCategoryModal = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      setError('Category name is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      let imageUrl = '';
      if (imageFile) {
        const uploadRes = await uploadImage(imageFile);
        imageUrl = uploadRes.url;
      }

      const payload = {
        name,
        description,
        image: imageUrl
      };

      await createCategory(payload);
      if (onSuccess) onSuccess();
      onClose();
      // Reset form
      setName('');
      setDescription('');
      setImageFile(null);
    } catch (err) {
      setError(err.message || 'Failed to create category');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Category">
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '14px' }}>{error}</div>}
        <div className={styles.formGroup}>
          <label>Category Name <span className={styles.required}>*</span></label>
          <input type="text" className={styles.input} value={name} onChange={e => setName(e.target.value)} required />
        </div>
        
        <div className={styles.formGroup}>
          <label>Description</label>
          <textarea className={styles.input} value={description} onChange={e => setDescription(e.target.value)} rows="3"></textarea>
        </div>

        <div className={styles.formGroup}>
          <label>Image</label>
          <input type="file" className={styles.input} accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
        </div>

        <div className={styles.footerActions}>
          <button type="button" className={styles.btnCancel} onClick={onClose} disabled={isSubmitting}>Cancel</button>
          <button type="submit" className={styles.btnSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Category'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddCategoryModal;
