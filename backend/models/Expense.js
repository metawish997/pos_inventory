const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    expenseNumber: { type: String, unique: true, sparse: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'ExpenseCategory', required: true },
    amount: { type: Number, required: true, min: 0 },
    expenseDate: { type: Date, default: Date.now },
    paymentType: { type: String, enum: ['Cash', 'Card', 'UPI', 'Bank Transfer', 'Other'], default: 'Cash' },
    referenceNo: { type: String, default: '' },
    notes: { type: String, default: '' },
    status: { type: String, enum: ['Approved', 'Pending'], default: 'Approved' }
}, { timestamps: true });

expenseSchema.pre('save', async function () {
    if (this.isNew && !this.expenseNumber) {
        const count = await mongoose.model('Expense').countDocuments();
        this.expenseNumber = `EXP-${String(count + 1).padStart(4, '0')}`;
    }
});

module.exports = mongoose.model('Expense', expenseSchema);
