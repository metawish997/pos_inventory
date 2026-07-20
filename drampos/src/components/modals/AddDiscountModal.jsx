import React from 'react';
import Modal from '../ui/Modal';
import styles from './ModalForm.module.css';

const AddDiscountModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Discount" maxWidth="800px">
      <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
        
        <div style={{display: 'flex', gap: '1.5rem', marginBottom: '1.5rem'}}>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Discount Name <span className={styles.required}>*</span></label>
            <input type="text" className={styles.input} />
          </div>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Discount Plan <span className={styles.required}>*</span></label>
            <select className={styles.select}>
              <option>Select</option>
            </select>
          </div>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Applicable For <span className={styles.required}>*</span></label>
            <select className={styles.select}>
              <option>Select</option>
            </select>
          </div>
        </div>

        <div style={{display: 'flex', gap: '1.5rem', marginBottom: '1.5rem'}}>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Valid From <span className={styles.required}>*</span></label>
            <input type="text" className={styles.input} placeholder="dd/mm/yyyy" />
          </div>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Valid Till <span className={styles.required}>*</span></label>
            <input type="text" className={styles.input} placeholder="dd/mm/yyyy" />
          </div>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Discount Type <span className={styles.required}>*</span></label>
            <select className={styles.select}>
              <option>Select</option>
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Valid on Following Days <span className={styles.required}>*</span></label>
          <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem'}}>
            <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#4B5563', cursor: 'pointer', margin: 0}}>
              <input type="checkbox" defaultChecked style={{accentColor: '#FF9F43'}} /> Monday
            </label>
            <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#4B5563', cursor: 'pointer', margin: 0}}>
              <input type="checkbox" /> Tuesday
            </label>
            <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#4B5563', cursor: 'pointer', margin: 0}}>
              <input type="checkbox" /> Wednesday
            </label>
            <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#4B5563', cursor: 'pointer', margin: 0}}>
              <input type="checkbox" /> Thursday
            </label>
            <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#4B5563', cursor: 'pointer', margin: 0}}>
              <input type="checkbox" /> Friday
            </label>
            <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#4B5563', cursor: 'pointer', margin: 0}}>
              <input type="checkbox" /> Saturday
            </label>
            <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#4B5563', cursor: 'pointer', margin: 0}}>
              <input type="checkbox" /> Sunday
            </label>
          </div>
        </div>

        <div className={styles.footerActions}>
          <button type="button" className={styles.btnCancel} style={{backgroundColor: '#002046', color: 'white'}} onClick={onClose}>Cancel</button>
          <button type="submit" className={styles.btnSubmit}>Add Discount</button>
        </div>
      </form>
    </Modal>
  );
};

export default AddDiscountModal;
