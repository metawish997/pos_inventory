const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  customerCode: { type: String, required: true, unique: true },
  customerType: { type: String, enum: ['Individual', 'Company'], default: 'Individual' },
  companyName: { type: String, default: '' },
  displayName: { type: String, default: '' },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  postalCode: { type: String },
  avatar: { type: String },
  gstNumber: { type: String, default: '' },
  placeOfSupply: { type: String, default: '' },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
