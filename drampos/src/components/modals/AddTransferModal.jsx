import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import styles from './ModalForm.module.css';
import { getBankAccounts, createMoneyTransfer } from '../../services/financeService';

const AddTransferModal = ({ isOpen, onClose }) => {
  const [accounts, setAccounts] = useState([]);
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      getBankAccounts().then(res => {
        if (res.success) setAccounts(res.data);
      }).catch(console.error);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fromAccount || !toAccount || !amount) {
      alert('Please select From Account, To Account, and Transfer Amount');
      return;
    }
    if (fromAccount === toAccount) {
      alert('From Account and To Account must be different');
      return;
    }
    try {
      setLoading(true);
      const res = await createMoneyTransfer({
        fromAccount,
        toAccount,
        amount: Number(amount),
        notes
      });
      if (res.success) {
        alert('Money transfer completed successfully!');
        setAmount('');
        setNotes('');
        onClose();
      }
    } catch (err) {
      alert(`Failed to complete money transfer: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Money Transfer" maxWidth="600px">
      <form onSubmit={handleSubmit} className={styles.form}>
        <div style={{display: 'flex', gap: '1rem', marginBottom: '1rem'}}>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem'}}>
              From Account <span className={styles.required}>*</span>
            </label>
            <select className={styles.select} value={fromAccount} onChange={(e) => setFromAccount(e.target.value)} required>
              <option value="">-- Select From Account --</option>
              {accounts.map(a => (
                <option key={a._id} value={a._id}>{a.accountName} ({a.bankName} - ₹{a.balance})</option>
              ))}
            </select>
          </div>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem'}}>
              To Account <span className={styles.required}>*</span>
            </label>
            <select className={styles.select} value={toAccount} onChange={(e) => setToAccount(e.target.value)} required>
              <option value="">-- Select To Account --</option>
              {accounts.map(a => (
                <option key={a._id} value={a._id}>{a.accountName} ({a.bankName} - ₹{a.balance})</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.formGroup} style={{marginBottom: '1rem'}}>
          <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem'}}>
            Transfer Amount (₹) <span className={styles.required}>*</span>
          </label>
          <input type="number" className={styles.input} value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </div>

        <div className={styles.formGroup} style={{marginBottom: '1.5rem'}}>
          <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem'}}>Notes</label>
          <input type="text" className={styles.input} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        <div className={styles.footerActions}>
          <button type="button" className={styles.btnCancel} onClick={onClose}>Cancel</button>
          <button type="submit" className={styles.btnSubmit} disabled={loading}>
            {loading ? 'Submitting...' : 'Transfer Money'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddTransferModal;
