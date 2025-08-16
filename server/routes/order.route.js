// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controller/order.controller');
const {verify} = require('../middlewares/auth.middleware');

router.use(verify);

router.post('/', orderController.createOrder);
router.get('/', orderController.getUserOrders);
router.get('/:id', orderController.getOrder);

module.exports = router;