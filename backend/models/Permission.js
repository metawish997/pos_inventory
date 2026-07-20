const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true, // e.g., 'read_users', 'write_products'
            lowercase: true,
            trim: true
        },
        module: {
            type: String,
            required: true, // e.g., 'Users', 'Products'
            trim: true
        },
        description: { type: String }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Permission', permissionSchema);
