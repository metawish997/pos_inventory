const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Alerts & Stock Reports
router.get('/expired', productController.getExpiredProducts);
router.get('/low-stocks', productController.getLowStocks);
router.post('/send-low-stock-email', productController.sendLowStockEmail);

// All standard catalog system CRUD endpoints
router.post('/', productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

// Variant rows fetching endpoint
router.get('/:productId/variants', productController.getProductVariants);

module.exports = router;