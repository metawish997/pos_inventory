import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css'; // Reusing styles
import { FileText, Printer, ArrowLeft, Copy } from 'lucide-react';

const InvoiceDetails = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Invoice Details</h1>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn}><FileText size={18} color="#EA5455" /></button>
          <button className={styles.iconBtn}><Printer size={18} color="#4B5563" /></button>
          <button className={styles.btnPrimary} style={{backgroundColor: '#FF9F43'}} onClick={() => navigate('/invoices')}>
            <ArrowLeft size={18} /> Back to Invoices
          </button>
        </div>
      </div>

      <Card style={{padding: '3rem', marginBottom: '1.5rem'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '2rem'}}>
          <div>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem'}}>
              <span style={{fontWeight: 'bold', fontSize: '1.5rem', color: '#1B2850'}}>
                <span style={{color: '#FF9F43'}}>D</span>reams <span style={{fontSize: '1rem'}}>POS</span>
              </span>
            </div>
            <p style={{color: '#4B5563', fontSize: '0.875rem'}}>3099 Kennedy Court Framingham, MA 01702</p>
          </div>
          <div style={{textAlign: 'right', fontSize: '0.875rem', color: '#4B5563'}}>
            <p>Invoice No <span style={{color: '#FF9F43', fontWeight: 600}}>#INV0001</span></p>
            <p>Created Date : <span style={{fontWeight: 600, color: '#1B2850'}}>Sep 24, 2024</span></p>
            <p>Due Date : <span style={{fontWeight: 600, color: '#1B2850'}}>Sep 30, 2024</span></p>
          </div>
        </div>

        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '2rem'}}>
          <div>
            <p style={{fontSize: '0.875rem', color: '#1B2850', fontWeight: 600, marginBottom: '0.5rem'}}>From</p>
            <p style={{fontSize: '1.125rem', color: '#1B2850', fontWeight: 600, marginBottom: '0.5rem'}}>Thomas Lawler</p>
            <div style={{color: '#4B5563', fontSize: '0.875rem', lineHeight: '1.5'}}>
              <p>2077 Chicago Avenue Orosi, CA 93647</p>
              <p>Email : Tarala2445@example.com</p>
              <p>Phone : +1 987 654 3210</p>
            </div>
          </div>
          <div>
            <p style={{fontSize: '0.875rem', color: '#1B2850', fontWeight: 600, marginBottom: '0.5rem'}}>To</p>
            <p style={{fontSize: '1.125rem', color: '#1B2850', fontWeight: 600, marginBottom: '0.5rem'}}>Carl Evans</p>
            <div style={{color: '#4B5563', fontSize: '0.875rem', lineHeight: '1.5'}}>
              <p>3103 Trainer Avenue Peoria, IL 61602</p>
              <p>Email : Sara_inc34@example.com</p>
              <p>Phone : +1 987 471 6589</p>
            </div>
          </div>
          <div>
            <p style={{fontSize: '0.875rem', color: '#1B2850', fontWeight: 600, marginBottom: '0.5rem'}}>Payment Status</p>
            <span style={{backgroundColor: '#E8F9EE', color: '#28C76F', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '1rem'}}>
              <span style={{width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#28C76F'}}></span> Paid
            </span>
            <div style={{width: '80px', height: '80px', backgroundColor: '#F3F4F6'}}>
              {/* QR Code Placeholder */}
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=INV0001" alt="QR Code" style={{width: '100%', height: '100%'}} />
            </div>
          </div>
        </div>

        <p style={{fontSize: '0.875rem', color: '#4B5563', marginBottom: '1.5rem'}}>
          Invoice For : <span style={{color: '#1B2850', fontWeight: 500}}>Design & development of Website</span>
        </p>

        <div style={{border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden', marginBottom: '2rem'}}>
          <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left'}}>
            <thead>
              <tr style={{backgroundColor: '#F3F4F6', color: '#4B5563', fontSize: '0.875rem'}}>
                <th style={{padding: '1rem', fontWeight: 600}}>Job Description</th>
                <th style={{padding: '1rem', fontWeight: 600}}>Qty</th>
                <th style={{padding: '1rem', fontWeight: 600}}>Cost</th>
                <th style={{padding: '1rem', fontWeight: 600}}>Discount</th>
                <th style={{padding: '1rem', fontWeight: 600}}>Total</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'UX Strategy', qty: '1', cost: '$500', discount: '$100', total: '$500' },
                { name: 'Design System', qty: '1', cost: '$5000', discount: '$100', total: '$5000' },
                { name: 'Brand Guidelines', qty: '1', cost: '$5000', discount: '$100', total: '$5000' },
                { name: 'Social Media Template', qty: '1', cost: '$5000', discount: '$100', total: '$5000' }
              ].map((item, i) => (
                <tr key={i} style={{borderTop: '1px solid #E5E7EB'}}>
                  <td style={{padding: '1rem', fontSize: '0.875rem', color: '#1B2850', fontWeight: 500}}>{item.name}</td>
                  <td style={{padding: '1rem', fontSize: '0.875rem', color: '#4B5563'}}>{item.qty}</td>
                  <td style={{padding: '1rem', fontSize: '0.875rem', color: '#4B5563'}}>{item.cost}</td>
                  <td style={{padding: '1rem', fontSize: '0.875rem', color: '#4B5563'}}>{item.discount}</td>
                  <td style={{padding: '1rem', fontSize: '0.875rem', color: '#1B2850', fontWeight: 500}}>{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem'}}>
          <div style={{width: '350px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0'}}>
              <span style={{color: '#4B5563', fontSize: '0.875rem'}}>Sub Total</span>
              <span style={{color: '#1B2850', fontSize: '0.875rem', fontWeight: 600}}>$5500</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0'}}>
              <span style={{color: '#4B5563', fontSize: '0.875rem'}}>Discount (0%)</span>
              <span style={{color: '#1B2850', fontSize: '0.875rem', fontWeight: 600}}>$400</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0'}}>
              <span style={{color: '#4B5563', fontSize: '0.875rem'}}>VAT (5%)</span>
              <span style={{color: '#1B2850', fontSize: '0.875rem', fontWeight: 600}}>$54</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB', marginTop: '0.5rem', marginBottom: '0.5rem'}}>
              <span style={{color: '#1B2850', fontSize: '1rem', fontWeight: 700}}>Total Amount</span>
              <span style={{color: '#1B2850', fontSize: '1.25rem', fontWeight: 700}}>$5775</span>
            </div>
            <div style={{fontSize: '0.75rem', color: '#6B7280', textAlign: 'right'}}>
              Amount in Words : Dollar Five thousand Seven Seventy Five
            </div>
          </div>
        </div>

        <div style={{marginBottom: '3rem'}}>
          <p style={{fontSize: '0.875rem', color: '#1B2850', fontWeight: 600, marginBottom: '0.5rem'}}>Terms and Conditions</p>
          <p style={{fontSize: '0.875rem', color: '#4B5563'}}>Please pay within 15 days from the date of invoice, overdue interest @ 14% will be charged on delayed payments.</p>
        </div>

        {/* Bank info and signature would go here if needed, keeping it simple */}
        <div style={{textAlign: 'center', borderTop: '1px solid #E5E7EB', paddingTop: '2rem', paddingBottom: '2rem'}}>
          <div style={{display: 'inline-block', marginBottom: '1rem'}}>
             <span style={{fontWeight: 'bold', fontSize: '1.5rem', color: '#1B2850'}}>
                <span style={{color: '#FF9F43'}}>D</span>reams <span style={{fontSize: '1rem'}}>POS</span>
              </span>
          </div>
          <p style={{fontSize: '0.875rem', color: '#1B2850', fontWeight: 500, marginBottom: '0.5rem'}}>Payment Made Via bank transfer / Cheque in the name of Thomas Lawler</p>
          <div style={{display: 'flex', justifyContent: 'center', gap: '2rem', color: '#6B7280', fontSize: '0.875rem'}}>
            <p>Bank Name : <span style={{color: '#1B2850', fontWeight: 500}}>HDFC Bank</span></p>
            <p>Account Number : <span style={{color: '#1B2850', fontWeight: 500}}>45366287987</span></p>
            <p>IFSC : <span style={{color: '#1B2850', fontWeight: 500}}>HDFC0018159</span></p>
          </div>
        </div>

      </Card>
      
      <div style={{display: 'flex', justifyContent: 'center', gap: '1rem', paddingBottom: '2rem'}}>
        <button className={styles.btnPrimary} style={{backgroundColor: '#FF9F43', padding: '0.75rem 1.5rem'}}>
          <Printer size={18} /> Print Invoice
        </button>
        <button className={styles.btnPrimary} style={{backgroundColor: '#1B2850', padding: '0.75rem 1.5rem'}}>
          <Copy size={18} /> Clone Invoice
        </button>
      </div>

    </DashboardLayout>
  );
};

export default InvoiceDetails;
