import React, { useState } from 'react';
import Modal from '../ui/Modal';
import styles from './ModalForm.module.css';

const EditIncomeCategoryModal = ({ isOpen, onClose }) => {
  const [isActive, setIsActive] = useState(true);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Income Category" maxWidth="500px">
      <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
        
        <div className={styles.formGroup}>
          <label>Code <span className={styles.required}>*</span></label>
          <div style={{display: 'flex', gap: '0.5rem'}}>
            <input type="text" className={styles.input} defaultValue="INCAB49" style={{flex: 1}} />
            <button type="button" style={{backgroundColor: '#FF9F43', color: 'white', border: 'none', borderRadius: '4px', padding: '0 1rem', fontSize: '0.875rem', cursor: 'pointer'}}>Generate</button>
          </div>
        </div>
        
        <div className={styles.formGroup}>
          <label>Enter Name <span className={styles.required}>*</span></label>
          <input type="text" className={styles.input} defaultValue="Foreign investment" />
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

export default EditIncomeCategoryModal;
