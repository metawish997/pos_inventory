import React from 'react';
import Modal from '../ui/Modal';
import styles from './ModalForm.module.css';
import { Search, Plus } from 'lucide-react';

const AddQuotationModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Quotation" maxWidth="900px">
      <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
        
        <div style={{display: 'flex', gap: '1.5rem', marginBottom: '1.5rem'}}>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Customer Name <span className={styles.required}>*</span></label>
            <div style={{display: 'flex', gap: '0.5rem'}}>
              <select className={styles.select} style={{flex: 1}}>
                <option>Select</option>
              </select>
              <button type="button" style={{backgroundColor: '#1B2850', color: 'white', border: 'none', borderRadius: '4px', width: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Plus size={16} />
              </button>
            </div>
          </div>
          
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Date <span className={styles.required}>*</span></label>
            <input type="text" className={styles.input} placeholder="Choose" />
          </div>

          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Reference <span className={styles.required}>*</span></label>
            <input type="text" className={styles.input} />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Product <span className={styles.required}>*</span></label>
          <div style={{position: 'relative'}}>
            <Search size={16} style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF'}} />
            <input type="text" className={styles.input} placeholder="Please type product code and select" style={{paddingLeft: '2.25rem'}} />
          </div>
        </div>

        <div style={{border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.5rem', marginTop: '-1rem'}}>
          <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left'}}>
            <thead>
              <tr style={{backgroundColor: '#F3F4F6', color: '#4B5563', fontSize: '0.75rem'}}>
                <th style={{padding: '0.75rem 1rem', fontWeight: 600}}>Product</th>
                <th style={{padding: '0.75rem 1rem', fontWeight: 600}}>Qty</th>
                <th style={{padding: '0.75rem 1rem', fontWeight: 600}}>Purchase Price($)</th>
                <th style={{padding: '0.75rem 1rem', fontWeight: 600}}>Discount($)</th>
                <th style={{padding: '0.75rem 1rem', fontWeight: 600}}>Tax(%)</th>
                <th style={{padding: '0.75rem 1rem', fontWeight: 600}}>Tax Amount($)</th>
                <th style={{padding: '0.75rem 1rem', fontWeight: 600}}>Unit Cost($)</th>
                <th style={{padding: '0.75rem 1rem', fontWeight: 600}}>Total Cost(%)</th>
              </tr>
            </thead>
            <tbody>
              {/* Empty state for products table */}
              <tr>
                 <td colSpan="8" style={{padding: '2rem', textAlign: 'center', color: '#6B7280'}}></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{display: 'flex', gap: '1.5rem', marginBottom: '1.5rem'}}>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Order Tax <span className={styles.required}>*</span></label>
            <input type="text" className={styles.input} defaultValue="0" />
          </div>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Discount <span className={styles.required}>*</span></label>
            <input type="text" className={styles.input} defaultValue="0" />
          </div>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Shipping <span className={styles.required}>*</span></label>
            <input type="text" className={styles.input} defaultValue="0" />
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
        </div>

        <div className={styles.footerActions}>
          <button type="button" className={styles.btnCancel} onClick={onClose}>Cancel</button>
          <button type="submit" className={styles.btnSubmit}>Submit</button>
        </div>
      </form>
    </Modal>
  );
};

export default AddQuotationModal;
