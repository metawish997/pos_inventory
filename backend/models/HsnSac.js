const mongoose = require('mongoose');

const hsnSacSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['HSN', 'SAC'], default: 'HSN' },
  cgst: { type: Number, default: 0 },
  sgst: { type: Number, default: 0 },
  igst: { type: Number, default: 0 }
}, { timestamps: true });

// Index for search lookup speed
hsnSacSchema.index({ code: 'text', description: 'text' });

module.exports = mongoose.model('HsnSac', hsnSacSchema);
