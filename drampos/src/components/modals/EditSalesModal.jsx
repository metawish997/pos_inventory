import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import styles from './ModalForm.module.css';
import { updateSale } from '../../services/salesService';

const EditSalesModal = ({ isOpen, onClose, sale }) => {
  const [customerName, setCustomerName] = useState('');
  const [orderStatus, setOrderStatus] = useState('Completed');
  const [paymentStatus, setPaymentStatus] = useState('Paid');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sale) {
      setCustomerName(sale.customerName || '');
      setOrderStatus(sale.orderStatus || 'Completed');
      setPaymentStatus(sale.paymentStatus || 'Paid');
    }
  }, [sale]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sale?._id) return;
    try {
      setLoading(true);
      const res = await updateSale(sale._id, {
        customerName,
        orderStatus,
        paymentStatus
      });
      if (res.success) {
        alert('Sale updated successfully!');
        onClose();
      }
    } catch (err) {
      alert(`Failed to update sale: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Sale" maxWidth="600px">
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup} style={{marginBottom: '1rem'}}>
          <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Customer Name</label>
          <input 
            type="text" 
            className={styles.input} 
            value={customerName} 
            onChange={(e) => setCustomerName(e.target.value)} 
            required 
          />
        </div>

        <div className={styles.formGroup} style={{marginBottom: '1rem'}}>
          <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Order Status</label>
          <select className={styles.select} value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)}>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className={styles.formGroup} style={{marginBottom: '1.5rem'}}>
          <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Payment Status</label>
          <select className={styles.select} value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Partial">Partial</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>

        <div className={styles.footerActions}>
          <button type="button" className={styles.btnCancel} onClick={onClose}>Cancel</button>
          <button type="submit" className={styles.btnSubmit} disabled={loading}>
            {loading ? 'Saving...' : 'Update Sale'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditSalesModal;
