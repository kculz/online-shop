const { Paynow } = require("paynow");
const { PAYNOW_INTEGRATION_ID, PAYNOW_INTEGRATION_KEY } = require('../config');
const { ZimbabwePhoneNumberChecker } = require("../helpers/phone.helper");
const { Payment, Order } = require('../models');

let paynow = new Paynow(PAYNOW_INTEGRATION_ID, PAYNOW_INTEGRATION_KEY);

const PaymentController = {
    // Process EcoCash payment
    async processEcocashPayment(req, res) {
        try {
            const { orderId, phoneNumber } = req.body;

            // Validate order exists and belongs to user
            const order = await Order.findOne({
                where: {
                    id: orderId,
                    userId: req.user.id
                },
                include: ['items']
            });

            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }

            if (order.status !== 'pending') {
                return res.status(400).json({ error: 'Order already processed' });
            }

            // Validate phone number
            const checkPhoneNumber = new ZimbabwePhoneNumberChecker(phoneNumber);
            
            if (!checkPhoneNumber.isValidZimbabweanNumber()) {
                return res.status(400).json({ error: 'Please provide a valid Zimbabwean phone number' });
            }

            if (checkPhoneNumber.getServiceProvider() !== "Econet") {
                return res.status(400).json({ error: 'Please provide a valid Econet number' });
            }

            const phone = checkPhoneNumber.getNormalizedPhoneNumber();

            // Generate unique invoice number
            const generateInvoiceNumber = () => {
                const randomNumber = Math.floor(1000 + Math.random() * 9000);
                const randomLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                const randomIndex1 = Math.floor(Math.random() * randomLetters.length);
                const randomIndex2 = Math.floor(Math.random() * randomLetters.length);
                return `ORD${orderId}${randomLetters[randomIndex1]}${randomLetters[randomIndex2]}${randomNumber}`;
            };

            // Set Paynow URLs
            paynow.resultUrl = `${process.env.BASE_URL}/api/payments/webhook/paynow`;
            paynow.returnUrl = `${process.env.FRONTEND_URL}/order/${orderId}/status`;

            const invoiceNo = generateInvoiceNumber();

            // Create payment
            const payment = paynow.createPayment(invoiceNo, req.user.email);

            // Add order items to payment
            order.items.forEach(item => {
                payment.add(item.product.name, item.price);
            });

            // Send mobile payment request
            const response = await paynow.sendMobile(payment, phone, 'ecocash');

            if (response.success) {
                // Create payment record
                const paymentRecord = await Payment.create({
                    orderId: order.id,
                    paymentMethod: 'ecocash',
                    amount: order.totalAmount,
                    phoneNumber: phone,
                    status: 'pending',
                    paynowReference: response.reference,
                    pollUrl: response.pollUrl,
                    invoiceNo: invoiceNo
                });

                // Update order status
                await order.update({ status: 'payment_pending' });

                // Return response with poll URL for frontend to check status
                res.json({
                    success: true,
                    message: 'Payment initiated successfully',
                    pollUrl: response.pollUrl,
                    reference: response.reference,
                    paymentId: paymentRecord.id
                });
            } else {
                res.status(400).json({
                    success: false,
                    error: 'Failed to initiate payment',
                    details: response.error
                });
            }
        } catch (error) {
            console.error('EcoCash payment error:', error);
            res.status(500).json({ error: error.message });
        }
    },

    // Check payment status
    async checkPaymentStatus(req, res) {
        try {
            const { paymentId } = req.params;

            const payment = await Payment.findOne({
                where: {
                    id: paymentId,
                    '$order.userId$': req.user.id
                },
                include: [{
                    model: Order,
                    as: 'order'
                }]
            });

            if (!payment) {
                return res.status(404).json({ error: 'Payment not found' });
            }

            if (payment.status === 'paid') {
                return res.json({ status: 'paid', message: 'Payment already completed' });
            }

            // Poll Paynow for status
            const statusResponse = await paynow.pollTransaction(payment.pollUrl);

            if (statusResponse.status === 'paid') {
                // Update payment and order status
                await payment.update({ status: 'paid' });
                await payment.order.update({ status: 'confirmed' });

                res.json({ status: 'paid', message: 'Payment successful' });
            } else if (statusResponse.status === 'cancelled') {
                await payment.update({ status: 'cancelled' });
                res.json({ status: 'cancelled', message: 'Payment cancelled' });
            } else {
                res.json({ status: 'pending', message: 'Payment still pending' });
            }
        } catch (error) {
            console.error('Payment status check error:', error);
            res.status(500).json({ error: error.message });
        }
    },

    // Webhook handler for Paynow
    async handlePaynowWebhook(req, res) {
        try {
            const { reference, status } = req.body;

            // Find payment by reference
            const payment = await Payment.findOne({
                where: { paynowReference: reference },
                include: ['order']
            });

            if (payment) {
                if (status === 'paid') {
                    await payment.update({ status: 'paid' });
                    await payment.order.update({ status: 'confirmed' });
                } else if (status === 'cancelled') {
                    await payment.update({ status: 'cancelled' });
                    await payment.order.update({ status: 'cancelled' });
                }

                console.log(`Payment ${reference} updated to status: ${status}`);
            }

            res.status(200).send('OK');
        } catch (error) {
            console.error('Webhook error:', error);
            res.status(500).send('Error');
        }
    },

    // Get payment history for user
    async getPaymentHistory(req, res) {
        try {
            const payments = await Payment.findAll({
                include: [{
                    model: Order,
                    as: 'order',
                    where: { userId: req.user.id },
                    attributes: ['id', 'totalAmount', 'status']
                }],
                order: [['createdAt', 'DESC']]
            });

            res.json(payments);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = PaymentController;