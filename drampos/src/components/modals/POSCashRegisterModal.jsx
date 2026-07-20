import React from 'react';
import Modal from '../ui/Modal';
import styles from './ModalForm.module.css';

const POSCashRegisterModal = ({ isOpen, onClose }) => {
  const details = [
    { label: 'Cash in Hand', value: '$45689' },
    { label: 'Total Sale Amount', value: '$565597.88' },
    { label: 'Total Payment', value: '$566867.97' },
    { label: 'Cash Payment', value: '$3355.84' },
    { label: 'Total Sale Return', value: '$1959' },
    { label: 'Total Expense', value: '$0' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cash Register Details" maxWidth="500px">
      <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid #E5E7EB', borderRadius: '4px', overflow: 'hidden', marginBottom: '1.5rem' }}>
        {details.map((item, index) => (
          <div 
            key={index} 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '1rem', 
              backgroundColor: index % 2 === 0 ? '#F3F4F6' : '#FFFFFF',
              color: '#4B5563',
              fontSize: '0.95rem'
            }}
          >
            <span>{item.label}</span>
            <span>{item.value}</span>
          </div>
        ))}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          padding: '1rem', 
          backgroundColor: '#E5E7EB',
          color: '#111827',
          fontWeight: 'bold',
          fontSize: '1rem'
        }}>
          <span>Total Cash</span>
          <span>$587130.97</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid #E5E7EB' }}>
        <button 
          type="button" 
          onClick={onClose}
          style={{
            backgroundColor: '#FF9F43',
            color: 'white',
            border: 'none',
            padding: '0.6rem 1.5rem',
            borderRadius: '4px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default POSCashRegisterModal;
