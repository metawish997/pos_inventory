const mongoose = require('mongoose');

const deliveryChallanItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    unit: { type: String, default: 'pcs' }
}, { _id: false });

const deliveryChallanSchema = new mongoose.Schema({
    challanNumber: { type: String, unique: true, sparse: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, default: '' },
    customerPhone: { type: String, default: '' },
    challanDate: { type: Date, default: Date.now },
    items: [deliveryChallanItemSchema],
    status: {
        type: String,
        enum: ['Draft', 'Dispatched', 'Delivered'],
        default: 'Draft'
    },
    notes: { type: String, default: '' }
}, { timestamps: true });

deliveryChallanSchema.pre('save', async function () {
    if (this.isNew && !this.challanNumber) {
        const count = await mongoose.model('DeliveryChallan').countDocuments();
        this.challanNumber = `DC-${String(count + 1).padStart(4, '0')}`;
    }
});

module.exports = mongoose.model('DeliveryChallan', deliveryChallanSchema);
