import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Header.module.css';
import { Search, Globe, Maximize, Minimize, Mail, Bell, Settings, User, Box, Package, ShoppingBag, ShoppingCart, FileSpreadsheet, FileCheck, Copy, Users, Shield, UserCheck, Truck, LogOut, FileText, ChevronsLeft, ChevronsRight, Menu } from 'lucide-react';
import { getStores } from '../../services/inventoryService';

const Header = ({ isCollapsed, toggleCollapse, toggleMobile }) => {
  const navigate = useNavigate();
  
  // States for Popovers
  const [isAddNewOpen, setIsAddNewOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMailOpen, setIsMailOpen] = useState(false);
  const [isBellOpen, setIsBellOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [stores, setStores] = useState([]);
  
  // DB Notifications State
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [systemMessages, setSystemMessages] = useState([]);

  // Refs for Click Outside
  const addNewRef = useRef(null);
  const userDropdownRef = useRef(null);
  const mailRef = useRef(null);
  const bellRef = useRef(null);

  // Fetch Notifications from DB
  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      if (data.success) {
        const allNotifications = data.data || [];
        
        // Filter Low stock alerts (not read)
        const lowStocks = allNotifications
          .filter(n => n.type === 'LOW_STOCK' && !n.isRead)
          .map(n => ({
            id: n._id,
            msg: n.message
          }));
        setLowStockAlerts(lowStocks);

        // Filter messages/sales completed
        const messages = allNotifications
          .filter(n => n.type === 'SALE_COMPLETED' && !n.isRead)
          .map(n => ({
            id: n._id,
            title: n.title,
            desc: n.message,
            time: new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));
        setSystemMessages(messages);
      }
    } catch (err) {
      console.error('Failed to load notifications from DB:', err);
    }
  };

  useEffect(() => {
    getStores().then(res => {
      if (res.success || Array.isArray(res)) setStores(res.data || res);
    }).catch(console.error);

    fetchNotifications();

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    // Setup EventSource for SSE Real-time Updates
    const eventSource = new EventSource('/api/events');
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'SALE_COMPLETED') {
          // Re-fetch notifications from DB when events are received
          fetchNotifications();
        }
      } catch (err) {
        console.error('Failed to parse SSE event data:', err);
      }
    };

    return () => {
      eventSource.close();
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (addNewRef.current && !addNewRef.current.contains(event.target)) {
        setIsAddNewOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
      if (mailRef.current && !mailRef.current.contains(event.target)) {
        setIsMailOpen(false);
      }
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setIsBellOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // API handler to mark all as read
  const handleClearAll = async () => {
    try {
      const res = await fetch('/api/notifications/read-all', { method: 'PUT' });
      const data = await res.json();
      if (data.success) {
        setLowStockAlerts([]);
        setSystemMessages([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // API handler to mark individual alert as read
  const handleMarkAsRead = async (id, isStockAlert) => {
    try {
      const res = await fetch(`/api/notifications/${id}/read`, { method: 'PUT' });
      const data = await res.json();
      if (data.success) {
        if (isStockAlert) {
          setLowStockAlerts(prev => prev.filter(n => n.id !== id));
          setIsBellOpen(false);
          navigate('/low-stocks');
        } else {
          setSystemMessages(prev => prev.filter(n => n.id !== id));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

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
          <div className={styles.shortcut}>
            <span>⌘</span><span>K</span>
          </div>
        </div>
      </div>

      <div className={styles.right}>
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
            <button className={styles.iconBtn} onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>

            {/* Dynamic Mail Popover */}
            <div className={styles.dropdownWrapper} ref={mailRef}>
              <button className={styles.iconBtn} onClick={() => { setIsMailOpen(!isMailOpen); setIsBellOpen(false); }}>
                <Mail size={20} />
                <span className={styles.badge}>{systemMessages.length}</span>
              </button>
              {isMailOpen && (
                <div className={styles.dropdownPopover}>
                  <div className={styles.dropdownHeader}>
                    <span>Recent Messages</span>
                    <span style={{ fontSize: '0.75rem', color: '#FF9F43', cursor: 'pointer' }} onClick={handleClearAll}>Clear all</span>
                  </div>
                  {systemMessages.length === 0 ? (
                    <div style={{ padding: '1rem 0.5rem', textAlign: 'center', fontSize: '0.85rem', color: '#9CA3AF' }}>No new messages</div>
                  ) : (
                    systemMessages.map(msg => (
                      <div key={msg.id} className={styles.dropdownItem} onClick={() => handleMarkAsRead(msg.id, false)}>
                        <div style={{ fontWeight: 600, color: '#1B2850', marginBottom: '0.15rem' }}>{msg.title}</div>
                        <div>{msg.desc}</div>
                        <div style={{ fontSize: '0.7rem', color: '#9CA3AF', marginTop: '0.25rem' }}>{msg.time}</div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Dynamic Bell Popover */}
            <div className={styles.dropdownWrapper} ref={bellRef}>
              <button className={styles.iconBtn} onClick={() => { setIsBellOpen(!isBellOpen); setIsMailOpen(false); }}>
                <Bell size={20} />
                <span className={styles.badge}>{lowStockAlerts.length}</span>
              </button>
              {isBellOpen && (
                <div className={styles.dropdownPopover}>
                  <div className={styles.dropdownHeader}>
                    <span>Dynamic Alerts</span>
                    <span style={{ fontSize: '0.75rem', color: '#EA5455', cursor: 'pointer' }} onClick={handleClearAll}>Clear all</span>
                  </div>
                  {lowStockAlerts.length === 0 ? (
                    <div style={{ padding: '1rem 0.5rem', textAlign: 'center', fontSize: '0.85rem', color: '#9CA3AF' }}>All inventory levels healthy</div>
                  ) : (
                    lowStockAlerts.slice(0, 5).map((alert) => (
                      <div 
                        key={alert.id} 
                        className={styles.dropdownItem} 
                        onClick={() => handleMarkAsRead(alert.id, true)}
                      >
                        <div style={{ color: '#EA5455', fontWeight: 500 }}>⚠️ {alert.msg}</div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            
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
