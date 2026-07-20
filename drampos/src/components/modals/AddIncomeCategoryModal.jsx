import React, { useState } from 'react';
import Modal from '../ui/Modal';
import styles from './ModalForm.module.css';

const AddIncomeCategoryModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Income Category" maxWidth="500px">
      <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
        
        <div className={styles.formGroup}>
          <label>Code <span className={styles.required}>*</span></label>
          <div style={{display: 'flex', gap: '0.5rem'}}>
            <input type="text" className={styles.input} style={{flex: 1}} />
            <button type="button" style={{backgroundColor: '#FF9F43', color: 'white', border: 'none', borderRadius: '4px', padding: '0 1rem', fontSize: '0.875rem', cursor: 'pointer'}}>Generate</button>
          </div>
        </div>
        
        <div className={styles.formGroup}>
          <label>Enter Name <span className={styles.required}>*</span></label>
          <input type="text" className={styles.input} defaultValue="Investment" />
        </div>

        <div className={styles.footerActions}>
          <button type="button" className={styles.btnCancel} onClick={onClose} style={{backgroundColor: '#002046', color: 'white'}}>Cancel</button>
          <button type="submit" className={styles.btnSubmit}>Add Category</button>
        </div>
      </form>
    </Modal>
  );
};

export default AddIncomeCategoryModal;
