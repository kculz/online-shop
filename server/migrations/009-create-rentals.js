// migrations/009-create-rentals.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Rentals', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      orderItemId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'OrderItems',
          key: 'id'
        }
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      actualReturnDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      depositAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      depositStatus: {
        type: Sequelize.ENUM('held', 'refunded', 'partially_refunded'),
        defaultValue: 'held'
      },
      lateFee: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      status: {
        type: Sequelize.ENUM('active', 'returned', 'overdue', 'cancelled'),
        defaultValue: 'active'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Rentals');
  }
};