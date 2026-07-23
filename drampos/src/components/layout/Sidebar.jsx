import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { Home, Package, Box, LayoutGrid, AlertCircle, TrendingDown, List, Layers, Award, FileText, FileCheck, Barcode, QrCode, PackageCheck, ArrowRightLeft, Truck, ShoppingCart, ShoppingBag, Landmark, DollarSign, Activity, FileSpreadsheet, Search, Users, UserCheck, UserPlus, Store, Building, BarChart, Clock, Filter, PieChart, Calendar, Percent, X, PlusCircle, FilePlus, ClipboardList, RotateCcw, TrendingUp } from 'lucide-react';

const Sidebar = ({ isCollapsed, isMobileOpen, closeMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isSalesExpanded = location.pathname.includes('/sales') || location.pathname.includes('/pos-orders');
  const isDiscountExpanded = location.pathname.includes('/discount');
  const isPurchasesExpanded = location.pathname.includes('/purchase') || location.pathname.includes('/vendor') || location.pathname.includes('/draft-purchase');
  const isExpensesExpanded = location.pathname.includes('/expense');
  const isIncomeExpanded = location.pathname.includes('/income');
  const isReportsExpanded = location.pathname.includes('/report') || location.pathname.includes('/best-seller');

  const [isScrolling, setIsScrolling] = React.useState(false);
  const scrollTimeout = React.useRef(null);
  const asideRef = React.useRef(null);

  const handleScroll = () => {
    setIsScrolling(true);
    if (asideRef.current) {
      sessionStorage.setItem('sidebarScrollPos', asideRef.current.scrollTop);
    }
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
    scrollTimeout.current = setTimeout(() => {
      setIsScrolling(false);
    }, 1000);
  };

  React.useEffect(() => {
    if (asideRef.current) {
      const savedPos = sessionStorage.getItem('sidebarScrollPos');
      if (savedPos !== null) {
        asideRef.current.scrollTop = parseInt(savedPos, 10);
      }
      
      setTimeout(() => {
        if (asideRef.current) {
          const activeEl = asideRef.current.querySelector(`.${styles.active}`);
          if (activeEl) {
            activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
          }
        }
      }, 50);
    }
  }, [location.pathname]);

  return (
    <aside
      ref={asideRef}
      className={`${styles.sidebar} ${isScrolling ? styles.isScrolling : ''} ${isCollapsed ? styles.collapsed : ''} ${isMobileOpen ? styles.mobileOpen : ''}`}
      onScroll={handleScroll}
    >
      <div className={styles.mobileHeader}>
        <div className={styles.mobileLogo}>
          <div className={styles.logoIcon}></div>
          <h2>Eronix POS</h2>
        </div>
        <button className={styles.closeBtn} onClick={closeMobile}>
          <X size={24} />
        </button>
      </div>
      <div className={styles.menuGroup}>
        <div className={styles.menuTitle}>Main</div>
        <ul className={styles.menuList}>
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem} end>
              <Home size={18} />
              <span>Admin Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/sales" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
              <LayoutGrid size={18} />
              <span>Sales Dashboard</span>
            </NavLink>
          </li>
        </ul>
      </div>

      <div className={styles.menuGroup}>
        <div className={styles.menuTitle}>Inventory</div>
        <ul className={styles.menuList}>
          <li>
            <NavLink to="/products" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
              <Package size={18} />
              <span>Products</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/create-product" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
              <Box size={18} />
              <span>Create Product</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/expired-products" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
              <AlertCircle size={18} />
              <span>Expired Products</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/low-stocks" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
              <TrendingDown size={18} />
              <span>Low Stocks</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/categories" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
              <List size={18} />
              <span>Category</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/sub-categories" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
              <Layers size={18} />
              <span>Sub Category</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/brands" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
              <Award size={18} />
              <span>Brands</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/variants" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
              <FileText size={18} />
              <span>Variant Attributes</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/taxes" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
              <Percent size={18} />
              <span>Tax Master</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/stores" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
              <Store size={18} />
              <span>Stores</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/warehouses" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
              <Building size={18} />
              <span>Warehouses</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/warranties" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
              <FileCheck size={18} />
              <span>Warranties</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/print-barcode" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
              <Barcode size={18} />
              <span>Print Barcode</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/print-qrcode" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
              <QrCode size={18} />
              <span>Print QR Code</span>
            </NavLink>
          </li>
        </ul>
      </div>

      <div className={styles.menuGroup}>
        <div className={styles.menuTitle}>Stock</div>
        <ul className={styles.menuList}>
          <li>
            <NavLink to="/manage-stock" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
              <PackageCheck size={18} />
              <span>Manage Stock</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/stock-adjustment" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
              <ArrowRightLeft size={18} />
              <span>Stock Adjustment</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/stock-transfer" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
              <Truck size={18} />
              <span>Stock Transfer</span>
            </NavLink>
          </li>
        </ul>
      </div>

      <div className={styles.menuGroup}>
        <div className={styles.menuTitle}>Sales</div>
        <ul className={styles.menuList}>
          <li>
            <div className={isSalesExpanded ? `${styles.menuItem} ${styles.active}` : styles.menuItem} style={{ cursor: 'pointer', marginBottom: isSalesExpanded ? '0' : '0.5rem' }} onClick={() => navigate('/sales')}>
              <ShoppingCart size={18} />
              <span>Sales</span>
            </div>
            {isSalesExpanded && (
              <ul style={{ listStyle: 'none', paddingLeft: '2.5rem', margin: '0.5rem 0 1rem 0' }}>
                <li style={{ marginBottom: '0.75rem' }}>
                  <NavLink to="/sales" style={({ isActive }) => ({ textDecoration: 'none', fontSize: '0.875rem', color: isActive ? '#FF9F43' : '#6B7280', display: 'flex', alignItems: 'center', gap: '0.5rem' })}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/sales' ? '#FF9F43' : '#D1D5DB' }}></div>
                    Online Orders
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/pos-orders" style={({ isActive }) => ({ textDecoration: 'none', fontSize: '0.875rem', color: isActive ? '#FF9F43' : '#6B7280', display: 'flex', alignItems: 'center', gap: '0.5rem' })}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/pos-orders' ? '#FF9F43' : '#D1D5DB' }}></div>
                    POS Orders
                  </NavLink>
                </li>
              </ul>
            )}
          </li>
          <li>
            <NavLink to="/invoices" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
              <FileText size={18} />
              <span>Invoices</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/proforma-invoices" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
              <FileText size={18} />
              <span>Proforma Invoices</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/sales-return" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
              <ArrowRightLeft size={18} />
              <span>Sales Return</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/quotation" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
              <FileCheck size={18} />
              <span>Quotation</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/delivery-challans" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
              <FileCheck size={18} />
              <span>Delivery Challans</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/pos" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
              <Box size={18} />
              <span>POS</span>
            </NavLink>
          </li>
        </ul>
      </div>

      <div className={styles.menuGroup}>
        <div className={styles.menuTitle}>Purchases</div>
        <ul className={styles.menuList}>
          <li>
            <div className={isPurchasesExpanded ? `${styles.menuItem} ${styles.active}` : styles.menuItem} style={{ cursor: 'pointer', marginBottom: isPurchasesExpanded ? '0' : '0.5rem' }} onClick={() => navigate('/purchases')}>
              <ShoppingBag size={18} />
              <span>Purchases</span>
            </div>
            {isPurchasesExpanded && (
              <ul style={{ listStyle: 'none', paddingLeft: '2.5rem', margin: '0.5rem 0 1rem 0' }}>
                <li style={{ marginBottom: '0.75rem' }}>
                  <NavLink to="/purchase-dashboard" style={({ isActive }) => ({ textDecoration: 'none', fontSize: '0.875rem', color: isActive ? '#FF9F43' : '#6B7280', display: 'flex', alignItems: 'center', gap: '0.5rem' })}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/purchase-dashboard' ? '#FF9F43' : '#D1D5DB' }}></div>
                    Dashboard
                  </NavLink>
                </li>
                <li style={{ marginBottom: '0.75rem' }}>
                  <NavLink to="/vendors" style={({ isActive }) => ({ textDecoration: 'none', fontSize: '0.875rem', color: isActive ? '#FF9F43' : '#6B7280', display: 'flex', alignItems: 'center', gap: '0.5rem' })}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/vendors' ? '#FF9F43' : '#D1D5DB' }}></div>
                    Vendors
                  </NavLink>
                </li>
                 <li style={{ marginBottom: '0.75rem' }}>
                  <NavLink to="/purchase-orders" style={({ isActive }) => ({ textDecoration: 'none', fontSize: '0.875rem', color: isActive ? '#FF9F43' : '#6B7280', display: 'flex', alignItems: 'center', gap: '0.5rem' })}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/purchase-orders' ? '#FF9F43' : '#D1D5DB' }}></div>
                    Purchase Orders
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/purchase-reports" style={({ isActive }) => ({ textDecoration: 'none', fontSize: '0.875rem', color: isActive ? '#FF9F43' : '#6B7280', display: 'flex', alignItems: 'center', gap: '0.5rem' })}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/purchase-reports' ? '#FF9F43' : '#D1D5DB' }}></div>
                    Reports
                  </NavLink>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>

      <div className={styles.menuGroup}>
        <div className={styles.menuTitle}>Promo</div>
        <ul className={styles.menuList}>
          <li>
            <NavLink to="/coupons" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
              <FileCheck size={18} />
              <span>Coupons</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/gift-cards" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
              <Box size={18} />
              <span>Gift Cards</span>
            </NavLink>
          </li>
          <li>
            <div className={isDiscountExpanded ? `${styles.menuItem} ${styles.active}` : styles.menuItem} style={{ cursor: 'pointer', marginBottom: isDiscountExpanded ? '0' : '0.5rem' }} onClick={() => navigate('/discount-plan')}>
              <FileText size={18} />
              <span>Discount</span>
            </div>
            {isDiscountExpanded && (
              <ul style={{ listStyle: 'none', paddingLeft: '2.5rem', margin: '0.5rem 0 1rem 0' }}>
                <li style={{ marginBottom: '0.75rem' }}>
                  <NavLink to="/discount-plan" style={({ isActive }) => ({ textDecoration: 'none', fontSize: '0.875rem', color: isActive ? '#FF9F43' : '#6B7280', display: 'flex', alignItems: 'center', gap: '0.5rem' })}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/discount-plan' ? '#FF9F43' : '#D1D5DB' }}></div>
                    Discount Plan
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/discounts" style={({ isActive }) => ({ textDecoration: 'none', fontSize: '0.875rem', color: isActive ? '#FF9F43' : '#6B7280', display: 'flex', alignItems: 'center', gap: '0.5rem' })}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/discounts' ? '#FF9F43' : '#D1D5DB' }}></div>
                    Discount
                  </NavLink>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>

      <div className={styles.menuGroup}>
        <div className={styles.menuTitle}>Finance & Accounts</div>
        <ul className={styles.menuList}>
          <li>
            <div className={isExpensesExpanded ? `${styles.menuItem} ${styles.active}` : styles.menuItem} style={{ cursor: 'pointer', marginBottom: isExpensesExpanded ? '0' : '0.5rem' }} onClick={() => navigate('/expenses')}>
              <FileText size={18} />
              <span>Expenses</span>
            </div>
            {isExpensesExpanded && (
              <ul style={{ listStyle: 'none', paddingLeft: '2.5rem', margin: '0.5rem 0 1rem 0' }}>
                <li style={{ marginBottom: '0.75rem' }}>
                  <NavLink to="/expenses" style={({ isActive }) => ({ textDecoration: 'none', fontSize: '0.875rem', color: isActive ? '#FF9F43' : '#6B7280', display: 'flex', alignItems: 'center', gap: '0.5rem' })}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/expenses' ? '#FF9F43' : '#D1D5DB' }}></div>
                    Expenses
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/expense-category" style={({ isActive }) => ({ textDecoration: 'none', fontSize: '0.875rem', color: isActive ? '#FF9F43' : '#6B7280', display: 'flex', alignItems: 'center', gap: '0.5rem' })}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/expense-category' ? '#FF9F43' : '#D1D5DB' }}></div>
                    Expense Category
                  </NavLink>
                </li>
              </ul>
            )}
          </li>
          <li>
            <div className={isIncomeExpanded ? `${styles.menuItem} ${styles.active}` : styles.menuItem} style={{ cursor: 'pointer', marginBottom: isIncomeExpanded ? '0' : '0.5rem' }} onClick={() => navigate('/income')}>
              <FileCheck size={18} />
              <span>Income</span>
            </div>
            {isIncomeExpanded && (
              <ul style={{ listStyle: 'none', paddingLeft: '2.5rem', margin: '0.5rem 0 1rem 0' }}>
                <li style={{ marginBottom: '0.75rem' }}>
                  <NavLink to="/income" style={({ isActive }) => ({ textDecoration: 'none', fontSize: '0.875rem', color: isActive ? '#FF9F43' : '#6B7280', display: 'flex', alignItems: 'center', gap: '0.5rem' })}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/income' ? '#FF9F43' : '#D1D5DB' }}></div>
                    Income List
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/income-category" style={({ isActive }) => ({ textDecoration: 'none', fontSize: '0.875rem', color: isActive ? '#FF9F43' : '#6B7280', display: 'flex', alignItems: 'center', gap: '0.5rem' })}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/income-category' ? '#FF9F43' : '#D1D5DB' }}></div>
                    Income Category
                  </NavLink>
                </li>
              </ul>
            )}
          </li>
          <li>
            <NavLink to="/bank-accounts" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
              <Landmark size={18} />
              <span>Bank Accounts</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/money-transfer" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
              <ArrowRightLeft size={18} />
              <span>Money Transfer</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/balance-sheet" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
              <FileSpreadsheet size={18} />
              <span>Balance Sheet</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/trial-balance" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
              <AlertCircle size={18} />
              <span>Trial Balance</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/cash-flow" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
              <Search size={18} />
              <span>Cash Flow</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/account-statement" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
              <FileText size={18} />
              <span>Account Statement</span>
            </NavLink>
          </li>
        </ul>
      </div>

      <div className={styles.menuGroup}>
        <div className={styles.menuTitle}>Reports</div>
        <ul className={styles.menuList}>
          <li>
            <div className={isReportsExpanded ? `${styles.menuItem} ${styles.active}` : styles.menuItem} style={{ cursor: 'pointer', marginBottom: isReportsExpanded ? '0' : '0.5rem' }} onClick={() => navigate('/sales-report')}>
              <BarChart size={18} />
              <span>Sales Report</span>
            </div>
            {isReportsExpanded && (
              <ul style={{ listStyle: 'none', paddingLeft: '2.5rem', margin: '0.5rem 0 1rem 0' }}>
                <li style={{ marginBottom: '0.75rem' }}>
                  <NavLink to="/sales-report" style={({ isActive }) => ({ textDecoration: 'none', fontSize: '0.875rem', color: isActive ? '#FF9F43' : '#6B7280', display: 'flex', alignItems: 'center', gap: '0.5rem' })}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/sales-report' ? '#FF9F43' : '#D1D5DB' }}></div>
                    Sales Report
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/best-seller" style={({ isActive }) => ({ textDecoration: 'none', fontSize: '0.875rem', color: isActive ? '#FF9F43' : '#6B7280', display: 'flex', alignItems: 'center', gap: '0.5rem' })}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/best-seller' ? '#FF9F43' : '#D1D5DB' }}></div>
                    Best Seller
                  </NavLink>
                </li>
              </ul>
            )}
          </li>
          <li>
            <NavLink to="/purchase-report" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
              <Clock size={18} />
              <span>Purchase report</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/inventory-report" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
              <Filter size={18} />
              <span>Inventory Report</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/invoice-report" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
              <DollarSign size={18} />
              <span>Invoice Report</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/supplier-report" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
              <UserPlus size={18} />
              <span>Supplier Report</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/customer-report" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
              <UserCheck size={18} />
              <span>Customer Report</span>
            </NavLink>
          </li>
        </ul>
      </div>

      <div className={styles.menuGroup}>
        <div className={styles.menuTitle}>User Management</div>
        <ul className={styles.menuList}>
          <li>
            <NavLink to="/users" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
              <UserPlus size={18} />
              <span>Users</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/roles-permissions" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
              <UserCheck size={18} />
              <span>Roles & Permissions</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/delete-account-request" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
              <UserCheck size={18} />
              <span>Delete Account Request</span>
            </NavLink>
          </li>
        </ul>
      </div>

      <div className={styles.menuGroup}>
        <div className={styles.menuTitle}>Pages</div>
        <ul className={styles.menuList}>
          <li>
            <NavLink to="/profile" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>
              <UserPlus size={18} />
              <span>Profile</span>
            </NavLink>
          </li>
        </ul>
      </div>

      <div style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', color: '#9CA3AF', borderTop: '1px solid #F3F4F6', marginTop: 'auto' }}>
        Developed & Maintained by <a href="https://www.metawish.ai" target="_blank" rel="noopener noreferrer" style={{ color: '#FF9F43', fontWeight: 600, textDecoration: 'none' }}>Metawish</a>
      </div>
    </aside>
  );
};

export default Sidebar;
