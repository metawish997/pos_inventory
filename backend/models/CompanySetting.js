const mongoose = require('mongoose');

const companySettingSchema = new mongoose.Schema({
  orgName: { type: String, default: 'Naarendra singh' },
  orgLocation: { type: String, default: 'India' },
  orgAddress1: { type: String, default: '702, Shagun Arcade' },
  orgAddress2: { type: String, default: 'Above Apna swetts' },
  orgCity: { type: String, default: 'Indore' },
  orgPincode: { type: String, default: '452001' },
  orgState: { type: String, default: 'Madhya Pradesh' },
  orgPhone: { type: String, default: '8817440858' },
  orgWebsite: { type: String, default: '' },
  orgGst: { type: String, default: '23AAQCM8058H2Z1' },
  storePan: { type: String, default: 'AAQCM8058H' },
  orgLogo: { type: String, default: '' },
  reportBasis: { type: String, default: 'Accrual' },
  financialYear: { type: String, default: 'April - March' },
  smtpHost: { type: String, default: '' },
  smtpPort: { type: String, default: '587' },
  smtpSecure: { type: Boolean, default: false },
  smtpUser: { type: String, default: '' },
  smtpPass: { type: String, default: '' },
  smtpFrom: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('CompanySetting', companySettingSchema);
