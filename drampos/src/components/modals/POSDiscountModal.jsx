import React from 'react';
import Modal from '../ui/Modal';
import styles from './ModalForm.module.css';

const POSDiscountModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Discount" maxWidth="600px">
      <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
        
        <div className={styles.formGroup}>
          <label>Order Discount Type <span className={styles.required}>*</span></label>
          <select className={styles.select}>
            <option>Select</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Value <span className={styles.required}>*</span></label>
          <input type="text" className={styles.input} />
        </div>

        <div className={styles.footerActions}>
          <button type="button" className={styles.btnCancel} onClick={onClose}>Cancel</button>
          <button type="submit" className={styles.btnSubmit}>Submit</button>
        </div>
      </form>
    </Modal>
  );
};

export default POSDiscountModal;
