import React, { useState, useEffect, useRef } from 'react';
import Modal from '../ui/Modal';
import styles from './ModalForm.module.css';
import { updateBrand, uploadImage } from '../../services/inventoryService';

const EditBrandModal = ({ isOpen, onClose, onSuccess, brand }) => {
  const [name, setName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (brand) {
      setName(brand.name || '');
      setImageFile(null);
      setError(null);
    }
  }, [brand]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) { setError('Brand name is required'); return; }
    setIsSubmitting(true);
    setError(null);
    try {
      let imageUrl = brand?.image || '';
      if (imageFile) {
        const res = await uploadImage(imageFile);
        imageUrl = res.url;
      }
      await updateBrand(brand._id, { name, image: imageUrl });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update brand');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Brand" maxWidth="500px">
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '14px' }}>{error}</div>}
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div onClick={() => fileInputRef.current?.click()} style={{ width: '120px', height: '120px', border: '2px dashed #E5E7EB', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden' }}>
            {imageFile ? (
              <img src={URL.createObjectURL(imageFile)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : brand?.image ? (
              <img src={brand.image} alt="Current" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '1px solid #9CA3AF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280', marginBottom: '8px' }}>+</div>
                <span style={{ fontSize: '0.875rem', color: '#4B5563' }}>Add Image</span>
              </>
            )}
          </div>
          <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <button type="button" onClick={() => fileInputRef.current?.click()} style={{ backgroundColor: '#FF9F43', color: 'white', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', fontWeight: 500, marginBottom: '0.5rem', cursor: 'pointer' }}>
              Change Image
            </button>
            <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>JPEG, PNG up to 2 MB</span>
          </div>
        </div>
        <div className={styles.formGroup}>
          <label>Brand Name <span className={styles.required}>*</span></label>
          <input type="text" className={styles.input} value={name} onChange={e => setName(e.target.value)} required />
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

export default EditBrandModal;
