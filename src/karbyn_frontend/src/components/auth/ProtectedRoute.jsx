import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSimpleNFIDAuth } from '../../contexts/SimpleNFIDAuthContext';
import EnhancedAuthModal from './EnhancedAuthModal';
import RoleSelectionModal from './RoleSelectionModal';
import { motion } from 'framer-motion';

const ProtectedRoute = ({ 
  children, 
  requiresAuth = true, 
  requiredRoles = [], 
  redirectTo = '/login',
  fallback = null 
}) => {
  const { 
    isAuthenticated, 
    user, 
    isLoading, 
    detectUserRole,
    USER_ROLES 
  } = useSimpleNFIDAuth();
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const location = useLocation();

  // Check if user needs to select a role
  const needsRoleSelection = isAuthenticated && user && (!user.role || user.role === USER_ROLES.INDIVIDUAL) && requiredRoles.length > 0;

  // Check if user has required role
  const hasRequiredRole = () => {
    if (!requiredRoles.length) return true;
    if (!user || !user.role) return false;
    
    const userRole = typeof user.role === 'string' ? user.role : detectUserRole(user.role);
    return requiredRoles.includes(userRole);
  };

  useEffect(() => {
    // Show auth modal if not authenticated and auth is required
    if (requiresAuth && !isAuthenticated && !isLoading) {
      setShowAuthModal(true);
    }
    
    // Show role selection if authenticated but role is needed
    if (needsRoleSelection) {
      setShowRoleSelection(true);
    }
  }, [isAuthenticated, isLoading, requiresAuth, needsRoleSelection]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading...</h3>
          <p className="text-gray-600">Please wait while we verify your authentication</p>
        </motion.div>
      </div>
    );
  }

  // Not authenticated and auth is required
  if (requiresAuth && !isAuthenticated) {
    return (
      <>
        {fallback || (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-md mx-auto p-8"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
              <p className="text-gray-600 mb-6">
                Please sign in to access this page and continue using Karbyn.
              </p>
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Sign In to Continue
              </button>
            </motion.div>
          </div>
        )}
        
        <EnhancedAuthModal
          isOpen={showAuthModal}
          onClose={() => {
            setShowAuthModal(false);
            // Redirect to login page if modal is closed without authentication
            if (location.pathname !== redirectTo) {
              window.location.href = redirectTo;
            }
          }}
        />
      </>
    );
  }

  // Authenticated but needs role selection
  if (needsRoleSelection) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto p-8"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Complete Your Profile</h2>
            <p className="text-gray-600 mb-6">
              Please select your role to customize your Karbyn experience and access the features you need.
            </p>
            <button
              onClick={() => setShowRoleSelection(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Select Your Role
            </button>
          </motion.div>
        </div>
        
        <RoleSelectionModal
          isOpen={showRoleSelection}
          onClose={() => setShowRoleSelection(false)}
          onRoleSelected={(role, info) => {
            setShowRoleSelection(false);
            // Refresh the page to update the user state
            window.location.reload();
          }}
        />
      </>
    );
  }

  // Authenticated but doesn't have required role
  if (requiresAuth && isAuthenticated && requiredRoles.length > 0 && !hasRequiredRole()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Restricted</h2>
          <p className="text-gray-600 mb-6">
            This page is restricted to {requiredRoles.join(', ')} accounts. 
            Your current role is {typeof user.role === 'string' ? user.role : detectUserRole(user.role)}.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.history.back()}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Go Back
            </button>
            <a
              href="/dashboard"
              className="inline-block w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Go to Dashboard
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  // All checks passed, render the protected content
  return <>{children}</>;
};

// Higher-order component for easier usage
export const withAuth = (Component, options = {}) => {
  return (props) => (
    <ProtectedRoute {...options}>
      <Component {...props} />
    </ProtectedRoute>
  );
};

// Specific role-based route components
export const IndividualRoute = ({ children, ...props }) => (
  <ProtectedRoute requiredRoles={['Individual']} {...props}>
    {children}
  </ProtectedRoute>
);

export const NGORoute = ({ children, ...props }) => (
  <ProtectedRoute requiredRoles={['NGO']} {...props}>
    {children}
  </ProtectedRoute>
);

export const CorporateRoute = ({ children, ...props }) => (
  <ProtectedRoute requiredRoles={['Corporate']} {...props}>
    {children}
  </ProtectedRoute>
);

export const AdminRoute = ({ children, ...props }) => (
  <ProtectedRoute requiredRoles={['Admin']} {...props}>
    {children}
  </ProtectedRoute>
);

export default ProtectedRoute;
