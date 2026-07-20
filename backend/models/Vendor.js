const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
    vendorCode: { type: String, unique: true, sparse: true },
    companyName: { type: String, default: '' },
    shopName: { type: String, default: '' },
    vendorName: { type: String, required: true },
    gstin: { type: String, default: '' },
    pan: { type: String, default: '' },
    email: { type: String, default: '' },
    mobile: { type: String, default: '' },
    phone: { type: String, default: '' },
    billingAddress: { type: String, default: '' },
    shippingAddress: { type: String, default: '' },
    shopAddress: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    country: { type: String, default: '' },
    pincode: { type: String, default: '' },
    paymentTerms: { type: String, default: '' },
    creditLimit: { type: Number, default: 0 },
    openingBalance: { type: Number, default: 0 },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    notes: { type: String, default: '' }
}, { timestamps: true });

// Auto-generate a unique vendor code (VEN-0001 ...)
vendorSchema.pre('save', async function () {
    if (this.isNew && !this.vendorCode) {
        const count = await mongoose.model('Vendor').countDocuments();
        this.vendorCode = `VEN-${String(count + 1).padStart(4, '0')}`;
    }
});

module.exports = mongoose.model('Vendor', vendorSchema);