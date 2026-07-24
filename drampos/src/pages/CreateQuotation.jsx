import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import formStyles from '../components/modals/ModalForm.module.css';
import { Plus, Trash2, ArrowLeft, Save, Search, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { getAllProducts } from '../services/productService';
import { createQuotation, getQuotations } from '../services/salesService';
import { getCustomers } from '../services/customerService';
import AddCustomerModal from '../components/modals/AddCustomerModal';

const CreateQuotation = () => {
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [placeOfSupply, setPlaceOfSupply] = useState('');
  const [clientPoNumber, setClientPoNumber] = useState('');
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Dropdown states
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerToEdit, setCustomerToEdit] = useState(null);
  const [nextQuotationNumber, setNextQuotationNumber] = useState('');

  const [quotationDate, setQuotationDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [terms, setTerms] = useState('Due on Receipt');
  const [validUntil, setValidUntil] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [notes, setNotes] = useState(
    "1. All quotations are valid for 30 days unless otherwise specified.\n" +
    "2. Acceptance of this quotation constitutes agreement to the outlined services and terms.\n" +
    "3. Any additional requirements requested after quotation acceptance will be subject to revised costing."
  );

  useEffect(() => {
    getQuotations().then(data => {
      if (data.success) {
        const count = data.data.length;
        setNextQuotationNumber(`QT-${String(count + 1).padStart(4, '0')}`);
      }
    }).catch(console.error);

    getAllProducts().then(res => {
      const prods = res.products || res.data || (Array.isArray(res) ? res : []);
      setProducts(prods);
    }).catch(console.error);

    getCustomers().then(data => {
      if (data.success) setCustomers(data.data);
    }).catch(console.error);

    // Outside click to close dropdown
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.customer-select-container')) {
        setShowCustomerDropdown(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  useEffect(() => {
    if (!quotationDate) return;
    const date = new Date(quotationDate);
    if (isNaN(date.getTime())) return;

    let daysToAdd = 0;
    if (terms === 'Net 15') daysToAdd = 15;
    else if (terms === 'Net 30') daysToAdd = 30;
    else if (terms === 'Net 45') daysToAdd = 45;
    else if (terms === 'Net 60') daysToAdd = 60;

    date.setDate(date.getDate() + daysToAdd);
    setValidUntil(date.toISOString().split('T')[0]);
  }, [quotationDate, terms]);

  const handleAddProduct = (productId) => {
    if (!productId) return;
    const prod = products.find(p => p._id === productId);
    if (!prod) return;

    const existing = cartItems.find(item => item.product._id === prod._id);
    if (existing) {
      setCartItems(cartItems.map(item => 
        item.product._id === prod._id ? { ...item, qty: item.qty + 1 } : item
      ));
    } else {
      setCartItems([...cartItems, { 
        product: prod, 
        qty: 1, 
        price: prod.sellingPrice || prod.price || 100 
      }]);
    }
  };

  const handleQuantityChange = (productId, qty) => {
    if (qty <= 0) return;
    setCartItems(cartItems.map(item => 
      item.product._id === productId ? { ...item, qty: Number(qty) } : item
    ));
  };

  const handlePriceChange = (productId, price) => {
    if (price < 0) return;
    setCartItems(cartItems.map(item => 
      item.product._id === productId ? { ...item, price: Number(price) } : item
    ));
  };

  const handleRemoveItem = (productId) => {
    setCartItems(cartItems.filter(item => item.product._id !== productId));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const grandTotal = subtotal;

  const filteredCustomers = customers.filter(c => {
    const fullName = `${c.firstName || ''} ${c.lastName || ''}`.toLowerCase();
    const dispName = (c.displayName || '').toLowerCase();
    const email = (c.email || '').toLowerCase();
    const phone = (c.phone || '').toLowerCase();
    return fullName.includes(customerSearchTerm.toLowerCase()) || 
           dispName.includes(customerSearchTerm.toLowerCase()) || 
           email.includes(customerSearchTerm.toLowerCase()) || 
           phone.includes(customerSearchTerm.toLowerCase());
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName) {
      alert('Please select or add a customer');
      return;
    }
    if (cartItems.length === 0) {
      alert('Please select at least one product');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        customerName: customerName,
        customerEmail: customerEmail,
        customerPhone: customerPhone,
        gstNumber: gstNumber,
        placeOfSupply: placeOfSupply,
        clientPoNumber: clientPoNumber,
        items: cartItems.map(ci => ({
          product: ci.product._id,
          quantity: ci.qty,
          unitPrice: ci.price,
          subtotal: ci.price * ci.qty
        })),
        subtotal,
        grandTotal,
        status: 'Sent',
        notes: notes,
        quotationDate: quotationDate,
        validUntil: validUntil
      };

      const res = await createQuotation(payload);
      if (res.success) {
        alert(`Quotation created successfully!`);
        navigate('/quotation');
      }
    } catch (err) {
      alert(`Error creating quotation: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div>
            <h1 className={styles.title}>Create Quotation</h1>
            <p className={styles.subtitle}>Enter quotation details and line items</p>
          </div>
          {nextQuotationNumber && (
            <div style={{ backgroundColor: '#FFF0E0', border: '1.5px solid #FF9F43', color: '#FF9F43', padding: '0.4rem 0.85rem', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 600, marginTop: '-0.5rem' }}>
              Quotation No: {nextQuotationNumber}
            </div>
          )}
        </div>
        <div className={styles.headerActions}>
          <button 
            className={styles.btnPrimary} 
            style={{ backgroundColor: '#6B7280' }} 
            onClick={() => navigate('/quotation')}
          >
            <ArrowLeft size={18} /> Back
          </button>
        </div>
      </div>

      <Card style={{ padding: '2rem' }}>
        <form onSubmit={handleSubmit}>
          {/* Customer Selection & PO Number Row */}
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center', maxWidth: '900px' }}>
            {/* Customer Select Input */}
            <div className="customer-select-container" style={{ display: 'flex', flex: 2, alignItems: 'center', gap: '1rem', position: 'relative', minWidth: '320px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: 600, color: '#FF9F43', whiteSpace: 'nowrap', margin: 0 }}>
                Customer Name <span style={{ color: '#EA5455' }}>*</span>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FF9F43' }}></span>
              </label>
              <div style={{ display: 'flex', flex: 1, borderRadius: '6px', overflow: 'hidden', border: showCustomerDropdown ? '1.5px solid #FF9F43' : '1.5px solid #D1D5DB', backgroundColor: 'white', position: 'relative', alignItems: 'stretch' }}>
                <div 
                  onClick={() => setShowCustomerDropdown(!showCustomerDropdown)}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0.6rem 2.5rem 0.6rem 0.75rem', fontSize: '0.875rem', color: customerName ? '#374151' : '#9CA3AF', cursor: 'pointer', minWidth: 0, userSelect: 'none' }}
                >
                  {customerName || "Select or add a customer"}
                </div>
                <div 
                  onClick={() => setShowCustomerDropdown(!showCustomerDropdown)}
                  style={{ position: 'absolute', right: '48px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', display: 'flex', alignItems: 'center', color: showCustomerDropdown ? '#FF9F43' : '#D1D5DB' }}
                >
                  {showCustomerDropdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
                <button 
                  type="button" 
                  onClick={() => setShowCustomerDropdown(!showCustomerDropdown)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', backgroundColor: showCustomerDropdown ? '#FF9F43' : '#D1D5DB', border: 'none', color: 'white', cursor: 'pointer' }}
                >
                  <Search size={16} />
                </button>
              </div>

              {showCustomerDropdown && (
                <div style={{ position: 'absolute', top: '100%', left: '140px', right: 0, zIndex: 1000, backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', marginTop: '4px', padding: '0.75rem' }}>
                  {/* Internal Dropdown Search */}
                  <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
                    <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                    <input
                      type="search"
                      placeholder="Search"
                      value={customerSearchTerm}
                      onChange={(e) => setCustomerSearchTerm(e.target.value)}
                      style={{ width: '100%', padding: '0.5rem 0.75rem 0.5rem 2.2rem', borderRadius: '6px', border: '1.5px solid #FF9F43', outline: 'none', fontSize: '0.875rem', height: '36px', boxSizing: 'border-box' }}
                    />
                  </div>

                  {/* Customer List */}
                  <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
                    {filteredCustomers.length === 0 ? (
                      <div style={{ padding: '0.75rem', color: '#9CA3AF', fontSize: '0.875rem', textAlign: 'center' }}>No customers found</div>
                    ) : (
                      filteredCustomers.map((c) => {
                        const fullName = c.displayName || `${c.firstName || ''} ${c.lastName || ''}`.trim() || 'Unnamed Customer';
                        const initials = fullName.charAt(0).toUpperCase();
                        const isSelected = customerName === fullName;

                        return (
                          <div
                            key={c._id}
                            onClick={() => {
                              setCustomerName(fullName);
                              setCustomerEmail(c.email || '');
                              setCustomerPhone(c.phone || '');
                              setGstNumber(c.gstNumber || '');
                              setPlaceOfSupply(c.placeOfSupply || '');
                              setSelectedCustomer(c);
                              setShowCustomerDropdown(false);
                              setCustomerSearchTerm('');
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '0.6rem 0.75rem',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              backgroundColor: isSelected ? '#FF9F43' : 'transparent',
                              color: isSelected ? 'white' : '#374151',
                              marginBottom: '0.25rem',
                              transition: 'all 0.15s'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : '#E5E7EB',
                                color: isSelected ? 'white' : '#4B5563',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 600,
                                fontSize: '0.875rem'
                              }}>
                                {initials}
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{fullName}</span>
                                <span style={{ fontSize: '0.75rem', color: isSelected ? 'rgba(255,255,255,0.8)' : '#9CA3AF' }}>
                                  {c.email ? `${c.email} | ` : ''}{c.phone || ''}
                                </span>
                              </div>
                            </div>
                            {isSelected && <Check size={16} />}
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Add New Customer Option at Bottom */}
                  <div 
                    onClick={() => {
                      setCustomerToEdit(null);
                      setIsCustomerModalOpen(true);
                      setShowCustomerDropdown(false);
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 0.5rem 0.25rem 0.5rem', color: '#FF9F43', fontWeight: 600, fontSize: '0.875rem', borderTop: '1px solid #E5E7EB', cursor: 'pointer', marginTop: '0.5rem' }}
                  >
                    <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>+</span> New Customer
                  </div>
                </div>
              )}
            </div>

            {/* Client PO Number Input */}
            <div style={{ display: 'flex', flex: 1, alignItems: 'center', gap: '1rem', minWidth: '220px' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#FF9F43', whiteSpace: 'nowrap', margin: 0 }}>Client PO No.</label>
              <input 
                type="text" 
                placeholder="Enter PO Number"
                value={clientPoNumber}
                onChange={(e) => setClientPoNumber(e.target.value)}
                style={{ flex: 1, padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1.5px solid #D1D5DB', outline: 'none', fontSize: '0.875rem', color: '#374151' }}
              />
            </div>
          </div>

          {/* Quotation Date, Terms, and Valid Until Row */}
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center', maxWidth: '900px' }}>
            {/* Quotation Date */}
            <div style={{ display: 'flex', flex: 1, alignItems: 'center', gap: '1rem', minWidth: '220px' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#FF9F43', whiteSpace: 'nowrap', margin: 0 }}>Quotation Date <span style={{ color: '#EA5455' }}>*</span></label>
              <input 
                type="date" 
                value={quotationDate}
                onChange={(e) => setQuotationDate(e.target.value)}
                required
                style={{ flex: 1, padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1.5px solid #D1D5DB', outline: 'none', fontSize: '0.875rem', color: '#374151' }}
              />
            </div>

            {/* Terms */}
            <div style={{ display: 'flex', flex: 1, alignItems: 'center', gap: '1rem', minWidth: '220px' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#4B5563', whiteSpace: 'nowrap', margin: 0 }}>Terms</label>
              <select 
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                style={{ flex: 1, padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1.5px solid #D1D5DB', outline: 'none', fontSize: '0.875rem', color: '#374151', backgroundColor: 'white' }}
              >
                <option value="Due on Receipt">Due on Receipt</option>
                <option value="Net 15">Net 15</option>
                <option value="Net 30">Net 30</option>
                <option value="Net 45">Net 45</option>
                <option value="Net 60">Net 60</option>
              </select>
            </div>

            {/* Valid Until Date */}
            <div style={{ display: 'flex', flex: 1, alignItems: 'center', gap: '1rem', minWidth: '220px' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#4B5563', whiteSpace: 'nowrap', margin: 0 }}>Valid Until</label>
              <input 
                type="date" 
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                style={{ flex: 1, padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1.5px solid #D1D5DB', outline: 'none', fontSize: '0.875rem', color: '#374151' }}
              />
            </div>
          </div>

          {/* Dynamic Customer Details Address Card */}
          {selectedCustomer && (
            <div style={{ display: 'flex', gap: '2rem', padding: '1.5rem', border: '1px solid #E5E7EB', borderRadius: '8px', backgroundColor: '#F9FAFB', marginBottom: '1.5rem', position: 'relative' }}>
              {/* Billing Address column */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4B5563', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                  BILLING ADDRESS
                  <span 
                    onClick={() => {
                      setCustomerToEdit(selectedCustomer);
                      setIsCustomerModalOpen(true);
                    }}
                    style={{ cursor: 'pointer', color: '#FF9F43', fontSize: '1rem', fontWeight: 'bold' }}
                  >
                    ✎
                  </span>
                </div>
                <div style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: '1.6' }}>
                  <strong style={{ display: 'block', fontSize: '0.95rem', color: '#1B2850', marginBottom: '0.25rem' }}>
                    {selectedCustomer.companyName || `${selectedCustomer.firstName || ''} ${selectedCustomer.lastName || ''}`.trim()}
                  </strong>
                  <div>{selectedCustomer.address || 'No address specified'}</div>
                  {(selectedCustomer.city || selectedCustomer.state || selectedCustomer.postalCode) && (
                    <div>
                      {[selectedCustomer.city, selectedCustomer.state, selectedCustomer.postalCode].filter(Boolean).join(', ')}
                    </div>
                  )}
                  {selectedCustomer.country && <div>{selectedCustomer.country}</div>}
                </div>
              </div>

              {/* GST & Place of Supply details */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', borderLeft: '1px solid #E5E7EB', paddingLeft: '2rem' }}>
                <div>
                  <span style={{ color: '#6B7280', fontSize: '0.875rem' }}>GST Treatment: </span>
                  <strong style={{ color: '#1B2850', fontSize: '0.875rem' }}>
                    {selectedCustomer.gstNumber ? 'Registered Business - Regular' : 'Consumer'}
                  </strong>
                  <span 
                    onClick={() => {
                      setCustomerToEdit(selectedCustomer);
                      setIsCustomerModalOpen(true);
                    }}
                    style={{ cursor: 'pointer', color: '#FF9F43', marginLeft: '0.5rem', fontSize: '1rem', fontWeight: 'bold' }}
                  >
                    ✎
                  </span>
                </div>
                {selectedCustomer.gstNumber && (
                  <div>
                    <span style={{ color: '#6B7280', fontSize: '0.875rem' }}>GSTIN: </span>
                    <strong style={{ color: '#1B2850', fontSize: '0.875rem' }}>
                      {selectedCustomer.gstNumber}
                    </strong>
                    <span 
                      onClick={() => {
                        setCustomerToEdit(selectedCustomer);
                        setIsCustomerModalOpen(true);
                      }}
                      style={{ cursor: 'pointer', color: '#FF9F43', marginLeft: '0.5rem', fontSize: '1rem', fontWeight: 'bold' }}
                    >
                      ✎
                    </span>
                  </div>
                )}
                {selectedCustomer.placeOfSupply && (
                  <div>
                    <span style={{ color: '#6B7280', fontSize: '0.875rem' }}>Place of Supply: </span>
                    <strong style={{ color: '#1B2850', fontSize: '0.875rem' }}>{selectedCustomer.placeOfSupply}</strong>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Items Table */}
          <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.5rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#F3F4F6', color: '#4B5563', fontSize: '0.875rem' }}>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>ITEM DETAILS</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600, width: '120px' }}>QUANTITY</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600, width: '150px' }}>RATE (₹)</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600, width: '150px' }}>AMOUNT (₹)</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600, width: '80px', textAlign: 'center' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.product._id} style={{ borderBottom: '1px solid #E5E7EB', fontSize: '0.875rem', color: '#374151' }}>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{ fontWeight: 500, color: '#1B2850' }}>{item.product.name}</span>
                      <small style={{ display: 'block', color: '#9CA3AF', fontSize: '0.75rem' }}>SKU: {item.product.sku || 'N/A'}</small>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <input 
                        type="number" 
                        min="1" 
                        value={item.qty} 
                        onChange={e => handleQuantityChange(item.product._id, e.target.value)} 
                        className={formStyles.input}
                        style={{ width: '80px', margin: 0, padding: '0.35rem 0.5rem', fontSize: '0.875rem' }}
                      />
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <input 
                        type="number" 
                        min="0" 
                        step="0.01" 
                        value={item.price} 
                        onChange={e => handlePriceChange(item.product._id, e.target.value)} 
                        className={formStyles.input}
                        style={{ width: '110px', margin: 0, padding: '0.35rem 0.5rem', fontSize: '0.875rem' }}
                      />
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 500, color: '#1B2850' }}>₹{(item.price * item.qty).toFixed(2)}</td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveItem(item.product._id)} 
                        style={{ background: 'none', border: 'none', color: '#EA5455', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}

                {/* Add Item Trigger Selector row inside table body */}
                <tr style={{ backgroundColor: '#F9FAFB' }}>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <select 
                      className={formStyles.select} 
                      style={{ margin: 0, padding: '0.5rem', width: '100%', border: '1px dashed #D1D5DB' }}
                      value="" 
                      onChange={(e) => handleAddProduct(e.target.value)}
                    >
                      <option value="">Type or click to select an item...</option>
                      {products.map(p => (
                        <option key={p._id} value={p._id}>{p.name} (₹{p.sellingPrice || p.price || 100})</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: '#9CA3AF' }}>1.00</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#9CA3AF' }}>0.00</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#9CA3AF' }}>₹0.00</td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center', color: '#9CA3AF' }}>-</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pricing Summary & Terms Columns */}
          <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'stretch' }}>
            
            {/* Left Column: Terms & Conditions */}
            <div style={{ flex: 1.2, minWidth: '320px', display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#FF9F43', marginBottom: '0.5rem' }}>Terms & Conditions</label>
              <textarea 
                rows={10}
                placeholder="Enter Terms & Conditions"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '6px', border: '1.5px solid #D1D5DB', outline: 'none', fontSize: '0.875rem', color: '#374151', resize: 'vertical', fontFamily: 'inherit', lineHeight: '1.6', flex: 1 }}
              />
            </div>

            {/* Right Column: Pricing Summary Card */}
            <div style={{ flex: 1, minWidth: '320px', maxWidth: '540px', backgroundColor: '#F9FAFB', padding: '1.5rem', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
              
              {/* Subtotal */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0', borderBottom: '1px solid #E5E7EB' }}>
                <span style={{ color: '#4B5563', fontSize: '0.875rem', fontWeight: 500 }}>Subtotal</span>
                <span style={{ color: '#1B2850', fontSize: '0.875rem', fontWeight: 600 }}>₹{subtotal.toFixed(2)}</span>
              </div>

              {/* Grand Total */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', margin: '0.5rem -1.5rem 0 -1.5rem', backgroundColor: '#EAECEF', fontWeight: 'bold' }}>
                <span style={{ color: '#1F2937', fontSize: '0.95rem' }}>Grand Total</span>
                <span style={{ color: '#1B2850', fontSize: '1.125rem' }}>₹{grandTotal.toFixed(2)}</span>
              </div>

            </div>
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid #E5E7EB', paddingTop: '1.5rem' }}>
            <button 
              type="button" 
              className={formStyles.btnCancel} 
              style={{ backgroundColor: '#6B7280' }}
              onClick={() => navigate('/quotation')}
            >
              Cancel
            </button>
            <button type="submit" className={formStyles.btnSubmit} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Save size={18} /> {loading ? 'Saving...' : 'Save Quotation'}
            </button>
          </div>
        </form>
      </Card>
      {/* AddCustomerModal */}
      <AddCustomerModal 
        isOpen={isCustomerModalOpen} 
        onClose={() => setIsCustomerModalOpen(false)} 
        customerToEdit={customerToEdit}
        onSuccess={() => {
          getCustomers().then(data => {
            if (data.success) {
              setCustomers(data.data);
              const sorted = [...data.data].sort((a, b) => b._id.localeCompare(a._id));
              const latest = customerToEdit 
                ? data.data.find(c => c._id === customerToEdit._id) 
                : sorted[0];
              if (latest) {
                const fullName = latest.displayName || `${latest.firstName || ''} ${latest.lastName || ''}`.trim() || 'Unnamed Customer';
                setCustomerName(fullName);
                setCustomerEmail(latest.email || '');
                setCustomerPhone(latest.phone || '');
                setGstNumber(latest.gstNumber || '');
                setPlaceOfSupply(latest.placeOfSupply || '');
                setSelectedCustomer(latest);
              }
            }
          }).catch(console.error);
        }}
      />
    </DashboardLayout>
  );
};

export default CreateQuotation;
