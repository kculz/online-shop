// ============================================
// client/src/features/admin/adminSelectors.js
// ============================================
import { createSelector } from 'reselect';

// Import selectors from other features
import { selectAllProducts } from '../products/productsSelectors';
import { selectAllOrders } from '../orders/ordersSelectors';
import { selectAllUsers } from '../users/usersSelectors';
import { selectPaymentHistory } from '../payments/paymentsSelectors';

// Safe rental selector - handle different state structures
const selectSafeRentals = (state) => {
  // The slice is named 'rental' in the store (from rentalsSlice.js)
  const rentalState = state.rental || state.rentals;
  if (!rentalState) return [];
  
  // Try to get rentals from different possible locations
  return rentalState.allRentals || rentalState.userRentals || [];
};

// Dashboard Statistics Selector
export const selectDashboardStats = createSelector(
  [
    selectAllProducts,
    selectAllOrders,
    selectAllUsers,
    selectSafeRentals,
    selectPaymentHistory
  ],
  (products = [], orders = [], users = [], rentals = [], payments = []) => {
    try {
      // Total counts
      const totalProducts = products.length;
      const totalOrders = orders.length;
      const totalUsers = users.length;
      
      // Calculate rental status
      const now = new Date();
      const activeRentals = rentals.filter(rental => {
        if (rental.status === 'active') return true;
        if (!rental.endDate) return false;
        return new Date(rental.endDate) > now && !rental.isReturned;
      }).length;
      
      // Pending orders
      const pendingOrders = orders.filter(
        order => ['pending', 'payment_pending', 'processing'].includes(order.status)
      ).length;
      
      // Total revenue from paid payments
      const totalRevenue = payments
        .filter(payment => payment.status === 'paid')
        .reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0);
      
      // Recent orders (last 5) - FIXED: Create copy before sorting
      const recentOrders = [...orders] // Create copy first
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      
      // Products by status
      const availableProducts = products.filter(p => p.isAvailable).length;
      const unavailableProducts = products.filter(p => !p.isAvailable).length;
      
      // Users by role
      const adminUsers = users.filter(u => u.role === 'admin').length;
      const regularUsers = users.filter(u => u.role === 'user').length;
      
      // Orders by status
      const ordersByStatus = {
        pending: orders.filter(o => o.status === 'pending').length,
        processing: orders.filter(o => o.status === 'processing').length,
        confirmed: orders.filter(o => o.status === 'confirmed').length,
        shipped: orders.filter(o => o.status === 'shipped').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
      };
      
      // Overdue rentals
      const overdueRentals = rentals.filter(rental => {
        if (rental.status === 'overdue') return true;
        if (!rental.endDate || rental.isReturned) return false;
        return new Date(rental.endDate) < now;
      }).length;
      
      return {
        // Main stats
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue,
        activeRentals,
        pendingOrders,
        
        // Products breakdown
        availableProducts,
        unavailableProducts,
        
        // Users breakdown
        adminUsers,
        regularUsers,
        
        // Orders breakdown
        ordersByStatus,
        
        // Rentals
        overdueRentals,
        
        // Recent activity
        recentOrders,
      };
    } catch (error) {
      console.error('Error calculating dashboard stats:', error);
      return {
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0,
        activeRentals: 0,
        pendingOrders: 0,
        availableProducts: 0,
        unavailableProducts: 0,
        adminUsers: 0,
        regularUsers: 0,
        ordersByStatus: {},
        overdueRentals: 0,
        recentOrders: [],
      };
    }
  }
);

// Recent Activities Selector - FIXED: Create copies before sorting
export const selectRecentActivities = createSelector(
  [selectAllOrders, selectAllUsers, selectAllProducts, selectSafeRentals],
  (orders, users, products, rentals) => {
    const activities = [];
    
    // Recent orders - FIXED: Create copy before slicing
    [...orders].slice(0, 3).forEach(order => {
      activities.push({
        type: 'order',
        message: `New order #${order.id} placed`,
        time: order.createdAt,
        icon: '🛒',
        color: 'text-blue-600'
      });
    });
    
    // Recent users - FIXED: Create copy before slicing
    [...users].slice(0, 2).forEach(user => {
      activities.push({
        type: 'user',
        message: `New user "${user.username}" registered`,
        time: user.createdAt,
        icon: '👤',
        color: 'text-green-600'
      });
    });
    
    // Recent product updates - FIXED: Create copy before sorting
    [...products] // Create copy first
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 2)
      .forEach(product => {
        activities.push({
          type: 'product',
          message: `Product "${product.name}" updated`,
          time: product.updatedAt,
          icon: '📦',
          color: 'text-purple-600'
        });
      });
    
    // Recent rental returns (if rentals exist) - FIXED: Create copy before filtering
    if (rentals && rentals.length > 0) {
      [...rentals] // Create copy first
        .filter(rental => rental.isReturned || rental.status === 'returned')
        .slice(0, 2)
        .forEach(rental => {
          activities.push({
            type: 'rental',
            message: `Rental #${rental.id} returned`,
            time: rental.updatedAt || rental.createdAt,
            icon: '📅',
            color: 'text-orange-600'
          });
        });
    }
    
    // Sort by time and return top 10 - FIXED: Create copy before sorting
    return [...activities] // Create copy first
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 10);
  }
);

// Low Stock Products Selector - FIXED: Create copies before sorting
export const selectLowStockProducts = createSelector(
  [selectAllProducts],
  (products) => {
    return [...products] // Create copy first
      .filter(product => product.isAvailable && (product.stockQuantity || 0) < 10)
      .sort((a, b) => (a.stockQuantity || 0) - (b.stockQuantity || 0))
      .slice(0, 5);
  }
);

// Top Selling Products Selector - FIXED: Create copies before sorting
export const selectTopSellingProducts = createSelector(
  [selectAllOrders, selectAllProducts],
  (orders, products) => {
    const productSales = {};
    
    // Count sales for each product - FIXED: Create copy before forEach
    [...orders].forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          const productId = item.productId;
          if (!productSales[productId]) {
            productSales[productId] = {
              productId,
              quantity: 0,
              revenue: 0
            };
          }
          productSales[productId].quantity += item.quantity || 0;
          productSales[productId].revenue += (item.price || 0) * (item.quantity || 0);
        });
      }
    });
    
    // Convert to array and sort by quantity - FIXED: Create copy before sorting
    return Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5)
      .map(sale => {
        const product = [...products].find(p => p.id === sale.productId); // Create copy for find
        return {
          ...sale,
          productName: product?.name || 'Unknown Product',
          productImage: product?.image || '📦'
        };
      });
  }
);

// Revenue Trends Selector (Last 7 days) - FIXED: Create copies before filtering
export const selectRevenueTrends = createSelector(
  [selectPaymentHistory],
  (payments) => {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayRevenue = [...payments] // Create copy first
        .filter(payment => {
          const paymentDate = new Date(payment.createdAt).toISOString().split('T')[0];
          return paymentDate === dateStr && payment.status === 'paid';
        })
        .reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0);
      
      last7Days.push({
        date: dateStr,
        revenue: dayRevenue,
        label: date.toLocaleDateString('en-US', { weekday: 'short' })
      });
    }
    
    return last7Days;
  }
);

// Additional safe utility functions
export const selectSafeOrders = createSelector(
  [selectAllOrders],
  (orders) => [...orders] // Always return a copy
);

export const selectSafeProducts = createSelector(
  [selectAllProducts],
  (products) => [...products] // Always return a copy
);

export const selectSafeUsers = createSelector(
  [selectAllUsers],
  (users) => [...users] // Always return a copy
);