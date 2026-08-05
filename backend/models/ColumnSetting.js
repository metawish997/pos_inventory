const mongoose = require('mongoose');

const columnSettingSchema = new mongoose.Schema({
  page: { type: String, required: true, unique: true }, // 'invoice' or 'quotation'
  columns: [{
    id: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    visible: { type: Boolean, default: true },
    width: { type: String },
    formula: { type: String },
    private: { type: Boolean, default: false },
    summariseTotal: { type: Boolean, default: false },
    formulaReturnType: { type: String },
    formulaValue: { type: String }
  }]
}, { timestamps: true });

module.exports = mongoose.model('ColumnSetting', columnSettingSchema);
