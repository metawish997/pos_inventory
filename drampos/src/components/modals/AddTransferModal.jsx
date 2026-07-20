import React from 'react';
import Modal from '../ui/Modal';
import styles from './ModalForm.module.css';
import { Search } from 'lucide-react';

const AddTransferModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Transfer" maxWidth="700px">
      <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
        
        <div style={{display: 'flex', gap: '1.5rem'}}>
          <div className={styles.formGroup} style={{flex: 1}}>
            <label>Warehouse From <span className={styles.required}>*</span></label>
            <select className={styles.select}>
              <option>Select</option>
            </select>
          </div>
          <div className={styles.formGroup} style={{flex: 1}}>
            <label>Warehouse To <span className={styles.required}>*</span></label>
            <select className={styles.select}>
              <option>Select</option>
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Reference Number <span className={styles.required}>*</span></label>
          <input type="text" className={styles.input} />
        </div>

        <div className={styles.formGroup}>
          <label>Product <span className={styles.required}>*</span></label>
          <div style={{position: 'relative'}}>
            <Search size={16} style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF'}} />
            <input type="text" className={styles.input} placeholder="Search Product" style={{paddingLeft: '2.25rem'}} />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Notes <span className={styles.required}>*</span></label>
          <textarea className={styles.textarea} rows={4}></textarea>
        </div>

        <div className={styles.footerActions}>
          <button type="button" className={styles.btnCancel} onClick={onClose}>Cancel</button>
          <button type="submit" className={styles.btnSubmit}>Create</button>
        </div>
      </form>
    </Modal>
  );
};

export default AddTransferModal;
