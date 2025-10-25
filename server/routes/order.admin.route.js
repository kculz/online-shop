// routes/admin.order.route.js
const router = require('express').Router();
const OrderController = require('../controller/order.controller');
const { verify, verifyAdmin } = require('../middlewares/auth.middleware');

// Apply admin verification to all routes
router.use(verify, verifyAdmin);

// GET /admin/orders - Get all orders
router.get('/', OrderController.getAllOrders);

// GET /admin/orders/stats - Get order statistics
router.get('/stats', OrderController.getOrderStats);

// GET /admin/orders/:id - Get order by ID
router.get('/:id', OrderController.getOrderById);

// PUT /admin/orders/:id/status - Update order status
router.put('/:id/status', OrderController.updateOrderStatus);

// DELETE /admin/orders/:id - Delete order
router.delete('/:id', OrderController.deleteOrder);

module.exports = router;