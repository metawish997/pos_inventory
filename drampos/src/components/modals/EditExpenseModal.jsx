import React from 'react';
import Modal from '../ui/Modal';
import styles from './ModalForm.module.css';

const EditExpenseModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Expense" maxWidth="600px">
      <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
        
        <div className={styles.formGroup}>
          <label>Expense <span className={styles.required}>*</span></label>
          <input type="text" className={styles.input} defaultValue="Electricity Payment" />
        </div>
        
        <div className={styles.formGroup}>
          <label>Description</label>
          <textarea className={styles.input} style={{minHeight: '100px', resize: 'vertical'}}></textarea>
        </div>
        
        <div style={{display: 'flex', gap: '1.5rem', marginBottom: '1.5rem'}}>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Category <span className={styles.required}>*</span></label>
            <select className={styles.select}>
              <option>Utilities</option>
            </select>
          </div>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Date <span className={styles.required}>*</span></label>
            <input type="text" className={styles.input} defaultValue="24 Dec 2024" />
          </div>
        </div>

        <div style={{display: 'flex', gap: '1.5rem', marginBottom: '1.5rem'}}>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Amount <span className={styles.required}>*</span></label>
            <input type="text" className={styles.input} defaultValue="$200" />
          </div>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Status <span className={styles.required}>*</span></label>
            <select className={styles.select}>
              <option>Approved</option>
              <option>Pending</option>
            </select>
          </div>
        </div>

        <div className={styles.footerActions}>
          <button type="button" className={styles.btnCancel} onClick={onClose} style={{backgroundColor: '#002046', color: 'white'}}>Cancel</button>
          <button type="submit" className={styles.btnSubmit}>Save Changes</button>
        </div>
      </form>
    </Modal>
  );
};

export default EditExpenseModal;
