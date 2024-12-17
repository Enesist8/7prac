const express = require('express');
const router = express.Router();
const brandController = require('../controller/brand.controller'); // Adjust path if needed

// Create a new brand
router.post('/brands', brandController.createBrand);

// Get all brands
router.get('/brands', brandController.getBrands);

// Get one brand by ID
router.get('/brands/:id', brandController.getOneBrand);

// Update a brand by ID
router.put('/brands/:id', brandController.updateBrand);

// Delete a brand by ID
router.delete('/brands/:id', brandController.deleteBrand);

module.exports = router;