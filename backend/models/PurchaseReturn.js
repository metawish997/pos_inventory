const mongoose = require('mongoose');

const purchaseReturnItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    variant: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductItem', default: null },
    sku: { type: String, default: '' },
    returnQty: { type: Number, required: true, min: 1 },
    reason: { type: String, default: '' },
    returnAmount: { type: Number, default: 0 }
}, { _id: true });

const purchaseReturnSchema = new mongoose.Schema({
    returnNumber: { type: String, unique: true, sparse: true },
    purchase: { type: mongoose.Schema.Types.ObjectId, ref: 'Purchase', required: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
    returnDate: { type: Date, default: Date.now },
    items: [purchaseReturnItemSchema],
    totalReturnAmount: { type: Number, default: 0 },
    notes: { type: String, default: '' }
}, { timestamps: true });

// Auto-generate a unique return number (PR-0001 ...)
purchaseReturnSchema.pre('save', async function () {
    if (this.isNew && !this.returnNumber) {
        const count = await mongoose.model('PurchaseReturn').countDocuments();
        this.returnNumber = `PR-${String(count + 1).padStart(4, '0')}`;
    }
});

module.exports = mongoose.model('PurchaseReturn', purchaseReturnSchema);