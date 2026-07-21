import React, { useState } from 'react';
import Modal from '../ui/Modal';
import styles from './ModalForm.module.css';
import { createBankAccount } from '../../services/financeService';

const AddAccountModal = ({ isOpen, onClose }) => {
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [balance, setBalance] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!accountName || !accountNumber || !bankName) {
      alert('Please fill out all required fields');
      return;
    }
    try {
      setLoading(true);
      const res = await createBankAccount({
        accountName,
        accountNumber,
        bankName,
        balance: Number(balance) || 0,
        status: 'Active'
      });

      if (res.success) {
        alert('Bank account created successfully!');
        setAccountName('');
        setAccountNumber('');
        setBankName('');
        setBalance('');
        onClose();
      }
    } catch (err) {
      alert(`Failed to create bank account: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Bank Account" maxWidth="600px">
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup} style={{marginBottom: '1rem'}}>
          <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem'}}>
            Account Holder Name <span className={styles.required}>*</span>
          </label>
          <input type="text" className={styles.input} value={accountName} onChange={(e) => setAccountName(e.target.value)} required />
        </div>

        <div style={{display: 'flex', gap: '1rem', marginBottom: '1rem'}}>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem'}}>
              Account Number <span className={styles.required}>*</span>
            </label>
            <input type="text" className={styles.input} value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required />
          </div>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem'}}>
              Bank Name <span className={styles.required}>*</span>
            </label>
            <input type="text" className={styles.input} value={bankName} onChange={(e) => setBankName(e.target.value)} required />
          </div>
        </div>

        <div className={styles.formGroup} style={{marginBottom: '1.5rem'}}>
          <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem'}}>Opening Balance (₹)</label>
          <input type="number" className={styles.input} value={balance} onChange={(e) => setBalance(e.target.value)} />
        </div>

        <div className={styles.footerActions}>
          <button type="button" className={styles.btnCancel} onClick={onClose}>Cancel</button>
          <button type="submit" className={styles.btnSubmit} disabled={loading}>
            {loading ? 'Submitting...' : 'Add Account'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddAccountModal;
