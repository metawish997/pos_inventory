import React from 'react';
import Modal from '../ui/Modal';
import styles from './ModalForm.module.css';

const AddCouponModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Coupon" maxWidth="800px">
      <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
        
        <div style={{display: 'flex', gap: '1.5rem', marginBottom: '1.5rem'}}>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Coupon Name <span className={styles.required}>*</span></label>
            <input type="text" className={styles.input} />
          </div>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Coupon Code <span className={styles.required}>*</span></label>
            <input type="text" className={styles.input} />
          </div>
        </div>

        <div style={{display: 'flex', gap: '1.5rem', marginBottom: '1.5rem'}}>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Type <span className={styles.required}>*</span></label>
            <select className={styles.select}>
              <option>Choose Type</option>
              <option>Percentage</option>
              <option>Fixed Amount</option>
            </select>
          </div>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Discount <span className={styles.required}>*</span></label>
            <input type="text" className={styles.input} />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Limit <span className={styles.required}>*</span></label>
          <input type="text" className={styles.input} />
          <p style={{fontSize: '0.75rem', color: '#6B7280', marginTop: '0.25rem'}}>Enter 0 for Unlimited</p>
        </div>

        <div style={{display: 'flex', gap: '1.5rem', marginBottom: '1.5rem'}}>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Start Date <span className={styles.required}>*</span></label>
            <input type="text" className={styles.input} placeholder="dd/mm/yyyy" />
          </div>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>End Date <span className={styles.required}>*</span></label>
            <input type="text" className={styles.input} placeholder="dd/mm/yyyy" />
          </div>
        </div>

        <div className={styles.formGroup}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem'}}>
            <label style={{margin: 0}}>Product <span className={styles.required}>*</span></label>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#4B5563'}}>
              <div style={{width: '36px', height: '20px', backgroundColor: '#D1D5DB', borderRadius: '10px', position: 'relative'}}>
                 <div style={{width: '16px', height: '16px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: '2px'}}></div>
              </div>
              Once Per Customer
            </div>
          </div>
          <select className={styles.select}>
            <option>Select</option>
          </select>
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
            <textarea style={{width: '100%', border: 'none', padding: '1rem', minHeight: '100px', outline: 'none', resize: 'vertical'}}></textarea>
          </div>
          <p style={{fontSize: '0.75rem', color: '#6B7280', marginTop: '0.25rem'}}>Maximum 60 Words</p>
        </div>

        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', padding: '1rem 0', borderTop: '1px solid #E5E7EB'}}>
          <span style={{fontSize: '0.875rem', fontWeight: 500, color: '#374151'}}>Status</span>
          <div style={{width: '36px', height: '20px', backgroundColor: '#28C76F', borderRadius: '10px', position: 'relative'}}>
             <div style={{width: '16px', height: '16px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '2px', right: '2px'}}></div>
          </div>
        </div>

        <div className={styles.footerActions}>
          <button type="button" className={styles.btnCancel} onClick={onClose}>Cancel</button>
          <button type="submit" className={styles.btnSubmit}>Add Coupon</button>
        </div>
      </form>
    </Modal>
  );
};

export default AddCouponModal;
