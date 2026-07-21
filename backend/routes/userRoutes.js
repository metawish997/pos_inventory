const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Users
router.get('/', userController.getUsers);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

// Roles & Permissions
router.get('/roles', userController.getRoles);
router.post('/roles', userController.createRole);

// Delete Requests
router.get('/delete-requests', userController.getDeleteRequests);
router.post('/delete-requests', userController.createDeleteRequest);
router.put('/delete-requests/:id', userController.processDeleteRequest);

module.exports = router;
