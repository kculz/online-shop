const router = require('express').Router();
const cartController = require('../controller/cart.controller');
const { verify } = require('../middlewares/auth.middleware');

// Apply authentication middleware to all cart routes
router.use(verify);

// GET /api/cart - Get user's cart
router.get('/', cartController.getCart);

// POST /api/cart/items - Add item to cart
router.post('/items', cartController.addItem);

// PUT /api/cart/items/:itemId - Update cart item quantity
router.put('/items/:itemId', cartController.updateItem);

// DELETE /api/cart/items/:itemId - Remove item from cart
router.delete('/items/:itemId', cartController.removeItem);

// DELETE /api/cart - Clear cart
router.delete('/', cartController.clearCart);

module.exports = router;