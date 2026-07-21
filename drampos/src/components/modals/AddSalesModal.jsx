import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import styles from './ModalForm.module.css';
import { Search, Plus, Trash2 } from 'lucide-react';
import { getAllProducts } from '../../services/productService';
import { createSale } from '../../services/salesService';

const AddSalesModal = ({ isOpen, onClose }) => {
  const [customerName, setCustomerName] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [orderTax, setOrderTax] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [orderStatus, setOrderStatus] = useState('Completed');
  const [paymentStatus, setPaymentStatus] = useState('Paid');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      getAllProducts().then(res => {
        const prods = res.products || res.data || (Array.isArray(res) ? res : []);
        setProducts(prods);
      }).catch(console.error);
    }
  }, [isOpen]);

  const handleAddProduct = () => {
    if (!selectedProduct) return;
    const prod = products.find(p => p._id === selectedProduct);
    if (!prod) return;

    setCartItems(prev => {
      const existing = prev.find(item => item.product._id === prod._id);
      if (existing) {
        return prev.map(item => item.product._id === prod._id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { product: prod, qty: 1, price: prod.sellingPrice || prod.price || 100 }];
    });
    setSelectedProduct('');
  };

  const removeCartItem = (id) => {
    setCartItems(prev => prev.filter(item => item.product._id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const grandTotal = Math.max(0, subtotal + Number(orderTax) + Number(shipping) - Number(discount));

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
      setLoading(true);
      const payload = {
        saleType: 'Online',
        customerName: customerName,
        items: cartItems.map(ci => ({
          product: ci.product._id,
          quantity: ci.qty,
          unitPrice: ci.price,
          subtotal: ci.price * ci.qty,
          total: ci.price * ci.qty
        })),
        subtotal,
        totalTax: Number(orderTax),
        totalDiscount: Number(discount),
        shipping: Number(shipping),
        grandTotal,
        paidAmount: paymentStatus === 'Paid' ? grandTotal : 0,
        paymentStatus,
        orderStatus
      };

      const res = await createSale(payload);
      if (res.success) {
        alert(`Sale #${res.data.saleNumber} created successfully!`);
        onClose();
      }
    } catch (err) {
      alert(`Error creating sale: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Sales" maxWidth="900px">
      <form onSubmit={handleSubmit} className={styles.form}>
        <div style={{display: 'flex', gap: '1.5rem', marginBottom: '1.5rem'}}>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>
              Customer Name <span className={styles.required}>*</span>
            </label>
            <input 
              type="text" 
              className={styles.input} 
              placeholder="Customer Name" 
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </div>
          
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>
              Order Status
            </label>
            <select className={styles.select} value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)}>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>
              Payment Status
            </label>
            <select className={styles.select} value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Add Product <span className={styles.required}>*</span></label>
          <div style={{display: 'flex', gap: '0.5rem'}}>
            <select 
              className={styles.select} 
              value={selectedProduct} 
              onChange={(e) => setSelectedProduct(e.target.value)}
              style={{flex: 1}}
            >
              <option value="">-- Select Product --</option>
              {products.map(p => (
                <option key={p._id} value={p._id}>{p.name} (₹{p.sellingPrice || p.price || 100})</option>
              ))}
            </select>
            <button 
              type="button" 
              onClick={handleAddProduct}
              style={{backgroundColor: '#1B2850', color: 'white', border: 'none', borderRadius: '4px', padding: '0 1rem', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer'}}
            >
              <Plus size={16} /> Add Item
            </button>
          </div>
        </div>

        <div style={{border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.5rem', marginTop: '1rem'}}>
          <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left'}}>
            <thead>
              <tr style={{backgroundColor: '#F3F4F6', color: '#4B5563', fontSize: '0.75rem'}}>
                <th style={{padding: '0.75rem 1rem', fontWeight: 600}}>Product</th>
                <th style={{padding: '0.75rem 1rem', fontWeight: 600}}>Price</th>
                <th style={{padding: '0.75rem 1rem', fontWeight: 600}}>Qty</th>
                <th style={{padding: '0.75rem 1rem', fontWeight: 600}}>Subtotal</th>
                <th style={{padding: '0.75rem 1rem', fontWeight: 600}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{textAlign: 'center', padding: '1.5rem', color: '#9CA3AF'}}>No products added yet. Select a product above.</td>
                </tr>
              ) : (
                cartItems.map((item) => (
                  <tr key={item.product._id} style={{borderBottom: '1px solid #E5E7EB'}}>
                    <td style={{padding: '0.75rem 1rem'}}>{item.product.name}</td>
                    <td style={{padding: '0.75rem 1rem'}}>₹{item.price}</td>
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
                    <td style={{padding: '0.75rem 1rem'}}>₹{item.price * item.qty}</td>
                    <td style={{padding: '0.75rem 1rem'}}>
                      <button type="button" onClick={() => removeCartItem(item.product._id)} style={{border: 'none', background: 'none', color: '#EA5455', cursor: 'pointer'}}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem'}}>
          <div style={{width: '300px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #E5E7EB'}}>
              <span style={{color: '#4B5563', fontSize: '0.875rem'}}>Subtotal</span>
              <span style={{color: '#1B2850', fontSize: '0.875rem', fontWeight: 500}}>₹{subtotal}</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #E5E7EB'}}>
              <span style={{color: '#4B5563', fontSize: '0.875rem'}}>Grand Total</span>
              <span style={{color: '#1B2850', fontSize: '0.875rem', fontWeight: 700}}>₹{grandTotal}</span>
            </div>
          </div>
        </div>

        <div className={styles.footerActions}>
          <button type="button" className={styles.btnCancel} onClick={onClose}>Cancel</button>
          <button type="submit" className={styles.btnSubmit} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Sale'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddSalesModal;
