import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css'; // Reusing styles
import { Printer, ArrowLeft } from 'lucide-react';
import { API_BASE_URL } from '../api/endpoints';

const InvoiceDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInvoiceDetails = async () => {
    try {
      setLoading(true);
      let targetId = id;
      
      // If no ID is provided, load the first invoice as fallback
      if (!targetId) {
        const listRes = await fetch(`${API_BASE_URL}/sales/invoices/list`);
        const listData = await listRes.json();
        if (listData.success && listData.data && listData.data.length > 0) {
          targetId = listData.data[0]._id;
        }
      }

      if (!targetId) {
        setError('No invoice records found in database.');
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/sales/invoices/${targetId}`);
      const data = await res.json();
      if (data.success) {
        setInvoice(data.data);
      } else {
        setError(data.message || 'Failed to load invoice');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error occurred fetching invoice');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoiceDetails();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ padding: '2rem', color: '#6B7280' }}>Loading Invoice...</div>
      </DashboardLayout>
    );
  }

  if (error || !invoice) {
    return (
      <DashboardLayout>
        <div style={{ padding: '2rem', color: '#EA5455' }}>
          {error || 'Invoice not found.'}
        </div>
      </DashboardLayout>
    );
  }

  const items = invoice.sale?.items || [];
  const savedSettings = JSON.parse(localStorage.getItem('pos_settings') || '{}');
  const storeName = savedSettings.storeName || 'Eronix Store Admin';
  const storeEmail = savedSettings.storeEmail || 'admin@eronixpos.com';
  const storePhone = savedSettings.storePhone || '9876543210';
  const storeAddress = savedSettings.storeAddress || '3099 Kennedy Court Framingham, MA 01702';

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Invoice Details</h1>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} onClick={handlePrint}><Printer size={18} color="#4B5563" /></button>
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
                <span style={{color: '#FF9F43'}}>{storeName}</span>
              </span>
            </div>
            <p style={{color: '#4B5563', fontSize: '0.875rem'}}>{storeAddress}</p>
          </div>
          <div style={{textAlign: 'right', fontSize: '0.875rem', color: '#4B5563'}}>
            <p>Invoice No <span style={{color: '#FF9F43', fontWeight: 600}}>{invoice.invoiceNumber}</span></p>
            <p>Created Date : <span style={{fontWeight: 600, color: '#1B2850'}}>{new Date(invoice.invoiceDate).toLocaleDateString()}</span></p>
            <p>Due Date : <span style={{fontWeight: 600, color: '#1B2850'}}>{new Date(invoice.dueDate).toLocaleDateString()}</span></p>
          </div>
        </div>

        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '2rem'}}>
          <div>
            <p style={{fontSize: '0.875rem', color: '#1B2850', fontWeight: 600, marginBottom: '0.5rem'}}>From</p>
            <p style={{fontSize: '1.125rem', color: '#1B2850', fontWeight: 600, marginBottom: '0.5rem'}}>{storeName}</p>
            <div style={{color: '#4B5563', fontSize: '0.875rem', lineHeight: '1.5'}}>
              <p>{storeAddress}</p>
              {storeEmail && <p>Email : {storeEmail}</p>}
              {storePhone && <p>Phone : {storePhone}</p>}
            </div>
          </div>
          <div>
            <p style={{fontSize: '0.875rem', color: '#1B2850', fontWeight: 600, marginBottom: '0.5rem'}}>To (Customer)</p>
            <p style={{fontSize: '1.125rem', color: '#1B2850', fontWeight: 600, marginBottom: '0.5rem'}}>{invoice.customerName}</p>
            <div style={{color: '#4B5563', fontSize: '0.875rem', lineHeight: '1.5'}}>
              {invoice.customerEmail && <p>Email : {invoice.customerEmail}</p>}
              {invoice.customerPhone && <p>Phone : {invoice.customerPhone}</p>}
            </div>
          </div>
          <div>
            <p style={{fontSize: '0.875rem', color: '#1B2850', fontWeight: 600, marginBottom: '0.5rem'}}>Payment Status</p>
            <span style={{
              backgroundColor: invoice.status === 'Paid' ? '#E8F9EE' : '#FCEAEA', 
              color: invoice.status === 'Paid' ? '#28C76F' : '#EA5455', 
              padding: '4px 8px', 
              borderRadius: '4px', 
              fontSize: '12px', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '4px', 
              marginBottom: '1rem'
            }}>
              <span style={{
                width: '6px', 
                height: '6px', 
                borderRadius: '50%', 
                backgroundColor: invoice.status === 'Paid' ? '#28C76F' : '#EA5455'
              }}></span> {invoice.status}
            </span>
            <div style={{width: '80px', height: '80px', backgroundColor: '#F3F4F6'}}>
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${invoice.invoiceNumber}`} alt="QR Code" style={{width: '100%', height: '100%'}} />
            </div>
          </div>
        </div>

        <div style={{border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden', marginBottom: '2rem'}}>
          <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left'}}>
            <thead>
              <tr style={{backgroundColor: '#F3F4F6', color: '#4B5563', fontSize: '0.875rem'}}>
                <th style={{padding: '1rem', fontWeight: 600}}>Product / Variant</th>
                <th style={{padding: '1rem', fontWeight: 600}}>Qty</th>
                <th style={{padding: '1rem', fontWeight: 600}}>Unit Cost</th>
                <th style={{padding: '1rem', fontWeight: 600}}>Discount</th>
                <th style={{padding: '1rem', fontWeight: 600}}>Total</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{padding: '1rem', textAlign: 'center', color: '#6B7280'}}>No items billed in this sale.</td>
                </tr>
              ) : (
                items.map((item, i) => (
                  <tr key={i} style={{borderTop: '1px solid #E5E7EB'}}>
                    <td style={{padding: '1rem', fontSize: '0.875rem', color: '#1B2850', fontWeight: 500}}>
                      {item.product?.name || 'Product'} {item.sku && `(${item.sku})`}
                    </td>
                    <td style={{padding: '1rem', fontSize: '0.875rem', color: '#4B5563'}}>{item.quantity}</td>
                    <td style={{padding: '1rem', fontSize: '0.875rem', color: '#4B5563'}}>₹{item.unitPrice}</td>
                    <td style={{padding: '1rem', fontSize: '0.875rem', color: '#4B5563'}}>₹{item.discount || 0}</td>
                    <td style={{padding: '1rem', fontSize: '0.875rem', color: '#1B2850', fontWeight: 500}}>₹{item.total}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem'}}>
          <div style={{width: '350px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0'}}>
              <span style={{color: '#4B5563', fontSize: '0.875rem'}}>Sub Total</span>
              <span style={{color: '#1B2850', fontSize: '0.875rem', fontWeight: 600}}>₹{invoice.subtotal}</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0'}}>
              <span style={{color: '#4B5563', fontSize: '0.875rem'}}>Discount</span>
              <span style={{color: '#1B2850', fontSize: '0.875rem', fontWeight: 600}}>₹{invoice.discountAmount || 0}</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0'}}>
              <span style={{color: '#4B5563', fontSize: '0.875rem'}}>Tax</span>
              <span style={{color: '#1B2850', fontSize: '0.875rem', fontWeight: 600}}>₹{invoice.taxAmount || 0}</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB', marginTop: '0.5rem', marginBottom: '0.5rem'}}>
              <span style={{color: '#1B2850', fontSize: '1rem', fontWeight: 700}}>Total Amount</span>
              <span style={{color: '#1B2850', fontSize: '1.25rem', fontWeight: 700}}>₹{invoice.totalAmount}</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0'}}>
              <span style={{color: '#4B5563', fontSize: '0.875rem'}}>Paid Amount</span>
              <span style={{color: '#28C76F', fontSize: '0.875rem', fontWeight: 600}}>₹{invoice.paidAmount}</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0'}}>
              <span style={{color: '#4B5563', fontSize: '0.875rem'}}>Balance Due</span>
              <span style={{color: '#EA5455', fontSize: '0.875rem', fontWeight: 600}}>₹{invoice.dueAmount}</span>
            </div>
          </div>
        </div>

        <div style={{textAlign: 'center', borderTop: '1px solid #E5E7EB', paddingTop: '2rem', paddingBottom: '2rem'}}>
          <div style={{display: 'inline-block', marginBottom: '1rem'}}>
             <span style={{fontWeight: 'bold', fontSize: '1.5rem', color: '#1B2850'}}>
                <span style={{color: '#FF9F43'}}>{storeName}</span>
              </span>
          </div>
          <p style={{fontSize: '0.875rem', color: '#1B2850', fontWeight: 500, marginBottom: '0.5rem'}}>Developed and maintained by Metawish</p>
          <a href="https://www.metawish.ai" target="_blank" rel="noreferrer" style={{color: '#FF9F43', textDecoration: 'none', fontSize: '0.875rem'}}>www.metawish.ai</a>
        </div>
      </Card>
      
      <div style={{display: 'flex', justifyContent: 'center', gap: '1rem', paddingBottom: '2rem'}}>
        <button className={styles.btnPrimary} style={{backgroundColor: '#FF9F43', padding: '0.75rem 1.5rem'}} onClick={handlePrint}>
          <Printer size={18} /> Print Invoice
        </button>
      </div>
    </DashboardLayout>
  );
};

export default InvoiceDetails;
