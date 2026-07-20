const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// All standard catalog system CRUD endpoints
router.post('/', productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

// Variant rows fetching endpoint
router.get('/:productId/variants', productController.getProductVariants);

module.exports = router;