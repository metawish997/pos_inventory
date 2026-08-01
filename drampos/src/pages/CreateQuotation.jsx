import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import {
  Plus, Trash2, ArrowLeft, Save, Search,
  ChevronDown, ChevronUp, Check, Eye, EyeOff, Edit2
} from 'lucide-react';
import { getAllProducts } from '../services/productService';
import { createQuotation, getQuotations } from '../services/salesService';
import { getCustomers } from '../services/customerService';
import AddCustomerModal from '../components/modals/AddCustomerModal';
import HsnModal from '../components/modals/HsnModal';
import { API_BASE_URL } from '../api/endpoints';

function numberToWords(amount) {
  if (!amount && amount !== 0) return '';
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven',
    'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen',
    'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const toWords = (n) => {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + toWords(n % 100) : '');
    if (n < 100000) return toWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + toWords(n % 1000) : '');
    if (n < 10000000) return toWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + toWords(n % 100000) : '');
    return toWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + toWords(n % 10000000) : '');
  };
  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);
  let result = '';
  if (rupees > 0) result += toWords(rupees) + ' Rupee' + (rupees !== 1 ? 's' : '');
  if (paise > 0) result += (result ? ' And ' : '') + toWords(paise) + ' Paise';
  return (result || 'Zero Rupees') + ' Only';
}

