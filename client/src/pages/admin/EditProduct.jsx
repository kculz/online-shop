// ============================================
// pages/admin/EditProduct.jsx
// ============================================
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

// Import Redux actions and selectors
import { 
  fetchProductByIdThunk, 
  updateProductThunk 
} from '../../features/products/productsThunks';
import { fetchCategoriesThunk } from '../../features/categories/categoriesThunks';
import { clearError, clearCurrentProduct } from '../../features/products/productsSlice';
import { 
  selectCurrentProduct, 
  selectProductsLoading, 
  selectProductsError 
} from '../../features/products/productsSelectors';
import { selectAllCategories } from '../../features/categories/categoriesSelectors';

const EditProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Redux Selectors
  const product = useSelector(selectCurrentProduct);
  const categories = useSelector(selectAllCategories);
  const isLoading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    stockQuantity: '',
    imageUrl: '',
    isAvailable: true,
    isFeatured: false,
    canBeRented: false,
    rentalPricePerDay: '',
    rentalDeposit: '',
    minRentalDays: '',
    maxRentalDays: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch product data and categories
    dispatch(fetchProductByIdThunk(id));
    dispatch(fetchCategoriesThunk());
  }, [dispatch, id]);

  // Populate form when product data is loaded
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        categoryId: product.categoryId || '',
        stockQuantity: product.stockQuantity || '',
        imageUrl: product.imageUrl || '',
        isAvailable: product.isAvailable !== false,
        isFeatured: product.isFeatured || false,
        canBeRented: product.canBeRented || false,
        rentalPricePerDay: product.rentalPricePerDay || '',
        rentalDeposit: product.rentalDeposit || '',
        minRentalDays: product.minRentalDays || '',
        maxRentalDays: product.maxRentalDays || '',
      });
    }
  }, [product]);

  // Clear errors and current product when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearCurrentProduct());
    };
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    // Required fields validation
    if (!formData.name.trim()) errors.name = 'Product name is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.price || formData.price <= 0) errors.price = 'Valid price is required';
    if (!formData.categoryId) errors.categoryId = 'Category is required';
    if (!formData.stockQuantity || formData.stockQuantity < 0) errors.stockQuantity = 'Valid stock quantity is required';

    // Rental-specific validation
    if (formData.canBeRented) {
      if (!formData.rentalPricePerDay || formData.rentalPricePerDay <= 0) {
        errors.rentalPricePerDay = 'Valid rental price is required';
      }
      if (!formData.minRentalDays || formData.minRentalDays <= 0) {
        errors.minRentalDays = 'Valid minimum rental days is required';
      }
      if (formData.maxRentalDays && formData.maxRentalDays < formData.minRentalDays) {
        errors.maxRentalDays = 'Maximum rental days cannot be less than minimum';
      }
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare product data for API
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity),
        rentalPricePerDay: formData.canBeRented ? parseFloat(formData.rentalPricePerDay) : null,
        rentalDeposit: formData.canBeRented && formData.rentalDeposit ? parseFloat(formData.rentalDeposit) : null,
        minRentalDays: formData.canBeRented ? parseInt(formData.minRentalDays) : null,
        maxRentalDays: formData.canBeRented && formData.maxRentalDays ? parseInt(formData.maxRentalDays) : null,
      };

      const result = await dispatch(updateProductThunk({ id, productData })).unwrap();
      
      if (result) {
        // Redirect to products list on success
        navigate('/admin/products');
      }
    } catch (error) {
      console.error('Failed to update product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/products');
  };

  // Show loading while fetching product data
  if (isLoading && !product) {
    return (
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-lg text-gray-600">Loading product data...</span>
        </div>
      </div>
    );
  }

  // Show error if product not found
  if (error && !product) {
    return (
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-red-800">Error Loading Product</h3>
              <p className="text-red-700 mt-2">{error}</p>
              <button
                onClick={() => navigate('/admin/products')}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Back to Products
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
            <p className="mt-2 text-sm text-gray-600">
              Update product information for {product?.name}
            </p>
          </div>
          <div className="text-sm text-gray-500">
            Product ID: #{id}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Product Form */}
      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Product Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Product Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter product name"
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                  Category *
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.categoryId ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {formErrors.categoryId && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.categoryId}</p>
                )}
              </div>

              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price ($) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.price ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
                {formErrors.price && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.price}</p>
                )}
              </div>

              {/* Stock Quantity */}
              <div>
                <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  id="stockQuantity"
                  name="stockQuantity"
                  min="0"
                  value={formData.stockQuantity}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.stockQuantity ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0"
                />
                {formErrors.stockQuantity && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.stockQuantity}</p>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                formErrors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter product description"
            />
            {formErrors.description && (
              <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
            )}
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
              Image URL
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com/image.jpg"
            />
            {formData.imageUrl && (
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-2">Image Preview:</p>
                <img 
                  src={formData.imageUrl} 
                  alt="Preview" 
                  className="h-32 w-32 object-cover rounded-lg border"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Rental Options Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Rental Options</h3>
            
            {/* Can Be Rented Toggle */}
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="canBeRented"
                name="canBeRented"
                checked={formData.canBeRented}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="canBeRented" className="ml-2 block text-sm text-gray-900">
                This product can be rented
              </label>
            </div>

            {/* Rental Fields (Conditional) */}
            {formData.canBeRented && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 bg-gray-50 p-4 rounded-lg">
                {/* Rental Price Per Day */}
                <div>
                  <label htmlFor="rentalPricePerDay" className="block text-sm font-medium text-gray-700">
                    Rental Price Per Day ($) *
                  </label>
                  <input
                    type="number"
                    id="rentalPricePerDay"
                    name="rentalPricePerDay"
                    step="0.01"
                    min="0"
                    value={formData.rentalPricePerDay}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors.rentalPricePerDay ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                  {formErrors.rentalPricePerDay && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.rentalPricePerDay}</p>
                  )}
                </div>

                {/* Rental Deposit */}
                <div>
                  <label htmlFor="rentalDeposit" className="block text-sm font-medium text-gray-700">
                    Rental Deposit ($)
                  </label>
                  <input
                    type="number"
                    id="rentalDeposit"
                    name="rentalDeposit"
                    step="0.01"
                    min="0"
                    value={formData.rentalDeposit}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                  />
                </div>

                {/* Minimum Rental Days */}
                <div>
                  <label htmlFor="minRentalDays" className="block text-sm font-medium text-gray-700">
                    Minimum Rental Days *
                  </label>
                  <input
                    type="number"
                    id="minRentalDays"
                    name="minRentalDays"
                    min="1"
                    value={formData.minRentalDays}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors.minRentalDays ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="1"
                  />
                  {formErrors.minRentalDays && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.minRentalDays}</p>
                  )}
                </div>

                {/* Maximum Rental Days */}
                <div>
                  <label htmlFor="maxRentalDays" className="block text-sm font-medium text-gray-700">
                    Maximum Rental Days
                  </label>
                  <input
                    type="number"
                    id="maxRentalDays"
                    name="maxRentalDays"
                    min="1"
                    value={formData.maxRentalDays}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors.maxRentalDays ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="30"
                  />
                  {formErrors.maxRentalDays && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.maxRentalDays}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Additional Options */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Options</h3>
            <div className="space-y-4">
              {/* Availability */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isAvailable"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-900">
                  Product is available for sale/rental
                </label>
              </div>

              {/* Featured Product */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900">
                  Feature this product on homepage
                </label>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : (
                'Update Product'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Product Status Information */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Product Status</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Current Status:</span>
            <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              product?.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {product?.isAvailable ? 'Available' : 'Unavailable'}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Rental Status:</span>
            <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              product?.canBeRented ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {product?.canBeRented ? 'Rentable' : 'Not Rentable'}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Created:</span>
            <span className="ml-2 text-gray-900">
              {product?.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Last Updated:</span>
            <span className="ml-2 text-gray-900">
              {product?.updatedAt ? new Date(product.updatedAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;