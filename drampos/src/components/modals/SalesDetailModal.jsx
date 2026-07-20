import React from 'react';
import Modal from '../ui/Modal';
import { FileText, Printer, ArrowLeft } from 'lucide-react';

const SalesDetailModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sales Detail" maxWidth="900px">
      <div style={{display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginBottom: '1.5rem', marginTop: '-3rem'}}>
        <button style={{padding: '0.375rem', border: '1px solid #E5E7EB', borderRadius: '4px', background: 'white', color: '#EA5455', cursor: 'pointer'}}><FileText size={16} /></button>
        <button style={{padding: '0.375rem', border: '1px solid #E5E7EB', borderRadius: '4px', background: 'white', color: '#4B5563', cursor: 'pointer'}}><Printer size={16} /></button>
        <button onClick={onClose} style={{padding: '0.375rem 0.75rem', border: 'none', borderRadius: '4px', background: '#1B2850', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, cursor: 'pointer'}}>
          <ArrowLeft size={16} /> Back to Sales
        </button>
      </div>

      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '2rem'}}>
        <div>
          <h4 style={{fontSize: '0.875rem', color: '#1B2850', marginBottom: '1rem', fontWeight: 600}}>Customer Info</h4>
          <div style={{color: '#4B5563', fontSize: '0.875rem', lineHeight: '1.5'}}>
            <p style={{fontWeight: 600, color: '#1B2850', fontSize: '1rem', marginBottom: '0.25rem'}}>Carl Evans</p>
            <p>3103 Trainer Avenue Peoria, IL 61602</p>
            <p>Emailcarlevans241@example.com</p>
            <p>Phone+1 987 471 6589</p>
          </div>
        </div>
        <div>
          <h4 style={{fontSize: '0.875rem', color: '#1B2850', marginBottom: '1rem', fontWeight: 600}}>Company Info</h4>
          <div style={{color: '#4B5563', fontSize: '0.875rem', lineHeight: '1.5'}}>
            <p style={{fontWeight: 600, color: '#1B2850', fontSize: '1rem', marginBottom: '0.25rem'}}>DGT</p>
            <p>2077 Chicago Avenue Orosi, CA 93647</p>
            <p>Emailadmin@example.com</p>
            <p>Phone+1 893 174 0385</p>
          </div>
        </div>
        <div>
          <h4 style={{fontSize: '0.875rem', color: '#1B2850', marginBottom: '1rem', fontWeight: 600}}>Invoice Info</h4>
          <div style={{color: '#4B5563', fontSize: '0.875rem', lineHeight: '1.5'}}>
            <p>Reference: <span style={{color: '#FF9F43'}}>#SL0101</span></p>
            <p>Payment Status: <span style={{backgroundColor: '#E8F9EE', color: '#28C76F', padding: '2px 6px', borderRadius: '4px', fontSize: '10px'}}>• Paid</span></p>
            <p>Status: <span style={{backgroundColor: '#28C76F', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '10px'}}>Completed</span></p>
          </div>
        </div>
      </div>

      <div>
        <h4 style={{fontSize: '0.875rem', color: '#1B2850', marginBottom: '1rem', fontWeight: 600}}>Order Summary</h4>
        <div style={{border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.5rem'}}>
          <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left'}}>
            <thead>
              <tr style={{backgroundColor: '#F3F4F6', color: '#4B5563', fontSize: '0.75rem'}}>
                <th style={{padding: '0.75rem 1rem', fontWeight: 600}}>Product</th>
                <th style={{padding: '0.75rem 1rem', fontWeight: 600}}>Purchase Price($)</th>
                <th style={{padding: '0.75rem 1rem', fontWeight: 600}}>Discount($)</th>
                <th style={{padding: '0.75rem 1rem', fontWeight: 600}}>Tax(%)</th>
                <th style={{padding: '0.75rem 1rem', fontWeight: 600}}>Tax Amount($)</th>
                <th style={{padding: '0.75rem 1rem', fontWeight: 600}}>Unit Cost($)</th>
                <th style={{padding: '0.75rem 1rem', fontWeight: 600}}>Total Cost(%)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{borderTop: '1px solid #E5E7EB'}}>
                <td style={{padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                  <div style={{width: '24px', height: '24px', backgroundColor: '#F3F4F6', borderRadius: '4px'}}></div>
                  <span style={{fontSize: '0.875rem', color: '#1B2850'}}>Nike Jordan</span>
                </td>
                <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6B7280'}}>2000</td>
                <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6B7280'}}>500</td>
                <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6B7280'}}>0.00</td>
                <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6B7280'}}>0.00</td>
                <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6B7280'}}>0.00</td>
                <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6B7280'}}>1500</td>
              </tr>
              <tr style={{borderTop: '1px solid #E5E7EB'}}>
                <td style={{padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                  <div style={{width: '24px', height: '24px', backgroundColor: '#F3F4F6', borderRadius: '4px'}}></div>
                  <span style={{fontSize: '0.875rem', color: '#1B2850'}}>Apple Series 5 Watch</span>
                </td>
                <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6B7280'}}>3000</td>
                <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6B7280'}}>400</td>
                <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6B7280'}}>0.00</td>
                <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6B7280'}}>0.00</td>
                <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6B7280'}}>0.00</td>
                <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6B7280'}}>1700</td>
              </tr>
              <tr style={{borderTop: '1px solid #E5E7EB'}}>
                <td style={{padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                  <div style={{width: '24px', height: '24px', backgroundColor: '#F3F4F6', borderRadius: '4px'}}></div>
                  <span style={{fontSize: '0.875rem', color: '#1B2850'}}>Lobar Handy</span>
                </td>
                <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6B7280'}}>2500</td>
                <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6B7280'}}>500</td>
                <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6B7280'}}>0.00</td>
                <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6B7280'}}>0.00</td>
                <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6B7280'}}>0.00</td>
                <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6B7280'}}>2000</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem'}}>
          <div style={{width: '350px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #E5E7EB'}}>
              <span style={{color: '#4B5563', fontSize: '0.875rem'}}>Order Tax</span>
              <span style={{color: '#1B2850', fontSize: '0.875rem', fontWeight: 500}}>$ 0.00</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #E5E7EB'}}>
              <span style={{color: '#4B5563', fontSize: '0.875rem'}}>Discount</span>
              <span style={{color: '#1B2850', fontSize: '0.875rem', fontWeight: 500}}>$ 0.00</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #E5E7EB'}}>
              <span style={{color: '#1B2850', fontSize: '0.875rem', fontWeight: 600}}>Grand Total</span>
              <span style={{color: '#1B2850', fontSize: '0.875rem', fontWeight: 600}}>$ 5200.00</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #E5E7EB'}}>
              <span style={{color: '#4B5563', fontSize: '0.875rem'}}>Paid</span>
              <span style={{color: '#1B2850', fontSize: '0.875rem', fontWeight: 500}}>$ 5200.00</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #E5E7EB'}}>
              <span style={{color: '#4B5563', fontSize: '0.875rem'}}>Due</span>
              <span style={{color: '#1B2850', fontSize: '0.875rem', fontWeight: 500}}>$ 0.00</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SalesDetailModal;
