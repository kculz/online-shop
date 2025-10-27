// ============================================
// HomePage with Redux Integration
// ============================================
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FaLaptop, FaStar, FaShoppingCart, FaHeart, FaArrowRight,
  FaTruck, FaShieldAlt, FaPhoneAlt, FaTools, FaFire,
  FaCalendarAlt, FaCheck, FaChevronLeft, FaChevronRight,
  FaImage
} from 'react-icons/fa';

// Import Redux actions and selectors
import { 
  fetchProductsThunk, 
  fetchRentalProductsThunk 
} from '../features/products/productsThunks';
import { fetchCategoriesThunk } from '../features/categories/categoriesThunks';
import { addToCartThunk } from '../features/cart/cartThunks';

import { 
  selectAllProducts,
  selectRentalProducts,
  selectProductsLoading 
} from '../features/products/productsSelectors';
import { 
  selectAllCategories 
} from '../features/categories/categoriesSelectors';
import { 
  selectCartItems,
  selectCartLoading 
} from '../features/cart/cartSelectors';
import { 
  selectIsAuthenticated 
} from '../features/auth/authSelectors';

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux Selectors
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const products = useSelector(selectAllProducts);
  const rentalProducts = useSelector(selectRentalProducts);
  const categories = useSelector(selectAllCategories);
  const cartItems = useSelector(selectCartItems);
  const productsLoading = useSelector(selectProductsLoading);
  const cartLoading = useSelector(selectCartLoading);

  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [addingToCart, setAddingToCart] = useState({});
  const [wishlistItems, setWishlistItems] = useState(new Set());
  const [imageErrors, setImageErrors] = useState({});

  // Hero slides data (keep as mock since it's UI-only)
  const heroSlides = useMemo(() => [
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
  ], [navigate]);

  // Rental benefits
  const rentalBenefits = useMemo(() => [
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
  ], []);

  // Auto-rotate hero slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchProductsThunk());
    dispatch(fetchRentalProductsThunk());
    dispatch(fetchCategoriesThunk());
  }, [dispatch]);

  // Debug product data
  useEffect(() => {
    if (products && products.length > 0) {
      console.log('Sample product data:', products[0]);
      console.log('Image URL field:', products[0].imageUrl);
      console.log('Image field:', products[0].image);
    }
  }, [products]);

  // Navigation handlers
  const nextHeroSlide = useCallback(() => {
    setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
  }, [heroSlides.length]);

  const prevHeroSlide = useCallback(() => {
    setCurrentHeroSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, [heroSlides.length]);

  // Safe utility functions
  const formatPrice = useCallback((price) => {
    if (price === null || price === undefined) return '0.00';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  }, []);

  const getRating = useCallback((rating) => {
    if (rating === null || rating === undefined) return 4.5;
    const numRating = typeof rating === 'string' ? parseFloat(rating) : rating;
    return isNaN(numRating) ? 4.5 : numRating;
  }, []);

  const getReviewsCount = useCallback((reviews) => {
    if (reviews === null || reviews === undefined) return 0;
    const numReviews = typeof reviews === 'string' ? parseInt(reviews) : reviews;
    return isNaN(numReviews) ? 0 : numReviews;
  }, []);

  // Check if product has valid image URL
  const hasValidImage = useCallback((imageUrl) => {
    if (!imageUrl) return false;
    if (typeof imageUrl !== 'string') return false;
    
    // Check if it's an emoji or icon (not a URL)
    if (imageUrl.match(/[\u{1F300}-\u{1F9FF}]/gu)) return false;
    
    // Check if it's a valid URL format
    try {
      new URL(imageUrl);
      return true;
    } catch {
      return false;
    }
  }, []);

  // Handle image error
  const handleImageError = useCallback((productId) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  }, []);

  // Check if product is in cart
  const isProductInCart = useCallback((productId, isForRental = false) => {
    return cartItems.some(item => 
      item.productId === productId && item.isForRental === isForRental
    );
  }, [cartItems]);

  // Check if product is in wishlist
  const isProductInWishlist = useCallback((productId) => {
    return wishlistItems.has(productId);
  }, [wishlistItems]);

  // Handle add to cart
  const handleAddToCart = useCallback(async (product, event) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/' } });
      return;
    }

    if (isProductInCart(product.id, false)) {
      navigate('/cart');
      return;
    }

    setAddingToCart(prev => ({ ...prev, [product.id]: true }));

    try {
      await dispatch(addToCartThunk({
        productId: product.id,
        quantity: 1,
        isForRental: false,
        priceAtAddition: product.price,
        productName: product.name,
        productImage: product.imageUrl || '📦'
      })).unwrap();
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setAddingToCart(prev => ({ ...prev, [product.id]: false }));
    }
  }, [isAuthenticated, isProductInCart, dispatch, navigate]);

  // Handle wishlist toggle
  const handleAddToWishlist = useCallback((productId, event) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/' } });
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
  }, [isAuthenticated, navigate]);

  // Handle rent now
  const handleRentNow = useCallback((productId, event) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/rental' } });
      return;
    }
    
    navigate(`/rental/${productId}`);
  }, [isAuthenticated, navigate]);

  // Handle quick view
  const handleQuickView = useCallback((productId, event) => {
    event.preventDefault();
    event.stopPropagation();
    navigate(`/product/${productId}`);
  }, [navigate]);

  // Get featured products (first 6 available products)
  const displayFeaturedProducts = useMemo(() => {
    return (products || [])
      .filter(product => product.isAvailable)
      .slice(0, 6)
      .map(product => ({
        ...product,
        safePrice: formatPrice(product.price),
        safeRating: getRating(product.rating),
        safeReviews: getReviewsCount(product.reviews),
        safeOriginalPrice: product.originalPrice ? formatPrice(product.originalPrice) : null,
        safeImage: product.imageUrl || '📦',
        safeCategory: product.category?.name || 'Tech',
        safeName: product.name || 'Unnamed Product',
        safeDescription: product.description || 'Premium tech product',
        inCart: isProductInCart(product.id, false),
        inWishlist: isProductInWishlist(product.id),
        hasImage: hasValidImage(product.imageUrl),
        imageError: imageErrors[product.id] || false
      }));
  }, [products, formatPrice, getRating, getReviewsCount, isProductInCart, isProductInWishlist, hasValidImage, imageErrors]);

  // Get rental products (first 4 available)
  const displayRentalProducts = useMemo(() => {
    return (rentalProducts || [])
      .filter(product => product.isAvailable && product.canBeRented)
      .slice(0, 4)
      .map(product => ({
        ...product,
        safeRentalPrice: formatPrice(product.rentalPricePerDay || product.price * 0.1),
        safeRating: getRating(product.rating),
        safeReviews: getReviewsCount(product.reviews),
        safeDeposit: product.rentalDeposit ? formatPrice(product.rentalDeposit) : '500.00',
        safeImage: product.imageUrl || '📦',
        safeCategory: product.category?.name || 'Tech',
        safeName: product.name || 'Rental Product',
        safeDescription: product.description || 'Premium tech equipment available for rent',
        inCart: isProductInCart(product.id, true),
        inWishlist: isProductInWishlist(product.id),
        hasImage: hasValidImage(product.imageUrl),
        imageError: imageErrors[product.id] || false
      }));
  }, [rentalProducts, formatPrice, getRating, getReviewsCount, isProductInCart, isProductInWishlist, hasValidImage, imageErrors]);

  // Check if still loading
  const isLoading = productsLoading || cartLoading;

  // Render product image component
  const renderProductImage = useCallback((product) => {
    const showFallback = !product.hasImage || product.imageError;
    
    if (showFallback) {
      return (
        <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-5xl group-hover:scale-105 transition-transform duration-300">
          {product.safeImage}
        </div>
      );
    }

    return (
      <img
        src={product.imageUrl}
        alt={product.safeName}
        className="aspect-square w-full object-cover group-hover:scale-105 transition-transform duration-300"
        onError={() => handleImageError(product.id)}
        loading="lazy"
      />
    );
  }, [handleImageError]);

  // Render rental product image component
  const renderRentalProductImage = useCallback((product) => {
    const showFallback = !product.hasImage || product.imageError;
    
    if (showFallback) {
      return (
        <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-5xl group-hover:scale-105 transition-transform duration-300">
          {product.safeImage}
        </div>
      );
    }

    return (
      <img
        src={product.imageUrl}
        alt={product.safeName}
        className="aspect-square w-full object-cover group-hover:scale-105 transition-transform duration-300"
        onError={() => handleImageError(product.id)}
        loading="lazy"
      />
    );
  }, [handleImageError]);

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
              {(categories || []).slice(0, 8).map((category) => (
                <Link 
                  key={category.id}
                  to={`/products?category=${category.name?.toLowerCase().replace(/\s+/g, '-') || 'all'}`}
                  className="group cursor-pointer"
                >
                  <div className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                    <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                      <FaLaptop />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{category.name || 'Category'}</h3>
                    <p className="text-gray-500 text-sm">{category.productCount || '0'}+ products</p>
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
          ) : displayRentalProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {displayRentalProducts.map((product) => (
                  <div 
                    key={product.id}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
                    onClick={(e) => handleQuickView(product.id, e)}
                  >
                    <div className="relative">
                      {renderRentalProductImage(product)}
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 bg-green-500 text-white rounded-full text-xs font-semibold">
                          {product.isAvailable ? 'Available' : 'Limited'}
                        </span>
                      </div>
                      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => handleAddToWishlist(product.id, e)}
                          className={`p-2 bg-white rounded-full shadow-md transition-colors ${
                            product.inWishlist ? 'text-red-500' : 'hover:text-red-500'
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
                      
                      <div className="flex items-center gap-1 mb-3">
                        <div className="flex text-yellow-400 text-xs">
                          {[...Array(5)].map((_, i) => (
                            <FaStar 
                              key={i} 
                              className={i < Math.floor(product.safeRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'} 
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-600">({product.safeReviews})</span>
                      </div>

                      <div className="grid grid-cols-3 gap-1 mb-3">
                        <div className="text-center bg-gray-50 rounded p-1">
                          <div className="text-xs font-medium text-gray-500">Daily</div>
                          <div className="text-sm font-bold text-gray-900">${product.safeRentalPrice}</div>
                        </div>
                        <div className="text-center bg-gray-50 rounded p-1">
                          <div className="text-xs font-medium text-gray-500">Weekly</div>
                          <div className="text-sm font-bold text-gray-900">
                            ${(parseFloat(product.safeRentalPrice) * 7 * 0.8).toFixed(2)}
                          </div>
                        </div>
                        <div className="text-center bg-gray-50 rounded p-1">
                          <div className="text-xs font-medium text-gray-500">Monthly</div>
                          <div className="text-sm font-bold text-gray-900">
                            ${(parseFloat(product.safeRentalPrice) * 30 * 0.7).toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleRentNow(product.id, e)}
                        className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm"
                      >
                        <FaCalendarAlt />
                        Rent Now
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
                  View All Rentals <FaArrowRight />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No rental products available at the moment.</p>
            </div>
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
                Featured Products
              </h2>
            </div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Check out our top-rated products and best deals
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
          ) : displayFeaturedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayFeaturedProducts.map((product) => (
                  <div 
                    key={product.id}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
                    onClick={(e) => handleQuickView(product.id, e)}
                  >
                    <div className="relative">
                      {renderProductImage(product)}
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <button 
                          onClick={(e) => handleAddToWishlist(product.id, e)}
                          className={`p-2 bg-white rounded-full shadow-md transition-colors ${
                            product.inWishlist ? 'text-red-500 bg-red-50' : 'hover:text-red-500 hover:bg-red-50'
                          }`}
                        >
                          <FaHeart className={product.inWishlist ? 'fill-current' : ''} />
                        </button>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="text-sm text-gray-500 mb-1">{product.safeCategory}</div>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.safeName}</h3>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <FaStar 
                              key={i} 
                              className={i < Math.floor(product.safeRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'} 
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">({product.safeReviews})</span>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xl font-bold text-gray-900">${product.safePrice}</span>
                        {product.safeOriginalPrice && parseFloat(product.safeOriginalPrice) > parseFloat(product.safePrice) && (
                          <span className="text-sm text-gray-500 line-through">${product.safeOriginalPrice}</span>
                        )}
                      </div>

                      <button
                        onClick={(e) => handleAddToCart(product, e)}
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
                            In Cart
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
                  View All Products <FaArrowRight />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No featured products available at the moment.</p>
            </div>
          )}
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