const { Rental, OrderItem, Product } = require('../models');

const RentalController = {
  // Get all rentals (admin only)
  async getAllRentals(req, res) {
    try {
      const rentals = await Rental.findAll({
        include: [{
          model: OrderItem,
          as: 'orderItem',
          include: [{
            model: Product,
            as: 'product'
          }]
        }]
      });
      res.json(rentals);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get rentals for a specific user
  async getUserRentals(req, res) {
    try {
      const rentals = await Rental.findAll({
        include: [{
          model: OrderItem,
          as: 'orderItem',
          where: { '$orderItem.order.userId$': req.user.id },
          include: [{
            model: Product,
            as: 'product'
          }]
        }]
      });
      res.json(rentals);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Process a rental return (admin only)
  async processReturn(req, res) {
    try {
      const { rentalId } = req.params;
      const { actualReturnDate, condition } = req.body;

      const rental = await Rental.findByPk(rentalId, {
        include: [{
          model: OrderItem,
          as: 'orderItem'
        }]
      });

      if (!rental) {
        return res.status(404).json({ error: 'Rental not found' });
      }

      // Calculate late fee if returned after endDate
      let lateFee = 0;
      if (new Date(actualReturnDate) > rental.endDate) {
        const lateDays = Math.ceil(
          (new Date(actualReturnDate) - rental.endDate) / (1000 * 60 * 60 * 24)
        );
        lateFee = lateDays * (rental.orderItem.price / rental.orderItem.rentalDays);
      }

      // Check for damage (simplified example)
      let depositRefund = rental.depositAmount;
      if (condition === 'damaged') {
        depositRefund *= 0.5; // Deduct 50% for damage
      }

      // Update rental status
      await rental.update({
        actualReturnDate,
        lateFee,
        depositStatus: depositRefund < rental.depositAmount ? 'partially_refunded' : 'refunded',
        status: 'returned'
      });

      res.json({
        message: 'Rental return processed',
        lateFee,
        depositRefund
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Check for overdue rentals (cron job or admin trigger)
  async checkOverdueRentals(req, res) {
    try {
      const overdueRentals = await Rental.findAll({
        where: {
          status: 'active',
          endDate: { [Op.lt]: new Date() }
        },
        include: [{
          model: OrderItem,
          as: 'orderItem',
          include: [{
            model: Product,
            as: 'product'
          }]
        }]
      });

      // Update status to overdue
      await Promise.all(
        overdueRentals.map(rental => 
          rental.update({ status: 'overdue' })
        )
      );

      res.json({
        message: `${overdueRentals.length} rentals marked as overdue`,
        overdueRentals
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = RentalController;