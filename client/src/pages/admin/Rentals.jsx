// ============================================
// pages/admin/Rentals.jsx - REDUX VERSION
// ============================================
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Import Redux actions and selectors
import { 
  fetchAllRentalsThunk, 
  processReturnThunk,
  checkOverdueRentalsThunk,
  deleteRentalThunk
} from '../../features/rentals/rentalsThunks';
import { clearError } from '../../features/rentals/rentalsSlice';
import { 
  selectAllRentalsWithCalculatedData, 
  selectRentalLoading, 
  selectRentalError 
} from '../../features/rentals/rentalsSelectors';

// Import users and products for data
import { fetchAllUsersThunk } from '../../features/users/usersThunks';
import { fetchProductsThunk } from '../../features/products/productsThunks';
import { selectAllUsers } from '../../features/users/usersSelectors';
import { selectAllProducts } from '../../features/products/productsSelectors';

const Rentals = () => {
  const dispatch = useDispatch();
  
  // Redux Selectors
  const rentals = useSelector(selectAllRentalsWithCalculatedData);
  const users = useSelector(selectAllUsers);
  const products = useSelector(selectAllProducts);
  const isLoading = useSelector(selectRentalLoading);
  const error = useSelector(selectRentalError);

  // Local state
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRental, setSelectedRental] = useState(null);
  const [returnData, setReturnData] = useState({
    actualReturnDate: new Date().toISOString().split('T')[0],
    condition: 'excellent',
    notes: ''
  });
  const [isProcessingReturn, setIsProcessingReturn] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch all data on component mount
    dispatch(fetchAllRentalsThunk());
    dispatch(fetchAllUsersThunk());
    dispatch(fetchProductsThunk());
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

  // Filter rentals based on status and search
  const filteredRentals = rentals.filter(rental => {
    const matchesStatus = statusFilter === 'all' || rental.status === statusFilter;
    const matchesSearch = 
      rental.id?.toString().includes(searchTerm) ||
      getUserName(rental.userId)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getProductName(rental.productId)?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.username : 'Unknown User';
  };

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'returned': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      case 'upcoming': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleProcessReturn = async (rentalId) => {
    setIsProcessingReturn(true);
    try {
      await dispatch(processReturnThunk({ rentalId, returnData })).unwrap();
      setSelectedRental(null);
      setReturnData({
        actualReturnDate: new Date().toISOString().split('T')[0],
        condition: 'excellent',
        notes: ''
      });
    } catch (error) {
      console.error('Failed to process return:', error);
    } finally {
      setIsProcessingReturn(false);
    }
  };

  const handleCheckOverdue = async () => {
    try {
      await dispatch(checkOverdueRentalsThunk()).unwrap();
      // The thunk will update the state automatically
    } catch (error) {
      console.error('Failed to check overdue rentals:', error);
    }
  };

  const handleDeleteRental = async (rentalId) => {
    if (window.confirm('Are you sure you want to delete this rental? This action cannot be undone.')) {
      try {
        await dispatch(deleteRentalThunk(rentalId)).unwrap();
        // The thunk will update the state automatically
      } catch (error) {
        console.error('Failed to delete rental:', error);
      }
    }
  };

  const isOverdue = (endDate) => {
    return new Date(endDate) < new Date();
  };

  const calculateLateFee = (endDate, actualReturnDate) => {
    const end = new Date(endDate);
    const actual = new Date(actualReturnDate);
    const lateDays = Math.max(0, Math.ceil((actual - end) / (1000 * 60 * 60 * 24)));
    return lateDays * 50; // $50 per day late fee
  };

  const getRentalDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Rentals</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage equipment rentals and returns
          </p>
        </div>
        <button
          onClick={handleCheckOverdue}
          disabled={isLoading}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
        >
          🔍 Check Overdue
        </button>
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

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Search Rentals
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search by rental ID, customer, or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Filter by Status
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Rentals</option>
              <option value="upcoming">Upcoming</option>
              <option value="active">Active</option>
              <option value="overdue">Overdue</option>
              <option value="returned">Returned</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rentals Table */}
      <div className="bg-white shadow rounded-lg">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading rentals...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rental ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRentals.map((rental) => (
                  <tr key={rental.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{rental.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getUserName(rental.userId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getProductName(rental.productId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        {new Date(rental.startDate).toLocaleDateString()} - {' '}
                        {new Date(rental.endDate).toLocaleDateString()}
                      </div>
                      {isOverdue(rental.endDate) && rental.status === 'active' && (
                        <div className="text-xs text-red-600 font-medium">
                          Overdue!
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getRentalDuration(rental.startDate, rental.endDate)} days
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(rental.status)}`}>
                        {rental.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${formatAmount(rental.totalAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedRental(rental)}
                          className="text-blue-600 hover:text-blue-900"
                          disabled={isProcessingReturn}
                        >
                          View
                        </button>
                        {rental.status === 'active' && (
                          <button
                            onClick={() => setSelectedRental(rental)}
                            className="text-green-600 hover:text-green-900"
                            disabled={isProcessingReturn}
                          >
                            Return
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteRental(rental.id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={isProcessingReturn}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredRentals.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'No rentals found matching your criteria.' 
                : 'No rentals found.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Rental Details/Return Modal */}
      {selectedRental && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedRental.status === 'active' ? 'Process Return' : 'Rental Details'} #{selectedRental.id}
              </h3>
              <button
                onClick={() => setSelectedRental(null)}
                className="text-gray-400 hover:text-gray-600"
                disabled={isProcessingReturn}
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700">Customer</h4>
                  <p className="text-sm text-gray-600">
                    {getUserName(selectedRental.userId)}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Product</h4>
                  <p className="text-sm text-gray-600">
                    {getProductName(selectedRental.productId)}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700">Rental Period</h4>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedRental.startDate).toLocaleDateString()} - {' '}
                    {new Date(selectedRental.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    Duration: {getRentalDuration(selectedRental.startDate, selectedRental.endDate)} days
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Status</h4>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedRental.status)}`}>
                    {selectedRental.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700">Total Amount</h4>
                  <p className="text-sm text-gray-600">
                    ${formatAmount(selectedRental.totalAmount)}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Created</h4>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedRental.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {selectedRental.status === 'active' && (
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-700 mb-3">Return Details</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Actual Return Date</label>
                      <input
                        type="date"
                        value={returnData.actualReturnDate}
                        onChange={(e) => setReturnData({ ...returnData, actualReturnDate: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        disabled={isProcessingReturn}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Condition</label>
                      <select
                        value={returnData.condition}
                        onChange={(e) => setReturnData({ ...returnData, condition: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        disabled={isProcessingReturn}
                      >
                        <option value="excellent">Excellent</option>
                        <option value="good">Good</option>
                        <option value="fair">Fair</option>
                        <option value="poor">Poor</option>
                        <option value="damaged">Damaged</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Notes</label>
                      <textarea
                        value={returnData.notes}
                        onChange={(e) => setReturnData({ ...returnData, notes: e.target.value })}
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Any notes about the return condition..."
                        disabled={isProcessingReturn}
                      />
                    </div>
                    
                    {isOverdue(selectedRental.endDate) && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                        <p className="text-sm text-yellow-800">
                          This rental is overdue. Late fee: ${calculateLateFee(selectedRental.endDate, returnData.actualReturnDate).toFixed(2)}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleProcessReturn(selectedRental.id)}
                        disabled={isProcessingReturn}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
                      >
                        {isProcessingReturn ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          'Process Return'
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteRental(selectedRental.id)}
                        disabled={isProcessingReturn}
                        className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pagination Info */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{filteredRentals.length}</span> of{' '}
              <span className="font-medium">{rentals.length}</span> rentals
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rentals;