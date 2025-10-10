import React, { useState } from 'react';
import { 
  FaUser, 
  FaSignOutAlt, 
  FaShoppingCart, 
  FaCog, 
  FaUsers, 
  FaBox, 
  FaBars, 
  FaTimes,
  FaHeart,
  FaSearch,
  FaTag,
  FaLaptop,
  FaDesktop,
  FaMobileAlt,
  FaHeadphones,
  FaKeyboard,
  FaMouse,
  FaCamera,
  FaGamepad,
  FaWifi,
  FaHdd,
  FaMicrochip,
  FaPlug,
  FaPrint
} from 'react-icons/fa';

// Mock Button component since it's not provided
const Button = ({ variant = 'primary', size = 'md', fullWidth = false, onClick, children, ...props }) => {
  const baseClasses = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2';
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500'
  };
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2'
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const Header = () => {
  // Mock data for demonstration - replace with actual store hooks
  const user = { username: 'TechUser' };
  const isAuthenticated = true;
  const isAdmin = false;
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    console.log('Logout clicked');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Search for:', searchQuery.trim());
      setSearchQuery('');
    }
  };

  const handleNavigation = (path) => {
    console.log('Navigate to:', path);
    setIsMobileMenuOpen(false);
  };

  // Navigation items for different user types
  const getNavItems = () => {
    const commonItems = [
      { path: '/', label: 'Home' },
      { path: '/categories', label: 'Categories' },
      { path: '/deals', label: 'Tech Deals', icon: <FaTag className="mr-1 text-red-500" /> },
      { path: '/new-arrivals', label: 'Latest Tech' },
      { path: '/reviews', label: 'Reviews' },
      { path: '/support', label: 'Tech Support' },
    ];

    if (!isAuthenticated) {
      return commonItems;
    }

    const authenticatedItems = [
      ...commonItems,
      { path: '/account', label: 'My Account' },
      { path: '/orders', label: 'My Orders' },
    ];

    if (isAdmin) {
      return [
        ...authenticatedItems,
        { path: '/admin', label: 'Admin', icon: <FaCog className="mr-1" /> },
        { path: '/admin/users', label: 'Users', icon: <FaUsers className="mr-1" /> },
        { path: '/admin/products', label: 'Inventory', icon: <FaBox className="mr-1" /> },
      ];
    }

    return authenticatedItems;
  };

  const navItems = getNavItems();

  // Tech category dropdown items
  const categoryItems = [
    { path: '/category/laptops', label: 'Laptops', icon: <FaLaptop /> },
    { path: '/category/desktops', label: 'Desktop PCs', icon: <FaDesktop /> },
    { path: '/category/components', label: 'Components', icon: <FaMicrochip /> },
    { path: '/category/monitors', label: 'Monitors & Displays', icon: <FaDesktop /> },
    { path: '/category/peripherals', label: 'Keyboards & Mice', icon: <FaKeyboard /> },
    { path: '/category/audio', label: 'Audio & Headphones', icon: <FaHeadphones /> },
    { path: '/category/mobile', label: 'Mobile & Tablets', icon: <FaMobileAlt /> },
    { path: '/category/gaming', label: 'Gaming Gear', icon: <FaGamepad /> },
    { path: '/category/networking', label: 'Networking', icon: <FaWifi /> },
    { path: '/category/storage', label: 'Storage', icon: <FaHdd /> },
    { path: '/category/accessories', label: 'Cables & Accessories', icon: <FaPlug /> },
    { path: '/category/printers', label: 'Printers & Scanners', icon: <FaPrint /> },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleNavigation('/')}>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <FaMicrochip className="text-white text-xl" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              TechHub
            </span>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="w-full relative">
              <input
                type="text"
                placeholder="Search laptops, components, accessories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-blue-600 transition-colors"
              >
                <FaSearch />
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navItems.slice(0, 4).map((item) => (
              <div
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium flex items-center relative group cursor-pointer"
              >
                {item.icon && <span className="mr-1">{item.icon}</span>}
                {item.label}
                
                {/* Category dropdown */}
                {item.label === 'Categories' && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-200 grid grid-cols-1 gap-1">
                    {categoryItems.map((category) => (
                      <div
                        key={category.path}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNavigation(category.path);
                        }}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors flex items-center cursor-pointer"
                      >
                        <span className="mr-3 text-blue-600 w-5">{category.icon}</span>
                        <span className="text-sm">{category.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* User Actions - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Wishlist */}
                <div
                  onClick={() => handleNavigation('/wishlist')}
                  className="p-2 text-gray-700 hover:text-red-500 transition-colors relative cursor-pointer"
                  title="Wishlist"
                >
                  <FaHeart className="text-xl" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    5
                  </span>
                </div>

                {/* Shopping Cart */}
                <div
                  onClick={() => handleNavigation('/cart')}
                  className="p-2 text-gray-700 hover:text-blue-600 transition-colors relative cursor-pointer"
                  title="Shopping Cart"
                >
                  <FaShoppingCart className="text-xl" />
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    3
                  </span>
                </div>

                {/* User Dropdown */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center">
                      <FaUser className="text-blue-600" />
                    </div>
                    <span className="font-medium">{user?.username}</span>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-200">
                    <div
                      onClick={() => handleNavigation('/account')}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      My Account
                    </div>
                    <div
                      onClick={() => handleNavigation('/orders')}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      My Orders
                    </div>
                    <div
                      onClick={() => handleNavigation('/wishlist')}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      Wishlist
                    </div>
                    <div
                      onClick={() => handleNavigation('/build-pc')}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      PC Builder
                    </div>
                    {isAdmin && (
                      <>
                        <hr className="my-2" />
                        <div
                          onClick={() => handleNavigation('/admin')}
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          Admin Panel
                        </div>
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
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleNavigation('/login')}
                >
                  Login
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleNavigation('/register')}
                >
                  Register
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center space-x-2">
            {isAuthenticated && (
              <div 
                onClick={() => handleNavigation('/cart')} 
                className="p-2 text-gray-700 relative cursor-pointer"
              >
                <FaShoppingCart className="text-xl" />
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  3
                </span>
              </div>
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
          <div className="relative">
            <input
              type="text"
              placeholder="Search tech products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
              className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-blue-600 transition-colors"
            >
              <FaSearch />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <div
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className="text-gray-700 hover:text-blue-600 transition-colors duration-200 py-2 px-4 font-medium flex items-center cursor-pointer"
                >
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.label}
                </div>
              ))}

              {/* Categories in mobile */}
              <div className="px-4 py-2">
                <div className="text-gray-500 font-semibold mb-2">Tech Categories</div>
                <div className="grid grid-cols-1 gap-1">
                  {categoryItems.map((category) => (
                    <div
                      key={category.path}
                      onClick={() => handleNavigation(category.path)}
                      className="block py-2 pl-4 text-gray-600 hover:text-blue-600 transition-colors flex items-center cursor-pointer"
                    >
                      <span className="mr-3 text-blue-600 w-5">{category.icon}</span>
                      <span className="text-sm">{category.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {isAuthenticated ? (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="px-4 py-2 text-sm text-gray-500">
                    Signed in as {user?.username}
                  </div>
                  <div
                    onClick={() => handleNavigation('/account')}
                    className="block py-2 px-4 text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    My Account
                  </div>
                  <div
                    onClick={() => handleNavigation('/orders')}
                    className="block py-2 px-4 text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    My Orders
                  </div>
                  <div
                    onClick={() => handleNavigation('/wishlist')}
                    className="block py-2 px-4 text-gray-700 hover:text-blue-600 transition-colors flex items-center cursor-pointer"
                  >
                    <FaHeart className="mr-2 text-red-500" />
                    Wishlist
                  </div>
                  <div
                    onClick={() => handleNavigation('/cart')}
                    className="block py-2 px-4 text-gray-700 hover:text-blue-600 transition-colors flex items-center cursor-pointer"
                  >
                    <FaShoppingCart className="mr-2" />
                    Shopping Cart
                  </div>
                  <div
                    onClick={() => handleNavigation('/build-pc')}
                    className="block py-2 px-4 text-gray-700 hover:text-blue-600 transition-colors flex items-center cursor-pointer"
                  >
                    <FaMicrochip className="mr-2" />
                    PC Builder
                  </div>
                  {isAdmin && (
                    <>
                      <hr className="my-2 mx-4" />
                      <div
                        onClick={() => handleNavigation('/admin')}
                        className="block py-2 px-4 text-gray-700 hover:text-blue-600 transition-colors flex items-center cursor-pointer"
                      >
                        <FaCog className="mr-2" />
                        Admin Panel
                      </div>
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
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => handleNavigation('/login')}
                  >
                    Login
                  </Button>
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => handleNavigation('/register')}
                  >
                    Register
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;