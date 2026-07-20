const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
    warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    sku: { type: String, required: true, unique: true },
    sellingType: { type: String, enum: ['Retail', 'Wholesale'], required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    subCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory', required: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    barcodeSymbology: { type: String, required: true },
    itemBarcode: { type: String, required: true },
    description: { type: String, default: '' },
    productType: { type: String, enum: ['single', 'variable'], required: true, default: 'single' },

    // Pricing input fields
    unit: { type: String, default: 'pc' },
    quantity: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    taxType: { type: String, enum: ['Exclusive', 'Inclusive'], default: 'Exclusive' },
    tax: { type: mongoose.Schema.Types.ObjectId, ref: 'Tax', default: null },
    discountType: { type: String, enum: ['Percentage', 'Fixed', ''], default: '' },
    discountValue: { type: Number, default: 0 },
    quantityAlert: { type: Number, default: 0 },

    // Pricing computation results (single products)
    basePrice: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    finalPrice: { type: Number, default: 0 },

    // Custom Fields (Toggles)
    hasWarranty: { type: Boolean, default: false },
    warrantyPlan: { type: mongoose.Schema.Types.ObjectId, ref: 'Warranty', default: null },
    hasManufacturer: { type: Boolean, default: false },
    manufacturer: { type: String, default: '' },
    hasExpiry: { type: Boolean, default: false },
    manufacturedDate: { type: Date, default: null },
    expiryOn: { type: Date, default: null },

    // Array for Multiple Image Uploads
    images: [{ type: String }],

    // Default status active
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);