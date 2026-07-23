import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import styles from './ProductList.module.css';
import modalStyles from '../components/modals/ModalForm.module.css';
import { Search, RefreshCw, Eye, PlusCircle, Trash2, Printer } from 'lucide-react';
import { getAllProducts } from '../services/productService';
import { API_BASE_URL } from '../api/endpoints';

const DeliveryChallanList = () => {
  const [challans, setChallans] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Add Modal State
  const [isOpen, setIsOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [status, setStatus] = useState('Draft');
  const [notes, setNotes] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  
  // Details Modal State
  const [selectedChallan, setSelectedChallan] = useState(null);

  const fetchChallans = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/delivery-challans`);
      const data = await res.json();
      if (data.success) {
        setChallans(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch challans:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallans();
    getAllProducts().then(res => {
      const prods = res.products || res.data || (Array.isArray(res) ? res : []);
      setProducts(prods);
    }).catch(console.error);
  }, []);

  const handleAddProduct = () => {
    if (!selectedProduct) return;
    const prod = products.find(p => p._id === selectedProduct);
    if (!prod) return;

    setCartItems(prev => {
      const existing = prev.find(item => item.product._id === prod._id);
      if (existing) {
        return prev.map(item => item.product._id === prod._id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { product: prod, qty: 1, unit: 'pcs' }];
    });
    setSelectedProduct('');
  };

  const removeCartItem = (id) => {
    setCartItems(prev => prev.filter(item => item.product._id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName) {
      alert('Please enter Customer Name');
      return;
    }
    if (cartItems.length === 0) {
      alert('Please select at least one product');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        customerName,
        customerEmail,
        customerPhone,
        status,
        notes,
        items: cartItems.map(ci => ({
          product: ci.product._id,
          quantity: ci.qty,
          unit: ci.unit
        }))
      };

      const res = await fetch(`${API_BASE_URL}/delivery-challans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        alert(`Delivery Challan #${data.data.challanNumber} created successfully!`);
        setIsOpen(false);
        setCustomerName('');
        setCustomerEmail('');
        setCustomerPhone('');
        setNotes('');
        setCartItems([]);
        fetchChallans();
      } else {
        alert(data.message || 'Failed to create Delivery Challan');
      }
    } catch (err) {
      alert(`Error creating Delivery Challan: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const updateChallanStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/delivery-challans/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        alert('Status updated successfully!');
        if (selectedChallan && selectedChallan._id === id) {
          setSelectedChallan({ ...selectedChallan, status: newStatus });
        }
        fetchChallans();
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return <span style={{backgroundColor: '#E8F9EE', color: '#28C76F', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600}}><span style={{width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#28C76F'}}></span> {status}</span>;
      case 'Dispatched':
        return <span style={{backgroundColor: '#FFF1E6', color: '#FF9F43', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600}}><span style={{width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FF9F43'}}></span> {status}</span>;
      case 'Draft':
      default:
        return <span style={{backgroundColor: '#F3F4F6', color: '#6B7280', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600}}><span style={{width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#9CA3AF'}}></span> {status}</span>;
    }
  };

  const filteredChallans = challans.filter(ch =>
    (ch.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (ch.challanNumber || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Delivery Challans</h1>
          <p className={styles.subtitle}>Manage dispatch & delivery documents</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} onClick={fetchChallans}><RefreshCw size={18} /></button>
          <button className={styles.btnPrimary} onClick={() => setIsOpen(true)}>
            <PlusCircle size={18} /> Add Challan
          </button>
        </div>
      </div>

      <Card className={styles.tableCard}>
        <div className={styles.filterBar}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search Challan No or Customer" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.tableResponsive}>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>Challan No</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items Count</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>Loading Delivery Challans...</td>
                </tr>
              ) : filteredChallans.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>No delivery challan records found</td>
                </tr>
              ) : (
                filteredChallans.map((item, i) => (
                  <tr key={item._id || i}>
                    <td><input type="checkbox" /></td>
                    <td>{item.challanNumber}</td>
                    <td>
                      <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                        <div style={{width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '12px'}}>
                          {(item.customerName || 'C')[0].toUpperCase()}
                        </div>
                        <span style={{fontSize: '0.875rem', color: '#1B2850', fontWeight: 500}}>{item.customerName}</span>
                      </div>
                    </td>
                    <td>{new Date(item.challanDate).toLocaleDateString()}</td>
                    <td>{item.items?.length || 0} items</td>
                    <td>{getStatusBadge(item.status)}</td>
                    <td>
                      <button 
                        style={{border: 'none', background: 'none', cursor: 'pointer', color: '#6B7280', display: 'inline-flex', alignItems: 'center'}}
                        onClick={() => setSelectedChallan(item)}
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Challan Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add Delivery Challan" maxWidth="900px">
        <form onSubmit={handleSubmit} className={modalStyles.form}>
          <div style={{display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap'}}>
            <div style={{flex: 1.2, minWidth: '200px'}}>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Customer Name *</label>
              <input type="text" className={modalStyles.input} placeholder="Customer Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
            </div>
            <div style={{flex: 1, minWidth: '150px'}}>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Phone</label>
              <input type="text" className={modalStyles.input} placeholder="Phone" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
            </div>
            <div style={{flex: 1, minWidth: '150px'}}>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>Status</label>
              <select className={modalStyles.select} value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Draft">Draft</option>
                <option value="Dispatched">Dispatched</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>

          <div className={modalStyles.formGroup}>
            <label>Add Item *</label>
            <div style={{display: 'flex', gap: '0.5rem'}}>
              <select className={modalStyles.select} value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} style={{flex: 1}}>
                <option value="">-- Select Product --</option>
                {products.map(p => (
                  <option key={p._id} value={p._id}>{p.name} ({p.code || 'No Code'})</option>
                ))}
              </select>
              <button type="button" onClick={handleAddProduct} style={{backgroundColor: '#1B2850', color: 'white', border: 'none', borderRadius: '4px', padding: '0 1rem', cursor: 'pointer'}}>Add</button>
            </div>
          </div>

          <div style={{border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.5rem', marginTop: '1rem'}}>
            <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left'}}>
              <thead>
                <tr style={{backgroundColor: '#F3F4F6', color: '#4B5563', fontSize: '0.75rem'}}>
                  <th style={{padding: '0.75rem 1rem'}}>Product</th>
                  <th style={{padding: '0.75rem 1rem'}}>Qty</th>
                  <th style={{padding: '0.75rem 1rem'}}>Unit</th>
                  <th style={{padding: '0.75rem 1rem'}}>Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{textAlign: 'center', padding: '1.5rem', color: '#9CA3AF'}}>No products added yet.</td>
                  </tr>
                ) : (
                  cartItems.map((item) => (
                    <tr key={item.product._id} style={{borderBottom: '1px solid #E5E7EB'}}>
                      <td style={{padding: '0.75rem 1rem'}}>{item.product.name}</td>
                      <td style={{padding: '0.75rem 1rem'}}>
                        <input 
                          type="number" 
                          min="1" 
                          value={item.qty} 
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 1;
                            setCartItems(cartItems.map(ci => ci.product._id === item.product._id ? { ...ci, qty: val } : ci));
                          }}
                          style={{width: '60px', padding: '0.25rem', borderRadius: '4px', border: '1px solid #D1D5DB'}}
                        />
                      </td>
                      <td style={{padding: '0.75rem 1rem'}}>
                        <input 
                          type="text" 
                          value={item.unit} 
                          onChange={(e) => {
                            setCartItems(cartItems.map(ci => ci.product._id === item.product._id ? { ...ci, unit: e.target.value } : ci));
                          }}
                          style={{width: '60px', padding: '0.25rem', borderRadius: '4px', border: '1px solid #D1D5DB'}}
                        />
                      </td>
                      <td style={{padding: '0.75rem 1rem'}}>
                        <button type="button" onClick={() => removeCartItem(item.product._id)} style={{border: 'none', background: 'none', color: '#EA5455', cursor: 'pointer'}}><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className={modalStyles.formGroup}>
            <label>Notes / Delivery Remarks</label>
            <textarea className={modalStyles.textarea} value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Add special instructions or delivery details..." />
          </div>

          <div className={modalStyles.footerActions}>
            <button type="button" className={modalStyles.btnCancel} onClick={() => setIsOpen(false)}>Cancel</button>
            <button type="submit" className={modalStyles.btnSubmit} disabled={submitting}>{submitting ? 'Creating...' : 'Create Challan'}</button>
          </div>
        </form>
      </Modal>

      {/* Details / View Modal */}
      {selectedChallan && (
        <Modal isOpen={!!selectedChallan} onClose={() => setSelectedChallan(null)} title="Delivery Challan Details" maxWidth="800px">
          <div style={{padding: '1.5rem'}} id="challan-print-area">
            <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #F3F4F6', paddingBottom: '1rem', marginBottom: '1.5rem'}}>
              <div>
                <h2 style={{color: '#1B2850', margin: 0}}>{selectedChallan.challanNumber}</h2>
                <p style={{fontSize: '0.875rem', color: '#6B7280', margin: '4px 0 0 0'}}>Date: {new Date(selectedChallan.challanDate).toLocaleDateString()}</p>
              </div>
              <div style={{textAlign: 'right'}}>
                <h3 style={{margin: 0, color: '#FF9F43'}}>DELIVERY CHALLAN</h3>
                <div style={{marginTop: '0.5rem'}}>{getStatusBadge(selectedChallan.status)}</div>
              </div>
            </div>

            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap'}}>
              <div>
                <p style={{fontSize: '0.75rem', textTransform: 'uppercase', color: '#9CA3AF', margin: '0 0 4px 0', fontWeight: 600}}>Consignee (Customer)</p>
                <p style={{fontWeight: 600, color: '#1B2850', margin: '0 0 4px 0'}}>{selectedChallan.customerName}</p>
                {selectedChallan.customerPhone && <p style={{fontSize: '0.875rem', color: '#6B7280', margin: 0}}>Phone: {selectedChallan.customerPhone}</p>}
                {selectedChallan.customerEmail && <p style={{fontSize: '0.875rem', color: '#6B7280', margin: 0}}>Email: {selectedChallan.customerEmail}</p>}
              </div>
            </div>

            <div style={{border: '1px solid #E5E7EB', borderRadius: '6px', overflow: 'hidden', marginBottom: '1.5rem'}}>
              <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left'}}>
                <thead>
                  <tr style={{backgroundColor: '#F9FAFB', color: '#4B5563', fontSize: '0.875rem'}}>
                    <th style={{padding: '0.75rem 1rem'}}>Item Description</th>
                    <th style={{padding: '0.75rem 1rem', textAlign: 'right'}}>Quantity</th>
                    <th style={{padding: '0.75rem 1rem'}}>Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedChallan.items?.map((item, idx) => (
                    <tr key={idx} style={{borderTop: '1px solid #E5E7EB'}}>
                      <td style={{padding: '0.75rem 1rem', color: '#1B2850', fontWeight: 500}}>{item.product?.name || 'Product'}</td>
                      <td style={{padding: '0.75rem 1rem', textAlign: 'right', color: '#4B5563'}}>{item.quantity}</td>
                      <td style={{padding: '0.75rem 1rem', color: '#6B7280'}}>{item.unit || 'pcs'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedChallan.notes && (
              <div style={{backgroundColor: '#F9FAFB', padding: '1rem', borderRadius: '6px', border: '1px solid #E5E7EB', marginBottom: '1.5rem'}}>
                <p style={{fontSize: '0.75rem', textTransform: 'uppercase', color: '#9CA3AF', margin: '0 0 4px 0', fontWeight: 600}}>Delivery Instructions / Notes</p>
                <p style={{fontSize: '0.875rem', color: '#4B5563', margin: 0}}>{selectedChallan.notes}</p>
              </div>
            )}

            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #F3F4F6'}}>
              <div style={{textAlign: 'center', width: '200px'}}>
                <div style={{borderBottom: '1px solid #D1D5DB', height: '40px'}}></div>
                <p style={{fontSize: '0.75rem', color: '#6B7280', marginTop: '0.5rem'}}>Receiver's Signature</p>
              </div>
              <div style={{textAlign: 'center', width: '200px'}}>
                <div style={{borderBottom: '1px solid #D1D5DB', height: '40px'}}></div>
                <p style={{fontSize: '0.75rem', color: '#6B7280', marginTop: '0.5rem'}}>Authorized Signatory</p>
              </div>
            </div>
          </div>

          <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', padding: '0 1.5rem 1.5rem 1.5rem'}}>
            {selectedChallan.status !== 'Delivered' && (
              <button 
                onClick={() => updateChallanStatus(selectedChallan._id, selectedChallan.status === 'Draft' ? 'Dispatched' : 'Delivered')}
                style={{backgroundColor: '#28C76F', color: 'white', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: 500}}
              >
                Mark as {selectedChallan.status === 'Draft' ? 'Dispatched' : 'Delivered'}
              </button>
            )}
            <button 
              onClick={handlePrint} 
              style={{backgroundColor: '#FF9F43', color: 'white', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500}}
            >
              <Printer size={16} /> Print Challan
            </button>
            <button 
              onClick={() => setSelectedChallan(null)} 
              style={{border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: 'white', padding: '0.5rem 1rem', cursor: 'pointer'}}
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
};

export default DeliveryChallanList;
