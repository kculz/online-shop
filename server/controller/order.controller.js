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
  },

    // ADMIN: Get all orders (with user information)
  async getAllOrders(req, res) {
    try {
      console.log('👑 ADMIN: Fetching all orders');
      
      const orders = await Order.findAll({
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'email']
          },
          {
            model: OrderItem,
            as: 'items',
            include: [
              {
                model: Product,
                as: 'product',
                attributes: ['id', 'name', 'price', 'rentalPricePerDay']
              }
            ]
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      console.log(`✅ ADMIN: Found ${orders.length} orders`);
      res.json(orders);
    } catch (error) {
      console.error('❌ ADMIN: Error fetching orders:', error);
      res.status(500).json({ 
        error: 'Failed to fetch orders',
        message: error.message 
      });
    }
  },

  // ADMIN: Get order by ID (with full details)
  async getOrderById(req, res) {
    try {
      const { id } = req.params;
      console.log(`👑 ADMIN: Fetching order ${id}`);

      const order = await Order.findByPk(id, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'email', 'firstName', 'lastName']
          },
          {
            model: OrderItem,
            as: 'items',
            include: [
              {
                model: Product,
                as: 'product',
                attributes: ['id', 'name', 'price', 'rentalPricePerDay', 'imageUrl']
              }
            ]
          }
        ]
      });

      if (!order) {
        console.log(`❌ ADMIN: Order ${id} not found`);
        return res.status(404).json({ error: 'Order not found' });
      }

      console.log(`✅ ADMIN: Order ${id} fetched successfully`);
      res.json(order);
    } catch (error) {
      console.error(`❌ ADMIN: Error fetching order ${req.params.id}:`, error);
      res.status(500).json({ 
        error: 'Failed to fetch order',
        message: error.message 
      });
    }
  },

  // ADMIN: Update order status
  async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      console.log(`👑 ADMIN: Updating order ${id} status to ${status}`);

      // Validate status
      const validStatuses = ['pending', 'payment_pending', 'processing', 'confirmed', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
          error: 'Invalid status',
          validStatuses 
        });
      }

      const order = await Order.findByPk(id);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // Update order status
      order.status = status;
      await order.save();

      console.log(`✅ ADMIN: Order ${id} status updated to ${status}`);

      // Return updated order with relationships
      const updatedOrder = await Order.findByPk(id, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'email']
          },
          {
            model: OrderItem,
            as: 'items',
            include: [
              {
                model: Product,
                as: 'product',
                attributes: ['id', 'name', 'price', 'rentalPricePerDay']
              }
            ]
          }
        ]
      });

      res.json(updatedOrder);
    } catch (error) {
      console.error(`❌ ADMIN: Error updating order status for ${req.params.id}:`, error);
      res.status(500).json({ 
        error: 'Failed to update order status',
        message: error.message 
      });
    }
  },

  // ADMIN: Delete order
  async deleteOrder(req, res) {
    try {
      const { id } = req.params;
      console.log(`👑 ADMIN: Deleting order ${id}`);

      const order = await Order.findByPk(id);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // First delete order items (due to foreign key constraints)
      await OrderItem.destroy({ where: { orderId: id } });
      
      // Then delete the order
      await order.destroy();

      console.log(`✅ ADMIN: Order ${id} deleted successfully`);
      res.status(204).send();
    } catch (error) {
      console.error(`❌ ADMIN: Error deleting order ${req.params.id}:`, error);
      res.status(500).json({ 
        error: 'Failed to delete order',
        message: error.message 
      });
    }
  },

  // ADMIN: Get order statistics
  async getOrderStats(req, res) {
    try {
      console.log('👑 ADMIN: Fetching order statistics');

      const totalOrders = await Order.count();
      const totalRevenue = await Order.sum('totalAmount', {
        where: { status: ['confirmed', 'shipped', 'delivered'] }
      });
      
      const ordersByStatus = await Order.findAll({
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['status'],
        raw: true
      });

      const recentOrders = await Order.findAll({
        limit: 5,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['username']
          }
        ]
      });

      const stats = {
        totalOrders,
        totalRevenue: totalRevenue || 0,
        ordersByStatus: ordersByStatus.reduce((acc, item) => {
          acc[item.status] = parseInt(item.count);
          return acc;
        }, {}),
        recentOrders
      };

      console.log('✅ ADMIN: Order statistics fetched successfully');
      res.json(stats);
    } catch (error) {
      console.error('❌ ADMIN: Error fetching order statistics:', error);
      res.status(500).json({ 
        error: 'Failed to fetch order statistics',
        message: error.message 
      });
    }
  }
};

module.exports = OrderController;