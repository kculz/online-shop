// migrations/update-order-status-enum.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // For MySQL, we need to modify the column
    await queryInterface.sequelize.query(`
      ALTER TABLE Orders 
      MODIFY status ENUM(
        'pending',
        'payment_pending',
        'processing', 
        'confirmed',
        'shipped',
        'delivered',
        'cancelled'
      ) DEFAULT 'pending'
    `);
  },

  async down(queryInterface, Sequelize) {
    // Revert back to original ENUM
    await queryInterface.sequelize.query(`
      ALTER TABLE Orders 
      MODIFY status ENUM(
        'pending',
        'processing',
        'shipped',
        'delivered',
        'cancelled'
      ) DEFAULT 'pending'
    `);
  }
};