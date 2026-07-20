import React from 'react';
import Modal from '../ui/Modal';
import styles from './ModalForm.module.css';

const AddPurchaseModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Purchase" maxWidth="900px">
      <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
        
        <div style={{display: 'flex', gap: '1.5rem', marginBottom: '1.5rem'}}>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Supplier Name <span className={styles.required}>*</span></label>
            <div style={{display: 'flex'}}>
              <select className={styles.select} style={{borderTopRightRadius: 0, borderBottomRightRadius: 0}}>
                <option>Select</option>
              </select>
              <button type="button" style={{backgroundColor: '#002046', color: 'white', border: 'none', padding: '0 1rem', borderRadius: '0 4px 4px 0', cursor: 'pointer'}}>+</button>
            </div>
          </div>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Date <span className={styles.required}>*</span></label>
            <input type="text" className={styles.input} placeholder="dd/mm/yyyy" />
          </div>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Reference <span className={styles.required}>*</span></label>
            <input type="text" className={styles.input} />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Product <span className={styles.required}>*</span></label>
          <input type="text" className={styles.input} placeholder="Search Product" />
        </div>

        <div style={{backgroundColor: '#F9FAFB', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', overflowX: 'auto'}}>
          <table style={{width: '100%', minWidth: '700px', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left'}}>
            <thead>
              <tr style={{borderBottom: '1px solid #E5E7EB'}}>
                <th style={{padding: '0.75rem', fontWeight: 600, color: '#374151'}}>Product</th>
                <th style={{padding: '0.75rem', fontWeight: 600, color: '#374151'}}>Qty</th>
                <th style={{padding: '0.75rem', fontWeight: 600, color: '#374151'}}>Purchase Price($)</th>
                <th style={{padding: '0.75rem', fontWeight: 600, color: '#374151'}}>Discount($)</th>
                <th style={{padding: '0.75rem', fontWeight: 600, color: '#374151'}}>Tax(%)</th>
                <th style={{padding: '0.75rem', fontWeight: 600, color: '#374151'}}>Tax Amount($)</th>
                <th style={{padding: '0.75rem', fontWeight: 600, color: '#374151'}}>Unit Cost($)</th>
                <th style={{padding: '0.75rem', fontWeight: 600, color: '#374151'}}>Total Cost($)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="8" style={{padding: '2rem', textAlign: 'center', color: '#6B7280'}}>No products added</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{display: 'flex', gap: '1.5rem', marginBottom: '1.5rem'}}>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Order Tax <span className={styles.required}>*</span></label>
            <input type="text" className={styles.input} />
          </div>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Discount <span className={styles.required}>*</span></label>
            <input type="text" className={styles.input} />
          </div>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Shipping <span className={styles.required}>*</span></label>
            <input type="text" className={styles.input} />
          </div>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Status <span className={styles.required}>*</span></label>
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
          <p style={{fontSize: '0.75rem', color: '#6B7280', marginTop: '0.25rem'}}>Maximum 60 Words</p>
        </div>

        <div className={styles.footerActions}>
          <button type="button" className={styles.btnCancel} onClick={onClose} style={{backgroundColor: '#002046', color: 'white'}}>Cancel</button>
          <button type="submit" className={styles.btnSubmit}>Submit</button>
        </div>
      </form>
    </Modal>
  );
};

export default AddPurchaseModal;
