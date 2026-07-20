// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, trim: true, lowercase: true },
        phone: { type: String, required: true, trim: true },
        password: { type: String, required: true },
        role: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role',
            required: true
        },
        emailVerified: { type: Boolean, default: false },
        status: {
            type: String,
            enum: ['active', 'inactive', 'suspended'],
            default: 'active'
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true }, // Ensure virtuals are included when converting to JSON
        toObject: { virtuals: true }
    }
);

// Virtual field to automatically construct full name
userSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`.trim();
});

// Pre-save middleware to hash password automatically
userSchema.pre('save', async function () {
    // If the password hasn't been modified, just stop execution here (implicitly resolves)
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    // No next() is needed! Returning from an async function auto-advances Mongoose.
});
// Helper method to compare passwords during login
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);