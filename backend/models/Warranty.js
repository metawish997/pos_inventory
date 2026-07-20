const mongoose = require('mongoose');

const warrantySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        placeholder: "e.g., Comprehensive Warranty, Money Back Refund"
    },
    duration: {
        type: String,
        required: true,
        placeholder: "e.g., 1 Year, 2 Years, 6 Months"
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    }
}, { timestamps: true });

module.exports = mongoose.model('Warranty', warrantySchema);