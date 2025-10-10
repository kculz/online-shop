import React, { useState } from 'react';
import { 
  FaShoppingCart,
  FaTrash,
  FaPlus,
  FaMinus,
  FaArrowLeft,
  FaArrowRight,
  FaHeart,
  FaTag,
  FaTruck,
  FaShieldAlt,
  FaPercent,
  FaGift
} from 'react-icons/fa';

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "ASUS ROG Strix RTX 4070",
      price: 599.99,
      quantity: 1,
      image: "🎮",
      category: "Graphics Cards",
      inStock: true
    },
    {
      id: 2,
      name: "Apple MacBook Air M3",
      price: 1299.99,
      quantity: 1,
      image: "💻",
      category: "Laptops",
      inStock: true
    },
    {
      id: 3,
      name: "Logitech MX Master 3S",
      price: 99.99,
      quantity: 2,
      image: "🖱️",
      category: "Peripherals",
      inStock: true
    },
    {
      id: 4,
      name: "Sony WH-1000XM5",
      price: 329.99,
      quantity: 1,
      image: "🎧",
      category: "Audio",
      inStock: false
    }
  ]);

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [savedItems, setSavedItems] = useState([]);

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

  const saveForLater = (id) => {
    const item = cartItems.find(item => item.id === id);
    if (item) {
      setSavedItems([...savedItems, item]);
      removeItem(id);
    }
  };

  const moveToCart = (id) => {
    const item = savedItems.find(item => item.id === id);
    if (item) {
      setCartItems([...cartItems, item]);
      setSavedItems(savedItems.filter(item => item.id !== id));
    }
  };

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'SAVE10') {
      setAppliedCoupon({ code: 'SAVE10', discount: 0.10 });
    } else if (couponCode.toUpperCase() === 'TECH20') {
      setAppliedCoupon({ code: 'TECH20', discount: 0.20 });
    } else {
      alert('Invalid coupon code');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = appliedCoupon ? subtotal * appliedCoupon.discount : 0;
  const shipping = subtotal > 75 ? 0 : 9.99;
  const tax = (subtotal - discount) * 0.15;
  const total = subtotal - discount + shipping + tax;

  const recommendedProducts = [
    { id: 101, name: "RGB Mouse Pad", price: 29.99, image: "🎨" },
    { id: 102, name: "USB-C Hub", price: 49.99, image: "🔌" },
    { id: 103, name: "Webcam HD", price: 79.99, image: "📹" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-600 text-white py-6">
        <div className="container mx-auto px-4">
          <button className="flex items-center gap-2 mb-4 hover:text-gray-200 transition-colors">
            <FaArrowLeft />
            <span>Continue Shopping</span>
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
              <FaShoppingCart />
              Shopping Cart
            </h1>
            <div className="text-right">
              <p className="text-sm text-orange-100">Items in cart</p>
              <p className="text-2xl font-bold">{cartItems.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Free Shipping Banner */}
      {subtotal < 75 && subtotal > 0 && (
        <div className="bg-blue-600 text-white py-3">
          <div className="container mx-auto px-4 text-center">
            <p className="flex items-center justify-center gap-2">
              <FaTruck />
              <span>Add <strong>${(75 - subtotal).toFixed(2)}</strong> more to get FREE SHIPPING!</span>
            </p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaShoppingCart className="text-6xl text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet</p>
            <button className="bg-gradient-to-r from-orange-500 to-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-pink-700 transition-all inline-flex items-center gap-2">
              Start Shopping <FaArrowRight />
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cart Items Card */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Cart Items ({cartItems.length})</h2>
                
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-xl p-4 hover:border-orange-300 transition-all">
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-4xl flex-shrink-0">
                          {item.image}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <div className="flex justify-between mb-2">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">{item.category}</p>
                              <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                              {item.inStock ? (
                                <p className="text-xs text-green-600 font-medium">✓ In Stock</p>
                              ) : (
                                <p className="text-xs text-red-600 font-medium">Out of Stock</p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-orange-600">${item.price.toFixed(2)}</p>
                              <p className="text-sm text-gray-500">each</p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-between mt-4">
                            {/* Quantity Control */}
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2 bg-gray-100 rounded-lg border border-gray-300">
                                <button
                                  onClick={() => updateQuantity(item.id, -1)}
                                  className="p-2 hover:bg-gray-200 transition-colors rounded-l-lg"
                                >
                                  <FaMinus className="text-sm" />
                                </button>
                                <span className="px-4 font-semibold">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, 1)}
                                  className="p-2 hover:bg-gray-200 transition-colors rounded-r-lg"
                                >
                                  <FaPlus className="text-sm" />
                                </button>
                              </div>
                              <p className="text-sm text-gray-600">
                                Subtotal: <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                              </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => saveForLater(item.id)}
                                className="p-2 text-gray-600 hover:text-orange-600 transition-colors"
                                title="Save for later"
                              >
                                <FaHeart />
                              </button>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                                title="Remove"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Saved for Later */}
              {savedItems.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FaHeart className="text-pink-500" />
                    Saved for Later ({savedItems.length})
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {savedItems.map((item) => (
                      <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex gap-3 mb-3">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                            {item.image}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm text-gray-900 mb-1">{item.name}</h4>
                            <p className="text-orange-600 font-bold">${item.price.toFixed(2)}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => moveToCart(item.id)}
                          className="w-full bg-orange-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors"
                        >
                          Move to Cart
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Products */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaGift className="text-purple-500" />
                  You May Also Like
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {recommendedProducts.map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-all">
                      <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-4xl mb-3">
                        {product.image}
                      </div>
                      <h4 className="font-semibold text-sm text-gray-900 mb-2">{product.name}</h4>
                      <p className="text-orange-600 font-bold mb-3">${product.price.toFixed(2)}</p>
                      <button className="w-full bg-gray-100 text-gray-900 py-2 rounded-lg text-sm font-semibold hover:bg-orange-500 hover:text-white transition-all">
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                {/* Coupon Code */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Have a coupon code?
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                      onClick={applyCoupon}
                      className="px-4 py-2 bg-orange-100 text-orange-600 rounded-lg font-semibold hover:bg-orange-200 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {appliedCoupon && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                      <FaTag />
                      <span>Coupon "{appliedCoupon.code}" applied!</span>
                    </div>
                  )}
                  <p className="mt-2 text-xs text-gray-500">Try: SAVE10 or TECH20</p>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6 pb-6 border-b">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span className="flex items-center gap-1">
                        <FaPercent className="text-sm" />
                        Discount ({appliedCoupon.discount * 100}%)
                      </span>
                      <span className="font-semibold">-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span className="flex items-center gap-1">
                      <FaTruck className="text-sm" />
                      Shipping
                    </span>
                    <span className="font-semibold">
                      {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (15%)</span>
                    <span className="font-semibold">${tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between text-2xl font-bold text-gray-900 mb-6">
                  <span>Total</span>
                  <span className="text-orange-600">${total.toFixed(2)}</span>
                </div>

                <button className="w-full bg-gradient-to-r from-orange-500 to-pink-600 text-white py-4 rounded-lg font-semibold hover:from-orange-600 hover:to-pink-700 transition-all shadow-lg transform hover:scale-[1.02] flex items-center justify-center gap-2 mb-4">
                  Proceed to Checkout
                  <FaArrowRight />
                </button>

                <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all">
                  Continue Shopping
                </button>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaShieldAlt className="text-green-600" />
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaTruck className="text-blue-600" />
                    <span>Free shipping over $75</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaArrowLeft className="text-purple-600" />
                    <span>30-day return policy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;