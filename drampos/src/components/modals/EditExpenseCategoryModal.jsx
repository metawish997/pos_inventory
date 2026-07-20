import React, { useState } from 'react';
import Modal from '../ui/Modal';
import styles from './ModalForm.module.css';

const EditExpenseCategoryModal = ({ isOpen, onClose }) => {
  const [isActive, setIsActive] = useState(true);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Expense Category" maxWidth="500px">
      <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
        
        <div className={styles.formGroup}>
          <label>Category <span className={styles.required}>*</span></label>
          <input type="text" className={styles.input} defaultValue="Utilities" />
        </div>
        
        <div className={styles.formGroup}>
          <label>Description</label>
          <textarea className={styles.input} style={{minHeight: '100px', resize: 'vertical'}}></textarea>
        </div>
        
        <div className={styles.formGroup} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <label style={{margin: 0}}>Status</label>
          <div 
            style={{
              width: '40px', 
              height: '20px', 
              backgroundColor: isActive ? '#28C76F' : '#E5E7EB', 
              borderRadius: '20px', 
              position: 'relative', 
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onClick={() => setIsActive(!isActive)}
          >
            <div 
              style={{
                width: '16px', 
                height: '16px', 
                backgroundColor: 'white', 
                borderRadius: '50%', 
                position: 'absolute', 
                top: '2px', 
                left: isActive ? '22px' : '2px',
                transition: 'left 0.2s'
              }}
            ></div>
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

export default EditExpenseCategoryModal;
