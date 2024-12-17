const express = require('express');
const router = express.Router();
const addressController = require('../controller/address.controller'); // Adjust path if needed

router.post('/addresses', addressController.createAddress);
router.get('/addresses', addressController.getAddresses);
router.get('/addresses/:id', addressController.getOneAddress);
router.put('/addresses/:id', addressController.updateAddress);
router.delete('/addresses/:id', addressController.deleteAddress);

module.exports = router;