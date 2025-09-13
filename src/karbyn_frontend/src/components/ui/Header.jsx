import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/SimpleAuthContext';
import Icon from '../AppIcon';
import AuthButton from '../AuthButton';
import UserStatus from '../UserStatus';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, logout, loading, principal } = useAuth();
  const location = useLocation();

  const publicNavigationItems = [
    { label: 'Home', path: '/', icon: 'Home' },
    { label: 'How It Works', path: '/how-it-works', icon: 'Info' },
    { label: 'Projects', path: '/projects', icon: 'Briefcase' },
    { label: 'Impact', path: '/impact', icon: 'Activity' }
  ];

  const authenticatedNavigationItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'BarChart3' },
    { label: 'Submit Project', path: '/submit-project', icon: 'Plus' },
    { label: 'Marketplace', path: '/marketplace', icon: 'ShoppingCart' },
    { label: 'Community', path: '/community', icon: 'Users' }
  ];

  const navigationItems = isAuthenticated 
    ? authenticatedNavigationItems 
    : publicNavigationItems;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm' 
          : 'bg-background border-b border-border'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group" onClick={closeMobileMenu}>
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <span className="text-white text-sm font-bold">K</span>
              </div>
              <span className="text-xl font-semibold text-foreground">Karbyn</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center">
              <nav className="flex items-center space-x-1 mr-6">
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActivePath(item.path)
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon name={item.icon} size={16} />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
              
              {/* Authentication Section */}
              <div className="flex items-center space-x-3 ml-6 pl-6 border-l border-border">
                {isAuthenticated ? (
                  <UserStatus />
                ) : (
                  <AuthButton />
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Toggle mobile menu"
            >
              <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={closeMobileMenu}></div>
          <div className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-background border-l border-border shadow-xl">
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <Link to="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">K</span>
                  </div>
                  <span className="text-xl font-semibold text-foreground">Karbyn</span>
                </Link>
                <button
                  onClick={closeMobileMenu}
                  className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  aria-label="Close menu"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 px-6 py-6 space-y-2 overflow-y-auto">
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeMobileMenu}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                      isActivePath(item.path)
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon name={item.icon} size={20} />
                    <span>{item.label}</span>
                  </Link>
                ))}

                {/* Mobile Authentication */}
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="px-4">
                    {isAuthenticated ? (
                      <div className="space-y-3">
                        <UserStatus />
                        <button
                          onClick={() => {
                            logout();
                            closeMobileMenu();
                          }}
                          className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-base font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
                        >
                          <Icon name="LogOut" size={20} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    ) : (
                      <AuthButton className="w-full justify-center" size="lg">
                        <Icon name="Shield" size={20} />
                        <span>Sign In</span>
                      </AuthButton>
                    )}
                  </div>
                </div>
              </nav>

              {/* Footer */}
              <div className="p-6 border-t border-border">
                <p className="text-sm text-muted-foreground text-center">
                  Decentralized Climate Action Platform
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
