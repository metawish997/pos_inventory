const mongoose = require('mongoose');

const deliveryChallanItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    variant: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductItem', default: null },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    taxRate: { type: Number, default: 0 },
    subtotal: { type: Number, default: 0 }
}, { _id: true });

const deliveryChallanSchema = new mongoose.Schema({
    challanNumber: { type: String, unique: true, sparse: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, default: '' },
    customerPhone: { type: String, default: '' },
    gstNumber: { type: String, default: '' },
    placeOfSupply: { type: String, default: '' },
    challanDate: { type: Date, default: Date.now },
    items: [deliveryChallanItemSchema],
    subtotal: { type: Number, default: 0 },
    totalDiscount: { type: Number, default: 0 },
    totalTax: { type: Number, default: 0 },
    grandTotal: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['Draft', 'Dispatched', 'Delivered'],
        default: 'Draft'
    },
    notes: { type: String, default: '' },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'CompanySetting', default: null }
}, { timestamps: true });

deliveryChallanSchema.pre('save', async function () {
    if (this.isNew && !this.challanNumber) {
        const count = await mongoose.model('DeliveryChallan').countDocuments();
        this.challanNumber = `DC-${String(count + 1).padStart(4, '0')}`;
    }
});

module.exports = mongoose.model('DeliveryChallan', deliveryChallanSchema);
