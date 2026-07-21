import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { getFinancialSummary } from '../../services/financeService';

const POSTodaysProfitModal = ({ isOpen, onClose }) => {
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
  const totalPurchases = summary?.totalPurchases || 0;
  const totalExpenses = summary?.totalExpenses || 0;
  const totalIncomes = summary?.totalIncomes || 0;
  const netProfit = (totalSales + totalIncomes) - (totalPurchases + totalExpenses);

  const details = [
    { label: 'Product Revenue', value: `₹${totalSales}` },
    { label: 'Product Cost (Purchases)', value: `₹${totalPurchases}` },
    { label: 'Operating Expenses', value: `₹${totalExpenses}` },
    { label: 'Other Incomes', value: `₹${totalIncomes}` },
    { label: 'Gross Margin', value: `₹${totalSales - totalPurchases}` }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Today's Profit & Loss Overview" maxWidth="600px">
      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>Calculating Profit Overview...</div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '1rem', border: '1px solid #10B981', borderRadius: '4px', backgroundColor: '#F0FDF4' }}>
              <div style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '0.5rem' }}>Total Sales</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#10B981' }}>₹{totalSales}</div>
            </div>
            <div style={{ padding: '1rem', border: '1px solid #EF4444', borderRadius: '4px', backgroundColor: '#FEF2F2' }}>
              <div style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '0.5rem' }}>Total Cost</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#EF4444' }}>₹{totalPurchases + totalExpenses}</div>
            </div>
            <div style={{ padding: '1rem', border: '1px solid #3B82F6', borderRadius: '4px', backgroundColor: '#EFF6FF' }}>
              <div style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '0.5rem' }}>Net Margin</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: netProfit >= 0 ? '#10B981' : '#EF4444' }}>
                ₹{netProfit}
              </div>
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
                  backgroundColor: index % 2 === 0 ? '#F9FAFB' : '#FFFFFF',
                  color: '#4B5563',
                  fontSize: '0.95rem'
                }}
              >
                <span>{item.label}</span>
                <span style={{ fontWeight: 500, color: '#1B2850' }}>{item.value}</span>
              </div>
            ))}
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

export default POSTodaysProfitModal;
