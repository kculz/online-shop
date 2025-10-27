// ============================================
// pages/ProductDetail.jsx - REDUX VERSION
// ============================================
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  FaArrowLeft,
  FaShoppingCart,
  FaHeart,
  FaStar,
  FaTruck,
  FaShieldAlt,
  FaUndo,
  FaCreditCard,
  FaCheck,
  FaChevronDown,
  FaChevronUp,
  FaShare,
  FaCalendarAlt,
  FaExclamationTriangle
} from 'react-icons/fa';

// Import Redux actions and selectors
import { fetchProductByIdThunk } from '../features/products/productsThunks';
import { addToCartThunk } from '../features/cart/cartThunks';
import { 
  selectIsAuthenticated 
} from '../features/auth/authSelectors';
import { 
  selectCurrentProduct,
  selectProductsLoading,
  selectProductsError 
} from '../features/products/productsSelectors';
import { 
  selectCartItems 
} from '../features/cart/cartSelectors';
import { clearCurrentProduct } from '../features/products/productsSlice';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux Selectors
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentProduct = useSelector(selectCurrentProduct);
  const isLoading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);
  const cartItems = useSelector(selectCartItems);
  
  // Local state
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    // Fetch product when component mounts or id changes
    if (id) {
      dispatch(fetchProductByIdThunk(parseInt(id)));
    }

    // Cleanup: clear current product when component unmounts
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [id, dispatch]);

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

  // Check if product has valid image URL
  const hasValidImage = (imageUrl) => {
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
  };

  // Handle image error
  const handleImageError = (productId, imageIndex) => {
    setImageErrors(prev => ({ ...prev, [`${productId}-${imageIndex}`]: true }));
  };

  // Check if product is in cart
  const isProductInCart = (productId, isForRental = false) => {
    return cartItems.some(item => 
      item.productId === productId && item.isForRental === isForRental
    );
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }

    if (!currentProduct) return;

    setAddingToCart(true);

    try {
      await dispatch(addToCartThunk({
        productId: currentProduct.id,
        quantity: quantity,
        isForRental: false,
        priceAtAddition: currentProduct.price,
        productName: currentProduct.name,
        productImage: currentProduct.imageUrl || '📦',
        rentalDays: currentProduct.canBeRented ? 7 : undefined
      })).unwrap();
      
      // Success feedback could be shown here
      console.log('Added to cart:', currentProduct.name, 'Quantity:', quantity);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      // Error feedback could be shown here
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }

    if (!currentProduct) return;

    setAddingToCart(true);

    try {
      await dispatch(addToCartThunk({
        productId: currentProduct.id,
        quantity: quantity,
        isForRental: false,
        priceAtAddition: currentProduct.price,
        productName: currentProduct.name,
        productImage: currentProduct.imageUrl || '📦'
      })).unwrap();
      
      // Navigate directly to checkout
      navigate('/checkout');
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleRentNow = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }

    if (currentProduct?.canBeRented) {
      navigate(`/rental/${currentProduct.id}`);
    } else {
      // Show message that this product is not available for rental
      alert('This product is not available for rental. Please check our rental section for available items.');
    }
  };

  const toggleWishlist = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }
    
    setIsWishlisted(!isWishlisted);
    console.log('Wishlist updated:', !isWishlisted);
  };

  const incrementQuantity = () => {
    if (currentProduct) {
      const maxQuantity = currentProduct.stockQuantity || currentProduct.stockCount || 10;
      setQuantity(prev => Math.min(prev + 1, maxQuantity));
    }
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 1));
  };

  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: currentProduct?.name,
        text: currentProduct?.description,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Product link copied to clipboard!');
    }
  };

  // Render product image
  const renderProductImage = (imageUrl, productId, imageIndex, isThumbnail = false) => {
    const hasImage = hasValidImage(imageUrl);
    const imageError = imageErrors[`${productId}-${imageIndex}`];
    const showFallback = !hasImage || imageError;
    
    const containerClass = isThumbnail 
      ? 'aspect-square bg-gray-100 rounded-xl flex items-center justify-center text-2xl transition-all'
      : 'aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center text-8xl group-hover:scale-105 transition-transform duration-300';

    if (showFallback) {
      return (
        <div className={containerClass}>
          {imageUrl || '📦'}
        </div>
      );
    }

    return (
      <img
        src={imageUrl}
        alt={currentProduct?.name || 'Product image'}
        className={`w-full h-full object-cover ${isThumbnail ? 'rounded-xl' : 'rounded-2xl'} group-hover:scale-105 transition-transform duration-300`}
        onError={() => handleImageError(productId, imageIndex)}
        loading="lazy"
      />
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900">Loading Product...</h2>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="text-red-500 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Product</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => dispatch(fetchProductByIdThunk(parseInt(id)))}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <Link
              to="/products"
              className="bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Product not found state
  if (!currentProduct) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <Link 
            to="/products" 
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  // Prepare product data with safe values
  const product = {
    ...currentProduct,
    safePrice: formatPrice(currentProduct.price),
    safeOriginalPrice: currentProduct.originalPrice ? formatPrice(currentProduct.originalPrice) : null,
    safeRating: getRating(currentProduct.rating),
    safeReviews: getReviewsCount(currentProduct.reviews),
    safeRentalPrice: currentProduct.rentalPricePerDay ? formatPrice(currentProduct.rentalPricePerDay) : null,
    safeImages: currentProduct.images || [currentProduct.imageUrl] || ['📦'],
    safeCategory: currentProduct.category?.name || 'Uncategorized',
    safeDescription: currentProduct.description || 'No description available.',
    safeFullDescription: currentProduct.fullDescription || currentProduct.description || 'No detailed description available.',
    safeSpecs: currentProduct.specs || {},
    safeFeatures: currentProduct.features || [],
    safeStockCount: currentProduct.stockQuantity || currentProduct.stockCount || 10,
    safeWarranty: currentProduct.warranty || 'Standard Warranty',
    safeShipping: currentProduct.shipping || 'Standard Shipping',
    safeReturnPolicy: currentProduct.returnPolicy || 'Standard Return Policy'
  };

  const productInCart = isProductInCart(product.id, false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-gray-900">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-gray-900">Products</Link>
            <span>/</span>
            <span className="text-gray-900">{product.safeCategory}</span>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <FaArrowLeft />
          <span>Back</span>
        </button>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="group">
              {renderProductImage(product.safeImages[selectedImage], product.id, selectedImage, false)}
            </div>
            
            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-3">
              {product.safeImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`group transition-all ${
                    selectedImage === index 
                      ? 'ring-2 ring-blue-500 ring-offset-2 rounded-xl' 
                      : 'hover:bg-gray-200 rounded-xl'
                  }`}
                >
                  {renderProductImage(image, product.id, index, true)}
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Badge and Category */}
            <div className="flex items-center gap-3">
              {product.badge && (
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  product.badge === 'Best Seller' ? 'bg-blue-100 text-blue-800' :
                  product.badge === 'Pro Choice' ? 'bg-purple-100 text-purple-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {product.badge}
                </span>
              )}
              <span className="text-sm text-gray-500">{product.safeCategory}</span>
              {product.canBeRented && (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                  Available for Rent
                </span>
              )}
            </div>

            {/* Product Name */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < Math.floor(product.safeRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                      size={16}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-900">{product.safeRating}</span>
              </div>
              <span className="text-sm text-gray-500">({product.safeReviews} reviews)</span>
              <span className={`text-sm font-medium ${product.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                {product.isAvailable ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-gray-900">${product.safePrice}</span>
              {product.safeOriginalPrice && (
                <span className="text-xl text-gray-500 line-through">${product.safeOriginalPrice}</span>
              )}
              {product.safeOriginalPrice && (
                <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm font-semibold">
                  Save ${(parseFloat(product.safeOriginalPrice) - parseFloat(product.safePrice)).toFixed(2)}
                </span>
              )}
            </div>

            {/* Rental Price */}
            {product.canBeRented && product.safeRentalPrice && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FaCalendarAlt className="text-blue-600" />
                  <span className="font-semibold text-blue-900">Available for Rental</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-blue-700">${product.safeRentalPrice}</span>
                  <span className="text-blue-600">per day</span>
                </div>
                <button
                  onClick={handleRentNow}
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                >
                  Rent This Item
                </button>
              </div>
            )}

            {/* Short Description */}
            <p className="text-gray-600 leading-relaxed">
              {product.safeDescription}
            </p>

            {/* Key Features */}
            {product.safeFeatures.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {product.safeFeatures.slice(0, 4).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <FaCheck className="text-green-500 flex-shrink-0" size={14} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="font-medium text-gray-900">Quantity:</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center font-medium text-lg">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  disabled={quantity >= product.safeStockCount}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  +
                </button>
              </div>
              <span className="text-sm text-gray-500">
                {product.safeStockCount > 0 ? `${product.safeStockCount} available` : 'Limited stock'}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || !product.isAvailable || productInCart}
                className={`flex-1 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed ${
                  productInCart
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {addingToCart ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Adding...
                  </>
                ) : productInCart ? (
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
              <button
                onClick={handleBuyNow}
                disabled={addingToCart || !product.isAvailable}
                className="flex-1 bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaCreditCard />
                Buy Now
              </button>
              <div className="flex gap-2">
                <button
                  onClick={toggleWishlist}
                  className={`px-6 py-4 border-2 rounded-lg transition-colors flex items-center justify-center ${
                    isWishlisted
                      ? 'border-red-500 text-red-500 bg-red-50 hover:bg-red-100'
                      : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <FaHeart className={isWishlisted ? 'fill-current' : ''} />
                </button>
                <button
                  onClick={shareProduct}
                  className="px-6 py-4 border-2 border-gray-300 text-gray-600 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  <FaShare />
                </button>
              </div>
            </div>

            {/* Product Highlights */}
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-b border-gray-200">
              <div className="text-center">
                <FaTruck className="text-blue-500 text-xl mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-900">{product.safeShipping}</div>
                <div className="text-xs text-gray-500">Free over $75</div>
              </div>
              <div className="text-center">
                <FaShieldAlt className="text-green-500 text-xl mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-900">{product.safeWarranty}</div>
                <div className="text-xs text-gray-500">Warranty</div>
              </div>
              <div className="text-center">
                <FaUndo className="text-purple-500 text-xl mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-900">{product.safeReturnPolicy}</div>
                <div className="text-xs text-gray-500">Easy returns</div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description Section */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Description</h2>
          <div className="space-y-4">
            <div className={`${!showFullDescription && product.safeFullDescription.length > 200 ? 'max-h-32 overflow-hidden' : ''}`}>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {showFullDescription ? product.safeFullDescription : product.safeFullDescription}
              </p>
            </div>
            {product.safeFullDescription.length > 200 && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                {showFullDescription ? <FaChevronUp /> : <FaChevronDown />}
                {showFullDescription ? 'Show Less' : 'Read More'}
              </button>
            )}
          </div>

          {/* Display Key Specifications if available */}
          {Object.keys(product.safeSpecs).length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Specifications</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(product.safeSpecs).slice(0, 6).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-600">{key}</span>
                    <span className="text-gray-900 text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Display Features if available */}
          {product.safeFeatures.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {product.safeFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FaCheck className="text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Rental CTA Section */}
        {product.canBeRented && (
          <div className="mt-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl p-8 text-white text-center">
            <div className="max-w-2xl mx-auto">
              <FaCalendarAlt className="text-4xl mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Want to Try Before You Buy?</h3>
              <p className="text-green-50 mb-6 text-lg">
                Rent this product and get hands-on experience before making a commitment. 
                Flexible rental terms available.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={handleRentNow}
                  className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Rent This Item
                </button>
                <Link
                  to="/rental"
                  className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
                >
                  Browse All Rentals
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;