const CreateQuotation = () => {
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [placeOfSupply, setPlaceOfSupply] = useState('');
  const [clientPoNumber, setClientPoNumber] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState(null);

  const [nextQuotationNumber, setNextQuotationNumber] = useState('');
  const [quotationDate, setQuotationDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [validUntil, setValidUntil] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [terms, setTerms] = useState('Net 30');

  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([{ id: Date.now(), product: null, qty: 1, price: 0, hsn: '', gstRate: 0, description: '', showDesc: false }]);
  
  // HSN active modal states
  const [isHsnModalOpen, setIsHsnModalOpen] = useState(false);
  const [hsnActiveRowId, setHsnActiveRowId] = useState(null);

  const [discount, setDiscount] = useState(0);
  const [shipping, setShipping] = useState(0);

  const [notes, setNotes] = useState(
    "1. All quotations are valid for 30 days unless otherwise specified.\n" +
    "2. Acceptance of this quotation constitutes agreement to the outlined services and terms.\n" +
    "3. Any additional requirements requested after quotation acceptance will be subject to revised costing."
  );
  const [showTotalInWords, setShowTotalInWords] = useState(true);
  const [loading, setLoading] = useState(false);

  const [billedBy, setBilledBy] = useState({
    name: '',
    address: '',
    gstin: '',
    pan: ''
  });

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const grandTotal = Math.max(0, subtotal - Number(discount) + Number(shipping));
  const totalInWords = numberToWords(grandTotal);

  useEffect(() => {
    getQuotations().then(data => {
      if (data.success) setNextQuotationNumber(`QT-${String(data.data.length + 1).padStart(4, '0')}`);
    }).catch(console.error);

    getAllProducts().then(res => {
      setProducts(res.products || res.data || (Array.isArray(res) ? res : []));
    }).catch(console.error);

    getCustomers().then(data => {
      if (data.success) setCustomers(data.data);
    }).catch(console.error);

    // Fetch org / billed-by details
    fetch(`${API_BASE_URL}/company-settings`)
      .then(res => { if (!res.ok) throw new Error('no api'); return res.json(); })
      .then(parsed => {
        if (parsed) setBilledBy({
          name: parsed.orgName || '',
          address: `${parsed.orgAddress1 || ''}, ${parsed.orgAddress2 || ''}, ${parsed.orgCity || ''}, ${parsed.orgState || ''} - ${parsed.orgPincode || ''}`.replace(/(,\s*){2,}/g, ', ').trim().replace(/(^,\s*|,\s*$)/g, ''),
          gstin: parsed.orgGst || '',
          pan: parsed.storePan || ''
        });
      })
      .catch(() => {
        const s = localStorage.getItem('pos_settings');
        if (s) {
          try {
            const p = JSON.parse(s);
            setBilledBy({
              name: p.orgName || '',
              address: `${p.orgAddress1 || ''}, ${p.orgAddress2 || ''}, ${p.orgCity || ''}, ${p.orgState || ''} - ${p.orgPincode || ''}`.replace(/(,\s*){2,}/g, ', ').trim().replace(/(^,\s*|,\s*$)/g, ''),
              gstin: p.orgGst || '',
              pan: p.storePan || ''
            });
          } catch (e) { /* ignore */ }
        }
      });

    const handleOutsideClick = (e) => {
      if (!e.target.closest('.customer-select-container')) setShowCustomerDropdown(false);
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  useEffect(() => {
    if (!quotationDate) return;
    const date = new Date(quotationDate);
    if (isNaN(date.getTime())) return;
    const days = { 'Net 15': 15, 'Net 30': 30, 'Net 45': 45, 'Net 60': 60 }[terms] || 0;
    date.setDate(date.getDate() + days);
    setValidUntil(date.toISOString().split('T')[0]);
  }, [quotationDate, terms]);

  const addRow = () => setCartItems(prev => [...prev, { id: Date.now(), product: null, qty: 1, price: 0, hsn: '', gstRate: 0, description: '', showDesc: false }]);
  const copyRow = (rowId) => setCartItems(prev => { const r = prev.find(x => x.id === rowId); return r ? [...prev, { ...r, id: Date.now() }] : prev; });

  const setRowProduct = (rowId, productId) => {
    const prod = products.find(p => p._id === productId);
    setCartItems(prev => prev.map(r =>
      r.id === rowId ? { ...r, product: prod || null, price: prod ? (prod.sellingPrice || prod.price || 0) : 0, hsn: prod?.hsn || prod?.hsnCode || '' } : r
    ));
  };

  const setRowQty = (rowId, qty) => setCartItems(prev =>
    prev.map(r => r.id === rowId ? { ...r, qty: Math.max(1, Number(qty)) } : r)
  );

  const setRowPrice = (rowId, price) => setCartItems(prev =>
    prev.map(r => r.id === rowId ? { ...r, price: Math.max(0, Number(price)) } : r)
  );

  const setRowHsn = (rowId, hsn) => setCartItems(prev => prev.map(r => r.id === rowId ? { ...r, hsn } : r));
  const setRowGst = (rowId, gstRate) => setCartItems(prev => prev.map(r => r.id === rowId ? { ...r, gstRate: Number(gstRate) } : r));
  const setRowDesc = (rowId, description) => setCartItems(prev => prev.map(r => r.id === rowId ? { ...r, description } : r));
  const toggleRowDesc = (rowId) => setCartItems(prev => prev.map(r => r.id === rowId ? { ...r, showDesc: !r.showDesc } : r));

  const removeRow = (rowId) => setCartItems(prev => prev.filter(r => r.id !== rowId));

  const handleSubmit = async (e, mode = 'save') => {
    if (e && e.preventDefault) e.preventDefault();
    if (!customerName) { alert('Please select or enter Customer Name'); return; }
    const validItems = cartItems.filter(r => r.product);
    if (validItems.length === 0) { alert('Please select at least one product'); return; }

    try {
      setLoading(true);
      const payload = {
        customerName, customerEmail, customerPhone,
        gstNumber, placeOfSupply, clientPoNumber,
        quotationDate, validUntil,
        items: validItems.map(r => ({
          product: r.product._id, quantity: r.qty,
          unitPrice: r.price, taxRate: r.gstRate || 0, subtotal: r.price * r.qty
        })),
        subtotal, grandTotal,
        status: mode === 'draft' ? 'Draft' : 'Sent',
        notes
      };

      const res = await createQuotation(payload);
      if (res.success) {
        if (mode === 'new') {
          alert('Quotation saved! Starting new quotation.');
          navigate(0);
        } else if (mode === 'draft') {
          alert('Draft saved!');
          navigate('/quotation');
        } else {
          alert('Quotation created successfully!');
          const createdQuoId = res.data?._id || res.quotation?._id || res._id;
          if (createdQuoId) {
            navigate(`/quotation-details/${createdQuoId}`);
          } else {
            navigate('/quotation');
          }
        }
      }
    } catch (err) {
      alert(`Error creating quotation: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(c => {
    const name = `${c.firstName || ''} ${c.lastName || ''}`.toLowerCase();
    const disp = (c.displayName || '').toLowerCase();
    const q = customerSearchTerm.toLowerCase();
    return name.includes(q) || disp.includes(q) || (c.email || '').toLowerCase().includes(q) || (c.phone || '').includes(q);
  });

  return (
    <DashboardLayout>

      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <button
          type="button"
          onClick={() => navigate('/quotation')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #D1D5DB', backgroundColor: 'white', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => handleSubmit(null, 'draft')}
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'white', border: '1px solid #D1D5DB', color: '#374151', padding: '0.6rem 1.25rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}
          >
            <Save size={16} /> Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(null, 'new')}
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#FF9F43', border: 'none', color: 'white', padding: '0.6rem 1.25rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}
          >
            <Save size={16} /> Save & Create New
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'save')}
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--color-navy)', border: 'none', color: 'white', padding: '0.6rem 1.5rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}
          >
            <Save size={16} /> {loading ? 'Saving...' : 'Save Quotation'}
          </button>
        </div>
      </div>

      {/* Document Card */}
      <Card style={{ padding: '2.5rem', maxWidth: '1200px', margin: '0 auto', border: '1px solid #F3F4F6', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)' }}>
        <form onSubmit={(e) => handleSubmit(e, 'save')}>

          {/* Header & Logo Flex Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', position: 'relative', minHeight: '100px' }}>
            {/* Empty spacer to push title to exact center */}
            <div style={{ width: '240px' }}></div>

            {/* Header Title Section (Centered) */}
            <div style={{ textAlign: 'center' }}>
              <h1 style={{ fontSize: '2.25rem', fontWeight: 700, color: '#111827', margin: 0 }}>Quotation</h1>
            </div>

            {/* Empty space for design consistency - we can hide logo on Quotation or keep the placeholder */}
            <div style={{ width: '240px' }}></div>
          </div>

          {/* Top Metadata Section (Full width / Two Columns) */}
          <div style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr', gap: '3rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <label style={{ width: '130px', fontSize: '0.875rem', fontWeight: 500, color: '#374151', textDecoration: 'underline', textDecorationColor: '#D1D5DB', flexShrink: 0 }}>Quotation No*</label>
                  <input
                    type="text"
                    value={nextQuotationNumber}
                    onChange={e => setNextQuotationNumber(e.target.value)}
                    style={{ flex: 1, border: 'none', borderBottom: '1px dashed #D1D5DB', padding: '0.35rem 0', outline: 'none', fontSize: '0.925rem', color: '#111827', backgroundColor: 'transparent', fontWeight: 500 }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <label style={{ width: '130px', fontSize: '0.875rem', fontWeight: 500, color: '#374151', textDecoration: 'underline', textDecorationColor: '#D1D5DB', flexShrink: 0 }}>PO Number</label>
                  <input
                    type="text"
                    value={clientPoNumber}
                    onChange={e => setClientPoNumber(e.target.value)}
                    placeholder="Enter PO Number"
                    style={{ flex: 1, border: 'none', borderBottom: '1px dashed #D1D5DB', padding: '0.35rem 0', outline: 'none', fontSize: '0.925rem', color: '#111827', backgroundColor: 'transparent' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <label style={{ width: '130px', fontSize: '0.875rem', fontWeight: 500, color: '#374151', textDecoration: 'underline', textDecorationColor: '#D1D5DB', flexShrink: 0 }}>Quotation Date*</label>
                  <input
                    type="date"
                    value={quotationDate}
                    onChange={e => setQuotationDate(e.target.value)}
                    style={{ flex: 1, border: 'none', borderBottom: '1px dashed #D1D5DB', padding: '0.35rem 0', outline: 'none', fontSize: '0.925rem', color: '#111827', backgroundColor: 'transparent' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <label style={{ width: '130px', fontSize: '0.875rem', fontWeight: 500, color: '#374151', textDecoration: 'underline', textDecorationColor: '#D1D5DB', flexShrink: 0 }}>Valid Until</label>
                  <input
                    type="date"
                    value={validUntil}
                    onChange={e => setValidUntil(e.target.value)}
                    style={{ flex: 1, border: 'none', borderBottom: '1px dashed #D1D5DB', padding: '0.35rem 0', outline: 'none', fontSize: '0.925rem', color: '#111827', backgroundColor: 'transparent' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr', gap: '3rem', marginTop: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <label style={{ width: '130px', fontSize: '0.875rem', fontWeight: 500, color: '#374151', textDecoration: 'underline', textDecorationColor: '#D1D5DB', flexShrink: 0 }}>Terms</label>
                <select
                  value={terms}
                  onChange={e => setTerms(e.target.value)}
                  style={{ flex: 1, border: 'none', borderBottom: '1px dashed #D1D5DB', padding: '0.35rem 0', outline: 'none', fontSize: '0.925rem', color: '#111827', backgroundColor: 'transparent' }}
                >
                  {['Due on Receipt', 'Net 15', 'Net 30', 'Net 45', 'Net 60'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Billed By & Billed To */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>

            {/* Billed By */}
            <div style={{ border: '1px solid #F3F4F6', borderRadius: '8px', padding: '1.5rem', backgroundColor: '#F9FAFB' }}>
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#374151' }}>Billed By <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 400 }}>(Your Details)</span></span>
              </div>
              <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600, color: '#111827', fontSize: '0.9rem' }}>{billedBy.name}</span>
                  <Edit2 size={14} style={{ color: '#FF9F43', cursor: 'pointer' }} />
                </div>
                <div style={{ fontSize: '0.8rem', color: '#6B7280', marginBottom: '0.5rem' }}>{billedBy.address}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '0.25rem', fontSize: '0.8rem' }}>
                  {billedBy.gstin && <><span style={{ color: '#9CA3AF' }}>GSTIN</span><span style={{ fontWeight: 500, color: '#374151' }}>{billedBy.gstin}</span></>}
                  {billedBy.pan && <><span style={{ color: '#9CA3AF' }}>PAN</span><span style={{ fontWeight: 500, color: '#374151' }}>{billedBy.pan}</span></>}
                </div>
              </div>
            </div>

            {/* Billed To */}
            <div style={{ border: '1px solid #F3F4F6', borderRadius: '8px', padding: '1.5rem', backgroundColor: '#F9FAFB' }}>
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#374151' }}>Billed To <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 400 }}>(Client's Details)</span></span>
              </div>

              {/* Customer Selector inside the Billed To Card */}
              <div className="customer-select-container" style={{ position: 'relative', marginBottom: '1rem' }}>
                <div 
                  onClick={() => setShowCustomerDropdown(!showCustomerDropdown)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: 'white', fontSize: '0.875rem', color: customerName ? '#111827' : '#9CA3AF', cursor: 'pointer' }}
                >
                  <span>{customerName || "Select a Client"}</span>
                  <ChevronDown size={16} style={{ color: '#9CA3AF' }} />
                </div>

                {showCustomerDropdown && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1000, backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', marginTop: '4px', padding: '0.75rem' }}>
                    <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
                      <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                      <input
                        type="search"
                        placeholder="Search Client"
                        value={customerSearchTerm}
                        onChange={e => setCustomerSearchTerm(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem 0.75rem 0.5rem 2.2rem', borderRadius: '6px', border: '1px solid #D1D5DB', outline: 'none', fontSize: '0.875rem', height: '36px', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
                      {filteredCustomers.map(c => {
                        const fullName = c.displayName || `${c.firstName || ''} ${c.lastName || ''}`.trim() || 'Unnamed';
                        return (
                          <div
                            key={c._id}
                            onClick={() => {
                              setCustomerName(fullName);
                              setCustomerEmail(c.email || '');
                              setCustomerPhone(c.phone || '');
                              setGstNumber(c.gstNumber || '');
                              const parsedSettings = JSON.parse(localStorage.getItem('pos_settings') || '{}');
                              const storeStateFallback = parsedSettings.orgState || 'Madhya Pradesh';
                              setPlaceOfSupply(c.placeOfSupply || c.state || storeStateFallback);
                              setSelectedCustomer(c);
                              setShowCustomerDropdown(false);
                            }}
                            style={{ padding: '0.5rem 0.75rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem' }}
                          >
                            {fullName}
                          </div>
                        );
                      })}
                    </div>
                    <div
                      onClick={() => { setCustomerToEdit(null); setIsCustomerModalOpen(true); setShowCustomerDropdown(false); }}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 0.5rem 0.25rem', color: '#FF9F43', fontWeight: 600, fontSize: '0.875rem', borderTop: '1px solid #E5E7EB', cursor: 'pointer', marginTop: '0.5rem' }}
                    >
                      <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>+</span> New Customer
                    </div>
                  </div>
                )}
              </div>
              {selectedCustomer ? (
                <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 600, color: '#111827', fontSize: '0.9rem' }}>
                      {selectedCustomer.companyName || `${selectedCustomer.firstName || ''} ${selectedCustomer.lastName || ''}`.trim()}
                    </span>
                    <Edit2 size={14} style={{ color: '#FF9F43', cursor: 'pointer' }} onClick={() => { setCustomerToEdit(selectedCustomer); setIsCustomerModalOpen(true); }} />
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6B7280', marginBottom: '0.5rem' }}>{selectedCustomer.address || ''}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '0.25rem', fontSize: '0.8rem' }}>
                    {selectedCustomer.gstNumber && <><span style={{ color: '#9CA3AF' }}>GSTIN</span><span style={{ fontWeight: 500, color: '#374151' }}>{selectedCustomer.gstNumber}</span></>}
                    {selectedCustomer.phone && <><span style={{ color: '#9CA3AF' }}>Phone</span><span style={{ fontWeight: 500, color: '#374151' }}>{selectedCustomer.phone}</span></>}
                  </div>
                </div>
              ) : (
                <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px dashed #D1D5DB', padding: '1.25rem', color: '#9CA3AF', fontSize: '0.875rem', textAlign: 'center' }}>
                  Select a customer above to see their details here
                </div>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden', marginBottom: '1rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#FF9F43', color: 'white', fontSize: '0.78rem', fontWeight: 600 }}>
                  <th style={{ padding: '0.75rem 0.5rem 0.75rem 1rem', width: '32px' }}>#</th>
                  <th style={{ padding: '0.75rem 0.5rem', width: '250px' }}>Item</th>
                  <th style={{ padding: '0.75rem 0.5rem', width: '90px' }}>HSN/SAC</th>
                  <th style={{ padding: '0.75rem 0.5rem', width: '80px', textAlign: 'center' }}>GST Rate</th>
                  <th style={{ padding: '0.75rem 0.5rem', width: '72px', textAlign: 'center' }}>Quantity</th>
                  <th style={{ padding: '0.75rem 0.5rem', width: '80px', textAlign: 'right' }}>Rate</th>
                  <th style={{ padding: '0.75rem 0.5rem', width: '80px', textAlign: 'right' }}>Amount</th>
                  <th style={{ padding: '0.75rem 0.5rem', width: '72px', textAlign: 'right' }}>CGST</th>
                  <th style={{ padding: '0.75rem 0.5rem', width: '72px', textAlign: 'right' }}>SGST</th>
                  <th style={{ padding: '0.75rem 1rem 0.75rem 0.5rem', width: '80px', textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((row, idx) => {
                  const amount = row.price * row.qty;
                  const cgst = (amount * (row.gstRate / 2)) / 100;
                  const sgst = cgst;
                  const total = amount + cgst + sgst;
                  return (
                    <React.Fragment key={row.id}>
                      <tr style={{ borderBottom: row.showDesc ? 'none' : '1px solid #F3F4F6', fontSize: '0.8rem', verticalAlign: 'middle' }}>
                        {/* # + copy/delete */}
                        <td style={{ padding: '0.75rem 0.25rem 0.75rem 0.75rem', verticalAlign: 'top' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                            <span style={{ color: '#6B7280', fontSize: '0.75rem', fontWeight: 600 }}>{idx + 1}.</span>
                            <button type="button" onClick={() => copyRow(row.id)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 0, display: 'flex' }}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                            </button>
                            <button type="button" onClick={() => removeRow(row.id)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EA5455', padding: 0, display: 'flex' }}>
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>

                        {/* Item name/SKU */}
                        <td style={{ padding: '0.6rem 0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '4px', backgroundColor: '#F3F4F6', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: '#9CA3AF', overflow: 'hidden' }}>
                              {row.product?.image ? <img src={row.product.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : 'IMG'}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <select
                                className="term-list-input"
                                value={row.product?._id || ''}
                                onChange={e => setRowProduct(row.id, e.target.value)}
                                style={{ width: '100%', border: 'none', borderBottom: '1.5px dashed #FF9F43', outline: 'none', fontSize: '0.8rem', color: row.product ? '#111827' : '#9CA3AF', backgroundColor: 'transparent', cursor: 'pointer', paddingBottom: '0.2rem' }}
                              >
                                <option value="">Item Name / SKU Id</option>
                                {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                              </select>
                              {row.product?.sku && <div style={{ fontSize: '0.7rem', color: '#9CA3AF', marginTop: '0.15rem' }}>SKU: {row.product.sku}</div>}
                            </div>
                          </div>
                        </td>

                        {/* HSN/SAC */}
                        <td style={{ padding: '0.6rem 0.5rem' }}>
                          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <input type="text" className="term-list-input" value={row.hsn} onChange={e => setRowHsn(row.id, e.target.value)}
                              placeholder="#"
                              style={{ width: '70px', border: 'none', borderBottom: '1.5px dashed #FF9F43', padding: '0.3rem 1.8rem 0.2rem 0.5rem', outline: 'none', fontSize: '0.8rem', color: '#374151', backgroundColor: 'transparent' }} />
                            <span 
                              onClick={() => {
                                setHsnActiveRowId(row.id);
                                setIsHsnModalOpen(true);
                              }}
                              style={{ position: 'absolute', right: '6px', cursor: 'pointer', fontSize: '0.75rem', color: '#FF9F43' }}
                              title="Search HSN/SAC"
                            >
                              🔍
                            </span>
                          </div>
                        </td>

                        {/* GST Rate */}
                        <td style={{ padding: '0.6rem 0.5rem', textAlign: 'center' }}>
                          <select className="term-list-input" value={row.gstRate} onChange={e => setRowGst(row.id, e.target.value)}
                            style={{ border: 'none', borderBottom: '1.5px dashed #FF9F43', padding: '0.3rem 0.4rem 0.2rem', outline: 'none', fontSize: '0.8rem', color: '#374151', backgroundColor: 'transparent' }}>
                            <option value={0}>GST 0%</option>
                            <option value={5}>GST 5%</option>
                            <option value={12}>GST 12%</option>
                            <option value={18}>GST 18%</option>
                            <option value={28}>GST 28%</option>
                          </select>
                        </td>

                        {/* Qty */}
                        <td style={{ padding: '0.6rem 0.5rem', textAlign: 'center' }}>
                          <input type="number" className="term-list-input" min="1" value={row.qty} onChange={e => setRowQty(row.id, e.target.value)}
                            style={{ width: '52px', border: 'none', borderBottom: '1.5px dashed #FF9F43', padding: '0.3rem 0.4rem 0.2rem', outline: 'none', fontSize: '0.8rem', textAlign: 'center', backgroundColor: 'transparent' }} />
                        </td>

                        {/* Rate */}
                        <td style={{ padding: '0.6rem 0.5rem', textAlign: 'right' }}>
                          <input type="number" className="term-list-input" min="0" step="0.01" value={row.price} onChange={e => setRowPrice(row.id, e.target.value)}
                            style={{ width: '68px', border: 'none', borderBottom: '1.5px dashed #FF9F43', padding: '0.3rem 0.4rem 0.2rem', outline: 'none', fontSize: '0.8rem', textAlign: 'right', backgroundColor: 'transparent' }} />
                        </td>

                        {/* Amount */}
                        <td style={{ padding: '0.6rem 0.5rem', textAlign: 'right', color: '#374151', fontWeight: 500, fontSize: '0.8rem' }}>₹{amount.toFixed(2)}</td>

                        {/* CGST */}
                        <td style={{ padding: '0.6rem 0.5rem', textAlign: 'right', color: '#374151', fontSize: '0.8rem' }}>₹{cgst.toFixed(2)}</td>

                        {/* SGST */}
                        <td style={{ padding: '0.6rem 0.5rem', textAlign: 'right', color: '#374151', fontSize: '0.8rem' }}>₹{sgst.toFixed(2)}</td>

                        {/* Total */}
                        <td style={{ padding: '0.6rem 1rem 0.6rem 0.5rem', textAlign: 'right', color: '#111827', fontWeight: 700, fontSize: '0.8rem' }}>₹{total.toFixed(2)}</td>
                      </tr>

                      {/* Add Description row */}
                      <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                        <td />
                        <td colSpan={9} style={{ padding: '0 0.5rem 0.6rem 0.5rem' }}>
                          {row.showDesc ? (
                            <input
                              type="text"
                              placeholder="Add a description…"
                              value={row.description}
                              onChange={e => setRowDesc(row.id, e.target.value)}
                              onBlur={() => !row.description && toggleRowDesc(row.id)}
                              style={{ width: '100%', border: 'none', borderBottom: '1px dashed #D1D5DB', outline: 'none', fontSize: '0.78rem', color: '#374151', backgroundColor: 'transparent', padding: '0.2rem 0' }}
                              autoFocus
                            />
                          ) : (
                            <button type="button" onClick={() => toggleRowDesc(row.id)}
                              style={{ background: 'none', border: 'none', color: '#FF9F43', fontSize: '0.78rem', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                              Add Description
                            </button>
                          )}
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>

            {/* Add New Line button */}
            <div
              onClick={addRow}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem 1rem', margin: '0.75rem', border: '1px dashed #E5E7EB', borderRadius: '6px', cursor: 'pointer', color: '#FF9F43', fontWeight: 600, fontSize: '0.875rem', backgroundColor: 'white', userSelect: 'none' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
              Add New Line
            </div>
          </div>

          {/* Bottom: Notes | Summary */}
          <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', flexWrap: 'wrap', alignItems: 'stretch' }}>
            <div style={{ flex: 1.2, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Terms &amp; Conditions</label>
              <textarea
                rows={8} value={notes} onChange={e => setNotes(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '6px', border: '1px solid #E5E7EB', outline: 'none', fontSize: '0.875rem', color: '#374151', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6, flex: 1 }}
              />
            </div>

            <div style={{ flex: 1, minWidth: '300px', maxWidth: '520px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1.25rem', borderBottom: '1px solid #F3F4F6' }}>
                  <span style={{ color: '#4B5563', fontSize: '0.875rem' }}>Subtotal</span>
                  <span style={{ color: '#111827', fontWeight: 600, fontSize: '0.875rem' }}>₹{subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1.25rem', borderBottom: '1px solid #F3F4F6' }}>
                  <span style={{ color: '#4B5563', fontSize: '0.875rem' }}>Discount (₹)</span>
                  <input type="number" min="0" step="0.01" value={discount} onChange={e => setDiscount(e.target.value)}
                    className="term-list-input"
                    style={{ width: '90px', textAlign: 'right', border: 'none', borderBottom: '1.5px dashed #FF9F43', outline: 'none', fontSize: '0.875rem', color: '#EA5455', backgroundColor: 'transparent' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1.25rem', borderBottom: '1px solid #F3F4F6' }}>
                  <span style={{ color: '#4B5563', fontSize: '0.875rem' }}>Shipping (₹)</span>
                  <input type="number" min="0" step="0.01" value={shipping} onChange={e => setShipping(e.target.value)}
                    className="term-list-input"
                    style={{ width: '90px', textAlign: 'right', border: 'none', borderBottom: '1.5px dashed #FF9F43', outline: 'none', fontSize: '0.875rem', color: '#111827', backgroundColor: 'transparent' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1.25rem', backgroundColor: '#F3F4F6' }}>
                  <span style={{ color: '#1F2937', fontWeight: 700, fontSize: '0.95rem' }}>Grand Total</span>
                  <span style={{ color: '#111827', fontWeight: 700, fontSize: '1.125rem' }}>₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '1rem 1.25rem', backgroundColor: '#F9FAFB' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#374151' }}>Show Total In Words</span>
                  <button type="button" onClick={() => setShowTotalInWords(!showTotalInWords)}
                    style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
                    {showTotalInWords ? <Eye size={18} style={{ color: '#7367F0' }} /> : <EyeOff size={18} style={{ color: '#9CA3AF' }} />}
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 500 }}>Total (in words)</span>
                  <span style={{ fontSize: '0.825rem', color: '#9CA3AF', borderBottom: '1px dashed #D1D5DB', paddingBottom: '4px', display: 'block' }}>
                    {totalInWords}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </form>
      </Card>

      <AddCustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        customerToEdit={customerToEdit}
        onSuccess={() => {
          getCustomers().then(data => {
            if (data.success) {
              setCustomers(data.data);
              const sorted = [...data.data].sort((a, b) => b._id.localeCompare(a._id));
              const latest = customerToEdit ? data.data.find(c => c._id === customerToEdit._id) : sorted[0];
              if (latest) {
                const fullName = latest.displayName || `${latest.firstName || ''} ${latest.lastName || ''}`.trim();
                setCustomerName(fullName);
                setCustomerEmail(latest.email || '');
                setCustomerPhone(latest.phone || '');
                setGstNumber(latest.gstNumber || '');
                
                const parsedSettings = JSON.parse(localStorage.getItem('pos_settings') || '{}');
                const storeStateFallback = parsedSettings.orgState || 'Madhya Pradesh';
                setPlaceOfSupply(latest.placeOfSupply || latest.state || storeStateFallback);
                
                setSelectedCustomer(latest);
              }
            }
          }).catch(console.error);
        }}
      />

      <HsnModal 
        isOpen={isHsnModalOpen}
        onClose={() => setIsHsnModalOpen(false)}
        onSelect={(code) => {
          if (hsnActiveRowId !== null) {
            setRowHsn(hsnActiveRowId, code);
          }
        }}
      />
    </DashboardLayout>
  );
};

export default CreateQuotation;
