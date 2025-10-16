// ============================================
// pages/HomePage.jsx - COMPLETE FIXED VERSION
// ============================================
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaLaptop,
  FaDesktop,
  FaMobileAlt,
  FaHeadphones,
  FaKeyboard,
  FaGamepad,
  FaWifi,
  FaHdd,
  FaMicrochip,
  FaCamera,
  FaStar,
  FaShoppingCart,
  FaHeart,
  FaArrowRight,
  FaTruck,
  FaShieldAlt,
  FaPhoneAlt,
  FaTools,
  FaFire,
  FaBolt,
  FaTag,
  FaChevronLeft,
  FaChevronRight,
  FaCalendarAlt,
  FaCheck
} from 'react-icons/fa';
import { useAuth, useCart, useProducts, useCategories } from '../stores';
import { productSelectors, cartSelectors } from '../stores/selectors';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // Use cart store with selectors - FIXED USAGE
  const { addToCart } = useCart();
  const cartState = useCart();
  const cartItems = cartSelectors.cartItems(cartState);
  const cartItemCount = cartSelectors.cartItemCount(cartState);
  const isCartEmpty = cartSelectors.isCartEmpty(cartState);
  
  // Use products store with selectors - FIXED USAGE
  const { products, fetchProducts, fetchRentalProducts, isLoading } = useProducts();
  const productsState = useProducts();
  
  // Safe selector calls with fallbacks
  const featuredProducts = productSelectors.featuredProducts(productsState) || [];
  const availableProducts = productSelectors.availableProducts(productsState) || [];
  const rentalProducts = productSelectors.rentalProducts(productsState) || [];
  const availableRentalProducts = productSelectors.availableRentalProducts(productsState) || [];
  
  const { categories, fetchCategories } = useCategories();
  
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [addingToCart, setAddingToCart] = useState({});
  const [wishlistItems, setWishlistItems] = useState(new Set());

  // Hero slides data
  const heroSlides = [
    {
      id: 1,
      title: "Gaming Powerhouse",
      subtitle: "RTX 4080 Gaming Laptops",
      description: "Experience next-gen gaming with ray tracing and DLSS 3",
      price: "From $1,899",
      image: "🎮",
      bgGradient: "from-purple-600 to-blue-600",
      cta: "Shop Gaming",
      action: () => navigate('/products?category=gaming')
    },
    {
      id: 2,
      title: "Productivity Beast",
      subtitle: "M3 MacBook Pro",
      description: "Revolutionary performance for creators and professionals",
      price: "Starting at $1,999",
      image: "💻",
      bgGradient: "from-gray-700 to-gray-900",
      cta: "Explore MacBooks",
      action: () => navigate('/products?category=laptops')
    },
    {
      id: 3,
      title: "Build Your Dream PC",
      subtitle: "Custom PC Components",
      description: "Premium parts, expert guidance, unbeatable prices",
      price: "Up to 30% Off",
      image: "🔧",
      bgGradient: "from-green-600 to-teal-600",
      cta: "Start Building",
      action: () => navigate('/products?category=components')
    }
  ];

  // Rental benefits
  const rentalBenefits = [
    {
      icon: <FaTruck />,
      title: "Free Delivery",
      description: "We deliver and set up your rental equipment"
    },
    {
      icon: <FaShieldAlt />,
      title: "Damage Protection",
      description: "Covered for accidental damage during rental"
    },
    {
      icon: <FaTools />,
      title: "24/7 Support",
      description: "Expert help whenever you need it"
    },
    {
      icon: <FaCalendarAlt />,
      title: "Flexible Terms",
      description: "Daily, weekly, or monthly rental options"
    }
  ];

  // Auto-rotate hero slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  useEffect(() => {
    // Fetch initial data
    fetchProducts();
    fetchRentalProducts();
    fetchCategories();
  }, [fetchProducts, fetchRentalProducts, fetchCategories]);

  const nextHeroSlide = () => {
    setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevHeroSlide = () => {
    setCurrentHeroSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // Safe price formatting function
  const formatPrice = (price) => {
    if (price === null || price === undefined) return '99.99';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? '99.99' : numPrice.toFixed(2);
  };

  // Safe rating calculation
  const getRating = (rating) => {
    if (rating === null || rating === undefined) return 4.5;
    const numRating = typeof rating === 'string' ? parseFloat(rating) : rating;
    return isNaN(numRating) ? 4.5 : numRating;
  };

  // Safe reviews count
  const getReviewsCount = (reviews) => {
    if (reviews === null || reviews === undefined) return 100;
    const numReviews = typeof reviews === 'string' ? parseInt(reviews) : reviews;
    return isNaN(numReviews) ? 100 : numReviews;
  };

  // Check if product is in cart
  const isProductInCart = (productId, isForRental = false) => {
    return cartItems.some(item => 
      item.productId === productId && item.isForRental === isForRental
    );
  };

  // Check if product is in wishlist
  const isProductInWishlist = (productId) => {
    return wishlistItems.has(productId);
  };

  const handleAddToCart = async (productId, event) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/products' } });
      return;
    }

    // Check if already in cart
    if (isProductInCart(productId, false)) {
      navigate('/cart');
      return;
    }

    setAddingToCart(prev => ({ ...prev, [productId]: true }));

    try {
      // Use products from store instead of selector
      const product = products.find(p => p.id === productId) || 
                     featuredProducts.find(p => p.id === productId) ||
                     availableProducts.find(p => p.id === productId);
      await addToCart({
        productId,
        quantity: 1,
        isForRental: false,
        priceAtAddition: product?.price || 0,
        productName: product?.name || 'Product',
        productImage: product?.image || '📦'
      });
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setAddingToCart(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleAddToWishlist = (productId, event) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/products' } });
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

  const handleRentNow = (productId, event) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/rental' } });
      return;
    }
    
    navigate(`/rental/${productId}`);
  };

  const handleQuickView = (productId, event) => {
    event.preventDefault();
    event.stopPropagation();
    navigate(`/product/${productId}`);
  };

  // SAFE: Get featured products with fallback
  const displayFeaturedProducts = (Array.isArray(featuredProducts) ? featuredProducts : [])
    .slice(0, 6)
    .map(product => ({
      ...product,
      safePrice: formatPrice(product.price),
      safeRating: getRating(product.rating),
      safeReviews: getReviewsCount(product.reviews),
      safeOriginalPrice: product.originalPrice ? formatPrice(product.originalPrice) : null,
      safeImage: product.image || '📦',
      safeCategory: product.category?.name || 'Tech',
      safeName: product.name || 'Unnamed Product',
      safeDescription: product.description || 'Premium tech product',
      isAvailable: product.isAvailable !== false,
      isFeatured: product.isFeatured || false,
      isNew: product.isNew || false,
      onSale: product.onSale || false,
      inCart: isProductInCart(product.id, false),
      inWishlist: isProductInWishlist(product.id)
    }));
  
  // SAFE: Get rental products with fallback
  const displayRentalProducts = (Array.isArray(availableRentalProducts) ? availableRentalProducts : [])
    .slice(0, 4)
    .map(product => ({
      ...product,
      safeRentalPrice: formatPrice(product.rentalPricePerDay),
      safeRating: getRating(product.rating),
      safeReviews: getReviewsCount(product.reviews),
      safeDeposit: product.rentalDeposit ? formatPrice(product.rentalDeposit) : '500.00',
      safeImage: product.image || '📦',
      safeCategory: product.category?.name || 'Tech',
      safeName: product.name || 'Rental Product',
      safeDescription: product.description || 'Premium tech equipment available for rent',
      isAvailable: product.isAvailable !== false,
      badge: product.badge || 'New',
      inCart: isProductInCart(product.id, true),
      inWishlist: isProductInWishlist(product.id)
    }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-96 md:h-[500px] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
              index === currentHeroSlide ? 'translate-x-0' : 
              index < currentHeroSlide ? '-translate-x-full' : 'translate-x-full'
            }`}
          >
            <div className={`w-full h-full bg-gradient-to-r ${slide.bgGradient} flex items-center`}>
              <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="text-white">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                      {slide.title}
                    </h1>
                    <h2 className="text-xl md:text-2xl mb-4 text-gray-200">
                      {slide.subtitle}
                    </h2>
                    <p className="text-lg mb-6 text-gray-300">
                      {slide.description}
                    </p>
                    <div className="flex items-center gap-4 mb-8">
                      <span className="text-3xl font-bold">{slide.price}</span>
                    </div>
                    <button 
                      onClick={slide.action}
                      className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
                    >
                      {slide.cta} <FaArrowRight />
                    </button>
                  </div>
                  <div className="text-center">
                    <div className="text-8xl md:text-9xl">{slide.image}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Hero Navigation */}
        <button 
          onClick={prevHeroSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
        >
          <FaChevronLeft />
        </button>
        <button 
          onClick={nextHeroSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
        >
          <FaChevronRight />
        </button>

        {/* Hero Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentHeroSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentHeroSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-white py-4 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <FaTruck className="text-blue-600" />
              <span className="text-sm font-medium">Free Shipping $75+</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <FaShieldAlt className="text-green-600" />
              <span className="text-sm font-medium">2 Year Warranty</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <FaPhoneAlt className="text-purple-600" />
              <span className="text-sm font-medium">24/7 Tech Support</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <FaTools className="text-orange-600" />
              <span className="text-sm font-medium">Expert Installation</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Find exactly what you need from our extensive collection of premium tech products
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.slice(0, 8).map((category) => (
                <Link 
                  key={category.id}
                  to={`/products?category=${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="group cursor-pointer"
                >
                  <div className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                    <div className={`${category.color || 'bg-blue-500'} w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4`}>
                      {category.icon || <FaLaptop />}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                    <p className="text-gray-500 text-sm">{category.productCount || '100+'}+ products</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Rental Products Section */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-teal-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FaCalendarAlt className="text-green-600 text-3xl" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Rent Premium Tech
              </h2>
            </div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Try before you buy. Access the latest technology with flexible rental terms and no long-term commitment.
            </p>
          </div>

          {/* Rental Benefits */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {rentalBenefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                  {benefit.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">{benefit.title}</h3>
                <p className="text-xs text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>

          {/* Rental Products Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {displayRentalProducts.map((product) => (
                  <div 
                    key={product.id}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
                    onClick={(e) => handleQuickView(product.id, e)}
                  >
                    <div className="relative">
                      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-5xl group-hover:scale-105 transition-transform duration-300">
                        {product.safeImage}
                      </div>
                      <div className="absolute top-3 left-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          product.badge === 'Popular' ? 'bg-blue-100 text-blue-800' :
                          product.badge === 'Pro' ? 'bg-purple-100 text-purple-800' :
                          product.badge === 'Hot' ? 'bg-red-100 text-red-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {product.badge}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold text-center ${
                          product.isAvailable 
                            ? 'bg-green-500 text-white' 
                            : 'bg-yellow-500 text-white'
                        }`}>
                          {product.isAvailable ? 'In Stock' : 'Limited'}
                        </span>
                      </div>
                      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <button 
                          onClick={(e) => handleAddToWishlist(product.id, e)}
                          className={`p-2 bg-white rounded-full shadow-md transition-colors ${
                            product.inWishlist 
                              ? 'text-red-500 bg-red-50' 
                              : 'hover:text-red-500 hover:bg-red-50'
                          }`}
                        >
                          <FaHeart className={product.inWishlist ? 'fill-current' : ''} />
                        </button>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="text-xs text-gray-500 mb-1">{product.safeCategory}</div>
                      <h3 className="font-semibold text-gray-900 mb-2 text-sm line-clamp-2">
                        {product.safeName}
                      </h3>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-3">
                        <div className="flex text-yellow-400 text-xs">
                          {[...Array(5)].map((_, i) => (
                            <FaStar 
                              key={i} 
                              className={
                                i < Math.floor(product.safeRating) 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                              } 
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-600">({product.safeReviews})</span>
                      </div>

                      <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                        {product.safeDescription}
                      </p>

                      {/* Pricing Options */}
                      <div className="grid grid-cols-3 gap-1 mb-3">
                        {product.safeRentalPrice && (
                          <>
                            <div className="text-center bg-gray-50 rounded p-1">
                              <div className="text-xs font-medium text-gray-500 capitalize">Daily</div>
                              <div className="text-sm font-bold text-gray-900">
                                ${product.safeRentalPrice}
                              </div>
                            </div>
                            <div className="text-center bg-gray-50 rounded p-1">
                              <div className="text-xs font-medium text-gray-500 capitalize">Weekly</div>
                              <div className="text-sm font-bold text-gray-900">
                                ${(parseFloat(product.safeRentalPrice) * 7 * 0.8).toFixed(2)}
                              </div>
                            </div>
                            <div className="text-center bg-gray-50 rounded p-1">
                              <div className="text-xs font-medium text-gray-500 capitalize">Monthly</div>
                              <div className="text-sm font-bold text-gray-900">
                                ${(parseFloat(product.safeRentalPrice) * 30 * 0.7).toFixed(2)}
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Deposit */}
                      <div className="flex items-center justify-between text-xs mb-3">
                        <span className="text-gray-600">Deposit:</span>
                        <span className="font-semibold">${product.safeDeposit}</span>
                      </div>

                      {/* Rent Button */}
                      <button
                        onClick={(e) => handleRentNow(product.id, e)}
                        className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm"
                      >
                        <FaCalendarAlt />
                        {product.inCart ? 'View in Cart' : 'Rent Now'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <Link 
                  to="/rental"
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  View All Rentals
                  <FaArrowRight />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <FaFire className="text-orange-500 text-2xl" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Hot Deals & Featured Products
              </h2>
            </div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Don't miss out on these incredible deals and our top-rated products
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayFeaturedProducts.map((product) => (
                  <div 
                    key={product.id}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
                    onClick={(e) => handleQuickView(product.id, e)}
                  >
                    {/* Product Badge */}
                    <div className="relative">
                      <div className="aspect-square bg-gray-100 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-300">
                        {product.safeImage}
                      </div>
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          product.isFeatured ? 'bg-blue-100 text-blue-800' :
                          product.isNew ? 'bg-green-100 text-green-800' :
                          product.onSale ? 'bg-red-100 text-red-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {product.isFeatured ? 'Featured' : 
                           product.isNew ? 'New' :
                           product.onSale ? 'Sale' : 'Popular'}
                        </span>
                      </div>
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <button 
                          onClick={(e) => handleAddToWishlist(product.id, e)}
                          className={`p-2 bg-white rounded-full shadow-md transition-colors ${
                            product.inWishlist 
                              ? 'text-red-500 bg-red-50' 
                              : 'hover:text-red-500 hover:bg-red-50'
                          }`}
                        >
                          <FaHeart className={product.inWishlist ? 'fill-current' : ''} />
                        </button>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="text-sm text-gray-500 mb-1">{product.safeCategory}</div>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.safeName}</h3>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <FaStar 
                              key={i} 
                              className={
                                i < Math.floor(product.safeRating) 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                              } 
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">({product.safeReviews})</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xl font-bold text-gray-900">
                          ${product.safePrice}
                        </span>
                        {product.safeOriginalPrice && parseFloat(product.safeOriginalPrice) > parseFloat(product.safePrice) && (
                          <span className="text-sm text-gray-500 line-through">
                            ${product.safeOriginalPrice}
                          </span>
                        )}
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={(e) => handleAddToCart(product.id, e)}
                        disabled={addingToCart[product.id] || !product.isAvailable}
                        className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                          product.inCart
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {addingToCart[product.id] ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Adding...
                          </>
                        ) : product.inCart ? (
                          <>
                            <FaCheck />
                            In Cart - View
                          </>
                        ) : (
                          <>
                            <FaShoppingCart />
                            Add to Cart
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-12">
                <Link 
                  to="/products" 
                  className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  All Products <FaArrowRight />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Special Offers Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white bg-opacity-10 backdrop-blur rounded-2xl p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <FaBolt className="text-3xl text-yellow-400" />
                <h3 className="text-2xl font-bold">Flash Sale</h3>
              </div>
              <p className="text-lg mb-6">Up to 50% off gaming peripherals. Limited time only!</p>
              <Link 
                to="/products?category=gaming&sale=true"
                className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Shop Flash Sale
              </Link>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur rounded-2xl p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <FaTag className="text-3xl text-green-400" />
                <h3 className="text-2xl font-bold">Build & Save</h3>
              </div>
              <p className="text-lg mb-6">Get 15% off when you buy 3+ PC components together!</p>
              <Link 
                to="/products?category=components&bundle=true"
                className="inline-block bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Start Building
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Get the latest tech news, product releases, and exclusive deals delivered to your inbox
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;