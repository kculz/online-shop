import React, { useState } from 'react';
import { 
  FaShoppingCart,
  FaPhone,
  FaCheckCircle,
  FaTimesCircle,
  FaCreditCard,
  FaMobileAlt,
  FaLock,
  FaTrash,
  FaPlus,
  FaMinus,
  FaArrowLeft,
  FaShieldAlt,
  FaMoneyBillWave
} from 'react-icons/fa';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "ASUS ROG Strix RTX 4070",
      price: 599.99,
      quantity: 1,
      image: "🎮"
    },
    {
      id: 2,
      name: "Logitech MX Master 3S",
      price: 99.99,
      quantity: 2,
      image: "🖱️"
    }
  ]);

  const [paymentMethod, setPaymentMethod] = useState('ecocash');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const updateQuantity = (id, change) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.15;
  const total = subtotal + tax;

  const handlePayment = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      alert('Please enter a valid phone number');
      return;
    }
    
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setPaymentSuccess(true);
    }, 3000);
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle className="text-5xl text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
          <p className="text-gray-600 mb-2">Your order has been confirmed</p>
          <p className="text-2xl font-bold text-green-600 mb-8">${total.toFixed(2)}</p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-600 mb-1">Transaction ID:</p>
            <p className="font-mono text-sm font-semibold">ECO-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
          </div>
          <button className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-teal-700 transition-all mb-3">
            Track Order
          </button>
          <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all">
            Continue Shopping
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
          <button className="flex items-center gap-2 mb-4 hover:text-gray-200 transition-colors">
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
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FaShoppingCart className="text-blue-600" />
                Order Summary
              </h2>

              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center text-4xl">
                        {item.image}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
                        <p className="text-lg font-bold text-blue-600">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-600 transition-colors"
                        >
                          <FaTrash />
                        </button>
                        <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-300">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-2 hover:bg-gray-100 transition-colors"
                          >
                            <FaMinus className="text-sm" />
                          </button>
                          <span className="px-3 font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-2 hover:bg-gray-100 transition-colors"
                          >
                            <FaPlus className="text-sm" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                disabled={processing || cartItems.length === 0}
                className={`w-full py-4 rounded-lg font-semibold text-white transition-all ${
                  processing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 transform hover:scale-[1.02] shadow-lg'
                }`}
              >
                {processing ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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