import React from 'react';
import Modal from '../ui/Modal';
import styles from './ModalForm.module.css';
import { Search, Plus, Minus } from 'lucide-react';

const EditSalesModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Sales" maxWidth="900px">
      <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
        
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
              <tr style={{borderTop: '1px solid #E5E7EB'}}>
                <td style={{padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                  <div style={{width: '24px', height: '24px', backgroundColor: '#F3F4F6', borderRadius: '4px'}}></div>
                  <span style={{fontSize: '0.875rem', color: '#1B2850'}}>Nike Jordan</span>
                </td>
                <td style={{padding: '0.75rem 1rem'}}>
                  <div style={{display: 'flex', alignItems: 'center', border: '1px solid #E5E7EB', borderRadius: '4px', width: 'fit-content'}}>
                    <button type="button" style={{padding: '4px 8px', border: 'none', background: 'none', cursor: 'pointer', color: '#1B2850'}}><Plus size={14} /></button>
                    <span style={{padding: '0 8px', fontSize: '0.875rem', borderLeft: '1px solid #E5E7EB', borderRight: '1px solid #E5E7EB'}}>2</span>
                    <button type="button" style={{padding: '4px 8px', border: 'none', background: 'none', cursor: 'pointer', color: '#1B2850'}}><Minus size={14} /></button>
                  </div>
                </td>
                <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6B7280'}}>2000</td>
                <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6B7280'}}>500</td>
                <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6B7280'}}>0.00</td>
                <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6B7280'}}>0.00</td>
                <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6B7280'}}>0.00</td>
                <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6B7280'}}>1500</td>
              </tr>
              <tr style={{borderTop: '1px solid #E5E7EB'}}>
                <td style={{padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                  <div style={{width: '24px', height: '24px', backgroundColor: '#F3F4F6', borderRadius: '4px'}}></div>
                  <span style={{fontSize: '0.875rem', color: '#1B2850'}}>Apple Series 5 Watch</span>
                </td>
                <td style={{padding: '0.75rem 1rem'}}>
                  <div style={{display: 'flex', alignItems: 'center', border: '1px solid #E5E7EB', borderRadius: '4px', width: 'fit-content'}}>
                    <button type="button" style={{padding: '4px 8px', border: 'none', background: 'none', cursor: 'pointer', color: '#1B2850'}}><Plus size={14} /></button>
                    <span style={{padding: '0 8px', fontSize: '0.875rem', borderLeft: '1px solid #E5E7EB', borderRight: '1px solid #E5E7EB'}}>2</span>
                    <button type="button" style={{padding: '4px 8px', border: 'none', background: 'none', cursor: 'pointer', color: '#1B2850'}}><Minus size={14} /></button>
                  </div>
                </td>
                <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6B7280'}}>3000</td>
                <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6B7280'}}>400</td>
                <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6B7280'}}>0.00</td>
                <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6B7280'}}>0.00</td>
                <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6B7280'}}>0.00</td>
                <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6B7280'}}>1700</td>
              </tr>
              <tr style={{borderTop: '1px solid #E5E7EB'}}>
                <td style={{padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                  <div style={{width: '24px', height: '24px', backgroundColor: '#F3F4F6', borderRadius: '4px'}}></div>
                  <span style={{fontSize: '0.875rem', color: '#1B2850'}}>Lobar Handy</span>
                </td>
                <td style={{padding: '0.75rem 1rem'}}>
                  <div style={{display: 'flex', alignItems: 'center', border: '1px solid #E5E7EB', borderRadius: '4px', width: 'fit-content'}}>
                    <button type="button" style={{padding: '4px 8px', border: 'none', background: 'none', cursor: 'pointer', color: '#1B2850'}}><Plus size={14} /></button>
                    <span style={{padding: '0 8px', fontSize: '0.875rem', borderLeft: '1px solid #E5E7EB', borderRight: '1px solid #E5E7EB'}}>2</span>
                    <button type="button" style={{padding: '4px 8px', border: 'none', background: 'none', cursor: 'pointer', color: '#1B2850'}}><Minus size={14} /></button>
                  </div>
                </td>
                <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6B7280'}}>2500</td>
                <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6B7280'}}>500</td>
                <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6B7280'}}>0.00</td>
                <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6B7280'}}>0.00</td>
                <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6B7280'}}>0.00</td>
                <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6B7280'}}>2000</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div style={{display: 'flex', gap: '1.5rem', marginBottom: '1.5rem'}}>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Customer Name <span className={styles.required}>*</span></label>
            <div style={{display: 'flex', gap: '0.5rem'}}>
              <select className={styles.select} style={{flex: 1}} defaultValue="Carl Evans">
                <option>Carl Evans</option>
              </select>
              <button type="button" style={{backgroundColor: '#1B2850', color: 'white', border: 'none', borderRadius: '4px', width: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Plus size={16} />
              </button>
            </div>
          </div>
          
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Date <span className={styles.required}>*</span></label>
            <input type="text" className={styles.input} defaultValue="19 Jan 2023" />
          </div>

          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Supplier <span className={styles.required}>*</span></label>
            <select className={styles.select} defaultValue="Apex Computers">
              <option>Apex Computers</option>
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Product Name <span className={styles.required}>*</span></label>
          <div style={{position: 'relative'}}>
            <Search size={16} style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF'}} />
            <input type="text" className={styles.input} placeholder="Please type product code and select" style={{paddingLeft: '2.25rem'}} />
          </div>
        </div>

        <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem'}}>
          <div style={{width: '300px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #E5E7EB'}}>
              <span style={{color: '#4B5563', fontSize: '0.875rem'}}>Order Tax</span>
              <span style={{color: '#1B2850', fontSize: '0.875rem', fontWeight: 500}}>$ 0.00</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #E5E7EB'}}>
              <span style={{color: '#4B5563', fontSize: '0.875rem'}}>Discount</span>
              <span style={{color: '#1B2850', fontSize: '0.875rem', fontWeight: 500}}>$ 0.00</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #E5E7EB'}}>
              <span style={{color: '#4B5563', fontSize: '0.875rem'}}>Shipping</span>
              <span style={{color: '#1B2850', fontSize: '0.875rem', fontWeight: 500}}>$ 0.00</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0'}}>
              <span style={{color: '#1B2850', fontSize: '0.875rem', fontWeight: 600}}>Grand Total</span>
              <span style={{color: '#1B2850', fontSize: '0.875rem', fontWeight: 600}}>$ 5200.00</span>
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
          <label>Notes <span className={styles.required}>*</span></label>
          <textarea className={styles.textarea} rows={4}></textarea>
        </div>

        <div className={styles.footerActions}>
          <button type="button" className={styles.btnCancel} onClick={onClose}>Cancel</button>
          <button type="submit" className={styles.btnSubmit}>Submit</button>
        </div>
      </form>
    </Modal>
  );
};

export default EditSalesModal;
