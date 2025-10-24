// controllers/orderController.js
const { Order, OrderItem, Cart, CartItem, Product } = require('../models');

const OrderController = {
  // Create order from cart
  async createOrder(req, res) {
    try {
      console.log('📦 CREATE ORDER REQUEST ================');
      console.log('👤 User ID:', req.user.id);
      console.log('📝 Request body:', req.body);

      const { shippingAddress, paymentMethod } = req.body;

      // Validate required fields
      if (!shippingAddress) {
        console.log('❌ Missing shipping address');
        return res.status(400).json({ error: 'Shipping address is required' });
      }

      if (!paymentMethod) {
        console.log('❌ Missing payment method');
        return res.status(400).json({ error: 'Payment method is required' });
      }

      console.log('🔍 Looking for user cart...');

      // Get user's cart with items
      const cart = await Cart.findOne({
        where: { userId: req.user.id },
        include: [
          {
            model: CartItem,
            as: 'items',
            include: [
              {
                model: Product,
                as: 'product'
              }
            ]
          }
        ]
      });

      if (!cart) {
        console.log('❌ Cart not found for user:', req.user.id);
        return res.status(404).json({ error: 'Cart not found' });
      }

      console.log('🛒 Cart found, items count:', cart.items?.length || 0);

      if (!cart.items || cart.items.length === 0) {
        console.log('❌ Cart is empty');
        return res.status(400).json({ error: 'Cart is empty' });
      }

      // Log cart items for debugging
      cart.items.forEach((item, index) => {
        console.log(`📦 Cart Item ${index + 1}:`, {
          id: item.id,
          productId: item.productId,
          productName: item.product?.name,
          quantity: item.quantity,
          isForRental: item.isForRental,
          rentalDays: item.rentalDays,
          productAvailable: item.product?.isAvailable,
          productStock: item.product?.stockQuantity
        });
      });

      // Calculate total amount
      let totalAmount = 0;
      const orderItems = [];

      console.log('💰 Calculating order total...');

      for (const item of cart.items) {
        const product = item.product;
        
        if (!product) {
          console.log('❌ Product not found for cart item:', item.id);
          return res.status(400).json({ 
            error: 'One or more products in your cart are no longer available' 
          });
        }

        // Verify product availability
        if (!product.isAvailable) {
          console.log('❌ Product not available:', product.name);
          return res.status(400).json({ 
            error: `Product "${product.name}" is no longer available` 
          });
        }

        if (!item.isForRental && product.stockQuantity < item.quantity) {
          console.log('❌ Insufficient stock:', product.name, 'Requested:', item.quantity, 'Available:', product.stockQuantity);
          return res.status(400).json({ 
            error: `Product "${product.name}" only has ${product.stockQuantity} items in stock` 
          });
        }

        // Calculate item price
        let itemPrice;
        if (item.isForRental) {
          if (!product.canBeRented) {
            console.log('❌ Product cannot be rented:', product.name);
            return res.status(400).json({ 
              error: `Product "${product.name}" cannot be rented` 
            });
          }
          itemPrice = product.rentalPricePerDay * item.rentalDays;
          console.log(`💳 Rental price: ${product.rentalPricePerDay} × ${item.rentalDays} days = $${itemPrice}`);
        } else {
          itemPrice = product.price * item.quantity;
          console.log(`💳 Purchase price: ${product.price} × ${item.quantity} = $${itemPrice}`);
        }

        totalAmount += itemPrice;

        orderItems.push({
          productId: product.id,
          quantity: item.quantity,
          price: itemPrice,
          isRental: item.isForRental,
          rentalDays: item.isForRental ? item.rentalDays : null,
          rentalStartDate: item.isForRental ? new Date() : null,
          rentalEndDate: item.isForRental 
            ? new Date(Date.now() + item.rentalDays * 24 * 60 * 60 * 1000) 
            : null
        });
      }

      console.log('💰 Total order amount:', totalAmount);

      // Create order
      console.log('📝 Creating order record...');
      const order = await Order.create({
        userId: req.user.id,
        totalAmount,
        status: 'pending',
        shippingAddress,
        paymentMethod
      });

      console.log('✅ Order created with ID:', order.id);

      // Create order items
      console.log('📝 Creating order items...');
      await Promise.all(orderItems.map(item => 
        OrderItem.create({
          ...item,
          orderId: order.id
        })
      ));

      console.log('✅ Order items created:', orderItems.length);

      // Update product stock quantities
      console.log('📦 Updating product stock...');
      await Promise.all(cart.items.map(async (item) => {
        if (!item.isForRental && item.product) {
          const product = item.product;
          const newStock = product.stockQuantity - item.quantity;
          console.log(`📦 Updating ${product.name} stock: ${product.stockQuantity} - ${item.quantity} = ${newStock}`);
          product.stockQuantity = newStock;
          await product.save();
        }
      }));

      // Clear cart
      console.log('🗑️ Clearing cart...');
      await CartItem.destroy({ where: { cartId: cart.id } });
      console.log('✅ Cart cleared');

      // Return created order with items
      console.log('🔍 Fetching complete order details...');
      const createdOrder = await Order.findByPk(order.id, {
        include: [
          {
            model: OrderItem,
            as: 'items',
            include: [
              {
                model: Product,
                as: 'product'
              }
            ]
          }
        ]
      });

      console.log('✅ ORDER CREATION COMPLETE ================');
      console.log('📦 Order ID:', createdOrder.id);
      console.log('💰 Total Amount:', createdOrder.totalAmount);
      console.log('📋 Items count:', createdOrder.items.length);

      res.status(201).json(createdOrder);
    } catch (error) {
      console.error('❌ ORDER CREATION ERROR:', error);
      console.error('❌ Error stack:', error.stack);
      res.status(500).json({ 
        error: 'Failed to create order',
        message: error.message 
      });
    }
  },

  // Get user's orders
  async getUserOrders(req, res) {
    try {
      const orders = await Order.findAll({
        where: { userId: req.user.id },
        include: [
          {
            model: OrderItem,
            as: 'items',
            include: [
              {
                model: Product,
                as: 'product'
              }
            ]
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get order by ID
  async getOrder(req, res) {
    try {
      const order = await Order.findOne({
        where: {
          id: req.params.id,
          userId: req.user.id
        },
        include: [
          {
            model: OrderItem,
            as: 'items',
            include: [
              {
                model: Product,
                as: 'product'
              }
            ]
          }
        ]
      });

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      res.json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = OrderController;