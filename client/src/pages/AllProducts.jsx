// ============================================
// pages/AllProducts.jsx - API INTEGRATION VERSION
// ============================================
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaStar,
  FaShoppingCart,
  FaHeart,
  FaFilter,
  FaTh,
  FaList,
  FaChevronDown,
  FaSearch,
  FaTimes,
  FaCheck,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaSpinner
} from 'react-icons/fa';
import { useAuth, useCart, useProducts, useCategories } from '../stores';
import { productSelectors, cartSelectors, categorySelectors } from '../stores/selectors';

const AllProducts = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // Cart store
  const { addToCart } = useCart();
  const cartState = useCart();
  const cartItems = cartSelectors.cartItems(cartState);
  
  // Products store
  const { products, fetchProducts, isLoading: productsLoading, error: productsError } = useProducts();
  const productsState = useProducts();
  const availableProducts = productSelectors.availableProducts(productsState);
  const featuredProducts = productSelectors.featuredProducts(productsState);
  
  // Categories store
  const { categories, fetchCategories, isLoading: categoriesLoading } = useCategories();
  const categoriesState = useCategories();
  const categoriesWithCounts = categorySelectors.categoriesWithCounts(categoriesState);

  // Local state
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [addingToCart, setAddingToCart] = useState({});
  const [wishlistItems, setWishlistItems] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Fetch data on component mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

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
  const isProductInCart = (productId, isForRental = false) => {
    return cartItems.some(item => 
      item.productId === productId && item.isForRental === isForRental
    );
  };

  // Check if product is in wishlist
  const isProductInWishlist = (productId) => {
    return wishlistItems.has(productId);
  };

  const handleAddToCart = async (product, event) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/products' } });
      return;
    }

    // Check if already in cart
    if (isProductInCart(product.id, false)) {
      navigate('/cart');
      return;
    }

    setAddingToCart(prev => ({ ...prev, [product.id]: true }));

    try {
      await addToCart({
        productId: product.id,
        quantity: 1,
        isForRental: false,
        priceAtAddition: product.price,
        productName: product.name,
        productImage: product.image || '📦'
      });
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setAddingToCart(prev => ({ ...prev, [product.id]: false }));
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

  const handleQuickView = (productId, event) => {
    event.preventDefault();
    event.stopPropagation();
    navigate(`/product/${productId}`);
  };

  const toggleBrand = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setPriceRange([0, 5000]);
    setSelectedBrands([]);
    setSearchQuery('');
    setCurrentPage(1);
  };

  // Filter and sort products
  const filteredProducts = availableProducts.filter(product => {
    // Category filter
    if (selectedCategory !== 'all') {
      const categoryMatch = product.category?.name?.toLowerCase().replace(/\s+/g, '-') === selectedCategory;
      if (!categoryMatch) return false;
    }

    // Price range filter
    const price = product.price || 0;
    if (price < priceRange[0] || price > priceRange[1]) return false;

    // Brand filter
    if (selectedBrands.length > 0 && product.brand) {
      if (!selectedBrands.includes(product.brand)) return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const nameMatch = product.name?.toLowerCase().includes(query);
      const descMatch = product.description?.toLowerCase().includes(query);
      const categoryMatch = product.category?.name?.toLowerCase().includes(query);
      if (!nameMatch && !descMatch && !categoryMatch) return false;
    }

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a.price || 0) - (b.price || 0);
      case 'price-high':
        return (b.price || 0) - (a.price || 0);
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'newest':
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      case 'featured':
      default:
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);

  // Get unique brands from products
  const brands = [...new Set(availableProducts.map(product => product.brand).filter(Boolean))].sort();

  // Get categories for filter
  const filterCategories = [
    { id: 'all', name: 'All Products' },
    ...(categoriesWithCounts || [])
  ];

  if (productsError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="text-red-500 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Products</h2>
          <p className="text-gray-600 mb-4">{productsError}</p>
          <button
            onClick={fetchProducts}
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
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">All Products</h1>
          <p className="text-blue-100">Discover our complete collection of premium tech products</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FaFilter /> Filters
                </h2>
                <button 
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Clear All
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Products
                </label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Categories</h3>
                <div className="space-y-2">
                  {filterCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id === 'all' ? 'all' : category.name.toLowerCase().replace(/\s+/g, '-'))}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === (category.id === 'all' ? 'all' : category.name.toLowerCase().replace(/\s+/g, '-'))
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{category.name}</span>
                        {category.id !== 'all' && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {category.productCount || 0}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Price Range</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Min"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>

              {/* Brands */}
              {brands.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Brands</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {brands.map((brand) => (
                      <label key={brand} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => toggleBrand(brand)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Results Count */}
              <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">{filteredProducts.length}</span> products found
                </div>
              </div>

              {/* Rental Option Banner */}
              <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-xl p-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <FaCalendarAlt className="text-xl" />
                  <h3 className="font-bold">Try Before You Buy</h3>
                </div>
                <p className="text-sm text-green-50 mb-3">
                  Rent premium tech products starting from $9.99/month
                </p>
                <Link 
                  to="/rental"
                  className="block w-full bg-white text-green-600 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors text-center"
                >
                  View Rental Options
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <FaFilter /> {showFilters ? 'Hide' : 'Show'} Filters
                  </button>
                  <span className="text-gray-600">
                    Showing <span className="font-semibold">{filteredProducts.length}</span> products
                    {selectedCategory !== 'all' && ` in ${selectedCategory.replace('-', ' ')}`}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  {/* Sort Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest</option>
                  </select>

                  {/* View Toggle */}
                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      <FaTh />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      <FaList />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {productsLoading && (
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">Loading products...</p>
                </div>
              </div>
            )}

            {/* Products Grid/List */}
            {!productsLoading && paginatedProducts.length === 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">
                  {filteredProducts.length === 0 && availableProducts.length > 0 
                    ? "Try adjusting your filters to see more products."
                    : "No products are currently available."
                  }
                </p>
                {filteredProducts.length === 0 && availableProducts.length > 0 && (
                  <button
                    onClick={clearFilters}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            )}

            {!productsLoading && paginatedProducts.length > 0 && (
              <>
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-4'
                }>
                  {paginatedProducts.map((product) => {
                    const safeProduct = {
                      ...product,
                      safePrice: formatPrice(product.price),
                      safeOriginalPrice: product.originalPrice ? formatPrice(product.originalPrice) : null,
                      safeRating: getRating(product.rating),
                      safeReviews: getReviewsCount(product.reviews),
                      safeImage: product.image || '📦',
                      safeCategory: product.category?.name || 'Uncategorized',
                      safeDescription: product.description || 'Premium tech product',
                      inCart: isProductInCart(product.id, false),
                      inWishlist: isProductInWishlist(product.id)
                    };

                    return viewMode === 'grid' ? (
                      // Grid View
                      <div
                        key={product.id}
                        className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
                        onClick={(e) => handleQuickView(product.id, e)}
                      >
                        <div className="relative">
                          <div className="aspect-square bg-gray-100 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-300">
                            {safeProduct.safeImage}
                          </div>
                          {product.badge && (
                            <div className="absolute top-4 left-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                product.badge === 'Best Seller' ? 'bg-blue-100 text-blue-800' :
                                product.badge === 'New' ? 'bg-green-100 text-green-800' :
                                product.badge === 'Deal' ? 'bg-red-100 text-red-800' :
                                'bg-purple-100 text-purple-800'
                              }`}>
                                {product.badge}
                              </span>
                            </div>
                          )}
                          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <button 
                              onClick={(e) => handleAddToWishlist(product.id, e)}
                              className={`p-2 bg-white rounded-full shadow-md transition-colors ${
                                safeProduct.inWishlist 
                                  ? 'text-red-500 bg-red-50' 
                                  : 'hover:text-red-500 hover:bg-red-50'
                              }`}
                            >
                              <FaHeart className={safeProduct.inWishlist ? 'fill-current' : ''} />
                            </button>
                          </div>
                          {!product.isAvailable && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                              <span className="bg-white text-gray-900 px-4 py-2 rounded-full font-semibold">
                                Out of Stock
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="p-6">
                          <div className="text-sm text-gray-500 mb-1">{safeProduct.safeCategory}</div>
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 h-12">
                            {product.name}
                          </h3>

                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <FaStar
                                  key={i}
                                  className={i < Math.floor(safeProduct.safeRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">({safeProduct.safeReviews})</span>
                          </div>

                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl font-bold text-gray-900">
                              ${safeProduct.safePrice}
                            </span>
                            {safeProduct.safeOriginalPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                ${safeProduct.safeOriginalPrice}
                              </span>
                            )}
                          </div>

                          <button
                            onClick={(e) => handleAddToCart(product, e)}
                            disabled={addingToCart[product.id] || !product.isAvailable || safeProduct.inCart}
                            className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
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
                                <FaShoppingCart />
                                {product.isAvailable ? 'Add to Cart' : 'Out of Stock'}
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ) : (
                      // List View
                      <div
                        key={product.id}
                        className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
                        onClick={(e) => handleQuickView(product.id, e)}
                      >
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-64 relative">
                            <div className="aspect-square md:aspect-auto md:h-full bg-gray-100 flex items-center justify-center text-6xl">
                              {safeProduct.safeImage}
                            </div>
                            {product.badge && (
                              <div className="absolute top-4 left-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  product.badge === 'Best Seller' ? 'bg-blue-100 text-blue-800' :
                                  product.badge === 'New' ? 'bg-green-100 text-green-800' :
                                  product.badge === 'Deal' ? 'bg-red-100 text-red-800' :
                                  'bg-purple-100 text-purple-800'
                                }`}>
                                  {product.badge}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex-1 p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex-1">
                                <div className="text-sm text-gray-500 mb-1">{safeProduct.safeCategory}</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                  {product.name}
                                </h3>
                                <p className="text-gray-600 mb-3 line-clamp-2">{safeProduct.safeDescription}</p>

                                {product.specs && product.specs.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mb-4">
                                    {product.specs.slice(0, 3).map((spec, index) => (
                                      <span
                                        key={index}
                                        className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-700"
                                      >
                                        {spec}
                                      </span>
                                    ))}
                                  </div>
                                )}

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

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-3xl font-bold text-gray-900">
                                  ${safeProduct.safePrice}
                                </span>
                                {safeProduct.safeOriginalPrice && (
                                  <span className="text-lg text-gray-500 line-through">
                                    ${safeProduct.safeOriginalPrice}
                                  </span>
                                )}
                              </div>

                              <button
                                onClick={(e) => handleAddToCart(product, e)}
                                disabled={addingToCart[product.id] || !product.isAvailable || safeProduct.inCart}
                                className={`px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
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
                                    In Cart
                                  </>
                                ) : (
                                  <>
                                    <FaShoppingCart />
                                    {product.isAvailable ? 'Add to Cart' : 'Out of Stock'}
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                              page === currentPage
                                ? 'bg-blue-600 text-white'
                                : 'border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      <button 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;