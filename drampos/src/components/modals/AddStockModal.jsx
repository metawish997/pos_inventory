import React from 'react';
import Modal from '../ui/Modal';
import styles from './ModalForm.module.css';
import { Search } from 'lucide-react';

const AddStockModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Stock" maxWidth="500px">
      <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
        
        <div className={styles.formGroup}>
          <label>Warehouse <span className={styles.required}>*</span></label>
          <select className={styles.select}>
            <option>Select</option>
            <option>Lavish Warehouse</option>
            <option>Quaint Warehouse</option>
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label>Store <span className={styles.required}>*</span></label>
          <select className={styles.select}>
            <option>Select</option>
            <option>Electro Mart</option>
            <option>Quantum Gadgets</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Responsible Person <span className={styles.required}>*</span></label>
          <select className={styles.select}>
            <option>Select</option>
            <option>James Kirwin</option>
            <option>Steven</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Product <span className={styles.required}>*</span></label>
          <div style={{position: 'relative'}}>
            <Search size={16} style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF'}} />
            <input type="text" className={styles.input} placeholder="Select Product" style={{paddingLeft: '2.25rem'}} />
          </div>
        </div>

        <div className={styles.footerActions}>
          <button type="button" className={styles.btnCancel} onClick={onClose}>Cancel</button>
          <button type="submit" className={styles.btnSubmit}>Add Stock</button>
        </div>
      </form>
    </Modal>
  );
};

export default AddStockModal;
