import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import styles from './ModalForm.module.css';
import { updateCategory, uploadImage } from '../../services/inventoryService';

const EditCategoryModal = ({ isOpen, onClose, onSuccess, category }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (category) {
      setName(category.name || '');
      setDescription(category.description || '');
      setImageFile(null);
      setError(null);
    }
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) { setError('Category name is required'); return; }
    setIsSubmitting(true);
    setError(null);
    try {
      let imageUrl = category?.image || '';
      if (imageFile) {
        const res = await uploadImage(imageFile);
        imageUrl = res.url;
      }
      await updateCategory(category._id, { name, description, image: imageUrl });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update category');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Category">
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
          <label>Image <span style={{ fontSize: '12px', color: '#6B7280' }}>(leave empty to keep current)</span></label>
          {category?.image && !imageFile && (
            <img src={category.image} alt="current" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', marginBottom: '8px', display: 'block' }} />
          )}
          {imageFile && (
            <img src={URL.createObjectURL(imageFile)} alt="preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', marginBottom: '8px', display: 'block' }} />
          )}
          <input type="file" className={styles.input} accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
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

export default EditCategoryModal;
