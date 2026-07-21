const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
    incomeNumber: { type: String, unique: true, sparse: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'IncomeCategory', required: true },
    amount: { type: Number, required: true, min: 0 },
    incomeDate: { type: Date, default: Date.now },
    paymentType: { type: String, enum: ['Cash', 'Card', 'UPI', 'Bank Transfer', 'Other'], default: 'Cash' },
    referenceNo: { type: String, default: '' },
    notes: { type: String, default: '' }
}, { timestamps: true });

incomeSchema.pre('save', async function () {
    if (this.isNew && !this.incomeNumber) {
        const count = await mongoose.model('Income').countDocuments();
        this.incomeNumber = `INC-${String(count + 1).padStart(4, '0')}`;
    }
});

module.exports = mongoose.model('Income', incomeSchema);
