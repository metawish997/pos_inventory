const express = require('express');
const router = express.Router();
const {
    storeController,
    warehouseController,
    categoryController,
    subCategoryController,
    brandController,
    variantController,
    taxController,
    warrantyController
} = require('../controllers/inventoryController');

// Helper: attach 5 CRUD routes for a controller at a path prefix
const attachRoutes = (ctrl, path) => {
    router.get(`/${path}`, ctrl.getAll);
    router.get(`/${path}/:id`, ctrl.getById);
    router.post(`/${path}`, ctrl.create);
    router.put(`/${path}/:id`, ctrl.update);
    router.delete(`/${path}/:id`, ctrl.remove);
};

attachRoutes(storeController, 'stores');
attachRoutes(warehouseController, 'warehouses');
attachRoutes(categoryController, 'categories');
attachRoutes(subCategoryController, 'subcategories');
attachRoutes(brandController, 'brands');
attachRoutes(variantController, 'variant-attributes');
attachRoutes(taxController, 'taxes');
attachRoutes(warrantyController, 'warranties');

module.exports = router;
