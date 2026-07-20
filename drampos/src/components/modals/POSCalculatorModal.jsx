import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { Delete } from 'lucide-react';

const POSCalculatorModal = ({ isOpen, onClose }) => {
  const [display, setDisplay] = useState('0');

  const handlePress = (val) => {
    if (display === '0' && val !== '.') {
      setDisplay(val);
    } else {
      setDisplay(display + val);
    }
  };

  const calculate = () => {
    try {
      // Replace x and ÷ with * and / for evaluation
      const expression = display.replace(/x/g, '*').replace(/÷/g, '/');
      const result = eval(expression);
      setDisplay(String(result));
    } catch (e) {
      setDisplay('Error');
    }
  };

  const clear = () => {
    setDisplay('0');
  };

  const backspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const buttons = [
    { label: 'C', type: 'action', onClick: clear },
    { label: '÷', type: 'operator', onClick: () => handlePress('÷') },
    { label: '%', type: 'operator', onClick: () => handlePress('%') },
    { label: <Delete size={18} />, type: 'action', onClick: backspace },
    { label: '7', type: 'number', onClick: () => handlePress('7') },
    { label: '8', type: 'number', onClick: () => handlePress('8') },
    { label: '9', type: 'number', onClick: () => handlePress('9') },
    { label: 'x', type: 'operator', onClick: () => handlePress('x') },
    { label: '4', type: 'number', onClick: () => handlePress('4') },
    { label: '5', type: 'number', onClick: () => handlePress('5') },
    { label: '6', type: 'number', onClick: () => handlePress('6') },
    { label: '-', type: 'operator', onClick: () => handlePress('-') },
    { label: '1', type: 'number', onClick: () => handlePress('1') },
    { label: '2', type: 'number', onClick: () => handlePress('2') },
    { label: '3', type: 'number', onClick: () => handlePress('3') },
    { label: '+', type: 'operator', onClick: () => handlePress('+') },
    { label: ',', type: 'number', onClick: () => handlePress(',') },
    { label: '00', type: 'number', onClick: () => handlePress('00') },
    { label: '.', type: 'number', onClick: () => handlePress('.') },
    { label: '=', type: 'action', onClick: calculate },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Calculator" maxWidth="400px">
      <div style={{ padding: '1rem' }}>
        <div style={{
          backgroundColor: '#F3F4F6',
          border: '1px solid #E5E7EB',
          borderRadius: '8px',
          padding: '1.5rem 1rem',
          fontSize: '2rem',
          textAlign: 'right',
          marginBottom: '1.5rem',
          color: '#111827',
          minHeight: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          overflow: 'hidden'
        }}>
          {display}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1rem'
        }}>
          {buttons.map((btn, index) => (
            <button
              key={index}
              onClick={btn.onClick}
              style={{
                backgroundColor: btn.type === 'action' ? '#FF9F43' : btn.type === 'operator' ? '#E5E7EB' : '#FFFFFF',
                color: btn.type === 'action' ? 'white' : '#111827',
                border: btn.type === 'number' ? '1px solid #E5E7EB' : 'none',
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: '600',
                cursor: 'pointer',
                margin: '0 auto',
                boxShadow: btn.type === 'number' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default POSCalculatorModal;
