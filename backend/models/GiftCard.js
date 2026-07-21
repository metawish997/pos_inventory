const mongoose = require('mongoose');

const giftCardSchema = new mongoose.Schema({
    cardNo: { type: String, required: true, unique: true },
    customerName: { type: String, default: 'Walk-in Customer' },
    customerEmail: { type: String, default: '' },
    customerPhone: { type: String, default: '' },
    amount: { type: Number, required: true, min: 0 },
    balance: { type: Number, required: true, min: 0 },
    expiryDate: { type: Date, default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) },
    status: { type: String, enum: ['Active', 'Inactive', 'Redeemed'], default: 'Active' }
}, { timestamps: true });

giftCardSchema.pre('save', function (next) {
    if (this.isNew && this.balance === undefined) {
        this.balance = this.amount;
    }
    next();
});

module.exports = mongoose.model('GiftCard', giftCardSchema);
