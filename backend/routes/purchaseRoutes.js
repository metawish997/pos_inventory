const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');

router.get('/', purchaseController.getAll);
router.get('/drafts', purchaseController.getDrafts);
router.get('/:id', purchaseController.getById);
router.post('/', purchaseController.create);
router.put('/:id', purchaseController.update);
router.put('/:id/approve', purchaseController.approve);
router.delete('/:id', purchaseController.remove);

module.exports = router;