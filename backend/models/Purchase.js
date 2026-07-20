const mongoose = require('mongoose');

const purchaseItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    variant: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductItem', default: null },
    sku: { type: String, default: '' },
    barcode: { type: String, default: '' },
    quantity: { type: Number, required: true, min: 0 },
    freeQuantity: { type: Number, default: 0, min: 0 },
    purchasePrice: { type: Number, required: true, min: 0 },
    discountType: { type: String, enum: ['Percentage', 'Fixed', ''], default: '' },
    discount: { type: Number, default: 0 },
    tax: { type: mongoose.Schema.Types.ObjectId, ref: 'Tax', default: null },
    taxRate: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    subtotal: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
}, { _id: true });

const purchaseSchema = new mongoose.Schema({
    purchaseNumber: { type: String, unique: true, sparse: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
    purchaseDate: { type: Date, default: Date.now },
    invoiceNumber: { type: String, default: '' },
    invoiceDate: { type: Date, default: null },
    dueDate: { type: Date, default: null },
    paymentTerms: { type: String, default: '' },
    currency: { type: String, default: 'INR' },
    referenceNumber: { type: String, default: '' },
    notes: { type: String, default: '' },
    status: {
        type: String,
        enum: ['Draft', 'Pending', 'Approved', 'Received', 'Cancelled', 'Completed'],
        default: 'Draft'
    },
    items: [purchaseItemSchema],
    // Computed totals
    subtotal: { type: Number, default: 0 },
    totalDiscount: { type: Number, default: 0 },
    totalTax: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    roundOff: { type: Number, default: 0 },
    grandTotal: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });

// Auto-generate a unique purchase number (PO-0001 ...)
purchaseSchema.pre('save', async function () {
    if (this.isNew && !this.purchaseNumber) {
        const count = await mongoose.model('Purchase').countDocuments();
        this.purchaseNumber = `PO-${String(count + 1).padStart(4, '0')}`;
    }
});

module.exports = mongoose.model('Purchase', purchaseSchema);
module.exports.purchaseItemSchema = purchaseItemSchema;