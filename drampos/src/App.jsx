import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/ProductList';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import ProductDetails from './pages/ProductDetails';
import ExpiredProducts from './pages/ExpiredProducts';
import LowStocks from './pages/LowStocks';

import CategoryList from './pages/CategoryList';
import SubCategoryList from './pages/SubCategoryList';
import BrandList from './pages/BrandList';
import VariantList from './pages/VariantList';
import WarrantyList from './pages/WarrantyList';
import PrintBarcode from './pages/PrintBarcode';

import ManageStock from './pages/ManageStock';
import StockAdjustment from './pages/StockAdjustment';
import StockTransfer from './pages/StockTransfer';
import SalesList from './pages/SalesList';
import PosOrdersList from './pages/PosOrdersList';
import InvoiceList from './pages/InvoiceList';
import InvoiceDetails from './pages/InvoiceDetails';
import SalesReturnList from './pages/SalesReturnList';
import QuotationList from './pages/QuotationList';
import QuotationDetails from './pages/QuotationDetails';
import POS from './pages/POS';
import PurchaseList from './pages/PurchaseList';
import PurchaseOrderList from './pages/PurchaseOrderList';
import PurchaseReturnsList from './pages/PurchaseReturnsList';

import PurchaseDashboard from './modules/purchase/pages/Dashboard/PurchaseDashboard';
import VendorList from './modules/purchase/pages/Vendor/VendorList';
import AddVendor from './modules/purchase/pages/Vendor/AddVendor';
import PurchaseOrders from './modules/purchase/pages/Purchase/PurchaseList';
import AddPurchase from './modules/purchase/pages/Purchase/AddPurchase';
import PurchaseDetails from './modules/purchase/pages/Purchase/PurchaseDetails';
import DraftPurchases from './modules/purchase/pages/Purchase/DraftPurchases';
import PurchaseReturn from './modules/purchase/pages/Returns/PurchaseReturn';
import PurchaseReports from './modules/purchase/pages/Reports/PurchaseReports';
import CouponsList from './pages/CouponsList';
import GiftCardsList from './pages/GiftCardsList';
import DiscountPlanList from './pages/DiscountPlanList';
import DiscountList from './pages/DiscountList';
import ExpensesList from './pages/ExpensesList';
import ExpenseCategoryList from './pages/ExpenseCategoryList';
import IncomeList from './pages/IncomeList';
import IncomeCategoryList from './pages/IncomeCategoryList';
import BankAccountsList from './pages/BankAccountsList';
import AccountTypeList from './pages/AccountTypeList';
import MoneyTransferList from './pages/MoneyTransferList';
import BalanceSheet from './pages/BalanceSheet';
import TrialBalance from './pages/TrialBalance';
import CashFlow from './pages/CashFlow';
import AccountStatement from './pages/AccountStatement';
import CustomersList from './pages/CustomersList';
import BillersList from './pages/BillersList';
import SuppliersList from './pages/SuppliersList';
import StoresList from './pages/StoresList';
import WarehousesList from './pages/WarehousesList';
import SalesReport from './pages/SalesReport';
import BestSeller from './pages/BestSeller';
import PurchaseReport from './pages/PurchaseReport';
import InvoiceReport from './pages/InvoiceReport';
import SupplierReport from './pages/SupplierReport';
import SupplierDueReport from './pages/SupplierDueReport';
import CustomerReport from './pages/CustomerReport';
import CustomerDueReport from './pages/CustomerDueReport';
import ProductReport from './pages/ProductReport';
import ProductExpiryReport from './pages/ProductExpiryReport';
import ProductQuantityAlert from './pages/ProductQuantityAlert';
import ExpenseReport from './pages/ExpenseReport';
import TaxReport from './pages/TaxReport';
import TaxList from './pages/TaxList';
import ProfitAndLoss from './pages/ProfitAndLoss';
import AnnualReport from './pages/AnnualReport';
import POSSettings from './pages/POSSettings';

import UsersList from './pages/UsersList';
import RolesPermissions from './pages/RolesPermissions';
import DeleteAccountRequest from './pages/DeleteAccountRequest';

