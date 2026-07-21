const mongoose = require('mongoose');

const bankAccountSchema = new mongoose.Schema({
    accountName: { type: String, required: true },
    accountNumber: { type: String, required: true, unique: true },
    bankName: { type: String, required: true },
    branch: { type: String, default: '' },
    balance: { type: Number, default: 0 },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('BankAccount', bankAccountSchema);
