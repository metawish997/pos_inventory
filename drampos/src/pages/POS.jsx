import React, { useState } from 'react';
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

const POS = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [isHoldOpen, setIsHoldOpen] = useState(false);
  const [isDiscountOpen, setIsDiscountOpen] = useState(false);
  const [isCustomerOpen, setIsCustomerOpen] = useState(false);
  const [isCashRegisterOpen, setIsCashRegisterOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isTodaysSaleOpen, setIsTodaysSaleOpen] = useState(false);
  const [isTodaysProfitOpen, setIsTodaysProfitOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const userDropdownRef = React.useRef(null);

  React.useEffect(() => {
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

  const categories = ['All Categories', 'Headphones', 'Shoes', 'Mobiles', 'Watches', 'Laptops', 'Home Needs'];
  
  const products = [
    { name: 'Charger Cable', price: '$30', qty: '40 Pcs', img: 'charger.jpg', selected: false },
    { name: 'Apple Airpods 2', price: '$120', qty: '25 Pcs', img: 'airpods.jpg', selected: true },
    { name: 'Vacuum Cleaner', price: '$800', qty: '12 Pcs', img: 'vacuum.jpg', selected: false },
    { name: 'Realme 8 Pro', price: '$700', qty: '18 Pcs', img: 'realme.jpg', selected: false },
    { name: 'Vacuum Robot', price: '$600', qty: '35 Pcs', img: 'vacuumrobot.jpg', selected: false },
    { name: 'Apple Watch Series 9', price: '$300', qty: '08 Pcs', img: 'watch1.jpg', selected: false },
    { name: 'Apple Watch Series 9', price: '$300', qty: '08 Pcs', img: 'watch2.jpg', selected: false },
    { name: 'Bracelet', price: '$1430', qty: '13 Pcs', img: 'bracelet.jpg', selected: false },
    { name: 'YETI Flask', price: '$1560', qty: '30 Pcs', img: 'flask.jpg', selected: false },
    { name: 'Osmo Med Kit', price: '$410', qty: '15 Pcs', img: 'kit.jpg', selected: false },
    { name: 'Celestique Perfume', price: '$150', qty: '45 Pcs', img: 'perfume.jpg', selected: false },
    { name: 'Dell XPS 13', price: '$1140', qty: '22 Pcs', img: 'laptop.jpg', selected: false },
    { name: 'Cheese Snack', price: '$15', qty: '55 Pcs', img: 'cheese.jpg', selected: false },
    { name: 'Blue Boot Shoes', price: '$320', qty: '30 Pcs', img: 'shoes.jpg', selected: false },
    { name: 'Sonic Aura X7', price: '$230', qty: '20 Pcs', img: 'headphone.jpg', selected: false },
  ];

  const cartItems = [
    { name: 'Iphone 11S', price: '$400', qty: 4 },
    { name: 'Samsung Galaxy S21', price: '$400', qty: 1 },
    { name: 'Red Boot Shoes', price: '$600', qty: 3 },
    { name: 'Bracelet', price: '$1400', qty: 1 },
  ];

  return (
    <div className={styles.posContainer}>
      
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.logo}>
            <span>D</span>reams POS
          </div>
          <div className={styles.clock}>
            ⏱ 09:25:32
          </div>
        </div>
        
        <div className={styles.headerRight}>
          <Link to="/" className={styles.dashboardBtn}>Dashboard</Link>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #E5E7EB', padding: '0.25rem 0.5rem', borderRadius: '4px', backgroundColor: 'white'}}>
             <img src="https://flagcdn.com/w20/in.png" alt="flag" style={{width: '20px'}} /> Freshmart
          </div>
          <button className={styles.iconBtn} style={{backgroundColor: '#EA5455', color: 'white', border: 'none'}} onClick={() => setIsCalculatorOpen(true)}><Calculator size={16} /></button>
          <button className={styles.iconBtn} onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
          <button className={styles.iconBtn} onClick={() => setIsCashRegisterOpen(true)}><Box size={16} /></button>
          <button className={styles.iconBtn}><Printer size={16} /></button>
          <button className={styles.iconBtn} onClick={() => setIsTodaysSaleOpen(true)}><RefreshCw size={16} /></button>
          <button className={styles.iconBtn} onClick={() => setIsTodaysProfitOpen(true)}><TrendingUp size={16} /></button>
          <button className={styles.iconBtn} onClick={() => navigate('/pos-settings')}><Settings size={16} /></button>
          <div className={styles.profile} ref={userDropdownRef}>
            <div 
              style={{width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer'}}
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            >
              <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            </div>
            {isUserDropdownOpen && (
              <div className={styles.userDropdown}>
                <div className={styles.userInfo}>
                  <div className={styles.userAvatar}>
                    <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User" />
                  </div>
                  <div className={styles.userDetails}>
                    <div className={styles.userName}>John Smilga</div>
                    <div className={styles.userRole}>Admin</div>
                  </div>
                </div>
                <div className={styles.userMenu}>
                  <div className={styles.userMenuItem}>
                    <User size={16} /> My Profile
                  </div>
                  <div className={styles.userMenuItem}>
                    <FileText size={16} /> Reports
                  </div>
                  <div className={styles.userMenuItem}>
                    <Settings size={16} /> Settings
                  </div>
                </div>
                <div className={styles.userLogout}>
                  <LogOut size={16} /> Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Area */}
      <div className={styles.mainContent}>
        
        {/* Left Panel - Products */}
        <div className={styles.leftPanel}>
          <div className={styles.leftHeader}>
            <div className={styles.welcome}>
              <h2>Welcome, Wesley Adrian</h2>
              <p>December 24, 2024</p>
            </div>
            <div className={styles.searchSection}>
              <div className={styles.searchBox}>
                <Search size={16} className={styles.searchIcon} />
                <input type="text" placeholder="Search Product" />
              </div>
              <button className={styles.viewAllBtn}>View All Categories</button>
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
            {products.map((p, i) => (
              <div key={i} className={`${styles.productCard} ${p.selected ? styles.selected : ''}`}>
                <div className={styles.productImage}></div>
                <div className={styles.addIcon}>
                  {p.selected ? '-' : '+'}
                </div>
                <div className={styles.productInfo}>
                  <p className={styles.productName}>{p.name}</p>
                  <div className={styles.productMeta}>
                    <span className={styles.productPrice}>{p.price}</span>
                    <span className={styles.productStock}>{p.qty}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Cart */}
        <div className={styles.rightPanel}>
          
          <div className={styles.cartHeader}>
            <div className={styles.orderTitleRow}>
              <div className={styles.orderTitle}>
                New Order <span className={styles.orderBadge}>#5655898</span>
              </div>
              <button className={styles.addCustomerBtn} onClick={() => setIsCustomerOpen(true)}>Add Customer</button>
            </div>
            <select style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #E5E7EB', outline: 'none', color: '#4B5563'}}>
              <option>Walk in Customer</option>
            </select>
          </div>

          <div style={{display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #E5E7EB', color: '#1B2850', fontWeight: 600, fontSize: '0.875rem'}}>
            <span>Order Details</span>
            <span style={{color: '#28C76F'}}>Items : 3</span>
          </div>

          <div style={{display: 'flex', padding: '0.5rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: '#4B5563'}}>
            <span style={{flex: 1}}>Product</span>
            <span style={{width: '100px', textAlign: 'center'}}>QTY</span>
            <span style={{width: '60px', textAlign: 'right'}}>Price</span>
            <span style={{width: '32px'}}></span>
          </div>

          <div className={styles.cartItems}>
            {cartItems.map((item, i) => (
              <div key={i} className={styles.cartItem}>
                <div className={styles.cartItemInfo}>
                  <div className={styles.cartItemName}>
                    {item.name} <Edit size={12} color="#9CA3AF" />
                  </div>
                  <div className={styles.cartItemPrice}>Price : {item.price}</div>
                </div>
                
                <div className={styles.qtyControl}>
                  <button className={styles.qtyBtn}><Minus size={14} /></button>
                  <span className={styles.qtyValue}>{item.qty}</span>
                  <button className={styles.qtyBtn}><Plus size={14} /></button>
                </div>

                <div className={styles.cartItemTotal}>
                  {item.price}
                </div>

                <button className={styles.cartItemDelete}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className={styles.summary}>
            <div className={styles.summaryRow}>
              <span>Sub Total</span>
              <span>$1250</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>$35</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Tax (15%)</span>
              <span>$25</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.discount}`}>
              <span>Discount (5%)</span>
              <span>-$24</span>
            </div>
            
            <div className={styles.grandTotalRow}>
              <span>Grand Total</span>
              <span>$56590</span>
            </div>
          </div>

          <div className={styles.actionGrid}>
            <button className={styles.actionBtn} style={{backgroundColor: '#00897B'}} onClick={() => setIsDiscountOpen(true)}>
              % Discount
            </button>
            <button className={styles.actionBtn} style={{backgroundColor: '#7367F0'}}>
              <Box size={14} /> Tax
            </button>
            <button className={styles.actionBtn} style={{backgroundColor: '#E83E8C'}}>
              <Box size={14} /> Shipping
            </button>
            <button className={styles.actionBtn} style={{backgroundColor: '#FD7E14'}} onClick={() => setIsHoldOpen(true)}>
              <Box size={14} /> Hold
            </button>
            <button className={styles.actionBtn} style={{backgroundColor: '#0D6EFD'}}>
              <Box size={14} /> Void
            </button>
            <button className={styles.actionBtn} style={{backgroundColor: '#00CFE8'}}>
              <Box size={14} /> Payment
            </button>
            <button className={styles.actionBtn} style={{backgroundColor: '#1B2850'}}>
              <Box size={14} /> View Orders
            </button>
            <button className={styles.actionBtn} style={{backgroundColor: '#4338CA'}}>
              <RefreshCw size={14} /> Reset
            </button>
            <button className={styles.actionBtn} style={{backgroundColor: '#EA5455'}}>
              <Box size={14} /> Transaction
            </button>
          </div>

          <div className={styles.paymentTypes}>
            <div className={styles.paymentTitle}>Select Payment</div>
            <div className={styles.paymentOptions}>
              <div className={styles.paymentOption}>
                <span style={{fontSize: '1.5rem'}}>💵</span>
                <span>Cash</span>
              </div>
              <div className={styles.paymentOption}>
                <span style={{fontSize: '1.5rem'}}>💳</span>
                <span>Card</span>
              </div>
              <div className={styles.paymentOption}>
                <span style={{fontSize: '1.5rem'}}>⭐</span>
                <span>Points</span>
              </div>
              <div className={styles.paymentOption}>
                <span style={{fontSize: '1.5rem'}}>📦</span>
                <span>Deposit</span>
              </div>
              <div className={styles.paymentOption}>
                <span style={{fontSize: '1.5rem'}}>🧾</span>
                <span>Cheque</span>
              </div>
            </div>
          </div>

          <button className={styles.payButton}>
            Pay : $56590.00
          </button>
        </div>

      </div>

      <HoldOrderModal isOpen={isHoldOpen} onClose={() => setIsHoldOpen(false)} />
      <POSDiscountModal isOpen={isDiscountOpen} onClose={() => setIsDiscountOpen(false)} />
      <POSCreateCustomerModal isOpen={isCustomerOpen} onClose={() => setIsCustomerOpen(false)} />
      <POSCashRegisterModal isOpen={isCashRegisterOpen} onClose={() => setIsCashRegisterOpen(false)} />
      <POSCalculatorModal isOpen={isCalculatorOpen} onClose={() => setIsCalculatorOpen(false)} />
      <POSTodaysSaleModal isOpen={isTodaysSaleOpen} onClose={() => setIsTodaysSaleOpen(false)} />
      <POSTodaysProfitModal isOpen={isTodaysProfitOpen} onClose={() => setIsTodaysProfitOpen(false)} />
    </div>
  );
};

export default POS;
