import React from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Shield, 
  Truck, 
  RotateCcw,
  CreditCard
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main footer content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Company info */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              ShopNow
            </h3>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Your trusted online shopping destination with quality products and exceptional service.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors duration-300" />
              <Twitter className="w-5 h-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors duration-300" />
              <Instagram className="w-5 h-5 text-gray-400 hover:text-pink-400 cursor-pointer transition-colors duration-300" />
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['About Us', 'Contact', 'FAQ', 'Size Guide', 'Blog'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer service */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              {['Track Order', 'Returns', 'Shipping Info', 'Privacy Policy', 'Terms'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-blue-400" />
                <span className="text-gray-400 text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-blue-400" />
                <span className="text-gray-400 text-sm">help@shopnow.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-blue-400 mt-0.5" />
                <span className="text-gray-400 text-sm">123 Commerce St<br />New York, NY 10001</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features banner */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center">
                <Truck className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <div className="text-sm font-semibold">Free Shipping</div>
                <div className="text-xs text-gray-400">Orders over $50</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center">
                <RotateCcw className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-sm font-semibold">Easy Returns</div>
                <div className="text-xs text-gray-400">30-day policy</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-500 bg-opacity-20 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className="text-sm font-semibold">Secure Payment</div>
                <div className="text-xs text-gray-400">SSL protected</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-500 bg-opacity-20 rounded-full flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <div className="text-sm font-semibold">Multiple Payment</div>
                <div className="text-xs text-gray-400">All major cards</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <div className="text-sm text-gray-400">
              © 2025 ShopNow. All rights reserved.
            </div>
           
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;