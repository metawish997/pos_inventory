import React from 'react';
import Modal from '../ui/Modal';
import styles from './ModalForm.module.css';

const AddDiscountPlanModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Discount Plan" maxWidth="500px">
      <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
        
        <div className={styles.formGroup}>
          <label>Plan Name <span className={styles.required}>*</span></label>
          <input type="text" className={styles.input} />
        </div>

        <div className={styles.formGroup}>
          <label>Customer <span className={styles.required}>*</span></label>
          <div style={{position: 'relative'}}>
             <select className={styles.select}>
               <option>Select</option>
             </select>
             <button type="button" style={{position: 'absolute', right: '0', top: '-25px', background: 'none', border: 'none', color: '#FF9F43', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem'}}>
               <span style={{fontSize: '1rem'}}>+</span> Add New
             </button>
          </div>
        </div>

        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
          <span style={{fontSize: '0.875rem', fontWeight: 500, color: '#374151'}}>Status</span>
          <div style={{width: '36px', height: '20px', backgroundColor: '#D1D5DB', borderRadius: '10px', position: 'relative'}}>
             <div style={{width: '16px', height: '16px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: '2px'}}></div>
          </div>
        </div>

        <div className={styles.footerActions}>
          <button type="button" className={styles.btnCancel} style={{backgroundColor: '#002046', color: 'white'}} onClick={onClose}>Cancel</button>
          <button type="submit" className={styles.btnSubmit}>Add Discount Plan</button>
        </div>
      </form>
    </Modal>
  );
};

export default AddDiscountPlanModal;
