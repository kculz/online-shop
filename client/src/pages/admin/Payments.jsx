// ============================================
// pages/admin/Payments.jsx - REDUX VERSION
// ============================================
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Import Redux actions and selectors
import { getPaymentHistoryThunk } from '../../features/payments/paymentsThunks';
import { clearError } from '../../features/payments/paymentsSlice';
import { 
  selectPaymentHistory, 
  selectHistoryLoading, 
  selectHistoryError 
} from '../../features/payments/paymentsSelectors';

// Import users and orders for data
import { fetchAllUsersThunk } from '../../features/users/usersThunks';
import { fetchAllOrdersThunk } from '../../features/orders/ordersThunks';
import { selectAllUsers } from '../../features/users/usersSelectors';
import { selectAllOrders } from '../../features/orders/ordersSelectors';

const Payments = () => {
  const dispatch = useDispatch();
  
  // Redux Selectors
  const paymentHistory = useSelector(selectPaymentHistory);
  const users = useSelector(selectAllUsers);
  const orders = useSelector(selectAllOrders);
  const isLoading = useSelector(selectHistoryLoading);
  const error = useSelector(selectHistoryError);

  // Local state
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch all data on component mount
    dispatch(getPaymentHistoryThunk());
    dispatch(fetchAllUsersThunk());
    dispatch(fetchAllOrdersThunk());
  }, [dispatch]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Helper function to safely format amounts
  const formatAmount = (amount) => {
    if (!amount && amount !== 0) return '0.00';
    
    if (typeof amount === 'number') {
      return amount.toFixed(2);
    }
    
    const numAmount = parseFloat(amount);
    if (!isNaN(numAmount)) {
      return numAmount.toFixed(2);
    }
    
    return amount || '0.00';
  };

  // Filter payments based on various criteria
  const filteredPayments = paymentHistory.filter(payment => {
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || payment.paymentMethod === methodFilter;
    const matchesDate = (!dateRange.start || new Date(payment.createdAt) >= new Date(dateRange.start)) &&
                       (!dateRange.end || new Date(payment.createdAt) <= new Date(dateRange.end));
    
    const matchesSearch = 
      payment.id?.toString().includes(searchTerm) ||
      getUserName(payment.userId)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.paynowReference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.phoneNumber?.includes(searchTerm);

    return matchesStatus && matchesMethod && matchesDate && matchesSearch;
  });

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.username : 'Unknown User';
  };

  const getOrderDetails = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    return order ? `Order #${order.id}` : 'Order not found';
  };

  const getOrderAmount = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    return order ? order.totalAmount : 0;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodColor = (method) => {
    switch (method) {
      case 'ecocash': return 'bg-purple-100 text-purple-800';
      case 'credit_card': return 'bg-blue-100 text-blue-800';
      case 'paypal': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodDisplayName = (method) => {
    switch (method) {
      case 'ecocash': return 'EcoCash';
      case 'credit_card': return 'Credit Card';
      case 'paypal': return 'PayPal';
      default: return method;
    }
  };

  const getStatusDisplayName = (status) => {
    switch (status) {
      case 'paid': return 'Paid';
      case 'pending': return 'Pending';
      case 'failed': return 'Failed';
      case 'cancelled': return 'Cancelled';
      case 'sent': return 'Sent';
      default: return status;
    }
  };

  // Calculate statistics
  const totalRevenue = filteredPayments
    .filter(p => p.status === 'paid')
    .reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0);

  const successfulPayments = filteredPayments.filter(p => p.status === 'paid').length;
  const pendingPayments = filteredPayments.filter(p => p.status === 'pending' || p.status === 'sent').length;
  const failedPayments = filteredPayments.filter(p => p.status === 'failed' || p.status === 'cancelled').length;
  const successRate = filteredPayments.length > 0 ? (successfulPayments / filteredPayments.length) * 100 : 0;

  const ecocashPayments = filteredPayments.filter(p => p.paymentMethod === 'ecocash').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Payments Management</h1>
        <p className="mt-2 text-sm text-gray-700">
          Monitor payment transactions, revenue, and payment status
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                  <dd className="text-lg font-medium text-gray-900">${formatAmount(totalRevenue)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Successful</dt>
                  <dd className="text-lg font-medium text-gray-900">{successfulPayments}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                  <dd className="text-lg font-medium text-gray-900">{pendingPayments}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Failed</dt>
                  <dd className="text-lg font-medium text-gray-900">{failedPayments}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Search</label>
            <input
              type="text"
              placeholder="Search by ID, user, reference, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="sent">Sent</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Method</label>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Methods</option>
              <option value="ecocash">EcoCash</option>
              <option value="credit_card">Credit Card</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">From Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">To Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white shadow rounded-lg">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading payments...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reference
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{payment.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getUserName(payment.userId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getOrderDetails(payment.orderId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${formatAmount(payment.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMethodColor(payment.paymentMethod)}`}>
                        {getMethodDisplayName(payment.paymentMethod)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.phoneNumber || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {getStatusDisplayName(payment.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(payment.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {payment.paynowReference || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredPayments.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' || methodFilter !== 'all' || dateRange.start || dateRange.end
                ? 'No payments found matching your criteria.' 
                : 'No payments found.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Summary Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Analytics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{filteredPayments.length}</div>
            <div className="text-sm text-gray-500">Total Transactions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {successRate.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-500">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {ecocashPayments}
            </div>
            <div className="text-sm text-gray-500">EcoCash Payments</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              ${formatAmount(totalRevenue)}
            </div>
            <div className="text-sm text-gray-500">Total Revenue</div>
          </div>
        </div>

        {/* Payment Method Distribution */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Payment Method Distribution</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['ecocash', 'credit_card', 'paypal'].map(method => {
              const methodCount = filteredPayments.filter(p => p.paymentMethod === method).length;
              const percentage = filteredPayments.length > 0 ? (methodCount / filteredPayments.length) * 100 : 0;
              
              return (
                <div key={method} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {getMethodDisplayName(method)}
                    </span>
                    <span className="text-sm text-gray-500">{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        method === 'ecocash' ? 'bg-purple-500' :
                        method === 'credit_card' ? 'bg-blue-500' :
                        'bg-indigo-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {methodCount} transactions
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pagination Info */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{filteredPayments.length}</span> of{' '}
              <span className="font-medium">{paymentHistory.length}</span> payments
            </p>
          </div>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;