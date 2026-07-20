import React from 'react';
import Modal from '../ui/Modal';
import { Printer } from 'lucide-react';

const GenerateBarcodeModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Barcode" maxWidth="800px">
      <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem'}}>
        <button style={{backgroundColor: '#EA5455', color: 'white', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, cursor: 'pointer'}}>
          <Printer size={18} /> Print Barcode
        </button>
      </div>

      <div>
        <h3 style={{color: '#1B2850', marginBottom: '1rem'}}>Nike Jordan</h3>
        <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
          {[1, 2, 3].map((item) => (
            <div key={item} style={{border: '1px solid #E5E7EB', borderRadius: '8px', padding: '1rem', width: '200px', textAlign: 'center'}}>
              <h4 style={{color: '#1B2850', fontSize: '0.875rem', marginBottom: '0.25rem'}}>Grocery Alpha</h4>
              <p style={{color: '#4B5563', fontSize: '0.875rem', marginBottom: '0.25rem'}}>Nike Jordan</p>
              <p style={{color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.75rem'}}>Price: $400</p>
              <div style={{display: 'flex', justifyContent: 'center'}}>
                {/* Mock Barcode lines */}
                {[1, 2, 4, 1, 3, 2, 1, 5, 2, 1, 4, 2, 3, 1, 2].map((w, i) => (
                  <div key={i} style={{ width: `${w * 2}px`, height: '48px', backgroundColor: '#111827', marginRight: '2px' }}></div>
                ))}
              </div>
              <p style={{color: '#9CA3AF', fontSize: '0.75rem', marginTop: '0.5rem'}}>HG3FKH8</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{marginTop: '2rem'}}>
        <h3 style={{color: '#1B2850', marginBottom: '1rem'}}>Apple Series 5 Watch</h3>
        <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
          {[1].map((item) => (
            <div key={item} style={{border: '1px solid #E5E7EB', borderRadius: '8px', padding: '1rem', width: '200px', textAlign: 'center'}}>
              <h4 style={{color: '#1B2850', fontSize: '0.875rem', marginBottom: '0.25rem'}}>Grocery Alpha</h4>
              <p style={{color: '#4B5563', fontSize: '0.875rem', marginBottom: '0.25rem'}}>Apple Series 5 Watch</p>
              <p style={{color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.75rem'}}>Price: $300</p>
              <div style={{display: 'flex', justifyContent: 'center'}}>
                {[1, 2, 4, 1, 3, 2, 1, 5, 2, 1, 4, 2, 3, 1, 2].map((w, i) => (
                  <div key={i} style={{ width: `${w * 2}px`, height: '48px', backgroundColor: '#111827', marginRight: '2px' }}></div>
                ))}
              </div>
              <p style={{color: '#9CA3AF', fontSize: '0.75rem', marginTop: '0.5rem'}}>TEUIU10</p>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default GenerateBarcodeModal;
