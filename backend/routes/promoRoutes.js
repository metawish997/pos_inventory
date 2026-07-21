const express = require('express');
const router = express.Router();
const promoController = require('../controllers/promoController');

// Coupons
router.get('/coupons', promoController.getCoupons);
router.post('/coupons', promoController.createCoupon);
router.put('/coupons/:id', promoController.updateCoupon);
router.delete('/coupons/:id', promoController.deleteCoupon);

// Gift Cards
router.get('/gift-cards', promoController.getGiftCards);
router.post('/gift-cards', promoController.createGiftCard);
router.put('/gift-cards/:id', promoController.updateGiftCard);
router.delete('/gift-cards/:id', promoController.deleteGiftCard);

// Discounts
router.get('/discounts', promoController.getDiscounts);
router.post('/discounts', promoController.createDiscount);
router.put('/discounts/:id', promoController.updateDiscount);
router.delete('/discounts/:id', promoController.deleteDiscount);

module.exports = router;
