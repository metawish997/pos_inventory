import React from 'react';
import Modal from '../ui/Modal';
import styles from './ModalForm.module.css';

const EditIncomeModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Income" maxWidth="600px">
      <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
        
        <div className={styles.formGroup}>
          <label>Date <span className={styles.required}>*</span></label>
          <input type="text" className={styles.input} defaultValue="24 Dec 2024" />
        </div>
        
        <div className={styles.formGroup}>
          <label>Category <span className={styles.required}>*</span></label>
          <select className={styles.select}>
            <option>select</option>
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label>Store <span className={styles.required}>*</span></label>
          <select className={styles.select}>
            <option>select</option>
          </select>
        </div>

        <div style={{display: 'flex', gap: '1.5rem', marginBottom: '1.5rem'}}>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Amount <span className={styles.required}>*</span></label>
            <input type="text" className={styles.input} defaultValue="$200" />
          </div>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Account <span className={styles.required}>*</span></label>
            <select className={styles.select}>
              <option>Zephyr Indira (329878430...</option>
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Description</label>
          <div style={{border: '1px solid #E5E7EB', borderRadius: '4px', overflow: 'hidden'}}>
            <div style={{padding: '0.5rem', borderBottom: '1px solid #E5E7EB', display: 'flex', gap: '1rem', backgroundColor: '#F9FAFB', alignItems: 'center'}}>
              <select style={{border: 'none', background: 'transparent', outline: 'none', fontSize: '0.875rem', color: '#4B5563'}}>
                <option>Normal</option>
              </select>
              <div style={{display: 'flex', gap: '0.5rem', color: '#4B5563'}}>
                <button type="button" style={{border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold'}}>B</button>
                <button type="button" style={{border: 'none', background: 'none', cursor: 'pointer', fontStyle: 'italic'}}>I</button>
                <button type="button" style={{border: 'none', background: 'none', cursor: 'pointer', textDecoration: 'underline'}}>U</button>
                <button type="button" style={{border: 'none', background: 'none', cursor: 'pointer'}}>🔗</button>
                <button type="button" style={{border: 'none', background: 'none', cursor: 'pointer'}}>≡</button>
                <button type="button" style={{border: 'none', background: 'none', cursor: 'pointer'}}>☷</button>
                <button type="button" style={{border: 'none', background: 'none', cursor: 'pointer'}}>T</button>
              </div>
            </div>
            <textarea style={{width: '100%', border: 'none', padding: '1rem', minHeight: '100px', outline: 'none', resize: 'vertical'}} defaultValue="Electricity Bill"></textarea>
          </div>
          <p style={{fontSize: '0.75rem', color: '#6B7280', marginTop: '0.25rem'}}>Maximum 60 Words</p>
        </div>

        <div className={styles.footerActions}>
          <button type="button" className={styles.btnCancel} onClick={onClose} style={{backgroundColor: '#002046', color: 'white'}}>Cancel</button>
          <button type="submit" className={styles.btnSubmit}>Save Changes</button>
        </div>
      </form>
    </Modal>
  );
};

export default EditIncomeModal;
