// ============================================
// pages/OrderDetails.jsx - Individual Order View
// ============================================
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  FaArrowLeft,
  FaShoppingBag,
  FaMapMarkerAlt,
  FaCreditCard,
  FaBox,
  FaTruck,
  FaCheckCircle,
  FaClock
} from 'react-icons/fa';

import { fetchOrderByIdThunk } from '../features/orders/ordersThunks';
import { clearCurrentOrder, clearError } from '../features/orders/ordersSlice';
import {
  selectCurrentOrder,
  selectOrdersLoading,
  selectOrdersError
} from '../features/orders/ordersSelectors';
import { ordersUtils } from '../features/orders/ordersAPI';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const order = useSelector(selectCurrentOrder);
  const loading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderByIdThunk(orderId));
    }

    return () => {
      dispatch(clearCurrentOrder());
      dispatch(clearError());
    };
  }, [dispatch, orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaShoppingBag className="text-6xl text-blue-600 mb-4 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900">Loading Order...</h2>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaBox className="text-6xl text-red-600 mb-4 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The order you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/orders')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = ordersUtils.formatStatus(order.status);
  const totals = ordersUtils.calculateTotals(order.items);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/orders')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FaArrowLeft />
              Back to Orders
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">Order #{order.id}</h1>
              <p className="text-gray-600">Placed on {ordersUtils.formatDate(order.createdAt)}</p>
            </div>
            <div className={`px-4 py-2 rounded-full ${statusConfig.bgColor} ${statusConfig.color} font-semibold`}>
              {statusConfig.text}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Items & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FaShoppingBag />
                Order Items
              </h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 py-4 border-b last:border-b-0">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      {item.product?.imageUrl ? (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <FaBox className="text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.product?.name}</h3>
                      <p className="text-gray-600 text-sm">
                        Quantity: {item.quantity}
                        {item.isRental && ` • Rental: ${item.rentalDays} days`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${parseFloat(item.price).toFixed(2)}</p>
                      {item.isRental && (
                        <p className="text-sm text-gray-600">Rental</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FaClock />
                Order Status
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-green-600">
                  <FaCheckCircle />
                  <div>
                    <p className="font-semibold">Order Placed</p>
                    <p className="text-sm text-gray-600">{ordersUtils.formatDate(order.createdAt)}</p>
                  </div>
                </div>
                {/* Add more timeline steps based on order status */}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Shipping Info */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaMapMarkerAlt />
                Shipping Address
              </h2>
              <p className="text-gray-700">{order.shippingAddress}</p>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaCreditCard />
                Payment Method
              </h2>
              <div className="flex items-center gap-3">
                <div className="w-10 h-6 bg-blue-100 rounded flex items-center justify-center">
                  <span className="text-xs font-semibold text-blue-600">
                    {order.paymentMethod?.toUpperCase()}
                  </span>
                </div>
                <span className="font-medium text-gray-700">{order.paymentMethod}</span>
              </div>
            </div>

            {/* Order Total */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Total</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${totals.subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (15%)</span>
                  <span>${totals.tax}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>${totals.total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;