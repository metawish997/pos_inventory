import React from 'react';
import Modal from '../ui/Modal';
import styles from './ModalForm.module.css';

const HoldOrderModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Hold order" maxWidth="500px">
      <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
        <div style={{textAlign: 'center', marginBottom: '2rem'}}>
          <h1 style={{fontSize: '3rem', fontWeight: 'bold', color: '#1B2850', margin: '0'}}>4500.00</h1>
        </div>
        
        <div className={styles.formGroup}>
          <label>Order Reference <span className={styles.required}>*</span></label>
          <input type="text" className={styles.input} />
        </div>

        <p style={{fontSize: '0.875rem', color: '#6B7280', marginBottom: '2rem', lineHeight: '1.5'}}>
          The current order will be set on hold. You can retrieve this order from the pending order button. Providing a reference to it might help you to identify the order more quickly.
        </p>

        <div className={styles.footerActions}>
          <button type="button" className={styles.btnCancel} onClick={onClose}>Cancel</button>
          <button type="submit" className={styles.btnSubmit}>Confirm</button>
        </div>
      </form>
    </Modal>
  );
};

export default HoldOrderModal;
