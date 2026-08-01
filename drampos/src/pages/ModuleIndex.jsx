import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { 
  Package, Box, AlertCircle, TrendingDown, List, Layers, Award, FileText, FileCheck, 
  Barcode, QrCode, Store, Building, Percent, PackageCheck, ArrowRightLeft, Truck,
  ShoppingCart, ShoppingBag, Landmark, DollarSign, Activity, FileSpreadsheet, Search,
  Users, UserCheck, UserPlus, BarChart, Clock, Filter, PieChart, Calendar, PlusCircle,
  TrendingUp
} from 'lucide-react';

const moduleConfigs = {
  inventory: {
    title: "Inventory & Products",
    description: "Manage products, sub-categories, variant attributes, and store-wise listings",
    items: [
      { name: "Product Catalog", desc: "View and edit products", path: "/products", icon: <Package size={24} color="#28C76F" /> },
      { name: "Create Product", desc: "Add new products to catalog", path: "/create-product", icon: <Box size={24} color="#7367F0" /> },
      { name: "Expired Products", desc: "Check logs of expired stock", path: "/expired-products", icon: <AlertCircle size={24} color="#EA5455" /> },
      { name: "Low Stocks", desc: "View items running low", path: "/low-stocks", icon: <TrendingDown size={24} color="#FF9F43" /> },
      { name: "Category List", desc: "Manage main categories", path: "/categories", icon: <List size={24} color="#00CFE8" /> },
      { name: "Sub Category", desc: "Manage sub-categories", path: "/sub-categories", icon: <Layers size={24} color="#1B2850" /> },
      { name: "Brands", desc: "Manage product brands", path: "/brands", icon: <Award size={24} color="#7367F0" /> },
      { name: "Variant Attributes", desc: "Manage sizing/colors", path: "/variants", icon: <FileText size={24} color="#28C76F" /> },
      { name: "Stores", desc: "Manage outlet stores", path: "/stores", icon: <Store size={24} color="#FF9F43" /> },
      { name: "Warehouses", desc: "Manage inventory warehouses", path: "/warehouses", icon: <Building size={24} color="#00CFE8" /> },
      { name: "Warranties", desc: "Manage product warranty terms", path: "/warranties", icon: <FileCheck size={24} color="#1B2850" /> },
      { name: "Print Barcode", desc: "Generate barcode sheets", path: "/print-barcode", icon: <Barcode size={24} color="#7367F0" /> },
      { name: "Print QR Code", desc: "Generate QR codes for items", path: "/print-qrcode", icon: <QrCode size={24} color="#28C76F" /> }
    ]
  },
  'tax-masters': {
    title: "Tax Masters",
    description: "Manage system-wide tax configurations and slabs",
    items: [
      { name: "Tax Slabs", desc: "View and edit tax configurations", path: "/taxes", icon: <Percent size={24} color="#7367F0" /> }
    ]
  },
  stock: {
    title: "Stock Management",
    description: "Manually adjust stock quantities or dispatch transfers between outlets",
    items: [
      { name: "Manage Stock", desc: "Manual stock overrides", path: "/manage-stock", icon: <PackageCheck size={24} color="#28C76F" /> },
      { name: "Stock Adjustment", desc: "Log stock value changes", path: "/stock-adjustment", icon: <ArrowRightLeft size={24} color="#FF9F43" /> },
      { name: "Stock Transfer", desc: "Dispatch stock to other stores", path: "/stock-transfer", icon: <Truck size={24} color="#7367F0" /> }
    ]
  },
  sales: {
    title: "Sales Billing & POS",
    description: "Access billing point-of-sale screens, list orders, or dispatch returns",
    items: [
      { name: "POS Terminal", desc: "Point of Sale billing screen", path: "/pos", icon: <ShoppingCart size={24} color="#28C76F" /> },
      { name: "Online Orders", desc: "View online customer orders", path: "/sales", icon: <ShoppingBag size={24} color="#7367F0" /> },
      { name: "POS Orders", desc: "View registers' POS history", path: "/pos-orders", icon: <ShoppingCart size={24} color="#FF9F43" /> },
      { name: "Tax Invoices", desc: "Tax invoices management", path: "/invoices", icon: <FileText size={24} color="#00CFE8" /> },
      { name: "Proforma Invoices", desc: "Proforma billing list", path: "/proforma-invoices", icon: <Layers size={24} color="#EA5455" /> },
      { name: "Sales Return", desc: "Log sales returns and credits", path: "/sales-return", icon: <ArrowRightLeft size={24} color="#1B2850" /> },
      { name: "Quotations List", desc: "Quotations management", path: "/quotation", icon: <FileCheck size={24} color="#7367F0" /> },
      { name: "Delivery Challans", desc: "View active delivery challans", path: "/delivery-challans", icon: <Truck size={24} color="#28C76F" /> }
    ]
  },
  purchase: {
    title: "Purchase Management",
    description: "Manage supplier purchasing processes and draft orders",
    items: [
      { name: "Purchases Dashboard", desc: "Supplier analytics overview", path: "/purchase-dashboard", icon: <BarChart size={24} color="#FF9F43" /> },
      { name: "Vendors List", desc: "Manage supplier information", path: "/vendors", icon: <UserPlus size={24} color="#7367F0" /> },
      { name: "Purchase Orders", desc: "Manage supplier purchase orders", path: "/purchase-orders", icon: <ShoppingBag size={24} color="#28C76F" /> },
      { name: "Create Purchase", desc: "Draft a new purchase ledger", path: "/create-purchase", icon: <PlusCircle size={24} color="#00CFE8" /> },
      { name: "Draft Purchases", desc: "View draft purchase lists", path: "/draft-purchases", icon: <FileText size={24} color="#EA5455" /> },
      { name: "Purchase Returns", desc: "Log returns dispatched to vendor", path: "/purchase-returns", icon: <ArrowRightLeft size={24} color="#1B2850" /> }
    ]
  },
  promo: {
    title: "Promotions & Discounts",
    description: "Set up discounts, gift cards, and custom coupon campaigns",
    items: [
      { name: "Coupons", desc: "Manage promotion codes", path: "/coupons", icon: <FileCheck size={24} color="#28C76F" /> },
      { name: "Gift Cards", desc: "Manage physical/digital gift cards", path: "/gift-cards", icon: <Box size={24} color="#7367F0" /> },
      { name: "Discount Plan", desc: "Setup periodic discount rules", path: "/discount-plan", icon: <FileText size={24} color="#FF9F43" /> },
      { name: "Discounts List", desc: "Individual product discount rules", path: "/discounts", icon: <Percent size={24} color="#EA5455" /> }
    ]
  },
  finance: {
    title: "Finance & Accounts",
    description: "Configure banks, track corporate expenses/incomes, and audit statements",
    items: [
      { name: "Expenses List", desc: "Manage business expenditures", path: "/expenses", icon: <DollarSign size={24} color="#EA5455" /> },
      { name: "Expense Category", desc: "Configure expense labels", path: "/expense-category", icon: <List size={24} color="#FF9F43" /> },
      { name: "Income List", desc: "Manage business incomes", path: "/income", icon: <TrendingUp size={24} color="#28C76F" /> },
      { name: "Income Category", desc: "Configure income labels", path: "/income-category", icon: <List size={24} color="#7367F0" /> },
      { name: "Bank Accounts", desc: "Manage bank accounts and cards", path: "/bank-accounts", icon: <Landmark size={24} color="#00CFE8" /> },
      { name: "Money Transfer", desc: "Track cash/bank internal transfers", path: "/money-transfer", icon: <ArrowRightLeft size={24} color="#1B2850" /> },
      { name: "Balance Sheet", desc: "Audit business balance sheet", path: "/balance-sheet", icon: <FileSpreadsheet size={24} color="#7367F0" /> },
      { name: "Trial Balance", desc: "Audit trial balance statement", path: "/trial-balance", icon: <AlertCircle size={24} color="#28C76F" /> },
      { name: "Cash Flow", desc: "Audit statements of cash flows", path: "/cash-flow", icon: <Search size={24} color="#FF9F43" /> },
      { name: "Account Statement", desc: "View unified ledger statement", path: "/account-statement", icon: <FileText size={24} color="#EA5455" /> }
    ]
  },
  reports: {
    title: "Reports & Analytics",
    description: "View financial reports, product expiry, and stocks alerts",
    items: [
      { name: "Sales Report", desc: "Analyze general sales records", path: "/sales-report", icon: <BarChart size={24} color="#28C76F" /> },
      { name: "Best Sellers", desc: "View most-sold products log", path: "/best-seller", icon: <TrendingUp size={24} color="#7367F0" /> },
      { name: "Purchase Report", desc: "Analyze purchasing records", path: "/purchase-report", icon: <Clock size={24} color="#FF9F43" /> },
      { name: "Inventory Report", desc: "Current values and counts", path: "/inventory-report", icon: <Filter size={24} color="#00CFE8" /> },
      { name: "Invoice Report", desc: "Outstanding invoice counts", path: "/invoice-report", icon: <DollarSign size={24} color="#EA5455" /> },
      { name: "Supplier Report", desc: "Supplier balances overview", path: "/supplier-report", icon: <UserPlus size={24} color="#1B2850" /> },
      { name: "Customer Report", desc: "Customer balances overview", path: "/customer-report", icon: <UserCheck size={24} color="#7367F0" /> },
      { name: "GSTR-1 Sales Report", desc: "GST Outward Supplies Statement", path: "/gstr-1", icon: <FileText size={24} color="#7367F0" /> },
      { name: "GSTR-2B Purchase Report", desc: "GST Auto-drafted ITC Statement", path: "/gstr-2b", icon: <FileText size={24} color="#28C76F" /> },
      { name: "GSTR-3B Summary", desc: "GST Consolidated Summary Return", path: "/gstr-3b", icon: <FileText size={24} color="#FF9F43" /> }
    ]
  },
  'user-management': {
    title: "User Management",
    description: "Manage system operators, employee access, roles, and security policies",
    items: [
      { name: "Users", desc: "Manage operator accounts", path: "/users", icon: <UserPlus size={24} color="#7367F0" /> },
      { name: "Roles & Permissions", desc: "Manage security authorization rules", path: "/roles-permissions", icon: <UserCheck size={24} color="#28C76F" /> },
      { name: "Delete Account Request", desc: "View user account deletion requests", path: "/delete-account-request", icon: <AlertCircle size={24} color="#EA5455" /> }
    ]
  }
};

const ModuleIndex = ({ moduleId }) => {
  const navigate = useNavigate();
  const config = moduleConfigs[moduleId];

  if (!config) {
    return (
      <DashboardLayout>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Module Index not found.</h2>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#1B2850', marginBottom: '0.5rem' }}>
          {config.title}
        </h1>
        <p style={{ color: '#4B5563', fontSize: '1rem' }}>
          {config.description}
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '1.5rem' 
      }}>
        {config.items.map((item, i) => (
          <div 
            key={i} 
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '1px solid #E5E7EB',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '160px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)';
            }}
            onClick={() => navigate(item.path)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div style={{ paddingRight: '1rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1B2850', marginBottom: '0.35rem' }}>
                  {item.name}
                </h3>
                <p style={{ fontSize: '0.75rem', color: '#6B7280', lineHeight: 1.4 }}>
                  {item.desc}
                </p>
              </div>
              <div style={{ 
                width: '44px', 
                height: '44px', 
                borderRadius: '8px', 
                backgroundColor: '#F3F4F6', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {item.icon}
              </div>
            </div>

            <div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(item.path);
                }}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#1B2850',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.815rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d3f75'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1B2850'}
              >
                Click Here
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default ModuleIndex;
