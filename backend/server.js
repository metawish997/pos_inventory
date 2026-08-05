// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Destructure it here explicitly
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const inventoryRoutes = require('./routes/inventoryMasterRoutes');
const productRoutes = require('./routes/productRoutes')
const uploadRoutes = require('./routes/uploadRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const purchaseReturnRoutes = require('./routes/purchaseReturnRoutes');
const purchaseReportRoutes = require('./routes/purchaseReportRoutes');
const saleRoutes = require('./routes/saleRoutes');
const promoRoutes = require('./routes/promoRoutes');
const financeRoutes = require('./routes/financeRoutes');
const userRoutes = require('./routes/userRoutes');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/purchase-returns', purchaseReturnRoutes);
app.use('/api/purchase-reports', purchaseReportRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/promo', promoRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/delivery-challans', require('./routes/deliveryChallanRoutes'));
app.use('/api/company-settings', require('./routes/companySettingsRoutes'));
app.use('/api/hsn-sac', require('./routes/hsnSacRoutes'));
app.use('/api/gst', require('./routes/gstReportRoutes'));
app.use('/api/terms-templates', require('./routes/termsTemplateRoutes'));
app.use('/api/column-settings', require('./routes/columnSettingsRoutes'));

const eventService = require('./services/eventService');
app.get('/api/events', (req, res) => {
  eventService.addClient(req, res);
});

// Serve uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to DB and seed after routes are mounted
connectDB().then(() => {
    const seedRBAC = require('./seeder/rbacSeeder');
    seedRBAC(app);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server executing seamlessly on port ${PORT}`);
});