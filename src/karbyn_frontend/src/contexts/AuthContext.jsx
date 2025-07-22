import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [identity, setIdentity] = useState(null);
  const [principal, setPrincipal] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize authentication state from localStorage on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedAuth = localStorage.getItem('karbyn_auth');
        if (storedAuth) {
          const authData = JSON.parse(storedAuth);
          setIsAuthenticated(authData.isAuthenticated);
          setPrincipal(authData.principal);
          setIdentity({ getPrincipal: () => ({ toString: () => authData.principal }) });
        }
      } catch (error) {
        console.error('Error loading auth state:', error);
        localStorage.removeItem('karbyn_auth');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Simplified demo authentication - replace with actual Internet Identity later
  const login = async () => {
    setLoading(true);
    
    try {
      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful authentication
      const mockPrincipal = 'rdmx6-jaaaa-aaaah-qcaiq-cai';
      
      // Update state
      setIsAuthenticated(true);
      setPrincipal(mockPrincipal);
      setIdentity({ getPrincipal: () => ({ toString: () => mockPrincipal }) });
      
      // Persist to localStorage
      const authData = {
        isAuthenticated: true,
        principal: mockPrincipal,
        timestamp: Date.now()
      };
      localStorage.setItem('karbyn_auth', JSON.stringify(authData));
      
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    
    try {
      // Simulate logout delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Clear state
      setIsAuthenticated(false);
      setIdentity(null);
      setPrincipal(null);
      
      // Clear localStorage
      localStorage.removeItem('karbyn_auth');
      
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    isAuthenticated,
    identity,
    principal,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
