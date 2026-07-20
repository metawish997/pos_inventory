const mongoose = require('mongoose');

const productItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    sku: { type: String, required: true, unique: true },
    quantity: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true, default: 0 },

    // Pricing computation results (per variant)
    basePrice: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    finalPrice: { type: Number, default: 0 },

    // Per-variant tax & discount (inherited from the main product and applied to each variant)
    taxType: { type: String, enum: ['Exclusive', 'Inclusive'], default: 'Exclusive' },
    tax: { type: mongoose.Schema.Types.ObjectId, ref: 'Tax', default: null },
    discountType: { type: String, enum: ['Percentage', 'Fixed', ''], default: '' },
    discountValue: { type: Number, default: 0 },

    // Stores dynamic row pairs: { "AttributeMasterId": "SelectedValueItem" }
    // Example: { "65a12b...": "128 GB", "65a34c...": "Blue" }
    selections: {
        type: Map,
        of: String,
        default: {}
    },

    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('ProductItem', productItemSchema);