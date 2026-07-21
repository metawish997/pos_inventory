const Coupon = require('../models/Coupon');
const GiftCard = require('../models/GiftCard');
const Discount = require('../models/Discount');

// --- COUPON CONTROLLERS ---
exports.getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.json({ success: true, data: coupons });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createCoupon = async (req, res) => {
    try {
        const coupon = new Coupon(req.body);
        await coupon.save();
        res.status(201).json({ success: true, data: coupon });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.updateCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
        res.json({ success: true, data: coupon });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);
        if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
        res.json({ success: true, message: 'Coupon deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- GIFT CARD CONTROLLERS ---
exports.getGiftCards = async (req, res) => {
    try {
        const cards = await GiftCard.find().sort({ createdAt: -1 });
        res.json({ success: true, data: cards });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createGiftCard = async (req, res) => {
    try {
        const card = new GiftCard(req.body);
        if (card.balance === undefined) card.balance = card.amount;
        await card.save();
        res.status(201).json({ success: true, data: card });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.updateGiftCard = async (req, res) => {
    try {
        const card = await GiftCard.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!card) return res.status(404).json({ success: false, message: 'Gift Card not found' });
        res.json({ success: true, data: card });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.deleteGiftCard = async (req, res) => {
    try {
        const card = await GiftCard.findByIdAndDelete(req.params.id);
        if (!card) return res.status(404).json({ success: false, message: 'Gift Card not found' });
        res.json({ success: true, message: 'Gift Card deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- DISCOUNT CONTROLLERS ---
exports.getDiscounts = async (req, res) => {
    try {
        const discounts = await Discount.find().sort({ createdAt: -1 });
        res.json({ success: true, data: discounts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createDiscount = async (req, res) => {
    try {
        const discount = new Discount(req.body);
        await discount.save();
        res.status(201).json({ success: true, data: discount });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.updateDiscount = async (req, res) => {
    try {
        const discount = await Discount.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!discount) return res.status(404).json({ success: false, message: 'Discount not found' });
        res.json({ success: true, data: discount });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.deleteDiscount = async (req, res) => {
    try {
        const discount = await Discount.findByIdAndDelete(req.params.id);
        if (!discount) return res.status(404).json({ success: false, message: 'Discount not found' });
        res.json({ success: true, message: 'Discount deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
