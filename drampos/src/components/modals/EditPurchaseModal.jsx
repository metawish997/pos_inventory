import React from 'react';
import Modal from '../ui/Modal';
import styles from './ModalForm.module.css';
import { Minus, Plus } from 'lucide-react';

const EditPurchaseModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Purchase" maxWidth="900px">
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
            <input type="text" className={styles.input} defaultValue="24 Dec 2024" />
          </div>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Supplier <span className={styles.required}>*</span></label>
            <input type="text" className={styles.input} defaultValue="Elite Retail" />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Product <span className={styles.required}>*</span></label>
          <input type="text" className={styles.input} placeholder="Search Product" />
        </div>

        <div style={{backgroundColor: '#F9FAFB', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', overflowX: 'auto'}}>
          <table style={{width: '100%', minWidth: '700px', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left', backgroundColor: 'white'}}>
            <thead>
              <tr style={{borderBottom: '1px solid #E5E7EB', backgroundColor: '#F3F4F6'}}>
                <th style={{padding: '0.75rem', fontWeight: 600, color: '#374151', borderTopLeftRadius: '4px'}}>Product Name</th>
                <th style={{padding: '0.75rem', fontWeight: 600, color: '#374151'}}>QTY</th>
                <th style={{padding: '0.75rem', fontWeight: 600, color: '#374151'}}>Purchase Price($)</th>
                <th style={{padding: '0.75rem', fontWeight: 600, color: '#374151'}}>Discount($)</th>
                <th style={{padding: '0.75rem', fontWeight: 600, color: '#374151'}}>Tax %</th>
                <th style={{padding: '0.75rem', fontWeight: 600, color: '#374151'}}>Tax Amount($)</th>
                <th style={{padding: '0.75rem', fontWeight: 600, color: '#374151'}}>Unit Cost($)</th>
                <th style={{padding: '0.75rem', fontWeight: 600, color: '#374151', borderTopRightRadius: '4px'}}>Total Cost ($)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid #E5E7EB'}}>
                  <div style={{width: '24px', height: '24px', backgroundColor: '#F3F4F6', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                     <span style={{fontSize: '10px'}}>👟</span>
                  </div>
                  <span style={{color: '#1B2850', fontWeight: 500}}>Nike Jordan</span>
                </td>
                <td style={{padding: '1rem', borderBottom: '1px solid #E5E7EB'}}>
                   <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #E5E7EB', borderRadius: '4px', padding: '0.25rem', width: 'fit-content'}}>
                      <button type="button" style={{border: 'none', background: 'none', cursor: 'pointer', color: '#6B7280'}}><Minus size={14} /></button>
                      <span style={{fontWeight: 500, width: '20px', textAlign: 'center'}}>10</span>
                      <button type="button" style={{border: 'none', background: 'none', cursor: 'pointer', color: '#6B7280'}}><Plus size={14} /></button>
                   </div>
                </td>
                <td style={{padding: '1rem', borderBottom: '1px solid #E5E7EB'}}>300</td>
                <td style={{padding: '1rem', borderBottom: '1px solid #E5E7EB'}}>50</td>
                <td style={{padding: '1rem', borderBottom: '1px solid #E5E7EB'}}>0</td>
                <td style={{padding: '1rem', borderBottom: '1px solid #E5E7EB'}}>0.00</td>
                <td style={{padding: '1rem', borderBottom: '1px solid #E5E7EB'}}>300</td>
                <td style={{padding: '1rem', borderBottom: '1px solid #E5E7EB'}}>600</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem'}}>
          <div style={{width: '300px'}}>
             <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #E5E7EB', color: '#4B5563'}}>
                <span>Order Tax</span>
                <span style={{fontWeight: 500}}>$ 0.00</span>
             </div>
             <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #E5E7EB', color: '#4B5563'}}>
                <span>Discount</span>
                <span style={{fontWeight: 500}}>$ 0.00</span>
             </div>
             <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #E5E7EB', color: '#4B5563'}}>
                <span>Shipping</span>
                <span style={{fontWeight: 500}}>$ 0.00</span>
             </div>
             <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #E5E7EB', color: '#1B2850'}}>
                <span style={{fontWeight: 600}}>Grand Total</span>
                <span style={{fontWeight: 700}}>$1800.00</span>
             </div>
          </div>
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

export default EditPurchaseModal;
