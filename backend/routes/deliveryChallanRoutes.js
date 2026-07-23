const express = require('express');
const router = express.Router();
const deliveryChallanController = require('../controllers/deliveryChallanController');

router.get('/', deliveryChallanController.getAll);
router.get('/:id', deliveryChallanController.getById);
router.post('/', deliveryChallanController.create);
router.put('/:id', deliveryChallanController.update);
router.delete('/:id', deliveryChallanController.delete);

module.exports = router;
