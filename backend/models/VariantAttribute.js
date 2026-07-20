const mongoose = require('mongoose');

const variantAttributeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  values: [{ type: String }] // Correctly stores values as an array of strings
}, { timestamps: true });

module.exports = mongoose.model('VariantAttribute', variantAttributeSchema);