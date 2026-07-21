import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import { Search, Globe, Maximize, Minimize, Mail, Bell, Settings, User, Box, Package, ShoppingBag, ShoppingCart, FileSpreadsheet, FileCheck, Copy, Users, Shield, UserCheck, Truck, LogOut, FileText, ChevronsLeft, ChevronsRight, Menu, MoreVertical } from 'lucide-react';
import { getStores } from '../../services/inventoryService';

const Header = ({ isCollapsed, toggleCollapse, toggleMobile }) => {
  const navigate = useNavigate();
  const [isAddNewOpen, setIsAddNewOpen] = useState(false);
  const addNewRef = useRef(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [stores, setStores] = useState([]);

  useEffect(() => {
    getStores().then(res => {
      if (res.success || Array.isArray(res)) setStores(res.data || res);
    }).catch(console.error);

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (addNewRef.current && !addNewRef.current.contains(event.target)) {
        setIsAddNewOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addNewItems = [
    { icon: Box, label: 'Category', path: '/category-list' },
    { icon: Package, label: 'Product', path: '/add-product' },
    { icon: ShoppingBag, label: 'Purchase', path: '/add-purchase' },
    { icon: ShoppingCart, label: 'Sale', path: '/pos' },
    { icon: FileSpreadsheet, label: 'Expense', path: '/expense-list' },
    { icon: FileCheck, label: 'Quotation', path: '/quotation-list' },
    { icon: Copy, label: 'Return', path: '/sales-return-list' },
    { icon: User, label: 'User', path: '/users' },
    { icon: Users, label: 'Customer', path: '/customers' },
    { icon: Shield, label: 'Biller', path: '/users' },
    { icon: UserCheck, label: 'Supplier', path: '/suppliers' },
    { icon: Truck, label: 'Transfer', path: '/stock-transfer' }
  ];

  const handleQuickAddClick = (path) => {
    setIsAddNewOpen(false);
    navigate(path);
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button className={styles.mobileMenuBtn} onClick={toggleMobile}>
          <Menu size={24} />
        </button>
        <div className={`${styles.logoContainer} ${isCollapsed ? styles.logoContainerCollapsed : ''}`}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}></div>
            {!isCollapsed && <h2>Eronix POS</h2>}
          </div>
          <button className={`${styles.toggleBtn} ${styles.hideOnMobile}`} onClick={toggleCollapse}>
            {isCollapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
          </button>
        </div>
        <div className={`${styles.searchBox} ${styles.hideOnMobile}`}>
          <Search size={18} className={styles.searchIcon} />
          <input type="text" placeholder="Search" />
          <span className={styles.shortcut}>⌘ K</span>
        </div>
      </div>
      <div className={styles.right}>
        <button className={styles.mobileMoreBtn}>
          <MoreVertical size={24} />
        </button>
        <div className={`${styles.rightControls} ${styles.hideOnMobile}`}>
          <select className={styles.storeSelect}>
            <option>Store: Freshmart</option>
            {stores.map(s => (
              <option key={s._id} value={s._id}>Store: {s.storeName || s.name}</option>
            ))}
          </select>
          <div className={styles.addNewWrapper} ref={addNewRef}>
            <button 
              className={styles.btnPrimary} 
              onClick={() => setIsAddNewOpen(!isAddNewOpen)}
            >
              + Add New
            </button>
          
            {isAddNewOpen && (
              <div className={styles.addNewPopover}>
                <div className={styles.addNewGrid}>
                  {addNewItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div 
                        key={index} 
                        className={styles.addNewItem}
                        onClick={() => handleQuickAddClick(item.path)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className={styles.addNewIcon}>
                          <Icon size={18} strokeWidth={1.5} />
                        </div>
                        <span>{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <button className={styles.btnDark} onClick={() => navigate('/pos')}>POS</button>
          
          <div className={styles.actions}>
            <button className={styles.iconBtn}><Globe size={20} /></button>
            <button className={styles.iconBtn} onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
            <button className={styles.iconBtn}>
              <Mail size={20} />
              <span className={styles.badge}>5</span>
            </button>
            <button className={styles.iconBtn}>
              <Bell size={20} />
              <span className={styles.badge}>3</span>
            </button>
            <button className={styles.iconBtn} onClick={() => navigate('/profile')}><Settings size={20} /></button>
          </div>
          
          <div className={styles.profile} ref={userDropdownRef}>
            <div className={styles.avatar} onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)} style={{ cursor: 'pointer' }}>
              <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            </div>
            {isUserDropdownOpen && (
              <div className={styles.userDropdown}>
                <div className={styles.userInfo}>
                  <div className={styles.userAvatar}>
                    <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User" />
                  </div>
                  <div className={styles.userDetails}>
                    <div className={styles.userName}>
                      {JSON.parse(localStorage.getItem('user'))?.fullName || JSON.parse(localStorage.getItem('user'))?.firstName || 'Super Admin'}
                    </div>
                    <div className={styles.userRole}>
                      {JSON.parse(localStorage.getItem('user'))?.role?.name || 'super_admin'}
                    </div>
                  </div>
                </div>
                <div className={styles.userMenu}>
                  <div className={styles.userMenuItem} onClick={() => { setIsUserDropdownOpen(false); navigate('/profile'); }} style={{ cursor: 'pointer' }}>
                    <User size={16} /> My Profile
                  </div>
                  <div className={styles.userMenuItem} onClick={() => { setIsUserDropdownOpen(false); navigate('/balance-sheet'); }} style={{ cursor: 'pointer' }}>
                    <FileText size={16} /> Reports
                  </div>
                  <div className={styles.userMenuItem} onClick={() => { setIsUserDropdownOpen(false); navigate('/profile'); }} style={{ cursor: 'pointer' }}>
                    <Settings size={16} /> Settings
                  </div>
                </div>
                <div 
                  className={styles.userLogout} 
                  onClick={() => {
                    setIsUserDropdownOpen(false);
                    localStorage.clear();
                    navigate('/signin');
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <LogOut size={16} /> Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
