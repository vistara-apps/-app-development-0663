import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, Menu, X, User, LogOut, Settings, CreditCard } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout, subscription } = useAuth();
  const location = useLocation();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isProfileOpen) setIsProfileOpen(false);
  };
  
  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    if (isMenuOpen) setIsMenuOpen(false);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  return (
    <header className="bg-black/20 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-1.5 rounded-md">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl">MemeMaster AI</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link
              to="/"
              className={`text-sm font-medium ${
                isActive('/') ? 'text-white' : 'text-white/70 hover:text-white'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/generator"
              className={`text-sm font-medium ${
                isActive('/generator') ? 'text-white' : 'text-white/70 hover:text-white'
              }`}
            >
              Meme Generator
            </Link>
            <Link
              to="/subscription"
              className={`text-sm font-medium ${
                isActive('/subscription') ? 'text-white' : 'text-white/70 hover:text-white'
              }`}
            >
              Subscription
            </Link>
          </nav>
          
          {/* User Menu (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {subscription && subscription.tier !== 'free' && (
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {subscription.tier.toUpperCase()}
              </div>
            )}
            
            <div className="relative">
              <button
                onClick={toggleProfile}
                className="flex items-center space-x-2 text-white/80 hover:text-white focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium">{user?.email?.split('@')[0]}</span>
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-lg py-1 z-10 border border-white/10">
                  <div className="px-4 py-2 border-b border-white/10">
                    <p className="text-sm text-white font-medium truncate">{user?.email}</p>
                    <p className="text-xs text-white/60">
                      {subscription?.tier ? `${subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1)} Plan` : 'Free Plan'}
                    </p>
                  </div>
                  <Link
                    to="/subscription"
                    className="block px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4" />
                      <span>Subscription</span>
                    </div>
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <div className="flex items-center space-x-2">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5"
                  >
                    <div className="flex items-center space-x-2">
                      <LogOut className="h-4 w-4" />
                      <span>Log Out</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white/80 hover:text-white focus:outline-none"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/20 backdrop-blur-lg border-t border-white/10">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-3">
              <Link
                to="/"
                className={`text-sm font-medium ${
                  isActive('/') ? 'text-white' : 'text-white/70 hover:text-white'
                }`}
                onClick={toggleMenu}
              >
                Dashboard
              </Link>
              <Link
                to="/generator"
                className={`text-sm font-medium ${
                  isActive('/generator') ? 'text-white' : 'text-white/70 hover:text-white'
                }`}
                onClick={toggleMenu}
              >
                Meme Generator
              </Link>
              <Link
                to="/subscription"
                className={`text-sm font-medium ${
                  isActive('/subscription') ? 'text-white' : 'text-white/70 hover:text-white'
                }`}
                onClick={toggleMenu}
              >
                Subscription
              </Link>
              <div className="pt-2 border-t border-white/10">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium truncate">{user?.email}</p>
                    <p className="text-xs text-white/60">
                      {subscription?.tier ? `${subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1)} Plan` : 'Free Plan'}
                    </p>
                  </div>
                </div>
                <Link
                  to="/settings"
                  className="flex items-center space-x-2 text-sm text-white/80 hover:text-white py-2"
                  onClick={toggleMenu}
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="flex items-center space-x-2 text-sm text-white/80 hover:text-white py-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

