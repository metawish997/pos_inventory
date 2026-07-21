import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './POS.module.css';
import { 
  Search, Maximize, Minimize, Printer, RefreshCw, Box, Settings, User, 
  Minus, Plus, Trash2, Edit, Calculator, TrendingUp, LogOut, FileText
} from 'lucide-react';
import HoldOrderModal from '../components/modals/HoldOrderModal';
import POSDiscountModal from '../components/modals/POSDiscountModal';
import POSCreateCustomerModal from '../components/modals/POSCreateCustomerModal';
import POSCashRegisterModal from '../components/modals/POSCashRegisterModal';
import POSCalculatorModal from '../components/modals/POSCalculatorModal';
import POSTodaysSaleModal from '../components/modals/POSTodaysSaleModal';
import POSTodaysProfitModal from '../components/modals/POSTodaysProfitModal';
import { getAllProducts } from '../services/productService';
import { createSale } from '../services/salesService';
import { getCategories } from '../services/inventoryService';

const POS = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [categories, setCategories] = useState(['All Categories']);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [availablePaymentMethods, setAvailablePaymentMethods] = useState(['Cash', 'Card', 'UPI', 'Bank Transfer']);

  const [isHoldOpen, setIsHoldOpen] = useState(false);
  const [isDiscountOpen, setIsDiscountOpen] = useState(false);
  const [isCustomerOpen, setIsCustomerOpen] = useState(false);
  const [isCashRegisterOpen, setIsCashRegisterOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isTodaysSaleOpen, setIsTodaysSaleOpen] = useState(false);
  const [isTodaysProfitOpen, setIsTodaysProfitOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef(null);

  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        setLoading(true);
        const res = await getAllProducts();
        if (res.success || Array.isArray(res.products) || Array.isArray(res)) {
          const prods = res.products || res.data || (Array.isArray(res) ? res : []);
          setProducts(prods);
        }
      } catch (err) {
        console.error('Failed to load products for POS:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategoriesData = async () => {
      try {
        const res = await getCategories();
        if (res.success || Array.isArray(res)) {
          const cats = res.data || res || [];
          setCategories(['All Categories', ...cats.map(c => c.name || c.categoryName)]);
        }
      } catch (err) {
        console.error('Failed to load categories for POS:', err);
      }
    };

    const loadSettings = () => {
      const saved = localStorage.getItem('pos_settings');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.paymentMethods && parsed.paymentMethods.length > 0) {
            setAvailablePaymentMethods(parsed.paymentMethods);
            setPaymentMethod(parsed.paymentMethods[0]);
          }
        } catch (e) {
          console.error('Failed to load POS settings', e);
        }
      }
    };

    fetchProductsData();
    fetchCategoriesData();
    loadSettings();
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product._id === product._id);
      if (existing) {
        return prev.map(item => item.product._id === product._id ? { ...item, qty: item.qty + 1 } : item);
      } else {
        return [...prev, { product, qty: 1, price: product.sellingPrice || product.price || 100 }];
      }
    });
  };

  const updateQty = (productId, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.product._id === productId) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.product._id !== productId));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const grandTotal = subtotal;

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert('Cart is empty! Please add products to complete sale.');
      return;
    }
    try {
      const payload = {
        saleType: 'POS',
        customerName: customerName,
        items: cartItems.map(ci => ({
          product: ci.product._id,
          quantity: ci.qty,
          unitPrice: ci.price,
          subtotal: ci.price * ci.qty,
          total: ci.price * ci.qty
        })),
        subtotal: subtotal,
        grandTotal: grandTotal,
        paidAmount: grandTotal,
        paymentStatus: 'Paid',
        orderStatus: 'Completed',
        paymentMethod: paymentMethod
      };

      const res = await createSale(payload);
      if (res.success) {
        alert(`POS Order #${res.data.saleNumber} completed successfully!`);
        setCartItems([]);
      }
    } catch (err) {
      alert(`Checkout failed: ${err.message}`);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.code || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    if (selectedCategory === 'All Categories') return true;

    const pCat = p.category?.name || p.category?.categoryName || p.category;
    return String(pCat).toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className={styles.posContainer}>
      
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.logo}>
            <span>E</span>ronix POS
          </div>
        </div>
        
        <div className={styles.headerRight}>
          <Link to="/" className={styles.dashboardBtn}>Dashboard</Link>
          <button className={styles.iconBtn} style={{backgroundColor: '#EA5455', color: 'white', border: 'none'}} onClick={() => setIsCalculatorOpen(true)}><Calculator size={16} /></button>
          <button className={styles.iconBtn} onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
          <button className={styles.iconBtn} onClick={() => setIsCashRegisterOpen(true)}><Box size={16} /></button>
          <button className={styles.iconBtn} onClick={() => setIsTodaysSaleOpen(true)}><RefreshCw size={16} /></button>
          <button className={styles.iconBtn} onClick={() => setIsTodaysProfitOpen(true)}><TrendingUp size={16} /></button>
          <button className={styles.iconBtn} onClick={() => navigate('/pos-settings')}><Settings size={16} /></button>
        </div>
      </header>

      {/* Main Area */}
      <div className={styles.mainContent}>
        
        {/* Left Panel - Products */}
        <div className={styles.leftPanel}>
          <div className={styles.leftHeader}>
            <div className={styles.welcome}>
              <h2>POS Terminal</h2>
              <p>{new Date().toLocaleDateString()}</p>
            </div>
            <div className={styles.searchSection}>
              <div className={styles.searchBox}>
                <Search size={16} className={styles.searchIcon} />
                <input 
                  type="text" 
                  placeholder="Search Product or Code..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className={styles.categories}>
            {categories.map((cat, i) => (
              <button key={i} className={`${styles.categoryBtn} ${selectedCategory === cat ? styles.active : ''}`} onClick={() => setSelectedCategory(cat)}>
                {cat}
              </button>
            ))}
          </div>

          <div className={styles.productGrid}>
            {loading ? (
              <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '3rem'}}>Loading POS Products...</div>
            ) : filteredProducts.length === 0 ? (
              <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '3rem'}}>No products found</div>
            ) : (
              filteredProducts.map((p, i) => (
                <div key={p._id || i} className={styles.productCard} onClick={() => addToCart(p)} style={{cursor: 'pointer'}}>
                  <div className={styles.productImage} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 600}}>
                    {(p.name || 'P')[0]}
                  </div>
                  <div className={styles.addIcon}>+</div>
                  <div className={styles.productInfo}>
                    <p className={styles.productName}>{p.name}</p>
                    <div className={styles.productMeta}>
                      <span className={styles.productPrice}>₹{p.sellingPrice || p.price || 100}</span>
                      <span className={styles.productStock}>{p.quantity || 10} In Stock</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Panel - Cart */}
        <div className={styles.rightPanel}>
          
          <div className={styles.cartHeader}>
            <div className={styles.orderTitleRow}>
              <div className={styles.orderTitle}>
                POS Counter Order
              </div>
              <button className={styles.addCustomerBtn} onClick={() => setIsCustomerOpen(true)}>Add Customer</button>
            </div>
            <input 
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Customer Name"
              style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #E5E7EB', outline: 'none', marginTop: '0.5rem'}}
            />
          </div>

          <div style={{display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #E5E7EB', color: '#1B2850', fontWeight: 600, fontSize: '0.875rem'}}>
            <span>Order Details</span>
            <span style={{color: '#28C76F'}}>Items: {cartItems.length}</span>
          </div>

          <div className={styles.cartItems}>
            {cartItems.length === 0 ? (
              <div style={{textAlign: 'center', padding: '2rem', color: '#9CA3AF'}}>Cart is empty. Click a product to add.</div>
            ) : (
              cartItems.map((item, i) => (
                <div key={item.product._id || i} className={styles.cartItem}>
                  <div className={styles.cartItemInfo}>
                    <div className={styles.cartItemName}>{item.product.name}</div>
                    <div className={styles.cartItemPrice}>₹{item.price}</div>
                  </div>
                  
                  <div className={styles.qtyControl}>
                    <button className={styles.qtyBtn} onClick={() => updateQty(item.product._id, -1)}><Minus size={14} /></button>
                    <span className={styles.qtyValue}>{item.qty}</span>
                    <button className={styles.qtyBtn} onClick={() => updateQty(item.product._id, 1)}><Plus size={14} /></button>
                  </div>

                  <div className={styles.cartItemTotal}>
                    ₹{item.price * item.qty}
                  </div>

                  <button className={styles.cartItemDelete} onClick={() => removeFromCart(item.product._id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className={styles.summary}>
            <div className={styles.summaryRow}>
              <span>Sub Total</span>
              <span>₹{subtotal}</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.grandTotalRow}`}>
              <span>Grand Total</span>
              <span>₹{grandTotal}</span>
            </div>
          </div>

          <div className={styles.paymentTypes}>
            <div className={styles.paymentTitle}>Select Payment Method</div>
            <div className={styles.paymentOptions}>
              {availablePaymentMethods.map((pm) => (
                <div 
                  key={pm} 
                  className={styles.paymentOption} 
                  style={{
                    backgroundColor: paymentMethod === pm ? '#E8F9EE' : '#F9FAFB', 
                    border: paymentMethod === pm ? '2px solid #28C76F' : '1px solid #E5E7EB',
                    cursor: 'pointer'
                  }}
                  onClick={() => setPaymentMethod(pm)}
                >
                  <span style={{fontWeight: 500, fontSize: '0.875rem'}}>{pm}</span>
                </div>
              ))}
            </div>
          </div>

          <button className={styles.payButton} onClick={handleCheckout}>
            Pay Now : ₹{grandTotal}
          </button>
        </div>

      </div>

      <HoldOrderModal isOpen={isHoldOpen} onClose={() => setIsHoldOpen(false)} />
      <POSDiscountModal isOpen={isDiscountOpen} onClose={() => setIsDiscountOpen(false)} />
      <POSCreateCustomerModal isOpen={isCustomerOpen} onClose={() => setIsCustomerOpen(false)} onSuccess={(name) => setCustomerName(name)} />
      <POSCashRegisterModal isOpen={isCashRegisterOpen} onClose={() => setIsCashRegisterOpen(false)} />
      <POSCalculatorModal isOpen={isCalculatorOpen} onClose={() => setIsCalculatorOpen(false)} />
      <POSTodaysSaleModal isOpen={isTodaysSaleOpen} onClose={() => setIsTodaysSaleOpen(false)} />
      <POSTodaysProfitModal isOpen={isTodaysProfitOpen} onClose={() => setIsTodaysProfitOpen(false)} />
    </div>
  );
};

export default POS;
