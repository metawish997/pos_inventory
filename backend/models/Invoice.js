const mongoose = require('mongoose');

const invoicePaymentSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now },
    referenceNumber: { type: String, default: '' }
}, { timestamps: true });

const invoiceSchema = new mongoose.Schema({
    invoiceNumber: { type: String, unique: true, sparse: true },
    sale: { type: mongoose.Schema.Types.ObjectId, ref: 'Sale', default: null },
    customerName: { type: String, required: true },
    customerEmail: { type: String, default: '' },
    customerPhone: { type: String, default: '' },
    gstNumber: { type: String, default: '' },
    placeOfSupply: { type: String, default: '' },
    clientPoNumber: { type: String, default: '' },
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
    notes: { type: String, default: '' },
    terms: [{ type: String }],
    customFields: [{
        label: { type: String, required: true },
        value: { type: String, required: true }
    }],
    attachments: [{ type: String }],
    payments: [invoicePaymentSchema],
    invoiceType: { type: String, enum: ['Tax Invoice', 'Proforma Invoice'], default: 'Tax Invoice' },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'CompanySetting', default: null }
}, { timestamps: true });

invoiceSchema.pre('save', async function () {
    if (this.isNew && !this.invoiceNumber) {
        const count = await mongoose.model('Invoice').countDocuments({ invoiceType: this.invoiceType });
        const prefix = this.invoiceType === 'Proforma Invoice' ? 'PINV' : 'INV';
        this.invoiceNumber = `${prefix}-${String(count + 1).padStart(4, '0')}`;
    }
    this.dueAmount = Math.max(0, this.totalAmount - this.paidAmount);
});

module.exports = mongoose.model('Invoice', invoiceSchema);
