# Future Module: Multi-Store & Warehouse Data Isolation

This document outlines the architecture and changes required to implement complete multi-outlet (store-wise) isolation in the POS & Inventory ERP.

---

## 1. Database Schema Updates

### Associate Users to Stores
Update the User model (`backend/models/User.js`) to link non-admin users to a specific store outlet:
```javascript
// Add to userSchema
store: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Store',
  default: null // null indicates super_admin / global access
}
```

---

## 2. Authentication Middleware Scope

Update the authorization middleware (`backend/middleware/authMiddleware.js`) to append the user's store context to the incoming request object:
* When verify token is run, select `store` during `User.findById` database checks.
* Add store context helper to requests:
  ```javascript
  req.storeId = req.user.store || null;
  req.isGlobalAdmin = req.user.role.name === 'super_admin';
  ```

---

## 3. Controller-Level Scoping & Filtering

For any CRUD/Fetch controller, check the user's permissions and scope data accordingly:

### A. Sales & Invoices (`backend/controllers/saleController.js`)
* **Fetching Sales/Invoices:**
  ```javascript
  const query = {};
  if (!req.isGlobalAdmin && req.storeId) {
    query.store = req.storeId;
  }
  const sales = await Sale.find(query).populate('items.product');
  ```
* **Saving Sales/Invoices:** Assign the user's assigned store automatically:
  ```javascript
  const sale = new Sale({
    ...req.body,
    store: req.isGlobalAdmin ? req.body.store : req.storeId
  });
  ```

### B. Products & Stock Valuations (`backend/controllers/productController.js`)
* Scope products, category counts, low-stock notifications, and inventory reports relative to the logged-in user's store context:
  ```javascript
  const query = {};
  if (!req.isGlobalAdmin && req.storeId) {
    query.store = req.storeId;
  }
  // Load stock balances corresponding to the scoped store
  const stock = await Stock.find(query);
  ```

---

## 4. Frontend Scoping & UI Restrictions

* **Dashboard Metrics:** Ensure all sales numbers, invoice totals, and inventory counts shown in the layout dashboards are filtered by the logged-in user's assigned store location.
* **Store Selection Dropdowns:** Lock store selection fields on forms (such as in billing POS/purchasing) to the user's assigned store when logged in as a store-operator, hiding other locations.
