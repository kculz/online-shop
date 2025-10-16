// ============================================
// pages/admin/Dashboard.jsx
// ============================================
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, useProducts, useOrders, useUsers, useRentals, usePayments } from '../../stores';
// import { productSelectors, orderSelectors, userSelectors, rentalSelectors, paymentSelectors } from '../../stores/selectors';
import { productSelectors } from '../../stores/selectors/productSelectors';
import { orderSelectors } from '../../stores/selectors/orderSelectors';
import { userSelectors } from '../../stores/selectors/userSelectors';
import { rentalSelectors } from '../../stores/selectors/rentalSelectors';
import { paymentSelectors } from '../../stores/selectors/paymentSelectors';

const Dashboard = () => {
  const { user } = useAuth();
  const { products, fetchProducts } = useProducts();
  const { orders, fetchUserOrders } = useOrders();
  const { users, fetchAllUsers } = useUsers();
  const { rentals, fetchAllRentals } = useRentals();
  const { paymentHistory, fetchPaymentHistory } = usePayments();

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    activeRentals: 0,
    pendingOrders: 0,
  });

  useEffect(() => {
    // Fetch all data for dashboard
    fetchProducts();
    fetchUserOrders();
    fetchAllUsers();
    fetchAllRentals();
    fetchPaymentHistory();
  }, [fetchProducts, fetchUserOrders, fetchAllUsers, fetchAllRentals, fetchPaymentHistory]);

  useEffect(() => {
    // Calculate stats when data changes
    if (products && orders && users && rentals && paymentHistory) {
      const totalRevenue = paymentHistory
        .filter(payment => payment.status === 'paid')
        .reduce((total, payment) => total + payment.amount, 0);

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalUsers: users.length,
        totalRevenue,
        activeRentals: rentals.filter(rental => rental.status === 'active').length,
        pendingOrders: orders.filter(order => order.status === 'pending').length,
      });
    }
  }, [products, orders, users, rentals, paymentHistory]);

  const recentActivities = [
    { type: 'order', message: 'New order #1234 placed', time: '2 minutes ago' },
    { type: 'user', message: 'New user registered', time: '5 minutes ago' },
    { type: 'product', message: 'Product "MacBook Pro" updated', time: '1 hour ago' },
    { type: 'rental', message: 'Rental return processed', time: '2 hours ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-700">
          Welcome back, {user?.username}! Here's what's happening with your store today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">📦</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalProducts}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/admin/products" className="font-medium text-blue-600 hover:text-blue-500">
                View all products
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">🛒</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalOrders}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/admin/orders" className="font-medium text-blue-600 hover:text-blue-500">
                View all orders
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalUsers}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/admin/users" className="font-medium text-blue-600 hover:text-blue-500">
                View all users
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                  <dd className="text-lg font-medium text-gray-900">${stats.totalRevenue.toFixed(2)}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/admin/payments" className="font-medium text-blue-600 hover:text-blue-500">
                View payments
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">📅</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Rentals</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.activeRentals}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/admin/rentals" className="font-medium text-blue-600 hover:text-blue-500">
                Manage rentals
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">⏳</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending Orders</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.pendingOrders}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/admin/orders?status=pending" className="font-medium text-blue-600 hover:text-blue-500">
                Process orders
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {recentActivities.map((activity, index) => (
                <li key={index} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.message}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/admin/products/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Product
              </Link>
              <Link
                to="/admin/categories/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Add Category
              </Link>
              <Link
                to="/admin/rentals/overdue"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Check Overdue
              </Link>
              <Link
                to="/admin/users/invite"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Invite User
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;