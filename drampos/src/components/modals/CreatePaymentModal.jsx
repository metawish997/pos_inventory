import React from 'react';
import Modal from '../ui/Modal';
import styles from './ModalForm.module.css';

const CreatePaymentModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Payments" maxWidth="800px">
      <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
        
        <div style={{display: 'flex', gap: '1.5rem', marginBottom: '1.5rem'}}>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Date <span className={styles.required}>*</span></label>
            <input type="text" className={styles.input} placeholder="Choose Date" />
          </div>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Reference <span className={styles.required}>*</span></label>
            <input type="text" className={styles.input} />
          </div>
        </div>

        <div style={{display: 'flex', gap: '1.5rem', marginBottom: '1.5rem'}}>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Received Amount <span className={styles.required}>*</span></label>
            <div style={{position: 'relative'}}>
              <span style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#4B5563'}}>$</span>
              <input type="text" className={styles.input} style={{paddingLeft: '1.75rem'}} />
            </div>
          </div>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Paying Amount <span className={styles.required}>*</span></label>
            <div style={{position: 'relative'}}>
              <span style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#4B5563'}}>$</span>
              <input type="text" className={styles.input} style={{paddingLeft: '1.75rem'}} />
            </div>
          </div>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Payment type <span className={styles.required}>*</span></label>
            <select className={styles.select}>
              <option>Select</option>
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
            <textarea style={{width: '100%', border: 'none', padding: '1rem', minHeight: '100px', outline: 'none', resize: 'vertical'}}></textarea>
          </div>
          <div style={{fontSize: '0.75rem', color: '#6B7280', marginTop: '0.25rem'}}>Maximum 60 Characters</div>
        </div>

        <div className={styles.footerActions}>
          <button type="button" className={styles.btnCancel} onClick={onClose}>Cancel</button>
          <button type="submit" className={styles.btnSubmit}>Submit</button>
        </div>
      </form>
    </Modal>
  );
};

export default CreatePaymentModal;
