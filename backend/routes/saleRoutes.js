const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');

// Sales Routes
router.get('/', saleController.getSales);
router.get('/:id', saleController.getSaleById);
router.post('/', saleController.createSale);
router.put('/:id', saleController.updateSale);
router.delete('/:id', saleController.deleteSale);

// Invoice Routes
router.get('/invoices/list', saleController.getInvoices);
router.get('/invoices/:id', saleController.getInvoiceById);

// Quotation Routes
router.get('/quotations/list', saleController.getQuotations);
router.post('/quotations', saleController.createQuotation);
router.put('/quotations/:id', saleController.updateQuotation);

// Sales Return Routes
router.get('/returns/list', saleController.getSalesReturns);
router.post('/returns', saleController.createSalesReturn);
router.put('/returns/:id', saleController.updateSalesReturn);

module.exports = router;
