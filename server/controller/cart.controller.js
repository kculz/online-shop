// controllers/cartController.js
const { Cart, CartItem, Product } = require('../models');

const CartController = {
  // Get user's cart
  async getCart(req, res) {
    try {
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
        return res.status(404).json({ message: 'Cart not found' });
      }

      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Add item to cart
  async addItem(req, res) {
    try {
      const { productId, quantity = 1, isForRental = false, rentalDays } = req.body;
      
      // Validate rental items
      if (isForRental && !rentalDays) {
        return res.status(400).json({ error: 'Rental items require rentalDays' });
      }

      // Find or create cart for user
      const [cart] = await Cart.findOrCreate({
        where: { userId: req.user.id },
        defaults: { userId: req.user.id }
      });

      // Get product to verify price and availability
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      if (!product.isAvailable) {
        return res.status(400).json({ error: 'Product is not available' });
      }

      if (isForRental && !product.canBeRented) {
        return res.status(400).json({ error: 'This product cannot be rented' });
      }

      // Check if item already exists in cart
      const [cartItem, created] = await CartItem.findOrCreate({
        where: {
          cartId: cart.id,
          productId,
          isForRental
        },
        defaults: {
          cartId: cart.id,
          productId,
          quantity,
          isForRental,
          rentalDays,
          priceAtAddition: isForRental 
            ? product.rentalPricePerDay * rentalDays 
            : product.price
        }
      });

      if (!created) {
        cartItem.quantity += quantity;
        await cartItem.save();
      }

      res.status(201).json(cartItem);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update cart item quantity
  async updateItem(req, res) {
    try {
      const { quantity, rentalDays } = req.body;
      const { itemId } = req.params;

      const cartItem = await CartItem.findOne({
        where: {
          id: itemId,
          '$cart.userId$': req.user.id
        },
        include: [
          {
            model: Cart,
            as: 'cart'
          },
          {
            model: Product,
            as: 'product'
          }
        ]
      });

      if (!cartItem) {
        return res.status(404).json({ error: 'Cart item not found' });
      }

      if (quantity) {
        cartItem.quantity = quantity;
      }

      if (cartItem.isForRental && rentalDays) {
        cartItem.rentalDays = rentalDays;
        cartItem.priceAtAddition = cartItem.product.rentalPricePerDay * rentalDays;
      }

      await cartItem.save();

      res.json(cartItem);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Remove item from cart
  async removeItem(req, res) {
    try {
      const { itemId } = req.params;

      const cartItem = await CartItem.findOne({
        where: {
          id: itemId,
          '$cart.userId$': req.user.id
        },
        include: [
          {
            model: Cart,
            as: 'cart'
          }
        ]
      });

      if (!cartItem) {
        return res.status(404).json({ error: 'Cart item not found' });
      }

      await cartItem.destroy();

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Clear cart
  async clearCart(req, res) {
    try {
      const cart = await Cart.findOne({
        where: { userId: req.user.id }
      });

      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
      }

      await CartItem.destroy({
        where: { cartId: cart.id }
      });

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = CartController;