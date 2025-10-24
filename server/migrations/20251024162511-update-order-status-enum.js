// migrations/xxxxxx-update-order-status-enum.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    console.log('🔄 Updating Orders status ENUM...');
    
    // For MySQL, modify the column to include new status values
    await queryInterface.sequelize.query(`
      ALTER TABLE Orders 
      MODIFY COLUMN status ENUM(
        'pending',
        'payment_pending',
        'processing',
        'confirmed',
        'shipped',
        'delivered',
        'cancelled'
      ) DEFAULT 'pending'
    `);
    
    console.log('✅ Orders status ENUM updated successfully');
  },

  async down(queryInterface, Sequelize) {
    console.log('🔄 Reverting Orders status ENUM...');
    
    // Revert back to original ENUM
    await queryInterface.sequelize.query(`
      ALTER TABLE Orders 
      MODIFY COLUMN status ENUM(
        'pending',
        'processing',
        'shipped',
        'delivered',
        'cancelled'
      ) DEFAULT 'pending'
    `);
    
    console.log('✅ Orders status ENUM reverted');
  }
};