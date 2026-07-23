import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import { Printer, ArrowLeft, CheckCircle } from 'lucide-react';
import { API_BASE_URL } from '../api/endpoints';

const PaymentReceipt = () => {
  const { invoiceId, paymentId } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/sales/invoices/${invoiceId}`);
        const data = await res.json();
        if (data.success) {
          setInvoice(data.data);
          const payObj = data.data.payments?.find(p => p._id === paymentId);
          if (payObj) {
            setPayment(payObj);
          } else {
            setError('Payment record not found.');
          }
        } else {
          setError(data.message || 'Invoice not found.');
        }
      } catch (err) {
        setError('Failed to load receipt.');
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [invoiceId, paymentId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div style={{ padding: '3rem', color: '#6B7280', textAlign: 'center' }}>Loading Receipt...</div>;
  }

  if (error || !invoice || !payment) {
    return <div style={{ padding: '3rem', color: '#EA5455', textAlign: 'center' }}>{error || 'Receipt not found.'}</div>;
  }

  const savedSettings = JSON.parse(localStorage.getItem('pos_settings') || '{}');
  const storeName = savedSettings.storeName || 'Eronix Store Admin';
  const storeAddress = savedSettings.storeAddress || '3099 Kennedy Court Framingham, MA 01702';

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      
      {/* Actions (Hidden on Print) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', gap: '1rem' }} className="no-print">
        <button 
          onClick={() => navigate(`/invoice-details/${invoiceId}`)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', border: '1px solid #d1d5db', padding: '0.5rem 1rem', borderRadius: '4px', backgroundColor: 'white', cursor: 'pointer' }}
        >
          <ArrowLeft size={16} /> Back to Invoice
        </button>
        <button 
          onClick={handlePrint}
          style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', backgroundColor: '#FF9F43', color: 'white', cursor: 'pointer', fontWeight: 600 }}
        >
          <Printer size={16} /> Print Receipt
        </button>
      </div>

      <Card style={{ padding: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #F3F4F6', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ color: '#1B2850', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={28} color="#28C76F" /> Payment Receipt
            </h1>
            <p style={{ color: '#6B7280', fontSize: '0.875rem', margin: 0 }}>Receipt Reference: {payment._id?.substring(0, 10).toUpperCase()}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ color: '#FF9F43', margin: 0 }}>{storeName}</h2>
            <p style={{ color: '#6B7280', fontSize: '0.875rem', margin: '4px 0 0 0' }}>{storeAddress}</p>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', gap: '2rem', flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#9CA3AF', margin: '0 0 4px 0', fontWeight: 600 }}>Payment Received From</p>
            <p style={{ fontWeight: 600, color: '#1B2850', fontSize: '1.125rem', margin: '0 0 4px 0' }}>{invoice.customerName}</p>
            {invoice.customerPhone && <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>Phone: {invoice.customerPhone}</p>}
            {invoice.customerEmail && <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>Email: {invoice.customerEmail}</p>}
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#9CA3AF', margin: '0 0 4px 0', fontWeight: 600 }}>Invoice Details</p>
            <p style={{ margin: '0 0 4px 0', fontSize: '0.875rem', color: '#1B2850' }}>Invoice No: <strong>{invoice.invoiceNumber}</strong></p>
            <p style={{ margin: '0 0 4px 0', fontSize: '0.875rem', color: '#1B2850' }}>Invoice Date: {new Date(invoice.invoiceDate).toLocaleDateString()}</p>
          </div>
        </div>

        <div style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E5E7EB', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
            <span style={{ color: '#4B5563', fontSize: '0.875rem' }}>Payment Date</span>
            <span style={{ color: '#1B2850', fontSize: '0.875rem', fontWeight: 600 }}>{new Date(payment.paymentDate || payment.createdAt).toLocaleDateString()}</span>
          </div>
          {payment.referenceNumber && (
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E5E7EB', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
              <span style={{ color: '#4B5563', fontSize: '0.875rem' }}>Transaction / Reference No.</span>
              <span style={{ color: '#1B2850', fontSize: '0.875rem', fontWeight: 600 }}>{payment.referenceNumber}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.25rem' }}>
            <span style={{ color: '#1B2850', fontSize: '1rem', fontWeight: 700 }}>Amount Paid</span>
            <span style={{ color: '#28C76F', fontSize: '1.25rem', fontWeight: 700 }}>₹{payment.amount?.toFixed(2)}</span>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#6B7280' }}>
          <span>Invoice Total: ₹{invoice.totalAmount}</span>
          <span>Remaining Balance Due: ₹{invoice.dueAmount}</span>
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem', borderTop: '1px solid #E5E7EB', paddingTop: '1.5rem', fontSize: '0.75rem', color: '#9CA3AF' }}>
          Thank you for your business!
        </div>
      </Card>
      
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background-color: white !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PaymentReceipt;
