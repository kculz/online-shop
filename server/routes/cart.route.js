// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const cartController = require('../controller/cart.controller');
const { verify } = require('../middlewares/auth.middleware');

router.use(verify);

router.get('/', cartController.getCart);
router.post('/items', cartController.addItem);
router.put('/items/:itemId', cartController.updateItem);
router.delete('/items/:itemId', cartController.removeItem);
router.delete('/', cartController.clearCart);

module.exports = router;