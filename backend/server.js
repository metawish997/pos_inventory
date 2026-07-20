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
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/purchase-returns', purchaseReturnRoutes);
app.use('/api/purchase-reports', purchaseReportRoutes);

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