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
import { getTermsTemplates, createOrUpdateTermsTemplate } from '../services/termsTemplateService';
import { getColumnSettings, saveColumnSettings } from '../services/columnSettingService';
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

const defaultTermsTemplates = {
  'Brand New': [
    'Warranty: 1-year manufacturer warranty from the date of invoice.',
    'Delivery: Dispatch will be done within 2-3 business days after order confirmation.',
    'Payment: 100% advance payment prior to dispatch.',
    'Validity: Prices are valid for 15 days.'
  ],
  'Refurbished': [
    'Warranty: 90-days seller warranty covering hardware parts.',
    'Delivery: Dispatch within 3-5 business days.',
    'Condition: Fully tested refurbished unit. Minor cosmetic blemishes may be present.',
    'Payment: 50% advance, 50% on delivery.'
  ],
  'Rental': [
    'Rental Period: Minimum contract duration is 3 months.',
    'Security Deposit: Refundable security deposit equivalent to 1 month rental value.',
    'Maintenance: Standard maintenance is covered by the provider.',
    'Payment: Monthly rental due by the 5th of each month.'
  ]
};

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
  const [cartItems, setCartItems] = useState([{ id: Date.now(), product: null, qty: 1, price: 0, hsn: '', gstRate: 0, description: '', showDesc: false, customColumns: {} }]);
  const [columns, setColumns] = useState([
    { id: 'item', name: 'Item', type: 'TEXT', visible: true, width: '250px' },
    { id: 'hsn', name: 'HSN/SAC', type: 'NUMBER', visible: true, width: '90px' },
    { id: 'gstRate', name: 'GST Rate', type: 'NUMBER', visible: true, width: '80px' },
    { id: 'quantity', name: 'Quantity', type: 'NUMBER', visible: true, width: '72px' },
    { id: 'rate', name: 'Rate', type: 'CURRENCY', visible: true, width: '80px' },
    { id: 'amount', name: 'Amount', type: 'CURRENCY', visible: true, width: '80px', formula: 'Quantity * Rate' },
    { id: 'cgst', name: 'CGST', type: 'CURRENCY', visible: true, width: '72px' },
    { id: 'sgst', name: 'SGST', type: 'CURRENCY', visible: true, width: '72px' },
    { id: 'total', name: 'Total', type: 'CURRENCY', visible: true, width: '80px', formula: 'Amount + CGST + SGST' }
  ]);
  const [tempColumns, setTempColumns] = useState([]);
  const [isColumnsModalOpen, setIsColumnsModalOpen] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleDragStart = (e, index) => {
    if (index === 0) {
      e.preventDefault();
      return;
    }
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index || index === 0) return;
    setTempColumns(prev => {
      const list = [...prev];
      const draggedItem = list[draggedIndex];
      list.splice(draggedIndex, 1);
      list.splice(index, 0, draggedItem);
      return list;
    });
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };
  
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

  const [templates, setTemplates] = useState([]);
  const [selectedTemplateName, setSelectedTemplateName] = useState('Brand New');

  const handleSaveAsTemplate = () => {
    const name = prompt("Enter a name for this terms template:");
    if (!name) return;
    const currentTerms = notes.split('\n').map(t => t.replace(/^\d+\.\s*/, '').trim()).filter(Boolean);
    if (currentTerms.length === 0) {
      alert("Please add some terms first before saving as a template.");
      return;
    }
    createOrUpdateTermsTemplate({ name, terms: currentTerms })
      .then(newTemplate => {
        setTemplates(prev => {
          const index = prev.findIndex(t => t.name === name);
          if (index > -1) {
            const copy = [...prev];
            copy[index] = newTemplate;
            return copy;
          }
          return [...prev, newTemplate];
        });
        alert(`Template "${name}" saved to DB successfully!`);
      })
      .catch(err => {
        console.error(err);
        alert("Failed to save template to database: " + err.message);
      });
  };

  const [showTotalInWords, setShowTotalInWords] = useState(true);
  const [loading, setLoading] = useState(false);

  const [billedBy, setBilledBy] = useState({
    name: '',
    address: '',
    gstin: '',
    pan: ''
  });
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrgId, setSelectedOrgId] = useState('');

  const updateBilledByFromOrg = (org) => {
    if (!org) return;
    setBilledBy({
      name: org.orgName || '',
      address: `${org.orgAddress1 || ''}, ${org.orgAddress2 || ''}, ${org.orgCity || ''}, ${org.orgState || ''} - ${org.orgPincode || ''}`.replace(/(,\s*){2,}/g, ', ').trim().replace(/(^,\s*|,\s*$)/g, ''),
      gstin: org.orgGst || '',
      pan: org.storePan || ''
    });
  };

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
        if (Array.isArray(parsed) && parsed.length > 0) {
          setOrganizations(parsed);
          const defaultOrg = parsed[0];
          setSelectedOrgId(defaultOrg._id);
          updateBilledByFromOrg(defaultOrg);
        } else if (parsed && !Array.isArray(parsed)) {
          setOrganizations([parsed]);
          setSelectedOrgId(parsed._id || "");
          updateBilledByFromOrg(parsed);
        }
      })
      .catch(() => {
        const s = localStorage.getItem('pos_settings');
        if (s) {
          try {
            const p = JSON.parse(s);
            updateBilledByFromOrg(p);
          } catch (e) { /* ignore */ }
        }
      });
    getTermsTemplates()
      .then(data => {
        setTemplates(data);
        const defaultTpl = data.find(t => t.name === 'Brand New');
        if (defaultTpl) {
          setSelectedTemplateName('Brand New');
          const text = defaultTpl.terms.map((t, i) => `${i + 1}. ${t}`).join('\n');
          setNotes(text);
        }
      })
      .catch(err => console.error('Failed to load terms templates:', err));

    getColumnSettings('quotation')
      .then(settings => {
        if (settings && settings.columns) {
          setColumns(settings.columns);
        }
      })
      .catch(err => console.error('Failed to load columns configuration:', err));
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

  const updateCustomRowField = (rowId, colId, value) => {
    setCartItems(prev => prev.map(r =>
      r.id === rowId ? {
        ...r,
        customColumns: {
          ...r.customColumns,
          [colId]: value
        }
      } : r
    ));
  };

  const openColumnsModal = () => {
    setTempColumns(JSON.parse(JSON.stringify(columns)));
    setIsColumnsModalOpen(true);
  };

  const resetColumnsToDefault = () => {
    const defaults = [
      { id: 'item', name: 'Item', type: 'TEXT', visible: true, width: '250px' },
      { id: 'hsn', name: 'HSN/SAC', type: 'NUMBER', visible: true, width: '90px' },
      { id: 'gstRate', name: 'GST Rate', type: 'NUMBER', visible: true, width: '80px' },
      { id: 'quantity', name: 'Quantity', type: 'NUMBER', visible: true, width: '72px' },
      { id: 'rate', name: 'Rate', type: 'CURRENCY', visible: true, width: '80px' },
      { id: 'amount', name: 'Amount', type: 'CURRENCY', visible: true, width: '80px', formula: 'Quantity * Rate' },
      { id: 'cgst', name: 'CGST', type: 'CURRENCY', visible: true, width: '72px' },
      { id: 'sgst', name: 'SGST', type: 'CURRENCY', visible: true, width: '72px' },
      { id: 'total', name: 'Total', type: 'CURRENCY', visible: true, width: '80px', formula: 'Amount + CGST + SGST' }
    ];
    setTempColumns(defaults);
  };

  const handleAddNewColumn = () => {
    const id = `col_${Date.now()}`;
    const newCol = {
      id,
      name: `Custom Column ${tempColumns.length - 9}`,
      type: 'TEXT',
      visible: true,
      width: '120px'
    };
    setTempColumns([...tempColumns, newCol]);
  };

  const moveColumn = (index, direction) => {
    const newCols = [...tempColumns];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newCols.length) return;
    const temp = newCols[index];
    newCols[index] = newCols[targetIndex];
    newCols[targetIndex] = temp;
    setTempColumns(newCols);
  };

  const addRow = () => setCartItems(prev => [...prev, { id: Date.now(), product: null, qty: 1, price: 0, hsn: '', gstRate: 0, description: '', showDesc: false, customColumns: {} }]);
  const copyRow = (rowId) => setCartItems(prev => { const r = prev.find(x => x.id === rowId); return r ? [...prev, { ...r, id: Date.now(), customColumns: { ...(r.customColumns || {}) } }] : prev; });

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
        organization: selectedOrgId || null,
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
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#374151', marginBottom: '1rem' }}>
                Billed By <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 400 }}>(Your Details)</span>
              </div>
              
              {organizations.length > 0 && (
                <div style={{ position: 'relative', marginBottom: '1rem' }}>
                  <select
                    value={selectedOrgId}
                    onChange={(e) => {
                      const orgId = e.target.value;
                      if (orgId === 'ADD_NEW') {
                        navigate('/pos-settings');
                        return;
                      }
                      setSelectedOrgId(orgId);
                      const org = organizations.find(o => o._id === orgId);
                      if (org) updateBilledByFromOrg(org);
                    }}
                    style={{
                      width: '100%',
                      backgroundColor: 'white',
                      border: '1px solid #D1D5DB',
                      borderRadius: '6px',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.875rem',
                      color: '#111827',
                      outline: 'none',
                      cursor: 'pointer',
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      paddingRight: '2rem'
                    }}
                  >
                    {organizations.map(org => (
                      <option key={org._id} value={org._id}>{org.orgName}</option>
                    ))}
                    <option value="ADD_NEW" style={{ color: '#FF9F43', fontWeight: 'bold' }}>+ Add New</option>
                  </select>
                  <div style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
                    <ChevronDown size={16} style={{ color: '#9CA3AF' }} />
                  </div>
                </div>
              )}
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

          {/* Columns Config Trigger */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button 
              type="button"
              onClick={openColumnsModal}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #D1D5DB', borderRadius: '6px', padding: '0.5rem 1rem', cursor: 'pointer', backgroundColor: 'white', fontWeight: '600', color: '#4B5563', fontSize: '0.85rem' }}
            >
              <Settings size={14} color="#FF9F43" /> Edit Columns/Formulas
            </button>
          </div>

          {/* Items Table */}
          <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden', marginBottom: '1rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#FF9F43', color: 'white', fontSize: '0.78rem', fontWeight: 600 }}>
                  <th style={{ padding: '0.75rem 0.5rem 0.75rem 1rem', width: '32px' }}>#</th>
                  {columns.filter(col => col.visible).map(col => (
                    <th key={col.id} style={{ padding: '0.75rem 0.5rem', width: col.width, textAlign: (col.id === 'gstRate' || col.id === 'quantity') ? 'center' : (col.id === 'item' || col.id === 'hsn') ? 'left' : 'right' }}>
                      {col.name}
                    </th>
                  ))}
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

                        {columns.filter(col => col.visible).map(col => {
                          switch(col.id) {
                            case 'item':
                              return (
                                <td key={col.id} style={{ padding: '0.6rem 0.5rem' }}>
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
                              );
                            case 'hsn':
                              return (
                                <td key={col.id} style={{ padding: '0.6rem 0.5rem' }}>
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
                              );
                            case 'gstRate':
                              return (
                                <td key={col.id} style={{ padding: '0.6rem 0.5rem', textAlign: 'center' }}>
                                  <select className="term-list-input" value={row.gstRate} onChange={e => setRowGst(row.id, e.target.value)}
                                    style={{ border: 'none', borderBottom: '1.5px dashed #FF9F43', padding: '0.3rem 0.4rem 0.2rem', outline: 'none', fontSize: '0.8rem', color: '#374151', backgroundColor: 'transparent' }}>
                                    <option value={0}>GST 0%</option>
                                    <option value={5}>GST 5%</option>
                                    <option value={12}>GST 12%</option>
                                    <option value={18}>GST 18%</option>
                                    <option value={28}>GST 28%</option>
                                  </select>
                                </td>
                              );
                            case 'quantity':
                              return (
                                <td key={col.id} style={{ padding: '0.6rem 0.5rem', textAlign: 'center' }}>
                                  <input type="number" className="term-list-input" min="1" value={row.qty} onChange={e => setRowQty(row.id, e.target.value)}
                                    style={{ width: '52px', border: 'none', borderBottom: '1.5px dashed #FF9F43', padding: '0.3rem 0.4rem 0.2rem', outline: 'none', fontSize: '0.8rem', textAlign: 'center', backgroundColor: 'transparent' }} />
                                </td>
                              );
                            case 'rate':
                              return (
                                <td key={col.id} style={{ padding: '0.6rem 0.5rem', textAlign: 'right' }}>
                                  <input type="number" className="term-list-input" min="0" step="0.01" value={row.price} onChange={e => setRowPrice(row.id, e.target.value)}
                                    style={{ width: '68px', border: 'none', borderBottom: '1.5px dashed #FF9F43', padding: '0.3rem 0.4rem 0.2rem', outline: 'none', fontSize: '0.8rem', textAlign: 'right', backgroundColor: 'transparent' }} />
                                </td>
                              );
                            case 'amount':
                              return (
                                <td key={col.id} style={{ padding: '0.6rem 0.5rem', textAlign: 'right', color: '#374151', fontWeight: 500, fontSize: '0.8rem' }}>
                                  ₹{amount.toFixed(2)}
                                </td>
                              );
                            case 'cgst':
                              return (
                                <td key={col.id} style={{ padding: '0.6rem 0.5rem', textAlign: 'right', color: '#374151', fontSize: '0.8rem' }}>
                                  ₹{cgst.toFixed(2)}
                                </td>
                              );
                            case 'sgst':
                              return (
                                <td key={col.id} style={{ padding: '0.6rem 0.5rem', textAlign: 'right', color: '#374151', fontSize: '0.8rem' }}>
                                  ₹{sgst.toFixed(2)}
                                </td>
                              );
                            case 'total':
                              return (
                                <td key={col.id} style={{ padding: '0.6rem 1rem 0.6rem 0.5rem', textAlign: 'right', color: '#111827', fontWeight: 700, fontSize: '0.8rem' }}>
                                  ₹{total.toFixed(2)}
                                </td>
                              );
                            default:
                              return (
                                <td key={col.id} style={{ padding: '0.6rem 0.5rem' }}>
                                  <input 
                                    type={col.type === 'NUMBER' ? 'number' : 'text'} 
                                    className="term-list-input" 
                                    placeholder={col.name}
                                    value={(row.customColumns && row.customColumns[col.id]) || ''}
                                    onChange={(e) => updateCustomRowField(row.id, col.id, e.target.value)}
                                    style={{ width: '100%', border: 'none', borderBottom: '1.5px dashed #FF9F43', padding: '0.3rem 0.4rem 0.2rem', outline: 'none', fontSize: '0.8rem', backgroundColor: 'transparent' }}
                                  />
                                </td>
                              );
                          }
                        })}
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Terms &amp; Conditions</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <select
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedTemplateName(val);
                      const selectedTemplate = templates.find(t => t.name === val);
                      if (selectedTemplate) {
                        const text = selectedTemplate.terms.map((t, i) => `${i + 1}. ${t}`).join('\n');
                        setNotes(text);
                      }
                    }}
                    value={selectedTemplateName}
                    className="term-list-input"
                    style={{
                      border: 'none',
                      borderBottom: '1.5px dashed #FF9F43',
                      outline: 'none',
                      fontSize: '0.85rem',
                      color: '#111827',
                      fontWeight: 600,
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      padding: '0.25rem 0',
                      marginRight: '0.25rem'
                    }}
                  >
                    <option value="" disabled>Load Template...</option>
                    {templates.map(t => (
                      <option key={t.name} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                  <button 
                    type="button" 
                    onClick={handleSaveAsTemplate}
                    style={{
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: '#FF9F43',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      outline: 'none',
                      padding: '0.25rem 0.5rem'
                    }}
                  >
                    + Save As Template
                  </button>
                </div>
              </div>
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
      {isColumnsModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '750px',
            maxWidth: '95%',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid #F3F4F6'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#1B2850', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                Customize Columns & Formulas <span role="img" aria-label="lightbulb">💡</span>
              </h3>
              <X 
                size={20} 
                onClick={() => setIsColumnsModalOpen(false)} 
                style={{ color: '#9CA3AF', cursor: 'pointer' }} 
              />
            </div>

            {/* Instruction / Banner */}
            <style>{`
              .custom-modal-scroll {
                scrollbar-width: none;
                -ms-overflow-style: none;
              }
              .custom-modal-scroll::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            <div className="custom-modal-scroll" style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#6B7280', lineHeight: '1.4' }}>
                Create/edit columns, customize formulas, make private columns visible to you, but not to clients, make hidden columns (hidden to both you & your clients)
              </p>


              {/* Add New Column */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={handleAddNewColumn}
                  style={{
                    backgroundColor: 'white',
                    color: '#FF9F43',
                    border: '1px solid #FF9F43',
                    borderRadius: '6px',
                    padding: '0.5rem 1rem',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <Plus size={14} /> Add New Column
                </button>
              </div>

              {/* Column Table Headers */}
              <div style={{ display: 'flex', fontSize: '0.85rem', fontWeight: 600, color: '#9CA3AF', padding: '0 0.5rem 0.5rem 3.5rem', borderBottom: '1px solid #F3F4F6', marginBottom: '0.5rem' }}>
                <div style={{ flex: 1 }}>Column Name</div>
                <div style={{ width: '160px', paddingRight: '4.5rem' }}>Column Type</div>
              </div>

              {/* Columns List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                {tempColumns.map((col, idx) => (
                  <div 
                    key={col.id} 
                    draggable={col.id !== 'item'}
                    onDragStart={(e) => handleDragStart(e, idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDragEnd={handleDragEnd}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                      padding: '0.25rem 0',
                      opacity: draggedIndex === idx ? 0.4 : 1,
                      cursor: col.id === 'item' ? 'default' : 'grab',
                      transition: 'opacity 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      {/* Drag Handles */}
                      <div style={{ display: 'flex', alignItems: 'center', color: '#9CA3AF', cursor: 'grab', fontSize: '1.25rem', userSelect: 'none', width: '24px', justifyContent: 'center' }}>
                        {col.id === 'item' ? (
                          <span style={{ color: '#E5E7EB', cursor: 'default' }}></span>
                        ) : (
                          <span>⋮⋮</span>
                        )}
                      </div>

                      {/* Cell Reference Label */}
                      <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#4B5563', width: '30px' }}>
                        {String.fromCharCode(65 + idx)}1
                      </span>

                      {/* Column Name Input */}
                      <div style={{ flex: 1 }}>
                        <input 
                          type="text"
                          value={col.name}
                          onChange={(e) => {
                            const val = e.target.value;
                            setTempColumns(prev => prev.map((c, i) => i === idx ? { ...c, name: val } : c));
                          }}
                          style={{
                            width: '100%',
                            boxSizing: 'border-box',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            padding: '0.5rem 0.75rem',
                            fontSize: '0.875rem',
                            outline: 'none',
                            backgroundColor: '#FFFFFF',
                            color: '#1F2937'
                          }}
                        />
                      </div>

                      {/* Column Type Select */}
                      <div style={{ width: '160px', display: 'flex', alignItems: 'center' }}>
                        {col.id === 'amount' ? (
                          <span style={{ fontSize: '0.85rem', color: '#4B5563', whiteSpace: 'nowrap' }}>(Quantity * Rate)</span>
                        ) : col.id === 'cgst' ? (
                          <span style={{ fontSize: '0.85rem', color: '#4B5563', whiteSpace: 'nowrap' }}>(Amount * (GST/2) / 100)</span>
                        ) : col.id === 'sgst' ? (
                          <span style={{ fontSize: '0.85rem', color: '#4B5563', whiteSpace: 'nowrap' }}>(Amount * (GST/2) / 100)</span>
                        ) : col.id === 'total' ? (
                          <span style={{ fontSize: '0.85rem', color: '#4B5563', whiteSpace: 'nowrap' }}>(Amount + Tax)</span>
                        ) : col.id === 'item' ? (
                          <select
                            disabled
                            style={{
                              width: '100%',
                              border: '1px solid #E5E7EB',
                              borderRadius: '8px',
                              padding: '0.5rem 0.75rem',
                              fontSize: '0.825rem',
                              outline: 'none',
                              backgroundColor: '#FFFFFF',
                              color: '#9CA3AF',
                              textTransform: 'uppercase',
                              cursor: 'not-allowed'
                            }}
                          >
                            <option>TEXT</option>
                          </select>
                        ) : (
                          <select
                            value={col.type}
                            onChange={(e) => {
                              const val = e.target.value;
                              setTempColumns(prev => prev.map((c, i) => i === idx ? { ...c, type: val } : c));
                            }}
                            style={{
                              width: '100%',
                              border: '1px solid #E5E7EB',
                              borderRadius: '8px',
                              padding: '0.5rem 0.75rem',
                              fontSize: '0.825rem',
                              outline: 'none',
                              backgroundColor: 'white',
                              color: '#1F2937'
                            }}
                          >
                            <option value="TEXT">TEXT</option>
                            <option value="NUMBER">NUMBER</option>
                            <option value="DATE">DATE</option>
                            <option value="CURRENCY">CURRENCY</option>
                            <option value="FORMULA">FORMULA</option>
                          </select>
                        )}
                      </div>

                      {/* Action Buttons (Eye and Trash) */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {/* Eye visibility wrapper */}
                        <div style={{ width: '30px', display: 'flex', justifyContent: 'center' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setTempColumns(prev => prev.map((c, i) => i === idx ? { ...c, visible: !c.visible } : c));
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: col.visible ? '#FF9F43' : '#9CA3AF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: 0
                            }}
                          >
                            {col.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                          </button>
                        </div>

                        {/* Trash wrapper */}
                        <div style={{ width: '30px', display: 'flex', justifyContent: 'center' }}>
                          {!['item', 'hsn', 'gstRate', 'quantity', 'rate', 'cgst', 'sgst', 'total'].includes(col.id) ? (
                            <button
                              type="button"
                              onClick={() => {
                                setTempColumns(prev => prev.filter((_, i) => i !== idx));
                              }}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#EF4444',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 0
                              }}
                            >
                              <Trash2 size={16} />
                            </button>
                          ) : (
                            <div style={{ width: '16px' }} />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Formula Editor Row if type is FORMULA */}
                    {col.type === 'FORMULA' && (
                      <div style={{ display: 'flex', gap: '1rem', paddingLeft: '4.25rem', alignItems: 'center', marginRight: '4.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden', flex: 1, backgroundColor: 'white' }}>
                          <span style={{ backgroundColor: '#F3F4F6', padding: '0.5rem 0.75rem', borderRight: '1px solid #E5E7EB', fontSize: '0.85rem', fontStyle: 'italic', fontWeight: 'bold' }}>fx</span>
                          <span style={{ padding: '0.5rem 0.5rem', fontSize: '0.85rem', color: '#4B5563' }}>=</span>
                          <input 
                            type="text" 
                            placeholder="e.g. D1 * E1"
                            value={col.formulaValue || ''} 
                            onChange={e => {
                              const val = e.target.value;
                              setTempColumns(prev => prev.map((c, i) => i === idx ? { ...c, formulaValue: val } : c));
                            }} 
                            style={{ flex: 1, border: 'none', outline: 'none', padding: '0.5rem 0.75rem', fontSize: '0.85rem' }} 
                          />
                        </div>
                        <select 
                          value={col.formulaReturnType || 'NUMBER'} 
                          onChange={e => {
                            const val = e.target.value;
                            setTempColumns(prev => prev.map((c, i) => i === idx ? { ...c, formulaReturnType: val } : c));
                          }} 
                          style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '0.5rem 0.75rem', fontSize: '0.825rem', outline: 'none', backgroundColor: 'white', width: '160px', color: '#1F2937' }}
                        >
                          <option value="TEXT">TEXT</option>
                          <option value="NUMBER">NUMBER</option>
                          <option value="DATE">DATE</option>
                          <option value="CURRENCY">CURRENCY</option>
                        </select>
                      </div>
                    )}

                    {/* Checkboxes Row */}
                    {!['item', 'hsn', 'gstRate', 'quantity', 'rate', 'cgst', 'sgst', 'total'].includes(col.id) && (
                      <div style={{ display: 'flex', gap: '1.5rem', paddingLeft: '4.25rem', flexWrap: 'wrap' }}>
                        {/* Make private? */}
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#4B5563', cursor: 'pointer' }}>
                          <input 
                            type="checkbox" 
                            checked={!!col.private} 
                            onChange={(e) => {
                              const val = e.target.checked;
                              setTempColumns(prev => prev.map((c, i) => i === idx ? { ...c, private: val } : c));
                            }} 
                            style={{ accentColor: '#FF9F43' }} 
                          />
                          Make private? 
                          <span title="Private columns are only visible to you while creating this document and will not be displayed on client bills or PDFs." style={{ cursor: 'help', color: '#9CA3AF', fontSize: '0.85rem' }}>ⓘ</span>
                        </label>

                        {/* Summarise total? */}
                        {(col.type === 'NUMBER' || col.type === 'CURRENCY' || (col.type === 'FORMULA' && (col.formulaReturnType === 'NUMBER' || col.formulaReturnType === 'CURRENCY'))) && (
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#4B5563', cursor: 'pointer' }}>
                            <input 
                              type="checkbox" 
                              checked={!!col.summariseTotal} 
                              onChange={(e) => {
                                const val = e.target.checked;
                                setTempColumns(prev => prev.map((c, i) => i === idx ? { ...c, summariseTotal: val } : c));
                              }} 
                              style={{ accentColor: '#FF9F43' }} 
                            />
                            Summarise total? 
                            <span title="Check this to sum the values of this column at the bottom of the table." style={{ cursor: 'help', color: '#9CA3AF', fontSize: '0.85rem' }}>ⓘ</span>
                          </label>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>

            {/* Live Table Header Preview */}
            <div style={{ padding: '0.75rem 1.5rem', borderTop: '1px solid #F3F4F6', backgroundColor: '#FAFAFA' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9CA3AF', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Live Table Header Preview
              </div>
              <div style={{
                display: 'flex',
                backgroundColor: '#FF9F43',
                color: 'white',
                fontSize: '0.85rem',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}>
                <div style={{ padding: '0.65rem 0.75rem', fontWeight: 600, borderRight: '1px solid rgba(255,255,255,0.15)', width: '30px', textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.05)' }}>#</div>
                {tempColumns.filter(c => c.visible).map((col, cIdx) => (
                  <div key={col.id} style={{
                    padding: '0.65rem 0.75rem',
                    fontWeight: 600,
                    flex: col.id === 'item' ? 2 : 1,
                    borderRight: cIdx === tempColumns.filter(c => c.visible).length - 1 ? 'none' : '1px solid rgba(255,255,255,0.15)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    minWidth: '50px'
                  }}>
                    {col.name || 'Column'}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Actions */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '1rem 1.5rem',
              borderTop: '1px solid #F3F4F6',
              backgroundColor: '#FAFAFA',
              borderRadius: '0 0 12px 12px'
            }}>
              <div>
                <button
                  type="button"
                  onClick={() => setIsColumnsModalOpen(false)}
                  style={{
                    backgroundColor: 'white',
                    color: '#4B5563',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    padding: '0.5rem 1rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={resetColumnsToDefault}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#4B5563',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    padding: '0.5rem'
                  }}
                >
                  Reset to Default
                </button>
                <button
                  type="button"
                  onClick={() => {
                    saveColumnSettings('quotation', tempColumns)
                      .then(settings => {
                        setColumns(settings.columns);
                        setIsColumnsModalOpen(false);
                      })
                      .catch(err => {
                        console.error(err);
                        alert("Failed to save column settings to database: " + err.message);
                      });
                  }}
                  style={{
                    backgroundColor: '#FF9F43',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1.5rem',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Save Changes
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default CreateQuotation;
