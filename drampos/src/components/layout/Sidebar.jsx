import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { 
  Home, Package, Box, LayoutGrid, AlertCircle, TrendingDown, List, Layers, Award, 
  FileText, FileCheck, Barcode, QrCode, PackageCheck, ArrowRightLeft, Truck, 
  ShoppingCart, ShoppingBag, Landmark, DollarSign, Activity, FileSpreadsheet, Search, 
  Users, UserCheck, UserPlus, Store, Building, BarChart, Clock, Filter, PieChart, 
  Calendar, Percent, X, PlusCircle, FilePlus, ClipboardList, RotateCcw, TrendingUp,
  ChevronDown, ChevronUp
} from 'lucide-react';

const Sidebar = ({ isCollapsed, isMobileOpen, closeMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [expandedSections, setExpandedSections] = React.useState({
    inventory: location.pathname.includes('inventory') || location.pathname.includes('product') || location.pathname.includes('categor') || location.pathname.includes('brand') || location.pathname.includes('variant') || location.pathname.includes('store') || location.pathname.includes('warehouse') || location.pathname.includes('warrant') || location.pathname.includes('barcode') || location.pathname.includes('qrcode') || location.pathname.includes('expired'),
    taxMasters: location.pathname.includes('tax'),
    stock: location.pathname.includes('stock'),
    sales: location.pathname.includes('sales') || location.pathname.includes('pos') || location.pathname.includes('invoice') || location.pathname.includes('quotation') || location.pathname.includes('challan'),
    purchase: location.pathname.includes('purchase') || location.pathname.includes('vendor') || location.pathname.includes('draft'),
    promo: location.pathname.includes('coupon') || location.pathname.includes('gift') || location.pathname.includes('discount'),
    finance: location.pathname.includes('expense') || location.pathname.includes('income') || location.pathname.includes('bank') || location.pathname.includes('transfer') || location.pathname.includes('sheet') || location.pathname.includes('balance') || location.pathname.includes('flow') || location.pathname.includes('statement'),
    reports: location.pathname.includes('report') || location.pathname.includes('best'),
    userManagement: location.pathname.includes('user') || location.pathname.includes('role') || location.pathname.includes('permission') || location.pathname.includes('delete')
  });

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
    }
  }, []);

  const toggleSection = (section, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setExpandedSections(prev => {
      const nextState = {};
      Object.keys(prev).forEach(key => {
        nextState[key] = false;
      });
      nextState[section] = !prev[section];
      return nextState;
    });
  };

  const renderSidebarItem = (sectionKey, path, icon, label, subItems) => {
    const isExpanded = expandedSections[sectionKey];
    const hasSubItems = subItems && subItems.length > 0;
    const isPathActive = location.pathname === path || (hasSubItems && subItems.some(sub => location.pathname === sub.path));

    return (
      <li style={{ listStyle: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', position: 'relative' }}>
          <NavLink 
            to={path} 
            className={({ isActive }) => isActive || isPathActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}
            style={{ flex: 1, paddingRight: hasSubItems ? '2.5rem' : '1rem' }}
            onClick={() => {
              if (hasSubItems) {
                toggleSection(sectionKey);
              }
            }}
          >
            {icon}
            <span>{label}</span>
          </NavLink>
          {hasSubItems && (
            <button
              onClick={(e) => toggleSection(sectionKey, e)}
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: isPathActive ? '#FF9F43' : '#6B7280',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px',
                zIndex: 2
              }}
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          )}
        </div>
        {hasSubItems && (
          <ul className={`${styles.submenu} ${isExpanded ? styles.open : ''}`}>
            {subItems.map((sub, idx) => (
              <li key={idx} style={{ marginBottom: '0.75rem' }}>
                <NavLink 
                  to={sub.path} 
                  style={({ isActive }) => ({ 
                    textDecoration: 'none', 
                    fontSize: '0.84rem', 
                    color: isActive ? '#FF9F43' : '#6B7280', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    fontWeight: isActive ? 600 : 500
                  })}
                >
                  <div style={{ 
                    width: '6px', 
                    height: '6px', 
                    borderRadius: '50%', 
                    backgroundColor: location.pathname === sub.path ? '#FF9F43' : '#D1D5DB' 
                  }}></div>
                  {sub.name}
                </NavLink>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  };

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
        <div className={styles.menuTitle}>Main Navigation</div>
        <ul className={styles.menuList}>
          {renderSidebarItem('dashboard', '/', <Home size={18} />, 'Dashboard')}
          {renderSidebarItem('salesDashboard', '/sales-index', <LayoutGrid size={18} />, 'Sales Dashboard')}
          
          {renderSidebarItem('sales', '/sales-index', <ShoppingCart size={18} />, 'Sales', [
            { name: "POS Terminal", path: "/pos" },
            { name: "Online Orders", path: "/sales" },
            { name: "POS Orders", path: "/pos-orders" },
            { name: "Tax Invoices", path: "/invoices" },
            { name: "Proforma Invoices", path: "/proforma-invoices" },
            { name: "Sales Return", path: "/sales-return" },
            { name: "Quotations", path: "/quotation" },
            { name: "Delivery Challans", path: "/delivery-challans" }
          ])}
          
          {renderSidebarItem('inventory', '/inventory-index', <Package size={18} />, 'Inventory', [
            { name: "Products List", path: "/products" },
            { name: "Create Product", path: "/create-product" },
            { name: "Expired Products", path: "/expired-products" },
            { name: "Low Stocks", path: "/low-stocks" },
            { name: "Categories", path: "/categories" },
            { name: "Sub Categories", path: "/sub-categories" },
            { name: "Brands", path: "/brands" },
            { name: "Variant Attributes", path: "/variants" },
            { name: "Stores", path: "/stores" },
            { name: "Warehouses", path: "/warehouses" },
            { name: "Warranties", path: "/warranties" },
            { name: "Print Barcode", path: "/print-barcode" },
            { name: "Print QR Code", path: "/print-qrcode" }
          ])}

          {renderSidebarItem('taxMasters', '/tax-masters-index', <Percent size={18} />, 'Tax Masters', [
            { name: "Tax Slabs", path: "/taxes" }
          ])}

          {renderSidebarItem('stock', '/stock-index', <PackageCheck size={18} />, 'Stock', [
            { name: "Manage Stock", path: "/manage-stock" },
            { name: "Stock Adjustment", path: "/stock-adjustment" },
            { name: "Stock Transfer", path: "/stock-transfer" }
          ])}


          {renderSidebarItem('purchase', '/purchase-index', <ShoppingBag size={18} />, 'Purchase', [
            { name: "Purchases Dashboard", path: "/purchase-dashboard" },
            { name: "Vendors List", path: "/vendors" },
            { name: "Purchase Orders", path: "/purchase-orders" },
            { name: "Create Purchase", path: "/create-purchase" },
            { name: "Draft Purchases", path: "/draft-purchases" },
            { name: "Purchase Returns", path: "/purchase-returns" }
          ])}

          {renderSidebarItem('promo', '/promo-index', <Award size={18} />, 'Promo', [
            { name: "Coupons", path: "/coupons" },
            { name: "Gift Cards", path: "/gift-cards" },
            { name: "Discount Plan", path: "/discount-plan" },
            { name: "Discounts List", path: "/discounts" }
          ])}

          {renderSidebarItem('finance', '/finance-index', <Landmark size={18} />, 'Finance and Accounting', [
            { name: "Expenses List", path: "/expenses" },
            { name: "Expense Category", path: "/expense-category" },
            { name: "Income List", path: "/income" },
            { name: "Income Category", path: "/income-category" },
            { name: "Bank Accounts", path: "/bank-accounts" },
            { name: "Money Transfer", path: "/money-transfer" },
            { name: "Balance Sheet", path: "/balance-sheet" },
            { name: "Trial Balance", path: "/trial-balance" },
            { name: "Cash Flow", path: "/cash-flow" },
            { name: "Account Statement", path: "/account-statement" }
          ])}

          {renderSidebarItem('reports', '/reports-index', <BarChart size={18} />, 'Reports', [
            { name: "Sales Report", path: "/sales-report" },
            { name: "Best Sellers", path: "/best-seller" },
            { name: "Purchase Report", path: "/purchase-report" },
            { name: "Inventory Report", path: "/inventory-report" },
            { name: "Invoice Report", path: "/invoice-report" },
            { name: "Supplier Report", path: "/supplier-report" },
            { name: "Customer Report", path: "/customer-report" }
          ])}

          {renderSidebarItem('userManagement', '/user-management-index', <Users size={18} />, 'User Management', [
            { name: "Users List", path: "/users" },
            { name: "Roles & Permissions", path: "/roles-permissions" },
            { name: "Delete Account Request", path: "/delete-account-request" }
          ])}
        </ul>
      </div>


      <div style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', color: '#9CA3AF', borderTop: '1px solid #F3F4F6', marginTop: 'auto' }}>
        Developed & Maintained by <a href="https://www.metawish.ai" target="_blank" rel="noopener noreferrer" style={{ color: '#FF9F43', fontWeight: 600, textDecoration: 'none' }}>Metawish</a>
      </div>
    </aside>
  );
};

export default Sidebar;
