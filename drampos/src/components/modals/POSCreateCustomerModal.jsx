import React, { useState } from 'react';
import Modal from '../ui/Modal';
import styles from './ModalForm.module.css';
import { createCustomer } from '../../services/customerService';

const POSCreateCustomerModal = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !phone) {
      setError('Customer Name and Phone are required.');
      return;
    }

    // Split firstName and lastName
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || ' ';

    try {
      setLoading(true);
      const res = await createCustomer({
        firstName,
        lastName,
        email: email || `${firstName.toLowerCase()}@example.com`,
        phone,
        address,
        city,
        country,
        status: 'Active'
      });
      
      if (res.success) {
        if (onSuccess) {
          onSuccess(`${firstName} ${lastName}`);
        }
        // Reset states
        setName('');
        setPhone('');
        setEmail('');
        setAddress('');
        setCity('');
        setCountry('');
        onClose();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Customer" maxWidth="800px">
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div style={{ color: '#EA5455', fontSize: '13px', marginBottom: '1rem' }}>{error}</div>}

        <div style={{display: 'flex', gap: '1.5rem', marginBottom: '1.5rem'}}>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Customer Name <span className={styles.required}>*</span></label>
            <input 
              type="text" 
              className={styles.input} 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Phone <span className={styles.required}>*</span></label>
            <input 
              type="text" 
              className={styles.input} 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Email</label>
          <input 
            type="email" 
            className={styles.input} 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Address</label>
          <input 
            type="text" 
            className={styles.input} 
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div style={{display: 'flex', gap: '1.5rem', marginBottom: '1.5rem'}}>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>City</label>
            <input 
              type="text" 
              className={styles.input} 
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Country</label>
            <input 
              type="text" 
              className={styles.input} 
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.footerActions}>
          <button type="button" className={styles.btnCancel} onClick={onClose} style={{backgroundColor: '#002046', color: 'white'}}>Cancel</button>
          <button type="submit" className={styles.btnSubmit} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default POSCreateCustomerModal;
