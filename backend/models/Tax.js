const mongoose = require('mongoose');

const taxSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        placeholder: "e.g., GST 3%"
    },
    taxValue: {
        type: Number,
        required: true,
        min: 0
    },
    components: [
        {
            name: { type: String, required: true },  // e.g., "IGST", "SGST"
            value: { type: Number, required: true }  // e.g., 1.5, 1.5
        }
    ],
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    }
}, { timestamps: true });

module.exports = mongoose.model('Tax', taxSchema);