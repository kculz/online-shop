// ============================================
// pages/admin/Rentals.jsx
// ============================================
import { useState, useEffect } from 'react';
import { useRentals, useUsers, useProducts } from '../../stores';
import { rentalSelectors } from '../../stores/selectors/rentalSelectors';
import { userSelectors } from '../../stores/selectors/userSelectors';
import { productSelectors } from '../../stores/selectors/productSelectors';

const Rentals = () => {
  const { rentals, fetchAllRentals, processRentalReturn, checkOverdueRentals, isLoading } = useRentals();
  const { users, fetchAllUsers } = useUsers();
  const { products, fetchProducts } = useProducts();
  
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRental, setSelectedRental] = useState(null);
  const [returnData, setReturnData] = useState({
    actualReturnDate: new Date().toISOString().split('T')[0],
    condition: 'excellent',
    notes: ''
  });

  useEffect(() => {
    fetchAllRentals();
    fetchAllUsers();
    fetchProducts();
  }, [fetchAllRentals, fetchAllUsers, fetchProducts]);

  const filteredRentals = rentals.filter(rental => 
    statusFilter === 'all' || rental.status === statusFilter
  );

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
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleProcessReturn = async (rentalId) => {
    const result = await processRentalReturn(rentalId, returnData);
    if (result.success) {
      setSelectedRental(null);
      setReturnData({
        actualReturnDate: new Date().toISOString().split('T')[0],
        condition: 'excellent',
        notes: ''
      });
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
          onClick={checkOverdueRentals}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
        >
          🔍 Check Overdue
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex items-center space-x-4">
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
                      {getUserName(rental.orderItem?.order?.userId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getProductName(rental.orderItem?.productId)}
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(rental.status)}`}>
                        {rental.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${rental.orderItem?.price?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedRental(rental)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </button>
                        {rental.status === 'active' && (
                          <button
                            onClick={() => setSelectedRental(rental)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Return
                          </button>
                        )}
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
            <p className="text-gray-500">No rentals found matching your criteria.</p>
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
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700">Customer</h4>
                  <p className="text-sm text-gray-600">
                    {getUserName(selectedRental.orderItem?.order?.userId)}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Product</h4>
                  <p className="text-sm text-gray-600">
                    {getProductName(selectedRental.orderItem?.productId)}
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
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Status</h4>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedRental.status)}`}>
                    {selectedRental.status}
                  </span>
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
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Condition</label>
                      <select
                        value={returnData.condition}
                        onChange={(e) => setReturnData({ ...returnData, condition: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                      />
                    </div>
                    
                    {isOverdue(selectedRental.endDate) && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                        <p className="text-sm text-yellow-800">
                          This rental is overdue. Late fee: ${calculateLateFee(selectedRental.endDate, returnData.actualReturnDate).toFixed(2)}
                        </p>
                      </div>
                    )}
                    
                    <button
                      onClick={() => handleProcessReturn(selectedRental.id)}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                    >
                      Process Return
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rentals;