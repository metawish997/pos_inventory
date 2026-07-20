const mongoose = require('mongoose');

// Stock is tracked per Warehouse + Product Variant (NOT per product only)
const stockSchema = new mongoose.Schema({
    warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    variant: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductItem', default: null },
    availableQty: { type: Number, default: 0 },
    reservedQty: { type: Number, default: 0 },
    damagedQty: { type: Number, default: 0 }
}, { timestamps: true });

// One stock record per warehouse + variant combination
stockSchema.index({ warehouse: 1, variant: 1 }, { unique: true, sparse: true });
stockSchema.index({ warehouse: 1, product: 1 }, { unique: false });

module.exports = mongoose.model('Stock', stockSchema);