// ============================================
// pages/RentalProducts.jsx - API INTEGRATION VERSION
// ============================================
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaCalendarAlt,
  FaShoppingCart,
  FaHeart,
  FaStar,
  FaCheck,
  FaInfoCircle,
  FaTruck,
  FaShieldAlt,
  FaTools,
  FaArrowRight,
  FaClock,
  FaSpinner,
  FaExclamationTriangle
} from 'react-icons/fa';
import { useAuth, useCart, useProducts } from '../stores';
import { productSelectors, cartSelectors } from '../stores/selectors';

const RentalProducts = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // Cart store
  const { addToCart } = useCart();
  const cartState = useCart();
  const cartItems = cartSelectors.cartItems(cartState);
  
  // Products store
  const { fetchRentalProducts, isLoading: productsLoading, error: productsError } = useProducts();
  const productsState = useProducts();
  const rentalProducts = productSelectors.rentalProducts(productsState);
  const availableRentalProducts = productSelectors.availableRentalProducts(productsState);

  // Local state
  const [selectedDuration, setSelectedDuration] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [addingToCart, setAddingToCart] = useState({});
  const [wishlistItems, setWishlistItems] = useState(new Set());

  // Fetch rental products on component mount
  useEffect(() => {
    fetchRentalProducts();
  }, [fetchRentalProducts]);

  // Safe price formatting function
  const formatPrice = (price) => {
    if (price === null || price === undefined) return '0.00';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  };

  // Safe rating calculation
  const getRating = (rating) => {
    if (rating === null || rating === undefined) return 4.5;
    const numRating = typeof rating === 'string' ? parseFloat(rating) : rating;
    return isNaN(numRating) ? 4.5 : numRating;
  };

  // Safe reviews count
  const getReviewsCount = (reviews) => {
    if (reviews === null || reviews === undefined) return 0;
    const numReviews = typeof reviews === 'string' ? parseInt(reviews) : reviews;
    return isNaN(numReviews) ? 0 : numReviews;
  };

  // Check if product is in cart
  const isProductInCart = (productId, isForRental = true) => {
    return cartItems.some(item => 
      item.productId === productId && item.isForRental === isForRental
    );
  };

  // Check if product is in wishlist
  const isProductInWishlist = (productId) => {
    return wishlistItems.has(productId);
  };

  const handleRentNow = async (product, duration, event) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/rental' } });
      return;
    }

    // Check if already in cart
    if (isProductInCart(product.id, true)) {
      navigate('/cart');
      return;
    }

    setAddingToCart(prev => ({ ...prev, [product.id]: true }));

    try {
      const rentalDays = duration === 'daily' ? 1 : duration === 'weekly' ? 7 : 30;
      const rentalPrice = getDurationPrice(product, duration);
      
      await addToCart({
        productId: product.id,
        quantity: 1,
        isForRental: true,
        priceAtAddition: rentalPrice,
        productName: product.name,
        productImage: product.image || '📦',
        rentalDays: rentalDays,
        rentalDuration: duration
      });
      
      console.log('Added to rental cart:', product.name, 'Duration:', duration);
    } catch (error) {
      console.error('Failed to add to rental cart:', error);
    } finally {
      setAddingToCart(prev => ({ ...prev, [product.id]: false }));
    }
  };

  const handleAddToWishlist = (productId, event) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/rental' } });
      return;
    }
    
    setWishlistItems(prev => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId);
      } else {
        newWishlist.add(productId);
      }
      return newWishlist;
    });
  };

  const handleQuickView = (productId, event) => {
    event.preventDefault();
    event.stopPropagation();
    navigate(`/product/${productId}`);
  };

  const getDurationPrice = (product, duration) => {
    switch (duration) {
      case 'daily':
        return product.rentalPricePerDay || product.price * 0.1;
      case 'weekly':
        return (product.rentalPricePerDay || product.price * 0.1) * 7 * 0.8; // 20% weekly discount
      case 'monthly':
        return (product.rentalPricePerDay || product.price * 0.1) * 30 * 0.7; // 30% monthly discount
      case 'buyout':
        return product.price || 0;
      default:
        return product.rentalPricePerDay || product.price * 0.1;
    }
  };

  // Filter products by category
  const filteredProducts = availableRentalProducts.filter(product => {
    if (selectedCategory === 'all') return true;
    return product.category?.name?.toLowerCase() === selectedCategory;
  });

  // Get unique categories from rental products
  const categories = [
    'all',
    ...new Set(availableRentalProducts.map(product => product.category?.name?.toLowerCase()).filter(Boolean))
  ];

  const rentalBenefits = [
    {
      icon: <FaTruck />,
      title: "Free Delivery & Setup",
      description: "We deliver and set up your rental equipment"
    },
    {
      icon: <FaShieldAlt />,
      title: "Damage Protection",
      description: "Covered for accidental damage during rental"
    },
    {
      icon: <FaTools />,
      title: "24/7 Tech Support",
      description: "Expert help whenever you need it"
    },
    {
      icon: <FaArrowRight />,
      title: "Rent-to-Own Option",
      description: "Apply rental payments toward purchase"
    }
  ];

  if (productsError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="text-red-500 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Rental Products</h2>
          <p className="text-gray-600 mb-4">{productsError}</p>
          <button
            onClick={fetchRentalProducts}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-500 via-teal-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <FaCalendarAlt className="text-4xl" />
              <h1 className="text-4xl md:text-5xl font-bold">Rent Premium Tech</h1>
            </div>
            <p className="text-xl text-green-50 mb-6">
              Try before you buy. Access the latest technology without the commitment.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white bg-opacity-20 backdrop-blur px-6 py-3 rounded-lg">
                <div className="text-2xl font-bold">From $9.99/day</div>
                <div className="text-sm text-green-50">Flexible rental terms</div>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur px-6 py-3 rounded-lg">
                <div className="text-2xl font-bold">{availableRentalProducts.length}+</div>
                <div className="text-sm text-green-50">Products available</div>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur px-6 py-3 rounded-lg">
                <div className="text-2xl font-bold">30 Days</div>
                <div className="text-sm text-green-50">Return guarantee</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rentalBenefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                  {benefit.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How Renting Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Choose Your Product", desc: "Browse our collection and select what you need" },
              { step: "2", title: "Select Duration", desc: "Pick daily, weekly, or monthly rental terms" },
              { step: "3", title: "Get Delivered", desc: "We deliver and set up at your location" },
              { step: "4", title: "Return or Buy", desc: "Return anytime or buy to keep" }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                    <FaArrowRight className="text-gray-300 text-2xl" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-colors capitalize ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'All Categories' : category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Loading State */}
      {productsLoading && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading rental products...</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Rental Products */}
      {!productsLoading && filteredProducts.length === 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Rental Products Available</h3>
              <p className="text-gray-600 mb-6">
                {availableRentalProducts.length === 0 
                  ? "We're currently updating our rental inventory. Please check back soon."
                  : "No products found in this category. Try selecting a different category."
                }
              </p>
              {availableRentalProducts.length === 0 ? (
                <button
                  onClick={() => navigate('/products')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Browse All Products
                </button>
              ) : (
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Show All Categories
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Rental Products Grid */}
      {!productsLoading && filteredProducts.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredProducts.map((product) => {
                const safeProduct = {
                  ...product,
                  safeRating: getRating(product.rating),
                  safeReviews: getReviewsCount(product.reviews),
                  safeImage: product.image || '📦',
                  safeCategory: product.category?.name || 'Uncategorized',
                  safeDescription: product.description || 'Premium tech equipment available for rent',
                  safeRentalPrice: product.rentalPricePerDay ? formatPrice(product.rentalPricePerDay) : formatPrice(product.price * 0.1),
                  safeDeposit: product.rentalDeposit ? formatPrice(product.rentalDeposit) : '500.00',
                  inCart: isProductInCart(product.id, true),
                  inWishlist: isProductInWishlist(product.id)
                };

                const currentDuration = selectedDuration[product.id] || 'monthly';
                const currentPrice = getDurationPrice(product, currentDuration);

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Product Image */}
                      <div className="md:w-1/3 relative">
                        <div 
                          className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-6xl cursor-pointer"
                          onClick={(e) => handleQuickView(product.id, e)}
                        >
                          {safeProduct.safeImage}
                        </div>
                        {product.badge && (
                          <div className="absolute top-4 left-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              product.badge === 'Popular' ? 'bg-blue-100 text-blue-800' :
                              product.badge === 'Pro' ? 'bg-purple-100 text-purple-800' :
                              product.badge === 'Hot' ? 'bg-red-100 text-red-800' :
                              product.badge === 'New' ? 'bg-green-100 text-green-800' :
                              'bg-orange-100 text-orange-800'
                            }`}>
                              {product.badge}
                            </span>
                          </div>
                        )}
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className={`px-3 py-1 rounded-full text-xs font-semibold text-center ${
                            product.isAvailable 
                              ? 'bg-green-500 text-white' 
                              : 'bg-yellow-500 text-white'
                          }`}>
                            {product.isAvailable ? 'Available' : 'Limited'}
                          </div>
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="md:w-2/3 p-6">
                        <div className="flex justify-between items-start mb-3">
                          <div 
                            className="flex-1 cursor-pointer"
                            onClick={(e) => handleQuickView(product.id, e)}
                          >
                            <div className="text-sm text-gray-500 mb-1">{safeProduct.safeCategory}</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                              {product.name}
                            </h3>
                          </div>
                          <button 
                            onClick={(e) => handleAddToWishlist(product.id, e)}
                            className={`p-2 rounded-full transition-colors ${
                              safeProduct.inWishlist 
                                ? 'text-red-500 bg-red-50' 
                                : 'hover:text-red-500 hover:bg-red-50'
                            }`}
                          >
                            <FaHeart className={safeProduct.inWishlist ? 'fill-current' : ''} />
                          </button>
                        </div>

                        <p className="text-gray-600 text-sm mb-3">{safeProduct.safeDescription}</p>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={i < Math.floor(safeProduct.safeRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {safeProduct.safeRating} ({safeProduct.safeReviews} reviews)
                          </span>
                        </div>

                        {/* Specs */}
                        {product.specs && product.specs.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {product.specs.slice(0, 3).map((spec, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700"
                              >
                                {spec}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Pricing Options */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <div className="grid grid-cols-4 gap-2 mb-3">
                            {['daily', 'weekly', 'monthly', 'buyout'].map((duration) => (
                              <button
                                key={duration}
                                onClick={() => setSelectedDuration({ ...selectedDuration, [product.id]: duration })}
                                className={`p-2 rounded-lg text-center transition-colors ${
                                  currentDuration === duration
                                    ? 'bg-green-600 text-white'
                                    : 'bg-white hover:bg-gray-100'
                                }`}
                              >
                                <div className="text-xs font-medium capitalize">
                                  {duration === 'buyout' ? 'Buy' : duration}
                                </div>
                                <div className="text-sm font-bold">
                                  ${formatPrice(getDurationPrice(product, duration))}
                                </div>
                                {duration !== 'buyout' && (
                                  <div className="text-xs opacity-75">
                                    {duration === 'daily' ? '/day' : duration === 'weekly' ? '/week' : '/month'}
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Security Deposit:</span>
                            <span className="font-semibold">${safeProduct.safeDeposit}</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <button
                            onClick={(e) => handleRentNow(product, currentDuration, e)}
                            disabled={addingToCart[product.id] || !product.isAvailable || safeProduct.inCart}
                            className={`flex-1 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                              safeProduct.inCart
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          >
                            {addingToCart[product.id] ? (
                              <>
                                <FaSpinner className="animate-spin" />
                                Adding...
                              </>
                            ) : safeProduct.inCart ? (
                              <>
                                <FaCheck />
                                In Cart - View
                              </>
                            ) : (
                              <>
                                <FaCalendarAlt />
                                {currentDuration === 'buyout' ? 'Buy Now' : 'Rent Now'}
                              </>
                            )}
                          </button>
                          <button 
                            onClick={(e) => handleQuickView(product.id, e)}
                            className="px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                          >
                            <FaInfoCircle />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Rental FAQs</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                q: "What's included in the rental?",
                a: "All necessary accessories, cables, and protective cases. Plus free delivery and setup."
              },
              {
                q: "Can I extend my rental period?",
                a: "Yes! You can extend anytime through your account or by contacting support."
              },
              {
                q: "What if the product gets damaged?",
                a: "Normal wear is covered. Accidental damage protection is included up to $500."
              },
              {
                q: "Can I buy the product I'm renting?",
                a: "Absolutely! We apply up to 50% of your rental payments toward the purchase price."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-start gap-2">
                  <FaCheck className="text-green-600 mt-1 flex-shrink-0" />
                  {faq.q}
                </h3>
                <p className="text-gray-600 text-sm ml-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Try Premium Tech?
          </h2>
          <p className="text-xl text-green-50 mb-8 max-w-2xl mx-auto">
            Start your rental today with flexible terms and no long-term commitment
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button 
              onClick={() => navigate('/products')}
              className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              Browse All Products
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-green-600 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RentalProducts;