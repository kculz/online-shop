const router = require('express').Router();
const paymentController = require('../controller/payment.controller');
const { verify } = require('../middlewares/auth.middleware');

// Apply authentication middleware to all payment routes
router.use(verify);

// POST /api/payments/ecocash - Process EcoCash payment
router.post('/ecocash', paymentController.processEcocashPayment);

// GET /api/payments/history - Get payment history
router.get('/history', paymentController.getPaymentHistory);

// GET /api/payments/status/:paymentId - Check payment status
router.get('/status/:paymentId', paymentController.checkPaymentStatus);

// POST /api/payments/webhook/paynow - Paynow webhook (no auth needed)
router.post('/webhook/paynow', paymentController.handlePaynowWebhook);

module.exports = router;