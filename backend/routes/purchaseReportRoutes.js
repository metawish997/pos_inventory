const express = require('express');
const router = express.Router();
const purchaseReportController = require('../controllers/purchaseReportController');

router.get('/vendor', purchaseReportController.vendorPurchaseReport);
router.get('/summary', purchaseReportController.purchaseSummary);
router.get('/gst', purchaseReportController.gstSummary);
router.get('/warehouse', purchaseReportController.warehousePurchaseReport);
router.get('/returns', purchaseReportController.purchaseReturnReport);

module.exports = router;