const { Paynow } = require("paynow");
// const { PAYNOW_INTEGRATION_ID, PAYNOW_INTEGRATION_KEY } = require('../config');
const { ZimbabwePhoneNumberChecker } = require("../helpers/phone.helper");
const { Payment, Order, OrderItem, Product } = require('../models');


// Debug Paynow initialization
// console.log('🔧 [Paynow] Initializing Paynow with:', {
//   integrationId: PAYNOW_INTEGRATION_ID ? 'SET' : 'MISSING',
//   integrationKey: PAYNOW_INTEGRATION_KEY ? 'SET' : 'MISSING',
//   idLength: PAYNOW_INTEGRATION_ID?.length,
//   keyLength: PAYNOW_INTEGRATION_KEY?.length
// });


let paynow = new Paynow(process.env.PAYNOW_INTEGRATION_ID, process.env.PAYNOW_INTEGRATION_KEY);

// Set result and return URLs
paynow.resultUrl = `${process.env.BASE_URL}/api/payments/webhook/paynow`;
paynow.returnUrl = `${process.env.FRONTEND_URL}/order/status`;

console.log('🔧 [Paynow] URLs set:', {
  resultUrl: paynow.resultUrl,
  returnUrl: paynow.returnUrl
});

const PaymentController = {
    // Process EcoCash payment
    async processEcocashPayment(req, res) {
        try {
            const { orderId, phoneNumber } = req.body;

            console.log('💰 [Paynow] Processing EcoCash payment:', { orderId, phoneNumber });

            // Validate required parameters
            if (!orderId) {
                return res.status(400).json({ error: 'Order ID is required' });
            }

            if (!phoneNumber) {
                return res.status(400).json({ error: 'Phone number is required' });
            }

            // Validate order exists and belongs to user
            const order = await Order.findOne({
                where: {
                    id: orderId,
                    userId: req.user.id
                },
                include: [{
                    model: OrderItem,
                    as: 'items',
                    include: [{
                        model: Product,
                        as: 'product',
                        attributes: ['id', 'name', 'price']
                    }]
                }]
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
            console.log('📱 [Paynow] Validated phone:', phone);

            // Generate unique invoice number
            const generateInvoiceNumber = () => {
                const randomNumber = Math.floor(1000 + Math.random() * 9000);
                const randomLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                const randomIndex1 = Math.floor(Math.random() * randomLetters.length);
                const randomIndex2 = Math.floor(Math.random() * randomLetters.length);
                return `ORD${orderId}${randomLetters[randomIndex1]}${randomLetters[randomIndex2]}${randomNumber}`;
            };

            const invoiceNo = generateInvoiceNumber();
            console.log('📄 [Paynow] Generated invoice:', invoiceNo);

            // Create payment with debug info
            console.log('🔧 [Paynow] Creating payment object...', {
                invoiceNo,
                email: req.user.email
            });

            const payment = paynow.createPayment(invoiceNo, req.user.email);

            // Add order items to payment
            if (!order.items || order.items.length === 0) {
                return res.status(400).json({ error: 'Order has no items' });
            }

            let totalPaymentAmount = 0;
            order.items.forEach((item, index) => {
                const itemName = item.product ? item.product.name : `Product ${item.productId}`;
                const itemPrice = parseFloat(item.price) || 0;
                totalPaymentAmount += itemPrice;
                
                console.log(`📦 [Paynow] Adding item ${index + 1}:`, {
                    name: itemName,
                    price: itemPrice
                });
                
                payment.add(itemName, itemPrice);
            });

            console.log('💰 [Paynow] Total payment amount:', totalPaymentAmount);

            // Debug payment object before sending
            console.log('🔧 [Paynow] Payment object created:', {
                reference: payment.reference,
                items: payment.items,
                authEmail: payment.authEmail,
                resultUrl: payment.resultUrl,
                returnUrl: payment.returnUrl
            });

            // Send mobile payment request
            console.log('📤 [Paynow] Sending mobile payment request...', {
                phone: phone,
                method: 'ecocash'
            });

            const response = await paynow.sendMobile(payment, phone, 'ecocash');

            console.log('✅ [Paynow] Payment response received:', {
                success: response.success,
                reference: response.reference,
                pollUrl: response.pollUrl,
                error: response.error,
                instructions: response.instructions
            });

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

                res.json({
                    success: true,
                    message: 'Payment initiated successfully',
                    instructions: response.instructions,
                    pollUrl: response.pollUrl,
                    reference: response.reference,
                    paymentId: paymentRecord.id
                });
            } else {
                console.error('❌ [Paynow] Payment failed:', response.error);
                res.status(400).json({
                    success: false,
                    error: 'Failed to initiate payment',
                    details: response.error
                });
            }
        } catch (error) {
            console.error('❌ [Paynow] EcoCash payment error:', error);
            console.error('❌ [Paynow] Error stack:', error.stack);
            res.status(500).json({ 
                error: 'Internal server error',
                message: error.message 
            });
        }
    },

// Check payment status
async checkPaymentStatus(req, res) {
    try {
        const { paymentId } = req.params;

        console.log('🔍 [Backend] Checking payment status for:', paymentId);

        const payment = await Payment.findOne({
            where: { id: paymentId },
            include: [{
                model: Order,
                as: 'order',
                where: { userId: req.user.id }
            }]
        });

        if (!payment) {
            console.error('❌ [Backend] Payment not found:', paymentId);
            return res.status(404).json({ 
                status: 'error',
                error: 'Payment not found' 
            });
        }

        console.log('✅ [Backend] Payment found:', {
            paymentId: payment.id,
            currentStatus: payment.status,
            orderId: payment.order?.id
        });

        // If payment is already completed, return immediately
        if (payment.status === 'paid') {
            console.log('💰 [Backend] Payment already paid');
            return res.json({ 
                status: {
                    status: 'paid',
                    success: true,
                    message: 'Payment already completed'
                }
            });
        }

        if (payment.status === 'cancelled' || payment.status === 'failed') {
            console.log('❌ [Backend] Payment already cancelled/failed:', payment.status);
            return res.json({ 
                status: {
                    status: payment.status,
                    success: false,
                    message: `Payment has been ${payment.status}`
                }
            });
        }

        // Poll Paynow for status
        console.log('📡 [Backend] Polling Paynow URL:', payment.pollUrl);
        try {
            const statusResponse = await paynow.pollTransaction(payment.pollUrl);

            console.log('📊 [Backend] Paynow status response:', {
                status: statusResponse.status,
                success: statusResponse.success,
                error: statusResponse.error,
                hasRedirect: statusResponse.hasRedirect,
                isInnbucks: statusResponse.isInnbucks
            });

            let updateResult = {
                status: statusResponse.status,
                success: statusResponse.success,
                error: statusResponse.error || null,
                message: ''
            };

            // Handle different statuses from Paynow
            if (statusResponse.status === 'paid' && statusResponse.success === true) {
                console.log('✅ [Backend] Payment confirmed as paid');
                
                // Update payment and order status
                await payment.update({ status: 'paid' });
                if (payment.order) {
                    await payment.order.update({ status: 'confirmed' });
                }
                
                updateResult.message = 'Payment successful';
                
            } else if (statusResponse.status === 'cancelled') {
                console.log('❌ [Backend] Payment cancelled');
                
                await payment.update({ status: 'cancelled' });
                if (payment.order) {
                    await payment.order.update({ status: 'cancelled' });
                }
                
                updateResult.message = 'Payment cancelled';
                updateResult.success = false;
                
            } else if (statusResponse.status === 'failed') {
                console.log('❌ [Backend] Payment failed');
                
                await payment.update({ status: 'failed' });
                updateResult.message = 'Payment failed';
                updateResult.success = false;
                
            } else if (statusResponse.status === 'sent' || statusResponse.status === 'created') {
                console.log('🔄 [Backend] Payment in intermediate state:', statusResponse.status);
                
                updateResult.message = 'Payment request sent - waiting for authorization';
                updateResult.success = false; // Not yet successful
                
            } else if (statusResponse.status === 'awaiting delivery' || statusResponse.status === 'delivered') {
                console.log('📦 [Backend] Payment in delivery state:', statusResponse.status);
                
                updateResult.message = `Payment ${statusResponse.status}`;
                updateResult.success = false; // Not yet fully successful
                
            } else {
                console.log('🔄 [Backend] Payment still pending:', statusResponse.status);
                
                updateResult.message = 'Payment still pending';
                updateResult.success = false;
            }

            console.log('📤 [Backend] Sending status response:', updateResult);
            res.json({ 
                status: updateResult
            });

        } catch (pollError) {
            console.error('❌ [Backend] Error polling Paynow:', pollError);
            
            // Return pending status but with error information
            res.json({ 
                status: {
                    status: 'pending',
                    success: false,
                    error: pollError.message,
                    message: 'Unable to check payment status, please try again later'
                }
            });
        }
    } catch (error) {
        console.error('❌ [Backend] Payment status check error:', error);
        res.status(500).json({ 
            status: {
                status: 'error',
                success: false,
                error: error.message,
                message: 'Failed to check payment status'
            }
        });
    }
},

    // Webhook handler for Paynow
    async handlePaynowWebhook(req, res) {
    try {
        const { reference, status, pollurl } = req.body;

        console.log('🔔 [Webhook] Paynow webhook received:', { 
            reference, 
            status,
            pollurl,
            body: req.body 
        });

        // Validate required fields
        if (!reference) {
            console.error('❌ [Webhook] Missing reference in webhook payload');
            return res.status(400).send('Missing reference');
        }

        if (!status) {
            console.error('❌ [Webhook] Missing status in webhook payload');
            return res.status(400).send('Missing status');
        }

        // Find payment by reference
        const payment = await Payment.findOne({
            where: { paynowReference: reference },
            include: [{
                model: Order,
                as: 'order'
            }]
        });

        if (!payment) {
            console.error('❌ [Webhook] Payment not found for reference:', reference);
            return res.status(404).send('Payment not found');
        }

        console.log('✅ [Webhook] Payment found:', {
            paymentId: payment.id,
            currentStatus: payment.status,
            orderId: payment.order?.id,
            orderStatus: payment.order?.status
        });

        // Use transaction to ensure data consistency
        const transaction = await sequelize.transaction();

        try {
            let updated = false;

            // Handle different statuses
            switch (status.toLowerCase()) {
                case 'paid':
                    if (payment.status !== 'paid') {
                        await payment.update({ status: 'paid' }, { transaction });
                        
                        if (payment.order) {
                            await payment.order.update({ status: 'confirmed' }, { transaction });
                        }
                        
                        console.log('💰 [Webhook] Payment marked as paid:', reference);
                        updated = true;
                    }
                    break;

                case 'cancelled':
                    if (payment.status !== 'cancelled') {
                        await payment.update({ status: 'cancelled' }, { transaction });
                        
                        if (payment.order) {
                            await payment.order.update({ status: 'cancelled' }, { transaction });
                        }
                        
                        console.log('❌ [Webhook] Payment marked as cancelled:', reference);
                        updated = true;
                    }
                    break;

                case 'failed':
                    if (payment.status !== 'failed') {
                        await payment.update({ status: 'failed' }, { transaction });
                        
                        if (payment.order) {
                            // Don't cancel order immediately on failure - might retry
                            await payment.order.update({ status: 'pending' }, { transaction });
                        }
                        
                        console.log('⚠️ [Webhook] Payment marked as failed:', reference);
                        updated = true;
                    }
                    break;

                case 'sent':
                case 'created':
                    // These are intermediate states, no action needed
                    console.log('🔄 [Webhook] Payment in intermediate state:', status);
                    break;

                default:
                    console.warn('⚠️ [Webhook] Unknown status received:', status);
                    break;
            }

            // Commit transaction
            await transaction.commit();

            if (updated) {
                console.log('✅ [Webhook] Successfully updated payment:', {
                    reference,
                    oldStatus: payment.status,
                    newStatus: status,
                    orderUpdated: !!payment.order
                });
            } else {
                console.log('ℹ️ [Webhook] No update needed - status unchanged:', {
                    reference,
                    currentStatus: payment.status,
                    receivedStatus: status
                });
            }

            res.status(200).send('OK');

        } catch (transactionError) {
            // Rollback transaction on error
            await transaction.rollback();
            console.error('❌ [Webhook] Transaction failed:', transactionError);
            throw transactionError;
        }

    } catch (error) {
        console.error('❌ [Webhook] Webhook processing error:', {
            error: error.message,
            stack: error.stack,
            body: req.body
        });
        
        // Still return 200 to Paynow so they don't retry excessively
        res.status(200).send('Error processed');
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
            console.error('Payment history error:', error);
            res.status(500).json({ 
                error: 'Failed to fetch payment history',
                message: error.message 
            });
        }
    }
};

module.exports = PaymentController;