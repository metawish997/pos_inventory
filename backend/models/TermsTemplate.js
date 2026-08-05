const mongoose = require('mongoose');

const termsTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  terms: [{ type: String, required: true }]
}, { timestamps: true });

module.exports = mongoose.model('TermsTemplate', termsTemplateSchema);
