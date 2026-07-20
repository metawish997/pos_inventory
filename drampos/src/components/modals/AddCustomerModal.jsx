import React from 'react';
import Modal from '../ui/Modal';
import styles from './ModalForm.module.css';

const AddCustomerModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Customer" maxWidth="700px">
      <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
        
        <div style={{display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem'}}>
          <div style={{width: '100px', height: '100px', border: '1px dashed #D1D5DB', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#6B7280', cursor: 'pointer'}}>
            <span style={{fontSize: '24px', marginBottom: '4px'}}>+</span>
            <span style={{fontSize: '12px'}}>Add Image</span>
          </div>
          <div>
            <button type="button" style={{backgroundColor: '#FF9F43', color: 'white', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '0.875rem', cursor: 'pointer', marginBottom: '0.5rem'}}>Upload Image</button>
            <p style={{fontSize: '0.75rem', color: '#6B7280', margin: 0}}>JPEG, PNG up to 2 MB</p>
          </div>
        </div>

        <div className={styles.formRow} style={{display: 'flex', gap: '1rem'}}>
          <div className={styles.formGroup} style={{flex: 1}}>
            <label>First Name <span className={styles.required}>*</span></label>
            <input type="text" className={styles.input} />
          </div>
          <div className={styles.formGroup} style={{flex: 1}}>
            <label>Last Name <span className={styles.required}>*</span></label>
            <input type="text" className={styles.input} />
          </div>
        </div>
        
        <div className={styles.formGroup}>
          <label>Email <span className={styles.required}>*</span></label>
          <input type="email" className={styles.input} />
        </div>
        
        <div className={styles.formGroup}>
          <label>Phone <span className={styles.required}>*</span></label>
          <input type="text" className={styles.input} />
        </div>
        
        <div className={styles.formGroup}>
          <label>Address <span className={styles.required}>*</span></label>
          <input type="text" className={styles.input} />
        </div>

        <div className={styles.formRow} style={{display: 'flex', gap: '1rem'}}>
          <div className={styles.formGroup} style={{flex: 1}}>
            <label>City <span className={styles.required}>*</span></label>
            <select className={styles.select}>
              <option>Select</option>
            </select>
          </div>
          <div className={styles.formGroup} style={{flex: 1}}>
            <label>State <span className={styles.required}>*</span></label>
            <select className={styles.select}>
              <option>Select</option>
            </select>
          </div>
        </div>

        <div className={styles.formRow} style={{display: 'flex', gap: '1rem'}}>
          <div className={styles.formGroup} style={{flex: 1}}>
            <label>Country <span className={styles.required}>*</span></label>
            <select className={styles.select}>
              <option>Select</option>
            </select>
          </div>
          <div className={styles.formGroup} style={{flex: 1}}>
            <label>Postal Code <span className={styles.required}>*</span></label>
            <input type="text" className={styles.input} />
          </div>
        </div>

        <div className={styles.formGroup} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem'}}>
          <label style={{margin: 0}}>Status</label>
          <div 
            style={{
              width: '40px', 
              height: '20px', 
              backgroundColor: '#28C76F', 
              borderRadius: '20px', 
              position: 'relative', 
              cursor: 'pointer',
            }}
          >
            <div 
              style={{
                width: '16px', 
                height: '16px', 
                backgroundColor: 'white', 
                borderRadius: '50%', 
                position: 'absolute', 
                top: '2px', 
                left: '22px',
              }}
            ></div>
          </div>
        </div>

        <div className={styles.footerActions}>
          <button type="button" className={styles.btnCancel} onClick={onClose} style={{backgroundColor: '#002046', color: 'white'}}>Cancel</button>
          <button type="submit" className={styles.btnSubmit}>Add Customer</button>
        </div>
      </form>
    </Modal>
  );
};

export default AddCustomerModal;
