// seeders/001-demo-data.js
'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create Users
    const users = await queryInterface.bulkInsert('Users', [
      {
        username: 'admin',
        password: await bcrypt.hash('admin123', 10),
        email: 'admin@store.com',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'john_doe',
        password: await bcrypt.hash('password123', 10),
        email: 'john@example.com',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'jane_smith',
        password: await bcrypt.hash('password123', 10),
        email: 'jane@example.com',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { returning: true });

    // Create Categories
    const categories = await queryInterface.bulkInsert('Categories', [
      {
        name: 'Electronics',
        description: 'Electronic devices and accessories',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Tools & Equipment',
        description: 'Tools and equipment for rent or purchase',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Furniture',
        description: 'Home and office furniture',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { returning: true });

    // Create Products
    const products = await queryInterface.bulkInsert('Products', [
      {
        name: 'iPhone 14 Pro',
        description: 'Latest Apple smartphone with advanced camera',
        price: 999.99,
        stockQuantity: 50,
        imageUrl: 'https://example.com/iphone14.jpg',
        isAvailable: true,
        canBeRented: false,
        categoryId: categories[0].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'MacBook Pro 16"',
        description: 'Powerful laptop for professionals',
        price: 2399.99,
        stockQuantity: 25,
        imageUrl: 'https://example.com/macbook.jpg',
        isAvailable: true,
        canBeRented: true,
        rentalPricePerDay: 49.99,
        rentalDeposit: 500.00,
        minRentalDays: 3,
        maxRentalDays: 30,
        categoryId: categories[0].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Power Drill Set',
        description: 'Cordless power drill with various attachments',
        price: 89.99,
        stockQuantity: 100,
        imageUrl: 'https://example.com/drill.jpg',
        isAvailable: true,
        canBeRented: true,
        rentalPricePerDay: 9.99,
        rentalDeposit: 50.00,
        minRentalDays: 1,
        maxRentalDays: 14,
        categoryId: categories[1].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Office Chair',
        description: 'Ergonomic office chair with lumbar support',
        price: 199.99,
        stockQuantity: 30,
        imageUrl: 'https://example.com/chair.jpg',
        isAvailable: true,
        canBeRented: true,
        rentalPricePerDay: 5.99,
        rentalDeposit: 100.00,
        minRentalDays: 7,
        maxRentalDays: 90,
        categoryId: categories[2].id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { returning: true });

    // Create Carts
    const carts = await queryInterface.bulkInsert('Carts', [
      {
        userId: users[1].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: users[2].id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { returning: true });

    // Create Cart Items
    await queryInterface.bulkInsert('CartItems', [
      {
        cartId: carts[0].id,
        productId: products[0].id,
        quantity: 1,
        isForRental: false,
        priceAtAddition: 999.99,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        cartId: carts[0].id,
        productId: products[2].id,
        quantity: 1,
        isForRental: true,
        rentalDays: 5,
        priceAtAddition: 9.99,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        cartId: carts[1].id,
        productId: products[1].id,
        quantity: 1,
        isForRental: true,
        rentalDays: 7,
        priceAtAddition: 49.99,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Create Orders
    const orders = await queryInterface.bulkInsert('Orders', [
      {
        userId: users[1].id,
        totalAmount: 1049.98,
        status: 'delivered',
        shippingAddress: '123 Main St, Harare, Zimbabwe',
        paymentMethod: 'ecocash',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: users[2].id,
        totalAmount: 349.93,
        status: 'processing',
        shippingAddress: '456 Park Ave, Bulawayo, Zimbabwe',
        paymentMethod: 'visa',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { returning: true });

    // Create Order Items
    const orderItems = await queryInterface.bulkInsert('OrderItems', [
      {
        orderId: orders[0].id,
        productId: products[0].id,
        quantity: 1,
        price: 999.99,
        isRental: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        orderId: orders[0].id,
        productId: products[2].id,
        quantity: 1,
        price: 49.95, // 5 days rental
        isRental: true,
        rentalDays: 5,
        rentalStartDate: new Date('2024-01-01'),
        rentalEndDate: new Date('2024-01-06'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        orderId: orders[1].id,
        productId: products[1].id,
        quantity: 1,
        price: 349.93, // 7 days rental
        isRental: true,
        rentalDays: 7,
        rentalStartDate: new Date('2024-01-15'),
        rentalEndDate: new Date('2024-01-22'),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { returning: true });

    // Create Payments
    await queryInterface.bulkInsert('Payments', [
      {
        orderId: orders[0].id,
        paymentMethod: 'ecocash',
        amount: 1049.98,
        phoneNumber: '+263771234567',
        status: 'paid',
        paynowReference: 'PAYNOW123456',
        invoiceNo: 'INV001',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        orderId: orders[1].id,
        paymentMethod: 'visa',
        amount: 349.93,
        status: 'paid',
        invoiceNo: 'INV002',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Create Rentals
    await queryInterface.bulkInsert('Rentals', [
      {
        orderItemId: orderItems[1].id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-06'),
        actualReturnDate: new Date('2024-01-06'),
        depositAmount: 50.00,
        depositStatus: 'refunded',
        lateFee: 0,
        status: 'returned',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        orderItemId: orderItems[2].id,
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-01-22'),
        depositAmount: 500.00,
        depositStatus: 'held',
        lateFee: 0,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Rentals', null, {});
    await queryInterface.bulkDelete('Payments', null, {});
    await queryInterface.bulkDelete('OrderItems', null, {});
    await queryInterface.bulkDelete('Orders', null, {});
    await queryInterface.bulkDelete('CartItems', null, {});
    await queryInterface.bulkDelete('Carts', null, {});
    await queryInterface.bulkDelete('Products', null, {});
    await queryInterface.bulkDelete('Categories', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};