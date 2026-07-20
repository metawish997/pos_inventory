import React from 'react';
import Modal from '../ui/Modal';
import { Trash2 } from 'lucide-react';

const ShowPaymentsModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Show Payments" maxWidth="600px">
      <div style={{border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.5rem'}}>
        <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left'}}>
          <thead>
            <tr style={{backgroundColor: '#F3F4F6', color: '#4B5563', fontSize: '0.875rem'}}>
              <th style={{padding: '1rem', fontWeight: 600}}>Date</th>
              <th style={{padding: '1rem', fontWeight: 600}}>Reference</th>
              <th style={{padding: '1rem', fontWeight: 600}}>Amount</th>
              <th style={{padding: '1rem', fontWeight: 600}}>Paid By</th>
              <th style={{padding: '1rem', fontWeight: 600}}>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderTop: '1px solid #E5E7EB'}}>
              <td style={{padding: '1rem', fontSize: '0.875rem', color: '#6B7280'}}>19 Jan 2023</td>
              <td style={{padding: '1rem', fontSize: '0.875rem', color: '#6B7280'}}>INV/SL0101</td>
              <td style={{padding: '1rem', fontSize: '0.875rem', color: '#6B7280'}}>$1500</td>
              <td style={{padding: '1rem', fontSize: '0.875rem', color: '#6B7280'}}>Cash</td>
              <td style={{padding: '1rem'}}>
                <button style={{border: 'none', background: 'none', cursor: 'pointer', color: '#EA5455'}}>
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Modal>
  );
};

export default ShowPaymentsModal;
