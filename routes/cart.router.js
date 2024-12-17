const express = require('express');
const router = express.Router();
const cartController = require('../controller/cart.controller');


router.post('/create', cartController.createNewCart);
router.get('/', cartController.getCart);  // GET request for retrieving cart
router.post('/', cartController.addToCart);
router.get('/user', cartController.getUserCart);

module.exports = router;