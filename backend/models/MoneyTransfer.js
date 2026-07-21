const mongoose = require('mongoose');

const moneyTransferSchema = new mongoose.Schema({
    transferNumber: { type: String, unique: true, sparse: true },
    fromAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'BankAccount', required: true },
    toAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'BankAccount', required: true },
    amount: { type: Number, required: true, min: 1 },
    transferDate: { type: Date, default: Date.now },
    notes: { type: String, default: '' }
}, { timestamps: true });

moneyTransferSchema.pre('save', async function () {
    if (this.isNew && !this.transferNumber) {
        const count = await mongoose.model('MoneyTransfer').countDocuments();
        this.transferNumber = `TRF-${String(count + 1).padStart(4, '0')}`;
    }
});

module.exports = mongoose.model('MoneyTransfer', moneyTransferSchema);
