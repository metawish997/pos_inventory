const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
    name: { type: String, required: true },
    planType: { type: String, default: 'General' },
    discountType: { type: String, enum: ['Percentage', 'Fixed'], default: 'Percentage' },
    value: { type: Number, required: true, min: 0 },
    validFrom: { type: Date, default: Date.now },
    validTo: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Discount', discountSchema);
