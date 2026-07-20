import React from 'react';
import Modal from '../ui/Modal';
import styles from './ModalForm.module.css';

const POSCreateCustomerModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create" maxWidth="800px">
      <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
        
        <div style={{display: 'flex', gap: '1.5rem', marginBottom: '1.5rem'}}>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Customer Name <span className={styles.required}>*</span></label>
            <input type="text" className={styles.input} />
          </div>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Phone <span className={styles.required}>*</span></label>
            <input type="text" className={styles.input} />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Email</label>
          <input type="email" className={styles.input} />
        </div>

        <div className={styles.formGroup}>
          <label>Address</label>
          <input type="text" className={styles.input} />
        </div>

        <div style={{display: 'flex', gap: '1.5rem', marginBottom: '1.5rem'}}>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>City</label>
            <input type="text" className={styles.input} />
          </div>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Country</label>
            <input type="text" className={styles.input} />
          </div>
        </div>

        <div className={styles.footerActions}>
          <button type="button" className={styles.btnCancel} onClick={onClose}>Cancel</button>
          <button type="submit" className={styles.btnSubmit}>Submit</button>
        </div>
      </form>
    </Modal>
  );
};

export default POSCreateCustomerModal;
