// ============================================
// pages/Cart.jsx - REDUX VERSION (FIXED)
// ============================================
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FaShoppingCart, FaTrash, FaPlus, FaMinus, FaArrowLeft,
  FaArrowRight, FaHeart, FaTag, FaTruck, FaShieldAlt,
  FaSpinner
} from 'react-icons/fa';

// Import Redux actions and selectors
import { 
  fetchCartThunk, 
  updateCartItemThunk, 
  removeFromCartThunk 
} from '../features/cart/cartThunks';
import { 
  updateQuantity,
  removeItem 
} from '../features/cart/cartSlice';
import { 
  selectIsAuthenticated 
} from '../features/auth/authSelectors';
import { 
  selectCartItems,
  selectCartLoading,
  selectCartError,
  selectCartItemCount
} from '../features/cart/cartSelectors';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux Selectors
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const cartItems = useSelector(selectCartItems);
  const isLoading = useSelector(selectCartLoading);
  const error = useSelector(selectCartError);
  const cartItemCount = useSelector(selectCartItemCount);
  
  // Local state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [savedItems, setSavedItems] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [updatingItems, setUpdatingItems] = useState(new Set()); // Track items being updated

  // ✅ CORRECT: Fetch cart only once on mount
  useEffect(() => {
    let isMounted = true;

    const loadCart = async () => {
      if (isAuthenticated && isInitialLoad) {
        try {
          await dispatch(fetchCartThunk()).unwrap();
        } catch (error) {
          console.error('Failed to fetch cart:', error);
        } finally {
          if (isMounted) {
            setIsInitialLoad(false);
          }
        }
      } else if (!isAuthenticated && isInitialLoad) {
        setIsInitialLoad(false);
      }
    };

    loadCart();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, dispatch, isInitialLoad]);

  // Safe utility functions
  const formatPrice = useCallback((price) => {
    if (price === null || price === undefined) return '0.00';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  }, []);

  const safeNumber = useCallback((value) => {
    if (value === null || value === undefined) return 0;
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(numValue) ? 0 : numValue;
  }, []);

  // ✅ FIXED: Optimistic quantity updates with immediate UI feedback
  const handleIncrementQuantity = useCallback(async (itemId, currentQuantity) => {
    const newQuantity = currentQuantity + 1;
    
    // Immediate UI update for better UX
    dispatch(updateQuantity({ itemId, quantity: newQuantity }));
    setUpdatingItems(prev => new Set(prev).add(itemId));
    
    try {
      // Sync with backend
      await dispatch(updateCartItemThunk({ 
        itemId, 
        updateData: { quantity: newQuantity } 
      })).unwrap();
    } catch (error) {
      console.error('Failed to update quantity:', error);
      // Revert on error
      dispatch(updateQuantity({ itemId, quantity: currentQuantity }));
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  }, [dispatch]);

  const handleDecrementQuantity = useCallback(async (itemId, currentQuantity) => {
    const newQuantity = currentQuantity - 1;
    
    if (newQuantity < 1) {
      // Remove item immediately for better UX
      dispatch(removeItem(itemId));
      setUpdatingItems(prev => new Set(prev).add(itemId));
      
      try {
        // Sync with backend
        await dispatch(removeFromCartThunk(itemId)).unwrap();
      } catch (error) {
        console.error('Failed to remove item:', error);
        // Note: We'd need an "addItem" action to properly revert here
        // For now, we'll just log the error
      } finally {
        setUpdatingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(itemId);
          return newSet;
        });
      }
      return;
    }
    
    // Immediate UI update
    dispatch(updateQuantity({ itemId, quantity: newQuantity }));
    setUpdatingItems(prev => new Set(prev).add(itemId));
    
    try {
      // Sync with backend
      await dispatch(updateCartItemThunk({ 
        itemId, 
        updateData: { quantity: newQuantity } 
      })).unwrap();
    } catch (error) {
      console.error('Failed to update quantity:', error);
      // Revert on error
      dispatch(updateQuantity({ itemId, quantity: currentQuantity }));
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  }, [dispatch]);

  const handleRemoveItem = useCallback(async (itemId) => {
    // Immediate UI update
    dispatch(removeItem(itemId));
    setUpdatingItems(prev => new Set(prev).add(itemId));
    
    try {
      // Sync with backend
      await dispatch(removeFromCartThunk(itemId)).unwrap();
    } catch (error) {
      console.error('Failed to remove item:', error);
      // Note: We'd need an "addItem" action to properly revert here
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  }, [dispatch]);

  const handleSaveForLater = useCallback((item) => {
    setSavedItems(prev => [...prev, item]);
    handleRemoveItem(item.id);
  }, [handleRemoveItem]);

  const handleApplyCoupon = useCallback(() => {
    const code = couponCode.toUpperCase();
    if (code === 'SAVE10') {
      setAppliedCoupon({ code: 'SAVE10', discount: 0.10 });
    } else if (code === 'TECH20') {
      setAppliedCoupon({ code: 'TECH20', discount: 0.20 });
    } else {
      alert('Invalid coupon code');
    }
  }, [couponCode]);

  const handleProceedToCheckout = useCallback(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }
    navigate('/checkout');
  }, [isAuthenticated, cartItems.length, navigate]);

  // Calculate totals
  const { subtotal, discount, shipping, tax, total } = useMemo(() => {
    const subtotalVal = cartItems.reduce((sum, item) => {
      const price = safeNumber(item.priceAtAddition);
      const quantity = safeNumber(item.quantity);
      return sum + (price * quantity);
    }, 0);

    const discountVal = appliedCoupon ? subtotalVal * appliedCoupon.discount : 0;
    const shippingVal = subtotalVal > 75 ? 0 : 9.99;
    const taxVal = (subtotalVal - discountVal) * 0.15;
    const totalVal = subtotalVal - discountVal + shippingVal + taxVal;

    return {
      subtotal: subtotalVal,
      discount: discountVal,
      shipping: shippingVal,
      tax: taxVal,
      total: totalVal
    };
  }, [cartItems, appliedCoupon, safeNumber]);

  // Debug: Log cart items for troubleshooting
  useEffect(() => {
    console.log('🛒 Cart Items:', cartItems);
  }, [cartItems]);

  // Loading state
  if (isInitialLoad && isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center max-w-md">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaShoppingCart className="text-6xl text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h2>
          <p className="text-gray-600 mb-8">Please sign in to view your shopping cart</p>
          <div className="flex flex-col space-y-3">
            <Link
              to="/login"
              state={{ from: '/cart' }}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
              <FaShoppingCart />
              Shopping Cart
            </h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaShoppingCart className="text-6xl text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet</p>
            <Link
              to="/products"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all inline-flex items-center gap-2"
            >
              Start Shopping <FaArrowRight />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Cart with items
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6">
        <div className="container mx-auto px-4">
          <Link to="/products" className="flex items-center gap-2 mb-4 hover:text-gray-200 transition-colors">
            <FaArrowLeft />
            <span>Continue Shopping</span>
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
              <FaShoppingCart />
              Shopping Cart
            </h1>
            <div className="text-right">
              <p className="text-sm text-blue-100">Items in cart</p>
              <p className="text-2xl font-bold">{cartItemCount}</p>
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
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Cart Items ({cartItems.length})</h2>
              
              <div className="space-y-4">
                {cartItems.map((item) => {
                  const itemPrice = safeNumber(item.priceAtAddition);
                  const itemQuantity = safeNumber(item.quantity);
                  const itemTotal = itemPrice * itemQuantity;
                  const isUpdating = updatingItems.has(item.id);
                  
                  return (
                    <div key={item.id} className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-all">
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-4xl flex-shrink-0">
                          {item.productImage || '📦'}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <div className="flex justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-1">{item.productName || 'Product'}</h3>
                              {item.isForRental && (
                                <p className="text-xs text-blue-600 font-medium">
                                  🗓️ Rental: {item.rentalDays || 7} days
                                </p>
                              )}
                              <p className="text-xs text-green-600 font-medium">✓ In Stock</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-blue-600">${formatPrice(itemPrice)}</p>
                              <p className="text-sm text-gray-500">{item.isForRental ? 'per rental' : 'each'}</p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-between mt-4">
                            {/* Quantity Control */}
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2 bg-gray-100 rounded-lg border border-gray-300">
                                <button
                                  onClick={() => handleDecrementQuantity(item.id, itemQuantity)}
                                  disabled={isUpdating || item.quantity <= 1}
                                  className="p-2 hover:bg-gray-200 transition-colors rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {isUpdating ? (
                                    <FaSpinner className="text-sm animate-spin" />
                                  ) : (
                                    <FaMinus className="text-sm" />
                                  )}
                                </button>
                                <span className="px-4 font-semibold min-w-[3ch] text-center">
                                  {itemQuantity}
                                </span>
                                <button
                                  onClick={() => handleIncrementQuantity(item.id, itemQuantity)}
                                  disabled={isUpdating}
                                  className="p-2 hover:bg-gray-200 transition-colors rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {isUpdating ? (
                                    <FaSpinner className="text-sm animate-spin" />
                                  ) : (
                                    <FaPlus className="text-sm" />
                                  )}
                                </button>
                              </div>
                              <p className="text-sm text-gray-600">
                                Subtotal: <span className="font-bold text-gray-900">${formatPrice(itemTotal)}</span>
                              </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleSaveForLater(item)}
                                disabled={isUpdating}
                                className="p-2 text-gray-600 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Save for later"
                              >
                                <FaHeart />
                              </button>
                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                disabled={isUpdating}
                                className="p-2 text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Remove"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg font-semibold hover:bg-blue-200 transition-colors"
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
                  <span className="font-semibold">${formatPrice(subtotal)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span className="flex items-center gap-1">
                      <FaTag className="text-sm" />
                      Discount ({appliedCoupon.discount * 100}%)
                    </span>
                    <span className="font-semibold">-${formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-1">
                    <FaTruck className="text-sm" />
                    Shipping
                  </span>
                  <span className="font-semibold">
                    {shipping === 0 ? 'FREE' : `$${formatPrice(shipping)}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (15%)</span>
                  <span className="font-semibold">${formatPrice(tax)}</span>
                </div>
              </div>

              <div className="flex justify-between text-2xl font-bold text-gray-900 mb-6">
                <span>Total</span>
                <span className="text-blue-600">${formatPrice(total)}</span>
              </div>

              <button 
                onClick={handleProceedToCheckout}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg transform hover:scale-[1.02] flex items-center justify-center gap-2 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Proceed to Checkout
                    <FaArrowRight />
                  </>
                )}
              </button>

              <Link
                to="/products"
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all text-center block"
              >
                Continue Shopping
              </Link>

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
      </div>
    </div>
  );
};

export default Cart;