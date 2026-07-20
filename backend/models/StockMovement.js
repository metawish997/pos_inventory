const mongoose = require('mongoose');

const stockMovementSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Purchase', 'Sale', 'Return', 'Transfer', 'Adjustment', 'Opening Stock'],
        required: true
    },
    reference: { type: String, default: '' }, // purchase number / order id / manual note
    referenceId: { type: mongoose.Schema.Types.ObjectId, default: null },
    warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    variant: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductItem', default: null },
    quantity: { type: Number, required: true }, // signed: + for inward, - for outward
    balanceAfter: { type: Number, default: 0 },
    reason: { type: String, default: '' },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('StockMovement', stockMovementSchema);