const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    invoiceNumber: { type: String, unique: true, sparse: true },
    sale: { type: mongoose.Schema.Types.ObjectId, ref: 'Sale', default: null },
    customerName: { type: String, required: true },
    customerEmail: { type: String, default: '' },
    customerPhone: { type: String, default: '' },
    invoiceDate: { type: Date, default: Date.now },
    dueDate: { type: Date, default: () => new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) },
    subtotal: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    dueAmount: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['Paid', 'Unpaid', 'Overdue', 'Partially Paid'],
        default: 'Unpaid'
    },
    notes: { type: String, default: '' }
}, { timestamps: true });

invoiceSchema.pre('save', async function () {
    if (this.isNew && !this.invoiceNumber) {
        const count = await mongoose.model('Invoice').countDocuments();
        this.invoiceNumber = `INV-${String(count + 1).padStart(4, '0')}`;
    }
    this.dueAmount = Math.max(0, this.totalAmount - this.paidAmount);
});

module.exports = mongoose.model('Invoice', invoiceSchema);
