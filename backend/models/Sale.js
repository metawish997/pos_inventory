const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    variant: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductItem', default: null },
    sku: { type: String, default: '' },
    barcode: { type: String, default: '' },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    discountType: { type: String, enum: ['Percentage', 'Fixed', ''], default: '' },
    discount: { type: Number, default: 0 },
    taxRate: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    subtotal: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
}, { _id: true });

const saleSchema = new mongoose.Schema({
    saleNumber: { type: String, unique: true, sparse: true },
    saleType: { type: String, enum: ['Online', 'POS'], default: 'Online' },
    customerName: { type: String, default: 'Walk-in Customer' },
    customerEmail: { type: String, default: '' },
    customerPhone: { type: String, default: '' },
    gstNumber: { type: String, default: '' },
    placeOfSupply: { type: String, default: '' },
    clientPoNumber: { type: String, default: '' },
    warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', default: null },
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', default: null },
    saleDate: { type: Date, default: Date.now },
    items: [saleItemSchema],
    subtotal: { type: Number, default: 0 },
    totalDiscount: { type: Number, default: 0 },
    totalTax: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    roundOff: { type: Number, default: 0 },
    grandTotal: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    dueAmount: { type: Number, default: 0 },
    paymentStatus: {
        type: String,
        enum: ['Paid', 'Unpaid', 'Partial', 'Overdue', 'Draft'],
        default: 'Paid'
    },
    orderStatus: {
        type: String,
        enum: ['Completed', 'Pending', 'Processing', 'Cancelled', 'Draft'],
        default: 'Completed'
    },
    paymentMethod: { type: String, enum: ['Cash', 'Card', 'UPI', 'Bank Transfer', 'Other'], default: 'Cash' },
    notes: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });

saleSchema.pre('save', async function () {
    if (this.isNew && !this.saleNumber) {
        const count = await mongoose.model('Sale').countDocuments();
        const prefix = this.saleType === 'POS' ? 'POS' : 'SL';
        this.saleNumber = `${prefix}-${String(count + 1).padStart(4, '0')}`;
    }
    this.dueAmount = Math.max(0, this.grandTotal - this.paidAmount);
});

module.exports = mongoose.model('Sale', saleSchema);
