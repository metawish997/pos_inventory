const mongoose = require('mongoose');

const incomeCategorySchema = new mongoose.Schema({
    categoryName: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('IncomeCategory', incomeCategorySchema);
