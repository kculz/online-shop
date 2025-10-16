// migrations/003-create-products.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Products', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      stockQuantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      imageUrl: {
        type: Sequelize.STRING,
        allowNull: true
      },
      isAvailable: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      canBeRented: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      rentalPricePerDay: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      rentalDeposit: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      minRentalDays: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      maxRentalDays: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Categories',
          key: 'id'
        },
        onDelete: 'CASCADE'
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
    await queryInterface.dropTable('Products');
  }
};