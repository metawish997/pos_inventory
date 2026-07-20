import React from 'react';
import Modal from '../ui/Modal';
import styles from './ModalForm.module.css';

const POSTodaysProfitModal = ({ isOpen, onClose }) => {
  const details = [
    { label: 'Product Revenue', value: '$565597.88' },
    { label: 'Product Cost', value: '$3355.84' },
    { label: 'Expense', value: '$1959' },
    { label: 'Total Stock Adjustment', value: '$0' },
    { label: 'Deposit Payment', value: '$565597.88' },
    { label: 'Total Purchase Shipping Cost', value: '$3355.84' },
    { label: 'Total Sell Discount', value: '$565597.88' },
    { label: 'Total Sell Return', value: '$3355.84' },
    { label: 'Closing Stock', value: '$3355.84' },
    { label: 'Total Sales', value: '$565597.88' },
    { label: 'Total Sale Return', value: '$565597.88' },
    { label: 'Total Expense', value: '$565597.88' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Today's Profit" maxWidth="600px">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ padding: '1rem', border: '1px solid #10B981', borderRadius: '4px', backgroundColor: '#F0FDF4' }}>
          <div style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '0.5rem' }}>Total Sale</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#10B981' }}>$89954</div>
        </div>
        <div style={{ padding: '1rem', border: '1px solid #EF4444', borderRadius: '4px', backgroundColor: '#FEF2F2' }}>
          <div style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '0.5rem' }}>Expense</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#EF4444' }}>$89954</div>
        </div>
        <div style={{ padding: '1rem', border: '1px solid #3B82F6', borderRadius: '4px', backgroundColor: '#EFF6FF' }}>
          <div style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '0.5rem' }}>Total Profit</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#3B82F6' }}>$2145</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid #E5E7EB', borderRadius: '4px', overflow: 'hidden', marginBottom: '1.5rem' }}>
        {details.map((item, index) => (
          <div 
            key={index} 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '0.75rem 1rem', 
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

export default POSTodaysProfitModal;
