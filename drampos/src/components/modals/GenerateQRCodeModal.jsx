import React from 'react';
import Modal from '../ui/Modal';
import { Printer } from 'lucide-react';

const GenerateQRCodeModal = ({ isOpen, onClose, selectedItems = [], options = {} }) => {
  const { showStoreName = true, showProductName = true, showPrice = true } = options;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Generated QR Codes Preview" maxWidth="800px">
      <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem'}}>
        <button 
          onClick={handlePrint}
          style={{backgroundColor: '#EA5455', color: 'white', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, cursor: 'pointer'}}
        >
          <Printer size={18} /> Print QR Codes
        </button>
      </div>

      <div style={{maxHeight: '60vh', overflowY: 'auto', paddingRight: '0.5rem'}}>
        {selectedItems.map((item) => (
          <div key={item.id} style={{marginBottom: '2rem'}}>
            <h3 style={{color: '#1B2850', marginBottom: '1rem'}}>{item.name}</h3>
            <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
              {Array.from({ length: item.qty || 1 }).map((_, index) => (
                <div key={index} style={{border: '1px solid #E5E7EB', borderRadius: '8px', padding: '1rem', width: '200px', textAlign: 'center', backgroundColor: '#FAFAFA'}}>
                  {showStoreName && <h4 style={{color: '#1B2850', fontSize: '0.875rem', marginBottom: '0.25rem'}}>Eronix POS</h4>}
                  {showProductName && <p style={{color: '#4B5563', fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: 600}}>{item.name}</p>}
                  {showPrice && <p style={{color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.75rem'}}>Price: ₹{item.price}</p>}
                  
                  <div style={{display: 'flex', justifyContent: 'center', marginBottom: '0.5rem'}}>
                    {/* Dynamic QR Code from public API */}
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${item.code || item.sku}`} 
                      alt="QR Code" 
                      style={{width: '120px', height: '120px'}}
                    />
                  </div>
                  <p style={{color: '#6B7280', fontSize: '0.75rem', marginTop: '0.5rem', fontWeight: 600, letterSpacing: '1px'}}>{item.code}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default GenerateQRCodeModal;
