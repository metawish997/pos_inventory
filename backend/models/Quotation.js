const mongoose = require('mongoose');

const quotationItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    variant: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductItem', default: null },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0 },
    taxRate: { type: Number, default: 0 },
    subtotal: { type: Number, default: 0 }
}, { _id: true });

const quotationSchema = new mongoose.Schema({
    quotationNumber: { type: String, unique: true, sparse: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, default: '' },
    customerPhone: { type: String, default: '' },
    clientPoNumber: { type: String, default: '' },
    quotationDate: { type: Date, default: Date.now },
    validUntil: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
    items: [quotationItemSchema],
    subtotal: { type: Number, default: 0 },
    totalDiscount: { type: Number, default: 0 },
    totalTax: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
    status: {
        type: String,
        enum: ['Sent', 'Accepted', 'Declined', 'Draft', 'Converted'],
        default: 'Sent'
    },
    notes: { type: String, default: '' }
}, { timestamps: true });

quotationSchema.pre('save', async function () {
    if (this.isNew && !this.quotationNumber) {
        const count = await mongoose.model('Quotation').countDocuments();
        this.quotationNumber = `QT-${String(count + 1).padStart(4, '0')}`;
    }
});

module.exports = mongoose.model('Quotation', quotationSchema);
