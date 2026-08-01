import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css'; // Reusing styles
import { Printer, ArrowLeft, Plus } from 'lucide-react';
import { API_BASE_URL } from '../api/endpoints';
import Modal from '../components/ui/Modal';

const InvoiceDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentRef, setPaymentRef] = useState('');
  const [submittingPayment, setSubmittingPayment] = useState(false);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!paymentAmount || Number(paymentAmount) <= 0) {
      alert('Please enter a valid payment amount');
      return;
    }
    try {
      setSubmittingPayment(true);
      const response = await fetch(`${API_BASE_URL}/sales/invoices/${invoice._id}/payment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: Number(paymentAmount),
          paymentDate,
          referenceNumber: paymentRef
        })
      });
      const data = await response.json();
      if (data.success) {
        alert('Payment recorded successfully!');
        setIsPaymentModalOpen(false);
        setPaymentAmount('');
        setPaymentRef('');
        fetchInvoiceDetails();
      } else {
        alert(data.message || 'Failed to record payment');
      }
    } catch (err) {
      console.error(err);
      alert('Error occurred recording payment');
    } finally {
      setSubmittingPayment(false);
    }
  };

  const [companySettings, setCompanySettings] = useState(null);

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
    fetch(`${API_BASE_URL}/company-settings`)
      .then(res => res.json())
      .then(data => {
        if (data) setCompanySettings(data);
      })
      .catch(e => console.error("Error loading settings", e));
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    const element = document.getElementById('printable-invoice-card');
    if (!element) return;
    
    if (window.html2pdf) {
      const opt = {
        margin:       0.5,
        filename:     `Invoice_${invoice.invoiceNumber || 'Detail'}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      window.html2pdf().from(element).set(opt).save();
    } else {
      alert("PDF generator is still loading. Please try again in a few seconds or use browser print.");
    }
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
  
  // Load org data from the user-configured company-settings database record
  const storeName = companySettings?.orgName || 'Dreams POS';
  const storeEmail = companySettings?.orgEmail || 'admin@dreams.com';
  const storePhone = companySettings?.orgPhone || '8817440858';
  
  // Format Address lines nicely 
  const addrParts = [
    companySettings?.orgAddress1,
    companySettings?.orgAddress2,
    companySettings?.orgCity,
    companySettings?.orgState,
    companySettings?.orgPincode
  ].filter(Boolean);
  
  const storeAddress = addrParts.length > 0 
    ? addrParts.join(', ') 
    : '3099 Kennedy Court Framingham, MA 01702';

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Invoice Details</h1>
        </div>
        <div className={styles.headerActions}>
          {invoice.dueAmount > 0 && (
            <button className={styles.btnPrimary} style={{backgroundColor: '#28C76F'}} onClick={() => {
              setPaymentAmount(invoice.dueAmount);
              setIsPaymentModalOpen(true);
            }}>
              <Plus size={18} /> Add Payment
            </button>
          )}
          <button className={styles.iconBtn} onClick={handlePrint} title="Print Invoice"><Printer size={18} color="#4B5563" /></button>
          <button className={styles.btnPrimary} style={{backgroundColor: '#7367F0'}} onClick={handleDownloadPdf}>
            Download PDF
          </button>
          <button className={styles.btnPrimary} style={{backgroundColor: '#FF9F43'}} onClick={() => navigate('/invoices')}>
            <ArrowLeft size={18} /> Back to Invoices
          </button>
        </div>
      </div>

      <Card id="printable-invoice-card" style={{padding: '3rem', marginBottom: '1.5rem'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
          <div>
            {companySettings?.orgLogo && (
              <img src={companySettings.orgLogo} alt="Logo" style={{maxHeight: '50px', maxWidth: '150px', objectFit: 'contain'}} />
            )}
          </div>
          <div style={{textAlign: 'right', maxWidth: '350px'}}>
            <div style={{fontWeight: 'bold', fontSize: '1.25rem', color: '#1B2850', marginBottom: '0.25rem'}}>{storeName}</div>
            {storeAddress && <p style={{color: '#4B5563', fontSize: '0.8rem', marginBottom: '0.5rem', lineHeight: '1.4'}}>{storeAddress}</p>}
            <div style={{fontSize: '0.8rem', color: '#4B5563', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 1rem', textAlign: 'left'}}>
              {storePhone && <div><strong>Phone:</strong> {storePhone}</div>}
              {storeEmail && <div><strong>Email:</strong> {storeEmail}</div>}
              {companySettings?.orgGst && <div><strong>GSTIN:</strong> {companySettings.orgGst}</div>}
              {companySettings?.orgState && <div><strong>State:</strong> {companySettings.orgState}</div>}
            </div>
          </div>
        </div>

        {/* Visual Reference Aligned Bill To & Invoice Details Table */}
        <table style={{width: '100%', borderCollapse: 'collapse', border: '1px solid #E5E7EB', marginBottom: '2rem'}}>
          <thead>
            <tr style={{backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB', textAlign: 'left', fontSize: '0.875rem', color: '#1F2937'}}>
              <th style={{padding: '0.75rem 1rem', fontWeight: 700, width: '50%', borderRight: '1px solid #E5E7EB'}}>Bill To:</th>
              <th style={{padding: '0.75rem 1rem', fontWeight: 700, width: '50%'}}>Invoice Details: {(() => {
                let bg = '#FCEAEA';
                let color = '#EA5455';
                if (invoice.status === 'Paid') { bg = '#E8F9EE'; color = '#28C76F'; }
                else if (invoice.status === 'Partially Paid') { bg = '#FFF1E6'; color = '#FF9F43'; }
                else if (invoice.status === 'Overdue') { bg = '#FFF2F2'; color = '#EA5455'; }
                return (
                  <span style={{
                    backgroundColor: bg, color: color,
                    padding: '4px 8px', borderRadius: '4px', fontSize: '12px',
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    fontWeight: 600, verticalAlign: 'middle'
                  }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: color }}></span>
                    {invoice.status}
                  </span>
                );
              })()}</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{fontSize: '0.875rem', color: '#4B5563', verticalAlign: 'top'}}>
              <td style={{padding: '1rem', borderRight: '1px solid #E5E7EB', lineHeight: '1.6'}}>
                <strong style={{color: '#1B2850', display: 'block', fontSize: '1rem', marginBottom: '0.25rem'}}>{invoice.customerName}</strong>
                {invoice.customerEmail && <div>Email : {invoice.customerEmail}</div>}
                {invoice.customerPhone && <div>Phone : {invoice.customerPhone}</div>}
                {invoice.gstNumber && <div>GST No : {invoice.gstNumber}</div>}
                {invoice.placeOfSupply && <div>Place of Supply : {invoice.placeOfSupply}</div>}
              </td>
              <td style={{padding: '1rem', lineHeight: '1.6', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                  <div>No: <strong style={{color: '#1B2850'}}>{invoice.invoiceNumber}</strong></div>
                  <div>Date: <strong style={{color: '#1B2850'}}>{new Date(invoice.invoiceDate).toLocaleDateString('en-GB')}</strong></div>
                  <div>Due Date: <strong style={{color: '#1B2850'}}>{new Date(invoice.dueDate).toLocaleDateString('en-GB')}</strong></div>
                </div>
                <div style={{width: '70px', height: '70px', backgroundColor: '#F3F4F6', border: '1px solid #E5E7EB', padding: '2px', borderRadius: '4px'}}>
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=70x70&data=${invoice.invoiceNumber}`} alt="QR Code" style={{width: '100%', height: '100%'}} />
                </div>
              </td>
            </tr>
          </tbody>
        </table>

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

        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', gap: '2rem', flexWrap: 'wrap'}}>
          <div style={{flex: 1, minWidth: '300px'}}>
            {invoice.payments && invoice.payments.length > 0 ? (
              <div>
                <p style={{fontSize: '0.875rem', color: '#1B2850', fontWeight: 600, marginBottom: '0.5rem'}}>Payment History</p>
                <div style={{border: '1px solid #E5E7EB', borderRadius: '6px', overflow: 'hidden'}}>
                  <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.75rem'}}>
                    <thead>
                      <tr style={{backgroundColor: '#F9FAFB', color: '#4B5563'}}>
                        <th style={{padding: '0.5rem 0.75rem', fontWeight: 600}}>Date</th>
                        <th style={{padding: '0.5rem 0.75rem', fontWeight: 600}}>Ref No</th>
                        <th style={{padding: '0.5rem 0.75rem', fontWeight: 600, textAlign: 'right'}}>Amount</th>
                        <th style={{padding: '0.5rem 0.75rem', fontWeight: 600, textAlign: 'center'}}>Receipt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.payments.map((p, idx) => (
                        <tr key={idx} style={{borderTop: '1px solid #E5E7EB'}}>
                          <td style={{padding: '0.5rem 0.75rem', color: '#4B5563'}}>{new Date(p.paymentDate).toLocaleDateString()}</td>
                          <td style={{padding: '0.5rem 0.75rem', color: '#4B5563'}}>{p.referenceNumber || '—'}</td>
                          <td style={{padding: '0.5rem 0.75rem', color: '#28C76F', fontWeight: 600, textAlign: 'right'}}>₹{p.amount.toFixed(2)}</td>
                          <td style={{padding: '0.5rem 0.75rem', textAlign: 'center'}}>
                            <button 
                              onClick={() => navigate(`/payment-receipt/${invoice._id}/${p._id}`)}
                              style={{border: 'none', background: 'none', cursor: 'pointer', color: '#FF9F43', display: 'inline-flex', alignItems: 'center'}}
                              title="Print Receipt"
                            >
                              <Printer size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div style={{padding: '1rem', backgroundColor: '#F9FAFB', borderRadius: '6px', border: '1px dashed #D1D5DB'}}>
                <p style={{fontSize: '0.875rem', color: '#9CA3AF', fontStyle: 'italic', margin: 0}}>No payments recorded yet.</p>
              </div>
            )}

            {invoice.notes && (
              <div style={{ marginTop: '2rem', padding: '1.25rem', backgroundColor: '#F9FAFB', borderRadius: '6px', border: '1px solid #E5E7EB' }}>
                <p style={{ fontSize: '0.875rem', color: '#1B2850', fontWeight: 600, marginBottom: '0.5rem' }}>Terms & Conditions</p>
                <div style={{ fontSize: '0.75rem', color: '#4B5563', whiteSpace: 'pre-line', lineHeight: '1.6' }}>
                  {invoice.notes}
                </div>
              </div>
            )}
          </div>
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

      <Modal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} title="Record Invoice Payment">
        <form onSubmit={handlePaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>
              Payment Date
            </label>
            <input 
              type="date" 
              value={paymentDate} 
              onChange={(e) => setPaymentDate(e.target.value)} 
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>
              Amount (INR) <span style={{ color: 'red' }}>*</span>
            </label>
            <input 
              type="number" 
              min="0.01" 
              step="0.01"
              max={invoice.dueAmount}
              value={paymentAmount} 
              onChange={(e) => setPaymentAmount(e.target.value)} 
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', boxSizing: 'border-box' }}
              required
            />
            <small style={{ color: '#6B7280' }}>Max payable: ₹{invoice.dueAmount}</small>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>
              Reference / Transaction No. (Optional)
            </label>
            <input 
              type="text" 
              placeholder="e.g. UPI Ref, Bank Txn ID"
              value={paymentRef} 
              onChange={(e) => setPaymentRef(e.target.value)} 
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
            <button 
              type="button" 
              onClick={() => setIsPaymentModalOpen(false)} 
              style={{ padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: 'white', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={submittingPayment}
              style={{ padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', backgroundColor: '#28C76F', color: 'white', cursor: 'pointer', fontWeight: 500 }}
            >
              {submittingPayment ? 'Submitting...' : 'Submit Payment'}
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default InvoiceDetails;
