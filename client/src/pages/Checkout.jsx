// ============================================
// pages/Checkout.jsx - REDUX VERSION
// ============================================
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FaShoppingCart, FaPhone, FaCheckCircle, FaCreditCard,
  FaMobileAlt, FaLock, FaTrash, FaPlus, FaMinus, FaArrowLeft,
  FaShieldAlt, FaMoneyBillWave, FaSpinner, FaExclamationTriangle
} from 'react-icons/fa';

// Import Redux actions and selectors
import { completeCheckoutThunk } from '../features/payments/paymentsThunks';
import { resetPayment } from '../features/payments/paymentsSlice';
import { clearCartThunk } from '../features/cart/cartThunks';
import { 
  selectIsAuthenticated,
  selectUser 
} from '../features/auth/authSelectors';
import { 
  selectCartItems,
  selectCartTotal 
} from '../features/cart/cartSelectors';
import {
  selectPaymentStatus,
  selectPaymentError,
  selectIsProcessing,
  selectIsPaymentSuccess,
  selectCurrentOrder,
  selectCurrentPayment,
  selectIsPolling
} from '../features/payments/paymentsSelectors';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux Selectors
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  
  const paymentStatus = useSelector(selectPaymentStatus);
  const paymentError = useSelector(selectPaymentError);
  const isProcessing = useSelector(selectIsProcessing);
  const isPaymentSuccess = useSelector(selectIsPaymentSuccess);
  const currentOrder = useSelector(selectCurrentOrder);
  const currentPayment = useSelector(selectCurrentPayment);
  const isPolling = useSelector(selectIsPolling);

  // Local state
  const [paymentMethod, setPaymentMethod] = useState('ecocash');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      sessionStorage.setItem('redirectAfterLogin', '/checkout');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Redirect if cart is empty and no successful payment
  useEffect(() => {
    if (cartItems.length === 0 && !isPaymentSuccess) {
      navigate('/cart');
    }
  }, [cartItems.length, isPaymentSuccess, navigate]);

  // Reset payment state when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetPayment());
    };
  }, [dispatch]);

  // Calculate totals
  const { subtotal, tax, total } = useMemo(() => {
    const subtotalVal = cartTotal;
    const taxVal = subtotalVal * 0.15;
    const totalVal = subtotalVal + taxVal;
    
    return {
      subtotal: subtotalVal,
      tax: taxVal,
      total: totalVal
    };
  }, [cartTotal]);

  const handlePayment = async () => {
    if (!phoneNumber || phoneNumber.length < 9) {
      alert('Please enter a valid phone number');
      return;
    }

    if (!shippingAddress.trim()) {
      alert('Please enter your shipping address');
      return;
    }

    const checkoutData = {
      orderData: {
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.priceAtAddition,
          isRental: item.isForRental,
          rentalDays: item.rentalDays
        })),
        totalAmount: total,
        paymentMethod: paymentMethod,
        shippingAddress: shippingAddress
      },
      paymentData: {
        amount: total,
        phoneNumber: phoneNumber,
        paymentMethod: paymentMethod
      }
    };

    try {
      const result = await dispatch(completeCheckoutThunk(checkoutData)).unwrap();
      
      if (result.payment.success) {
        // Clear cart on success
        dispatch(clearCartThunk());
        
        // Show success message
        console.log('Payment initiated successfully:', result.payment);
      }
    } catch (error) {
      console.error('Checkout failed:', error);
      // Error is handled by the thunk and stored in paymentError
    }
  };

  // Payment processing screen
  if (isProcessing && currentPayment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            {isPolling ? (
              <FaSpinner className="text-5xl text-blue-600 animate-spin" />
            ) : (
              <FaMobileAlt className="text-5xl text-blue-600" />
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {isPolling ? 'Checking Payment...' : 'Payment Initiated'}
          </h1>
          <p className="text-gray-600 mb-6">
            {isPolling 
              ? 'Please wait while we confirm your payment...'
              : 'Please check your phone for the EcoCash prompt'
            }
          </p>
          
          {currentPayment && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Reference:</span>
                <span className="font-mono text-sm font-semibold">{currentPayment.reference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Amount:</span>
                <span className="font-semibold">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Phone:</span>
                <span className="font-semibold">{phoneNumber}</span>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <FaExclamationTriangle className="text-blue-600 mt-1" />
              <div>
                <p className="text-sm font-medium text-blue-900 mb-1">What to do next:</p>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Check your phone for the USSD prompt</li>
                  <li>Enter your EcoCash PIN to authorize payment</li>
                  <li>Wait for confirmation (this may take a moment)</li>
                </ol>
              </div>
            </div>
          </div>

          <button 
            onClick={() => dispatch(resetPayment())}
            className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all"
          >
            Cancel Payment
          </button>
        </div>
      </div>
    );
  }

  // Success screen
  if (isPaymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle className="text-5xl text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
          <p className="text-gray-600 mb-2">Your order has been confirmed</p>
          <p className="text-2xl font-bold text-green-600 mb-8">${total.toFixed(2)}</p>
          
          {currentOrder && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-gray-600 mb-1">Order ID:</p>
              <p className="font-mono text-sm font-semibold">#{currentOrder.id}</p>
            </div>
          )}

          <button 
            onClick={() => navigate('/profile')}
            className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-teal-700 transition-all mb-3"
          >
            View Orders
          </button>
          <button 
            onClick={() => {
              dispatch(resetPayment());
              navigate('/products');
            }}
            className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // Error screen
  if (paymentError && !isProcessing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaExclamationTriangle className="text-5xl text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Failed</h1>
          <p className="text-gray-600 mb-6">{paymentError}</p>
          
          <button 
            onClick={() => dispatch(resetPayment())}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-all mb-3"
          >
            Try Again
          </button>
          <button 
            onClick={() => navigate('/cart')}
            className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all"
          >
            Back to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6">
        <div className="container mx-auto px-4">
          <button 
            onClick={() => navigate('/cart')}
            className="flex items-center gap-2 mb-4 hover:text-gray-200 transition-colors"
          >
            <FaArrowLeft />
            <span>Back to Cart</span>
          </button>
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
            <FaShoppingCart />
            Checkout
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Summary & Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Address
                  </label>
                  <textarea
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your complete delivery address"
                    rows="3"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FaMobileAlt className="text-green-600" />
                Payment Method
              </h2>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => setPaymentMethod('ecocash')}
                  className={`p-4 border-2 rounded-xl transition-all ${
                    paymentMethod === 'ecocash'
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      paymentMethod === 'ecocash' ? 'bg-green-600' : 'bg-gray-200'
                    }`}>
                      <FaMobileAlt className={`text-xl ${
                        paymentMethod === 'ecocash' ? 'text-white' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">EcoCash</p>
                      <p className="text-sm text-gray-500">Mobile Wallet</p>
                    </div>
                  </div>
                  {paymentMethod === 'ecocash' && (
                    <div className="mt-2 flex justify-end">
                      <FaCheckCircle className="text-green-600" />
                    </div>
                  )}
                </button>

                <button
                  onClick={() => setPaymentMethod('onemoney')}
                  className={`p-4 border-2 rounded-xl transition-all ${
                    paymentMethod === 'onemoney'
                      ? 'border-red-600 bg-red-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      paymentMethod === 'onemoney' ? 'bg-red-600' : 'bg-gray-200'
                    }`}>
                      <FaMoneyBillWave className={`text-xl ${
                        paymentMethod === 'onemoney' ? 'text-white' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">OneMoney</p>
                      <p className="text-sm text-gray-500">Mobile Wallet</p>
                    </div>
                  </div>
                  {paymentMethod === 'onemoney' && (
                    <div className="mt-2 flex justify-end">
                      <FaCheckCircle className="text-red-600" />
                    </div>
                  )}
                </button>
              </div>

              {/* Payment Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaPhone className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="0771234567"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Enter your {paymentMethod === 'ecocash' ? 'EcoCash' : 'OneMoney'} registered number
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <FaLock className="text-blue-600 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 mb-1">How it works:</p>
                      <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                        <li>Enter your phone number</li>
                        <li>You'll receive a USSD prompt on your phone</li>
                        <li>Enter your {paymentMethod === 'ecocash' ? 'EcoCash' : 'OneMoney'} PIN to confirm</li>
                        <li>Payment complete!</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (15%)</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-4 flex justify-between text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-green-600">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={isProcessing || cartItems.length === 0 || !phoneNumber || !shippingAddress.trim()}
                className={`w-full py-4 rounded-lg font-semibold text-white transition-all ${
                  isProcessing || !phoneNumber || !shippingAddress.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 transform hover:scale-[1.02] shadow-lg'
                }`}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <FaSpinner className="animate-spin" />
                    Processing...
                  </span>
                ) : (
                  `Pay $${total.toFixed(2)}`
                )}
              </button>

              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center gap-2 text-sm text-gray-600 justify-center">
                  <FaShieldAlt className="text-green-600" />
                  <span>Secure payment with SSL encryption</span>
                </div>
              </div>

              <div className="mt-4 bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 text-center">
                  By completing this purchase, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;