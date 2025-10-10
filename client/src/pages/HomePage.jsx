import React, { useState, useEffect } from 'react';
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
  FaChevronRight
} from 'react-icons/fa';

const HomePage = () => {
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [featuredProductIndex, setFeaturedProductIndex] = useState(0);

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
      cta: "Shop Gaming"
    },
    {
      id: 2,
      title: "Productivity Beast",
      subtitle: "M3 MacBook Pro",
      description: "Revolutionary performance for creators and professionals",
      price: "Starting at $1,999",
      image: "💻",
      bgGradient: "from-gray-700 to-gray-900",
      cta: "Explore MacBooks"
    },
    {
      id: 3,
      title: "Build Your Dream PC",
      subtitle: "Custom PC Components",
      description: "Premium parts, expert guidance, unbeatable prices",
      price: "Up to 30% Off",
      image: "🔧",
      bgGradient: "from-green-600 to-teal-600",
      cta: "Start Building"
    }
  ];

  // Featured products data
  const featuredProducts = [
    {
      id: 1,
      name: "ASUS ROG Strix RTX 4070",
      price: "$599.99",
      originalPrice: "$699.99",
      rating: 4.8,
      reviews: 256,
      image: "🎮",
      badge: "Best Seller",
      category: "Graphics Cards"
    },
    {
      id: 2,
      name: "Apple MacBook Air M3",
      price: "$1,299.99",
      originalPrice: null,
      rating: 4.9,
      reviews: 1024,
      image: "💻",
      badge: "New",
      category: "Laptops"
    },
    {
      id: 3,
      name: "Sony WH-1000XM5",
      price: "$329.99",
      originalPrice: "$399.99",
      rating: 4.7,
      reviews: 512,
      image: "🎧",
      badge: "Deal",
      category: "Audio"
    },
    {
      id: 4,
      name: "Logitech MX Master 3S",
      price: "$99.99",
      originalPrice: "$129.99",
      rating: 4.6,
      reviews: 789,
      image: "🖱️",
      badge: "Popular",
      category: "Peripherals"
    },
    {
      id: 5,
      name: "Samsung 980 Pro 2TB SSD",
      price: "$179.99",
      originalPrice: "$249.99",
      rating: 4.8,
      reviews: 445,
      image: "💾",
      badge: "Deal",
      category: "Storage"
    },
    {
      id: 6,
      name: "Dell UltraSharp 27\" 4K",
      price: "$449.99",
      originalPrice: "$599.99",
      rating: 4.7,
      reviews: 334,
      image: "🖥️",
      badge: "Sale",
      category: "Monitors"
    }
  ];

  // Categories data
  const categories = [
    { name: 'Gaming Laptops', icon: <FaLaptop />, count: '250+', color: 'bg-purple-500' },
    { name: 'Desktop PCs', icon: <FaDesktop />, count: '180+', color: 'bg-blue-500' },
    { name: 'Components', icon: <FaMicrochip />, count: '500+', color: 'bg-green-500' },
    { name: 'Monitors', icon: <FaDesktop />, count: '120+', color: 'bg-orange-500' },
    { name: 'Peripherals', icon: <FaKeyboard />, count: '300+', color: 'bg-red-500' },
    { name: 'Audio', icon: <FaHeadphones />, count: '150+', color: 'bg-pink-500' },
    { name: 'Mobile Tech', icon: <FaMobileAlt />, count: '200+', color: 'bg-indigo-500' },
    { name: 'Networking', icon: <FaWifi />, count: '80+', color: 'bg-teal-500' }
  ];

  // Auto-rotate hero slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextHeroSlide = () => {
    setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevHeroSlide = () => {
    setCurrentHeroSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleAddToCart = (productId) => {
    console.log('Add to cart:', productId);
  };

  const handleAddToWishlist = (productId) => {
    console.log('Add to wishlist:', productId);
  };

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
                    <button className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2">
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
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div 
                key={index}
                className="group cursor-pointer"
              >
                <div className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                  <div className={`${category.color} w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4`}>
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-gray-500 text-sm">{category.count} products</p>
                </div>
              </div>
            ))}
          </div>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div 
                key={product.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                {/* Product Badge */}
                <div className="relative">
                  <div className="aspect-square bg-gray-100 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-300">
                    {product.image}
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      product.badge === 'Best Seller' ? 'bg-blue-100 text-blue-800' :
                      product.badge === 'New' ? 'bg-green-100 text-green-800' :
                      product.badge === 'Deal' ? 'bg-red-100 text-red-800' :
                      product.badge === 'Popular' ? 'bg-purple-100 text-purple-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {product.badge}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleAddToWishlist(product.id)}
                      className="p-2 bg-white rounded-full shadow-md hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      <FaHeart />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="text-sm text-gray-500 mb-1">{product.category}</div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'} />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({product.reviews})</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl font-bold text-gray-900">{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(product.id)}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaShoppingCart />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2 mx-auto">
              View All Products <FaArrowRight />
            </button>
          </div>
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
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Shop Flash Sale
              </button>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur rounded-2xl p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <FaTag className="text-3xl text-green-400" />
                <h3 className="text-2xl font-bold">Build & Save</h3>
              </div>
              <p className="text-lg mb-6">Get 15% off when you buy 3+ PC components together!</p>
              <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Start Building
              </button>
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