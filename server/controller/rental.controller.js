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
  },

    // Delete rental (admin only)
  async deleteRental(req, res) {
    try {
      const { rentalId } = req.params;

      console.log(`👑 ADMIN: Deleting rental ${rentalId}`);

      const rental = await Rental.findByPk(rentalId);
      
      if (!rental) {
        console.log(`❌ ADMIN: Rental ${rentalId} not found`);
        return res.status(404).json({ error: 'Rental not found' });
      }

      // Check if rental can be deleted (only allow deletion of cancelled or returned rentals)
      if (rental.status === 'active' || rental.status === 'overdue') {
        console.log(`❌ ADMIN: Cannot delete ${rental.status} rental`);
        return res.status(400).json({ 
          error: `Cannot delete ${rental.status} rental. Only cancelled or returned rentals can be deleted.` 
        });
      }

      await rental.destroy();

      console.log(`✅ ADMIN: Rental ${rentalId} deleted successfully`);
      res.status(204).send();
    } catch (error) {
      console.error(`❌ ADMIN: Error deleting rental ${req.params.rentalId}:`, error);
      res.status(500).json({ 
        error: 'Failed to delete rental',
        message: error.message 
      });
    }
  },

  // Force delete rental (admin only - for any status)
  async forceDeleteRental(req, res) {
    try {
      const { rentalId } = req.params;

      console.log(`👑 ADMIN: Force deleting rental ${rentalId}`);

      const rental = await Rental.findByPk(rentalId);
      
      if (!rental) {
        return res.status(404).json({ error: 'Rental not found' });
      }

      await rental.destroy();

      console.log(`✅ ADMIN: Rental ${rentalId} force deleted successfully`);
      res.status(204).send();
    } catch (error) {
      console.error(`❌ ADMIN: Error force deleting rental ${req.params.rentalId}:`, error);
      res.status(500).json({ 
        error: 'Failed to force delete rental',
        message: error.message 
      });
    }
  }
};

module.exports = RentalController;