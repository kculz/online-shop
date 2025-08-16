// controllers/orderController.js
const { Order, OrderItem, Cart, CartItem, Product } = require('../models');

const OrderController = {
  // Create order from cart
  async createOrder(req, res) {
    try {
      const { shippingAddress, paymentMethod } = req.body;

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
        return res.status(404).json({ error: 'Cart not found' });
      }

      if (cart.items.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
      }

      // Calculate total amount
      let totalAmount = 0;
      const orderItems = [];

      for (const item of cart.items) {
        const product = item.product;
        
        // Verify product availability
        if (!product.isAvailable || product.stockQuantity < item.quantity) {
          return res.status(400).json({ 
            error: `Product ${product.name} is not available in the requested quantity` 
          });
        }

        // Calculate item price
        const itemPrice = item.isForRental 
          ? product.rentalPricePerDay * item.rentalDays 
          : product.price * item.quantity;

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

      // Create order
      const order = await Order.create({
        userId: req.user.id,
        totalAmount,
        status: 'pending',
        shippingAddress,
        paymentMethod
      });

      // Create order items
      await Promise.all(orderItems.map(item => 
        OrderItem.create({
          ...item,
          orderId: order.id
        })
      ));

      // Update product stock quantities
      await Promise.all(cart.items.map(async item => {
        const product = item.product;
        if (!item.isForRental) {
          product.stockQuantity -= item.quantity;
          await product.save();
        }
      }));

      // Clear cart
      await CartItem.destroy({ where: { cartId: cart.id } });

      // Return created order with items
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

      res.status(201).json(createdOrder);
    } catch (error) {
      res.status(500).json({ error: error.message });
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