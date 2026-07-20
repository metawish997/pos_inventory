import React, { useState } from 'react';
import Modal from '../ui/Modal';
import styles from './ModalForm.module.css';

const AddAccountModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Account" maxWidth="600px">
      <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
        
        <div className={styles.formGroup}>
          <label>Account Holder Name <span className={styles.required}>*</span></label>
          <input type="text" className={styles.input} />
        </div>
        
        <div className={styles.formGroup}>
          <label>Account Number <span className={styles.required}>*</span></label>
          <input type="text" className={styles.input} />
        </div>
        
        <div className={styles.formGroup}>
          <label>Account Type <span className={styles.required}>*</span></label>
          <select className={styles.select}>
            <option>Select</option>
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label>Opening Balance <span className={styles.required}>*</span></label>
          <input type="text" className={styles.input} defaultValue="$200" />
        </div>

        <div className={styles.formGroup}>
          <label>Description</label>
          <textarea className={styles.input} style={{minHeight: '100px', resize: 'vertical'}}></textarea>
          <p style={{fontSize: '0.75rem', color: '#6B7280', marginTop: '0.25rem'}}>Maximum 60 Words</p>
        </div>
        
        <div className={styles.formGroup}>
          <label>Account Status <span className={styles.required}>*</span></label>
          <select className={styles.select}>
            <option>Active</option>
            <option>Closed</option>
          </select>
        </div>

        <div className={styles.footerActions}>
          <button type="button" className={styles.btnCancel} onClick={onClose} style={{backgroundColor: '#002046', color: 'white'}}>Cancel</button>
          <button type="submit" className={styles.btnSubmit}>Add Account</button>
        </div>
      </form>
    </Modal>
  );
};

export default AddAccountModal;
