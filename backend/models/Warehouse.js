const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  location: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Warehouse', warehouseSchema);
