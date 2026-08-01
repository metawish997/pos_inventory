import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { Printer, ArrowLeft } from 'lucide-react';
import { API_BASE_URL } from '../api/endpoints';

const QuotationDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [companySettings, setCompanySettings] = useState(null);

  const fetchQuotation = async () => {
    try {
      setLoading(true);
      let targetId = id;

      if (!targetId) {
        const listRes = await fetch(`${API_BASE_URL}/sales/quotations/list`);
        const listData = await listRes.json();
        if (listData.success && listData.data && listData.data.length > 0) {
          targetId = listData.data[0]._id;
        }
      }

      if (!targetId) {
        setError('No quotation records found.');
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/sales/quotations/${targetId}`);
      const data = await res.json();
      if (data.success) {
        setQuotation(data.data);
      } else {
        setError(data.message || 'Failed to load quotation');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error fetching quotation');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotation();
    fetch(`${API_BASE_URL}/company-settings`)
      .then(res => res.json())
      .then(data => { if (data) setCompanySettings(data); })
      .catch(e => console.error("Error loading settings", e));
  }, [id]);

  const handlePrint = () => window.print();

  const handleDownloadPdf = () => {
    const element = document.getElementById('printable-quotation-card');
    if (!element) return;
    if (window.html2pdf) {
      const opt = {
        margin: 0.5,
        filename: `Quotation_${quotation?.quotationNumber || 'Detail'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      window.html2pdf().from(element).set(opt).save();
    } else {
      alert("PDF generator is still loading. Please try again.");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ padding: '2rem', color: '#6B7280' }}>Loading Quotation...</div>
      </DashboardLayout>
    );
  }

  if (error || !quotation) {
    return (
      <DashboardLayout>
        <div style={{ padding: '2rem', color: '#EA5455' }}>
          {error || 'Quotation not found.'}
        </div>
      </DashboardLayout>
    );
  }

  const items = quotation.items || [];

  // Org data from company-settings DB
  const storeName = companySettings?.orgName || 'Dreams POS';
  const storeEmail = companySettings?.orgEmail || '';
  const storePhone = companySettings?.orgPhone || '';
  const addrParts = [
    companySettings?.orgAddress1, companySettings?.orgAddress2,
    companySettings?.orgCity, companySettings?.orgState, companySettings?.orgPincode
  ].filter(Boolean);
  const storeAddress = addrParts.length > 0 ? addrParts.join(', ') : '';

  // Status badge colors
  const statusColors = {
    Sent: { bg: '#E8F9EE', color: '#28C76F' },
    Accepted: { bg: '#E8F9EE', color: '#28C76F' },
    Draft: { bg: '#F3F4F6', color: '#6B7280' },
    Declined: { bg: '#FCEAEA', color: '#EA5455' },
    Converted: { bg: '#EDE9FE', color: '#7367F0' },
  };
  const badge = statusColors[quotation.status] || statusColors.Sent;

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Quotation Details</h1>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} onClick={handlePrint} title="Print Quotation"><Printer size={18} color="#4B5563" /></button>
          <button className={styles.btnPrimary} style={{backgroundColor: '#7367F0'}} onClick={handleDownloadPdf}>
            Download PDF
          </button>
          <button className={styles.btnPrimary} style={{backgroundColor: '#FF9F43'}} onClick={() => navigate('/quotation')}>
            <ArrowLeft size={18} /> Back to Quotation
          </button>
        </div>
      </div>

      <Card id="printable-quotation-card" style={{padding: '3rem', marginBottom: '1.5rem'}}>
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

        {/* Visual Reference Aligned Bill To & Quotation Details Table */}
        <table style={{width: '100%', borderCollapse: 'collapse', border: '1px solid #E5E7EB', marginBottom: '2rem'}}>
          <thead>
            <tr style={{backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB', textAlign: 'left', fontSize: '0.875rem', color: '#1F2937'}}>
              <th style={{padding: '0.75rem 1rem', fontWeight: 700, width: '50%', borderRight: '1px solid #E5E7EB'}}>Bill To:</th>
              <th style={{padding: '0.75rem 1rem', fontWeight: 700, width: '50%'}}>Quotation Details: <span style={{
                backgroundColor: badge.bg, color: badge.color,
                padding: '4px 8px', borderRadius: '4px', fontSize: '12px',
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                fontWeight: 600, verticalAlign: 'middle'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: badge.color }}></span>
                {quotation.status}
              </span></th>
            </tr>
          </thead>
          <tbody>
            <tr style={{fontSize: '0.875rem', color: '#4B5563', verticalAlign: 'top'}}>
              <td style={{padding: '1rem', borderRight: '1px solid #E5E7EB', lineHeight: '1.6'}}>
                <strong style={{color: '#1B2850', display: 'block', fontSize: '1rem', marginBottom: '0.25rem'}}>{quotation.customerName}</strong>
                {quotation.customerEmail && <div>Email : {quotation.customerEmail}</div>}
                {quotation.customerPhone && <div>Phone : {quotation.customerPhone}</div>}
                {quotation.gstNumber && <div>GST No : {quotation.gstNumber}</div>}
                {quotation.placeOfSupply && <div>Place of Supply : {quotation.placeOfSupply}</div>}
              </td>
              <td style={{padding: '1rem', lineHeight: '1.6', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                  <div>No: <strong style={{color: '#1B2850'}}>{quotation.quotationNumber}</strong></div>
                  <div>Date: <strong style={{color: '#1B2850'}}>{new Date(quotation.quotationDate).toLocaleDateString('en-GB')}</strong></div>
                  <div>Valid Until: <strong style={{color: '#1B2850'}}>{new Date(quotation.validUntil).toLocaleDateString('en-GB')}</strong></div>
                </div>
                <div style={{width: '70px', height: '70px', backgroundColor: '#F3F4F6', border: '1px solid #E5E7EB', padding: '2px', borderRadius: '4px'}}>
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=70x70&data=${quotation.quotationNumber}`} alt="QR Code" style={{width: '100%', height: '100%'}} />
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
                  <td colSpan="5" style={{padding: '1rem', textAlign: 'center', color: '#6B7280'}}>No items in this quotation.</td>
                </tr>
              ) : (
                items.map((item, i) => (
                  <tr key={i} style={{borderTop: '1px solid #E5E7EB'}}>
                    <td style={{padding: '1rem', fontSize: '0.875rem', color: '#1B2850', fontWeight: 500}}>
                      {item.product?.name || 'Product'}
                    </td>
                    <td style={{padding: '1rem', fontSize: '0.875rem', color: '#4B5563'}}>{item.quantity}</td>
                    <td style={{padding: '1rem', fontSize: '0.875rem', color: '#4B5563'}}>₹{item.unitPrice}</td>
                    <td style={{padding: '1rem', fontSize: '0.875rem', color: '#4B5563'}}>₹{item.discount || 0}</td>
                    <td style={{padding: '1rem', fontSize: '0.875rem', color: '#1B2850', fontWeight: 500}}>₹{item.subtotal}</td>
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
              <span style={{color: '#1B2850', fontSize: '0.875rem', fontWeight: 600}}>₹{quotation.subtotal}</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0'}}>
              <span style={{color: '#4B5563', fontSize: '0.875rem'}}>Discount</span>
              <span style={{color: '#1B2850', fontSize: '0.875rem', fontWeight: 600}}>₹{quotation.totalDiscount || 0}</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0'}}>
              <span style={{color: '#4B5563', fontSize: '0.875rem'}}>Tax</span>
              <span style={{color: '#1B2850', fontSize: '0.875rem', fontWeight: 600}}>₹{quotation.totalTax || 0}</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB', marginTop: '0.5rem', marginBottom: '0.5rem'}}>
              <span style={{color: '#1B2850', fontSize: '1rem', fontWeight: 700}}>Total Amount</span>
              <span style={{color: '#1B2850', fontSize: '1.25rem', fontWeight: 700}}>₹{quotation.grandTotal}</span>
            </div>
          </div>
        </div>

        {quotation.notes && (
          <div style={{marginBottom: '2rem', padding: '1.25rem', backgroundColor: '#F9FAFB', borderRadius: '6px', border: '1px solid #E5E7EB'}}>
            <p style={{fontSize: '0.875rem', color: '#1B2850', fontWeight: 600, marginBottom: '0.5rem'}}>Terms & Conditions</p>
            <div style={{fontSize: '0.75rem', color: '#4B5563', whiteSpace: 'pre-line', lineHeight: '1.6'}}>
              {quotation.notes}
            </div>
          </div>
        )}

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
    </DashboardLayout>
  );
};

export default QuotationDetails;
