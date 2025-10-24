// ============================================
// pages/Orders.jsx - Orders Management
// ============================================
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  FaShoppingBag,
  FaClock,
  FaCheckCircle,
  FaTruck,
  FaBoxOpen,
  FaTimesCircle,
  FaEye,
  FaPlus,
  FaSearch,
  FaFilter,
  FaSort
} from 'react-icons/fa';

// Import Redux actions and selectors
import { fetchOrdersThunk } from '../features/orders/ordersThunks';
import { clearError } from '../features/orders/ordersSlice';
import {
  selectAllOrders,
  selectOrdersLoading,
  selectOrdersError,
  selectPendingOrders,
  selectCompletedOrders,
  selectCancelledOrders,
  selectOrderStats
} from '../features/orders/ordersSelectors';
import { ordersUtils } from '../features/orders/ordersAPI';

const Orders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux Selectors
  const orders = useSelector(selectAllOrders);
  const loading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);
  const pendingOrders = useSelector(selectPendingOrders);
  const completedOrders = useSelector(selectCompletedOrders);
  const cancelledOrders = useSelector(selectCancelledOrders);
  const stats = useSelector(selectOrderStats);

  // Local state
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Fetch orders on component mount
  useEffect(() => {
    dispatch(fetchOrdersThunk());
  }, [dispatch]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Filter and sort orders
  const filteredAndSortedOrders = React.useMemo(() => {
    let filtered = orders;

    // Filter by active tab
    if (activeTab === 'pending') {
      filtered = pendingOrders;
    } else if (activeTab === 'completed') {
      filtered = completedOrders;
    } else if (activeTab === 'cancelled') {
      filtered = cancelledOrders;
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toString().includes(searchTerm) ||
        order.items.some(item =>
          item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Sort orders
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'amount-high':
          return parseFloat(b.totalAmount) - parseFloat(a.totalAmount);
        case 'amount-low':
          return parseFloat(a.totalAmount) - parseFloat(b.totalAmount);
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return filtered;
  }, [orders, activeTab, searchTerm, sortBy, pendingOrders, completedOrders, cancelledOrders]);

  // Handle view order details
  const handleViewOrder = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = ordersUtils.formatStatus(status);
    return (
      <span className={`badge ${statusConfig.badgeColor} badge-lg`}>
        {statusConfig.text}
      </span>
    );
  };

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaShoppingBag className="text-6xl text-blue-600 mb-4 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900">Loading Orders...</h2>
          <p className="text-gray-600">Please wait while we fetch your orders</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3 mb-2">
                <FaShoppingBag />
                My Orders
              </h1>
              <p className="text-blue-100">Manage and track your orders</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={() => navigate('/products')}
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all flex items-center gap-2"
              >
                <FaPlus />
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="container mx-auto px-4 -mt-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FaShoppingBag className="text-2xl text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <FaClock className="text-2xl text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FaCheckCircle className="text-2xl text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-purple-600">${stats.totalAmount}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <FaBoxOpen className="text-2xl text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              {[
                { key: 'all', label: 'All Orders', count: orders.length },
                { key: 'pending', label: 'Pending', count: pendingOrders.length },
                { key: 'completed', label: 'Completed', count: completedOrders.length },
                { key: 'cancelled', label: 'Cancelled', count: cancelledOrders.length }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab.key
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            {/* Search and Sort */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="amount-high">Amount: High to Low</option>
                <option value="amount-low">Amount: Low to High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3">
              <FaTimesCircle className="text-red-600 text-xl" />
              <div>
                <h3 className="text-red-800 font-semibold">Error Loading Orders</h3>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Orders List */}
        {filteredAndSortedOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <FaBoxOpen className="text-6xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Orders Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || activeTab !== 'all' 
                ? 'No orders match your current filters.' 
                : "You haven't placed any orders yet."
              }
            </p>
            {!searchTerm && activeTab === 'all' && (
              <button
                onClick={() => navigate('/products')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
              >
                Start Shopping
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredAndSortedOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
                {/* Order Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order.id}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Placed on {ordersUtils.formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="mt-2 lg:mt-0 flex items-center gap-4">
                    <StatusBadge status={order.status} />
                    <p className="text-xl font-bold text-gray-900">
                      ${parseFloat(order.totalAmount).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="border-t pt-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-2">
                        {order.items.slice(0, 3).map((item, index) => (
                          <div
                            key={item.id}
                            className="w-12 h-12 bg-gray-200 rounded-lg border-2 border-white flex items-center justify-center"
                            style={{ zIndex: 3 - index }}
                          >
                            {item.product?.imageUrl ? (
                              <img
                                src={item.product.imageUrl}
                                alt={item.product.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <FaBoxOpen className="text-gray-600" />
                            )}
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="w-12 h-12 bg-gray-100 rounded-lg border-2 border-white flex items-center justify-center text-xs font-semibold text-gray-600">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.items[0]?.product?.name}
                          {order.items.length > 1 && ` and ${order.items.length - 1} more`}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleViewOrder(order.id)}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center gap-2"
                    >
                      <FaEye />
                      View Details
                    </button>
                  </div>
                </div>

                {/* Order Footer */}
                <div className="border-t mt-4 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Payment Method:</span> {order.paymentMethod}
                  </div>
                  <div className="mt-2 sm:mt-0">
                    <span className="font-medium">Shipping Address:</span> {order.shippingAddress.substring(0, 50)}...
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;