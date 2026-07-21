const mongoose = require('mongoose');

const returnItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    variant: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductItem', default: null },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    subtotal: { type: Number, default: 0 }
}, { _id: true });

const salesReturnSchema = new mongoose.Schema({
    returnNumber: { type: String, unique: true, sparse: true },
    sale: { type: mongoose.Schema.Types.ObjectId, ref: 'Sale', default: null },
    customerName: { type: String, required: true },
    returnDate: { type: Date, default: Date.now },
    items: [returnItemSchema],
    totalRefundAmount: { type: Number, required: true },
    refundStatus: {
        type: String,
        enum: ['Pending', 'Refunded', 'Cancelled'],
        default: 'Refunded'
    },
    returnReason: { type: String, default: '' },
    notes: { type: String, default: '' }
}, { timestamps: true });

salesReturnSchema.pre('save', async function () {
    if (this.isNew && !this.returnNumber) {
        const count = await mongoose.model('SalesReturn').countDocuments();
        this.returnNumber = `SR-${String(count + 1).padStart(4, '0')}`;
    }
});

module.exports = mongoose.model('SalesReturn', salesReturnSchema);
