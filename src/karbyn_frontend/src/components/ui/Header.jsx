import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../AppIcon';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, logout, login, loading, principal } = useAuth();
  const location = useLocation();

  const publicNavigationItems = [
    { label: 'Home', path: '/', icon: 'Home' },
    { label: 'How It Works', path: '/how-it-works', icon: 'Info' },
    { label: 'Projects', path: '/projects-listing', icon: 'TreePine' },
    { label: 'Impact', path: '/impact-dashboard', icon: 'BarChart3' }
  ];

  const authenticatedNavigationItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
    { label: 'Activities', path: '/activities/submit', icon: 'Plus' },
    { label: 'Marketplace', path: '/marketplace', icon: 'ShoppingBag' },
    { label: 'My NFTs', path: '/marketplace/my-nfts', icon: 'Award' },
    { label: 'Community', path: '/community', icon: 'Users' },
    { label: 'Business', path: '/business/partnership', icon: 'Building2' },
    { label: 'Submit Project', path: '/submit-project', icon: 'TreePine', isAction: true }
  ];

  const navigationItems = isAuthenticated ? authenticatedNavigationItems : publicNavigationItems;

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
    return location.pathname === path;
  };

  const Logo = () => (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
        <Icon name="Leaf" size={20} color="white" />
      </div>
      <span className="text-xl font-semibold text-foreground">Karbyn</span>
    </div>
  );

  return (
    <>
      <header 
        className={`sticky top-0 z-1000 w-full transition-all duration-200 ${
          isScrolled 
            ? 'bg-background/95 backdrop-blur-sm organic-shadow-subtle' 
            : 'bg-background'
        }`}
      >
        <div className="w-full px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/landing-page" className="flex-shrink-0">
              <Logo />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <nav className="flex items-center space-x-6">
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium organic-transition ${
                      isActivePath(item.path)
                        ? 'text-primary bg-primary/10'
                        : item.isAction
                        ? 'text-accent-foreground bg-accent hover:bg-accent/90'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon name={item.icon} size={16} />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
              
              {/* Authentication Buttons */}
              <div className="flex items-center space-x-3 ml-6 pl-6 border-l border-border">
                {isAuthenticated ? (
                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-muted-foreground">
                      {principal?.slice(0, 6)}...{principal?.slice(-4)}
                    </span>
                    <button
                      onClick={logout}
                      disabled={loading}
                      className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground organic-transition"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={login}
                    disabled={loading}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 organic-transition disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        <span>Connecting...</span>
                      </>
                    ) : (
                      <>
                        <Icon name="LogIn" size={16} />
                        <span>Sign In</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted organic-transition"
              aria-label="Toggle mobile menu"
            >
              <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-1100 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={closeMobileMenu}
          />
          
          {/* Menu Panel */}
          <div className="fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-card organic-shadow-prominent">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <Logo />
                <button
                  onClick={closeMobileMenu}
                  className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted organic-transition"
                  aria-label="Close menu"
                >
                  <Icon name="X" size={24} />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 px-6 py-6">
                <div className="space-y-2">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={closeMobileMenu}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium organic-transition ${
                        isActivePath(item.path)
                          ? 'text-primary bg-primary/10'
                          : item.isAction
                          ? 'text-accent-foreground bg-accent hover:bg-accent/90'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon name={item.icon} size={20} />
                      <span>{item.label}</span>
                    </Link>
                  ))}
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