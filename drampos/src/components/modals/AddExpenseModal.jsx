import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import styles from './ModalForm.module.css';
import { getExpenseCategories, createExpense } from '../../services/financeService';

const AddExpenseModal = ({ isOpen, onClose }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentType, setPaymentType] = useState('Cash');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      getExpenseCategories().then(res => {
        if (res.success) setCategories(res.data);
      }).catch(console.error);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCategory || !amount) {
      alert('Please select category and enter amount');
      return;
    }
    try {
      setLoading(true);
      const res = await createExpense({
        category: selectedCategory,
        amount: Number(amount),
        paymentType,
        notes
      });
      if (res.success) {
        alert('Expense created successfully!');
        setAmount('');
        setNotes('');
        onClose();
      }
    } catch (err) {
      alert(`Failed to create expense: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Expense" maxWidth="600px">
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup} style={{marginBottom: '1rem'}}>
          <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem'}}>
            Expense Category <span className={styles.required}>*</span>
          </label>
          <select className={styles.select} value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} required>
            <option value="">-- Select Category --</option>
            {categories.map(c => (
              <option key={c._id} value={c._id}>{c.categoryName}</option>
            ))}
          </select>
        </div>

        <div style={{display: 'flex', gap: '1rem', marginBottom: '1rem'}}>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem'}}>
              Amount (₹) <span className={styles.required}>*</span>
            </label>
            <input type="number" className={styles.input} value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </div>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem'}}>Payment Mode</label>
            <select className={styles.select} value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="UPI">UPI</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>
        </div>

        <div className={styles.formGroup} style={{marginBottom: '1.5rem'}}>
          <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem'}}>Notes / Description</label>
          <textarea className={styles.input} style={{minHeight: '80px', resize: 'vertical'}} value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
        </div>

        <div className={styles.footerActions}>
          <button type="button" className={styles.btnCancel} onClick={onClose}>Cancel</button>
          <button type="submit" className={styles.btnSubmit} disabled={loading}>
            {loading ? 'Submitting...' : 'Add Expense'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddExpenseModal;
