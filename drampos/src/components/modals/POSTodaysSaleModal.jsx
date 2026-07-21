import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { getFinancialSummary } from '../../services/financeService';

const POSTodaysSaleModal = ({ isOpen, onClose }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      getFinancialSummary().then(res => {
        if (res.success) {
          setSummary(res.data);
        }
      }).catch(console.error).finally(() => setLoading(false));
    }
  }, [isOpen]);

  const totalSales = summary?.totalSales || 0;
  const totalExpenses = summary?.totalExpenses || 0;
  const totalIncomes = summary?.totalIncomes || 0;

  const details = [
    { label: 'Total Sale Amount', value: `₹${totalSales}` },
    { label: 'Cash Sales (Payment received)', value: `₹${totalSales}` },
    { label: 'Other Incomes', value: `₹${totalIncomes}` },
    { label: 'Operating Expenses Paid', value: `₹${totalExpenses}` }
  ];

  const totalCash = totalSales + totalIncomes - totalExpenses;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Today's Sale Overview" maxWidth="500px">
      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>Calculating Today's Sales...</div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid #E5E7EB', borderRadius: '4px', overflow: 'hidden', marginBottom: '1.5rem' }}>
            {details.map((item, index) => (
              <div 
                key={index} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '1rem', 
                  backgroundColor: index % 2 === 0 ? '#F9FAFB' : '#FFFFFF',
                  color: '#4B5563',
                  fontSize: '0.95rem'
                }}
              >
                <span>{item.label}</span>
                <span style={{ fontWeight: 500, color: '#1B2850' }}>{item.value}</span>
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
              <span>Total Calculated Cash</span>
              <span>₹{totalCash}</span>
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
        </>
      )}
    </Modal>
  );
};

export default POSTodaysSaleModal;
