const express = require('express');
const router = express.Router();
const gstReportController = require('../controllers/gstReportController');

router.get('/gstr-1', gstReportController.getGSTR1);
router.get('/gstr-2b', gstReportController.getGSTR2B);
router.get('/gstr-3b', gstReportController.getGSTR3B);

module.exports = router;
