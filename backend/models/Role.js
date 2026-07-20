// models/Role.js
const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true, // Prevents duplicate role names from being created
            lowercase: true,
            trim: true
        },
        description: { type: String },
        permissions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Permission'
            }
        ]
    },
    { timestamps: true }
);

module.exports = mongoose.model('Role', roleSchema);