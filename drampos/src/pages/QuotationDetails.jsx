import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css'; // Reusing styles
import { FileText, Printer, ArrowLeft, Copy } from 'lucide-react';

const QuotationDetails = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Quotation Details</h1>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn}><FileText size={18} color="#EA5455" /></button>
          <button className={styles.iconBtn}><Printer size={18} color="#4B5563" /></button>
          <button className={styles.btnPrimary} style={{backgroundColor: '#FF9F43'}} onClick={() => navigate('/quotation')}>
            <ArrowLeft size={18} /> Back to Quotation
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
            <p>Quotation No <span style={{color: '#FF9F43', fontWeight: 600}}>#QUO0001</span></p>
            <p>Created Date : <span style={{fontWeight: 600, color: '#1B2850'}}>Sep 24, 2024</span></p>
            <p>Valid Until : <span style={{fontWeight: 600, color: '#1B2850'}}>Oct 24, 2024</span></p>
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
            <p style={{fontSize: '0.875rem', color: '#1B2850', fontWeight: 600, marginBottom: '0.5rem'}}>Status</p>
            <span style={{backgroundColor: '#E8F9EE', color: '#28C76F', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '1rem'}}>
              Sent
            </span>
          </div>
        </div>

        <p style={{fontSize: '0.875rem', color: '#4B5563', marginBottom: '1.5rem'}}>
          Quotation For : <span style={{color: '#1B2850', fontWeight: 500}}>Hardware Supply</span>
        </p>

        <div style={{border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden', marginBottom: '2rem'}}>
          <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left'}}>
            <thead>
              <tr style={{backgroundColor: '#F3F4F6', color: '#4B5563', fontSize: '0.875rem'}}>
                <th style={{padding: '1rem', fontWeight: 600}}>Product Description</th>
                <th style={{padding: '1rem', fontWeight: 600}}>Qty</th>
                <th style={{padding: '1rem', fontWeight: 600}}>Cost</th>
                <th style={{padding: '1rem', fontWeight: 600}}>Discount</th>
                <th style={{padding: '1rem', fontWeight: 600}}>Total</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Lenovo 3rd Generation', qty: '1', cost: '$550', discount: '$0', total: '$550' }
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
              <span style={{color: '#1B2850', fontSize: '0.875rem', fontWeight: 600}}>$550</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0'}}>
              <span style={{color: '#4B5563', fontSize: '0.875rem'}}>Discount (0%)</span>
              <span style={{color: '#1B2850', fontSize: '0.875rem', fontWeight: 600}}>$0</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0'}}>
              <span style={{color: '#4B5563', fontSize: '0.875rem'}}>VAT (0%)</span>
              <span style={{color: '#1B2850', fontSize: '0.875rem', fontWeight: 600}}>$0</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB', marginTop: '0.5rem', marginBottom: '0.5rem'}}>
              <span style={{color: '#1B2850', fontSize: '1rem', fontWeight: 700}}>Total Amount</span>
              <span style={{color: '#1B2850', fontSize: '1.25rem', fontWeight: 700}}>$550</span>
            </div>
            <div style={{fontSize: '0.75rem', color: '#6B7280', textAlign: 'right'}}>
              Amount in Words : Dollar Five hundred and Fifty
            </div>
          </div>
        </div>

        <div style={{marginBottom: '3rem'}}>
          <p style={{fontSize: '0.875rem', color: '#1B2850', fontWeight: 600, marginBottom: '0.5rem'}}>Terms and Conditions</p>
          <p style={{fontSize: '0.875rem', color: '#4B5563'}}>This quotation is valid for 30 days from the date of issue.</p>
        </div>

      </Card>
      
      <div style={{display: 'flex', justifyContent: 'center', gap: '1rem', paddingBottom: '2rem'}}>
        <button className={styles.btnPrimary} style={{backgroundColor: '#FF9F43', padding: '0.75rem 1.5rem'}}>
          <Printer size={18} /> Print Quotation
        </button>
        <button className={styles.btnPrimary} style={{backgroundColor: '#1B2850', padding: '0.75rem 1.5rem'}}>
          <Copy size={18} /> Clone Quotation
        </button>
      </div>

    </DashboardLayout>
  );
};

export default QuotationDetails;
