// ============================================
// pages/admin/Dashboard.jsx - REDUX VERSION
// ============================================
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  FaShoppingBag,
  FaUsers,
  FaBox,
  FaDollarSign,
  FaCalendarAlt,
  FaClock,
  FaArrowUp,
  FaArrowDown,
  FaExclamationTriangle,
  FaChartLine
} from 'react-icons/fa';

// Import Redux actions
import { fetchProductsThunk } from '../../features/products/productsThunks';
import { fetchOrdersThunk } from '../../features/orders/ordersThunks';
import { fetchAllUsersThunk } from '../../features/users/usersThunks';
import { fetchAllRentalsThunk } from '../../features/rentals/rentalsThunks';
import { getPaymentHistoryThunk } from '../../features/payments/paymentsThunks';

// Import selectors
import { selectUser } from '../../features/auth/authSelectors';
import {
  selectDashboardStats,
  selectRecentActivities,
  selectLowStockProducts,
  selectTopSellingProducts,
  selectRevenueTrends
} from '../../features/admin/adminSelectors';

// Import loading states
import {
  selectProductsLoading
} from '../../features/products/productsSelectors';
import {
  selectOrdersLoading
} from '../../features/orders/ordersSelectors';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux Selectors
  const user = useSelector(selectUser);
  const stats = useSelector(selectDashboardStats);
  const recentActivities = useSelector(selectRecentActivities);
  const lowStockProducts = useSelector(selectLowStockProducts);
  const topSellingProducts = useSelector(selectTopSellingProducts);
  const revenueTrends = useSelector(selectRevenueTrends);
  
  const productsLoading = useSelector(selectProductsLoading);
  const ordersLoading = useSelector(selectOrdersLoading);

  const isLoading = productsLoading || ordersLoading;

  // Fetch all data on mount
  useEffect(() => {
    dispatch(fetchProductsThunk());
    dispatch(fetchOrdersThunk());
    dispatch(fetchAllUsersThunk());
    dispatch(fetchAllRentalsThunk());
    dispatch(getPaymentHistoryThunk());
  }, [dispatch]);

  // Format time ago
  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    
    return new Date(date).toLocaleDateString();
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `$${parseFloat(amount || 0).toFixed(2)}`;
  };

  if (isLoading && !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

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
        {/* Total Products */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FaBox className="text-2xl text-blue-600" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stats?.totalProducts || 0}
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <FaArrowUp className="self-center flex-shrink-0 h-3 w-3 text-green-500" />
                      <span className="ml-1">{stats?.availableProducts || 0} available</span>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/admin/products" className="font-medium text-blue-600 hover:text-blue-500">
                View all products →
              </Link>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FaShoppingBag className="text-2xl text-green-600" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stats?.totalOrders || 0}
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-orange-600">
                      <FaClock className="self-center flex-shrink-0 h-3 w-3 text-orange-500" />
                      <span className="ml-1">{stats?.pendingOrders || 0} pending</span>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/admin/orders" className="font-medium text-green-600 hover:text-green-500">
                View all orders →
              </Link>
            </div>
          </div>
        </div>

        {/* Total Users */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FaUsers className="text-2xl text-purple-600" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stats?.totalUsers || 0}
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-purple-600">
                      <span className="ml-1">{stats?.adminUsers || 0} admins</span>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/admin/users" className="font-medium text-purple-600 hover:text-purple-500">
                View all users →
              </Link>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <FaDollarSign className="text-2xl text-yellow-600" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {formatCurrency(stats?.totalRevenue)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/admin/payments" className="font-medium text-yellow-600 hover:text-yellow-500">
                View payments →
              </Link>
            </div>
          </div>
        </div>

        {/* Active Rentals */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                  <FaCalendarAlt className="text-2xl text-teal-600" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Rentals</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stats?.activeRentals || 0}
                    </div>
                    {stats?.overdueRentals > 0 && (
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-red-600">
                        <FaExclamationTriangle className="self-center flex-shrink-0 h-3 w-3 text-red-500" />
                        <span className="ml-1">{stats?.overdueRentals} overdue</span>
                      </div>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/admin/rentals" className="font-medium text-teal-600 hover:text-teal-500">
                Manage rentals →
              </Link>
            </div>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FaClock className="text-2xl text-orange-600" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending Orders</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stats?.pendingOrders || 0}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/admin/orders?status=pending" className="font-medium text-orange-600 hover:text-orange-500">
                Process orders →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            {recentActivities && recentActivities.length > 0 ? (
              <ul className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="text-2xl">{activity.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${activity.color}`}>
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatTimeAgo(activity.time)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No recent activity
              </p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/admin/products')}
                className="inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaBox className="mr-2" />
                Add Product
              </button>
              <button
                onClick={() => navigate('/admin/categories')}
                className="inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Add Category
              </button>
              <button
                onClick={() => navigate('/admin/rentals')}
                className="inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <FaExclamationTriangle className="mr-2" />
                Check Overdue
              </button>
              <button
                onClick={() => navigate('/admin/users')}
                className="inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <FaUsers className="mr-2" />
                Manage Users
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock & Top Selling */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Low Stock Products */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <FaExclamationTriangle className="text-orange-500" />
              Low Stock Alert
            </h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            {lowStockProducts && lowStockProducts.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {lowStockProducts.map((product) => (
                  <li key={product.id} className="py-3 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{product.image || '📦'}</div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">Stock: {product.stockQuantity}</p>
                      </div>
                    </div>
                    <Link
                      to={`/admin/products`}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Restock
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                All products have sufficient stock
              </p>
            )}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <FaChartLine className="text-green-500" />
              Top Selling Products
            </h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            {topSellingProducts && topSellingProducts.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {topSellingProducts.map((item, index) => (
                  <li key={index} className="py-3 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{item.productImage}</div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                        <p className="text-xs text-gray-500">{item.quantity} sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">
                        {formatCurrency(item.revenue)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No sales data available
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Revenue Trends Chart */}
      {revenueTrends && revenueTrends.length > 0 && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Revenue Trends (Last 7 Days)</h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-end justify-between h-64 space-x-2">
              {revenueTrends.map((day, index) => {
                const maxRevenue = Math.max(...revenueTrends.map(d => d.revenue));
                const height = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0;
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center justify-end">
                    <div className="w-full relative group">
                      <div
                        className="w-full bg-blue-500 hover:bg-blue-600 rounded-t transition-all cursor-pointer"
                        style={{ height: `${height}%`, minHeight: height > 0 ? '8px' : '2px' }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                          {formatCurrency(day.revenue)}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-600 text-center">
                      {day.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;