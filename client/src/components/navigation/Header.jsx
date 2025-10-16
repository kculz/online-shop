// ============================================
// components/navigation/Header.jsx
// ============================================
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaUser, 
  FaSignOutAlt, 
  FaShoppingCart, 
  FaCog, 
  FaBars, 
  FaTimes,
  FaHeart,
  FaSearch,
  FaMicrochip,
  FaCalendarAlt
} from 'react-icons/fa';
import { useAuth, useCart } from '../../stores';
import { cartSelectors } from '../../stores/selectors/cartSelectors';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const { cartItemCount } = useCart(cartSelectors.cartItemCount);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  // Essential navigation items
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'All Products' },
    { path: '/rental', label: 'Rent Tech', icon: <FaCalendarAlt className="mr-1" /> },
  ];

  // User menu items
  const userMenuItems = [
    { path: '/profile', label: 'My Profile', icon: <FaUser className="mr-2" /> },
    { path: '/orders', label: 'My Orders', icon: <FaShoppingCart className="mr-2" /> },
    { path: '/wishlist', label: 'Wishlist', icon: <FaHeart className="mr-2" /> },
  ];

  // Admin menu items
  const adminMenuItems = [
    { path: '/admin', label: 'Dashboard', icon: <FaCog className="mr-2" /> },
    { path: '/admin/products', label: 'Products', icon: <FaCog className="mr-2" /> },
    { path: '/admin/orders', label: 'Orders', icon: <FaCog className="mr-2" /> },
    { path: '/admin/rentals', label: 'Rentals', icon: <FaCog className="mr-2" /> },
    { path: '/admin/users', label: 'Users', icon: <FaCog className="mr-2" /> },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <FaMicrochip className="text-white text-xl" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              TechHub
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                placeholder="Search laptops, components, accessories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-blue-600 transition-colors"
              >
                <FaSearch />
              </button>
            </form>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center transition-colors duration-200 font-medium ${
                  location.pathname === item.path 
                    ? 'text-blue-600' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {item.icon && <span className="mr-1">{item.icon}</span>}
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Actions - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Wishlist */}
                <Link
                  to="/wishlist"
                  className="p-2 text-gray-700 hover:text-red-500 transition-colors relative"
                  title="Wishlist"
                >
                  <FaHeart className="text-xl" />
                </Link>

                {/* Shopping Cart */}
                <Link
                  to="/cart"
                  className="p-2 text-gray-700 hover:text-blue-600 transition-colors relative"
                  title="Shopping Cart"
                >
                  <FaShoppingCart className="text-xl" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Link>

                {/* User Dropdown */}
                <div className="relative">
                  <button 
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center">
                      <FaUser className="text-blue-600" />
                    </div>
                    <span className="font-medium">{user?.username}</span>
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200 z-50">
                      {/* User Menu Items */}
                      {userMenuItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          {item.icon}
                          {item.label}
                        </Link>
                      ))}

                      {/* Admin Menu Items */}
                      {user?.role === 'admin' && (
                        <>
                          <hr className="my-2" />
                          {adminMenuItems.map((item) => (
                            <Link
                              key={item.path}
                              to={item.path}
                              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              {item.icon}
                              {item.label}
                            </Link>
                          ))}
                        </>
                      )}

                      <hr className="my-2" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition-colors flex items-center"
                      >
                        <FaSignOutAlt className="mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center space-x-2">
            {isAuthenticated && (
              <Link 
                to="/cart" 
                className="p-2 text-gray-700 relative"
              >
                <FaShoppingCart className="text-xl" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            )}
            
            {/* Mobile Menu Button */}
            <button
              className="p-2 text-gray-700"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search tech products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-blue-600 transition-colors"
            >
              <FaSearch />
            </button>
          </form>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-3">
              {/* Main Navigation */}
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`py-2 px-4 font-medium flex items-center ${
                    location.pathname === item.path 
                      ? 'text-blue-600 bg-blue-50 rounded-lg' 
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.label}
                </Link>
              ))}

              {/* User Section */}
              {isAuthenticated ? (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="px-4 py-2 text-sm text-gray-500">
                    Signed in as {user?.username}
                  </div>
                  
                  {/* User Menu Items */}
                  {userMenuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="flex items-center py-2 px-4 text-gray-700 hover:text-blue-600 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  ))}

                  {/* Admin Menu Items */}
                  {user?.role === 'admin' && (
                    <>
                      <hr className="my-2 mx-4" />
                      <div className="px-4 py-2 text-sm text-gray-500 font-semibold">
                        Admin
                      </div>
                      {adminMenuItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className="flex items-center py-2 px-4 text-gray-700 hover:text-blue-600 transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.icon}
                          {item.label}
                        </Link>
                      ))}
                    </>
                  )}

                  <hr className="my-2 mx-4" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left py-2 px-4 text-red-600 hover:text-red-700 transition-colors flex items-center"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-4 mt-4 flex flex-col space-y-3 px-4">
                  <Link
                    to="/login"
                    className="w-full text-center py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="w-full text-center py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>

      {/* Overlay for dropdown */}
      {isUserMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;