import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import ForgotPassword from './pages/ForgotPassword';
import LockScreen from './pages/LockScreen';
import Error404 from './pages/Error404';
import Error500 from './pages/Error500';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/lock-screen" element={<LockScreen />} />
        <Route path="/error-404" element={<Error404 />} />
        <Route path="/error-500" element={<Error500 />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/create-product" element={<AddProduct />} />
          <Route path="/edit-product/:id" element={<EditProduct />} />
          <Route path="/product-details" element={<ProductDetails />} />
          <Route path="/product-details/:id" element={<ProductDetails />} />
          <Route path="/expired-products" element={<ExpiredProducts />} />
          <Route path="/low-stocks" element={<LowStocks />} />
          <Route path="/categories" element={<CategoryList />} />
          <Route path="/sub-categories" element={<SubCategoryList />} />
          <Route path="/brands" element={<BrandList />} />
          <Route path="/variants" element={<VariantList />} />
          <Route path="/taxes" element={<TaxList />} />
          <Route path="/warranties" element={<WarrantyList />} />
          <Route path="/print-barcode" element={<PrintBarcode />} />

          <Route path="/manage-stock" element={<ManageStock />} />
          <Route path="/stock-adjustment" element={<StockAdjustment />} />
          <Route path="/stock-transfer" element={<StockTransfer />} />
          <Route path="/sales" element={<SalesList />} />
          <Route path="/pos-orders" element={<PosOrdersList />} />
          <Route path="/invoices" element={<InvoiceList />} />
          <Route path="/invoice-details" element={<InvoiceDetails />} />
          <Route path="/sales-return" element={<SalesReturnList />} />
          <Route path="/quotation" element={<QuotationList />} />
          <Route path="/quotation-details" element={<QuotationDetails />} />
          <Route path="/pos" element={<POS />} />
          <Route path="/pos-settings" element={<POSSettings />} />
          <Route path="/purchases" element={<PurchaseList />} />
          <Route path="/purchase-orders" element={<PurchaseOrderList />} />
          <Route path="/purchase-returns" element={<PurchaseReturnsList />} />

          {/* Purchase Management Module */}
          <Route path="/purchase-dashboard" element={<PurchaseDashboard />} />
          <Route path="/vendors" element={<VendorList />} />
          <Route path="/create-vendor" element={<AddVendor />} />
          <Route path="/edit-vendor/:id" element={<AddVendor />} />
          <Route path="/purchase-orders-new" element={<PurchaseOrders />} />
          <Route path="/create-purchase" element={<AddPurchase />} />
          <Route path="/edit-purchase/:id" element={<AddPurchase />} />
          <Route path="/purchase-details/:id" element={<PurchaseDetails />} />
          <Route path="/draft-purchases" element={<DraftPurchases />} />
          <Route path="/purchase-returns-new" element={<PurchaseReturn />} />
          <Route path="/purchase-reports" element={<PurchaseReports />} />
          <Route path="/coupons" element={<CouponsList />} />
          <Route path="/gift-cards" element={<GiftCardsList />} />
          <Route path="/discount-plan" element={<DiscountPlanList />} />
          <Route path="/discounts" element={<DiscountList />} />
          <Route path="/expenses" element={<ExpensesList />} />
          <Route path="/expense-category" element={<ExpenseCategoryList />} />
          <Route path="/income" element={<IncomeList />} />
          <Route path="/income-category" element={<IncomeCategoryList />} />
          <Route path="/bank-accounts" element={<BankAccountsList />} />
          <Route path="/account-type" element={<AccountTypeList />} />
          <Route path="/money-transfer" element={<MoneyTransferList />} />
          <Route path="/balance-sheet" element={<BalanceSheet />} />
          <Route path="/trial-balance" element={<TrialBalance />} />
          <Route path="/cash-flow" element={<CashFlow />} />
          <Route path="/account-statement" element={<AccountStatement />} />
          <Route path="/customers" element={<CustomersList />} />
          <Route path="/billers" element={<BillersList />} />
          <Route path="/suppliers" element={<SuppliersList />} />
          <Route path="/stores" element={<StoresList />} />
          <Route path="/warehouses" element={<WarehousesList />} />
          <Route path="/sales-report" element={<SalesReport />} />
          <Route path="/best-seller" element={<BestSeller />} />
          <Route path="/purchase-report" element={<PurchaseReport />} />
          <Route path="/invoice-report" element={<InvoiceReport />} />
          <Route path="/supplier-report" element={<SupplierReport />} />
          <Route path="/supplier-due-report" element={<SupplierDueReport />} />
          <Route path="/customer-report" element={<CustomerReport />} />
          <Route path="/customer-due-report" element={<CustomerDueReport />} />
          <Route path="/product-report" element={<ProductReport />} />
          <Route path="/product-expiry-report" element={<ProductExpiryReport />} />
          <Route path="/product-quantity-alert" element={<ProductQuantityAlert />} />
          <Route path="/expense-report" element={<ExpenseReport />} />
          <Route path="/tax-report" element={<TaxReport />} />
          <Route path="/profit-and-loss" element={<ProfitAndLoss />} />
          <Route path="/annual-report" element={<AnnualReport />} />

          <Route path="/users" element={<UsersList />} />
          <Route path="/roles-permissions" element={<RolesPermissions />} />
          <Route path="/delete-account-request" element={<DeleteAccountRequest />} />

          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
