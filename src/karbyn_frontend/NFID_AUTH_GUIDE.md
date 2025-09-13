# 🔐 NFID Authentication Integration for Karbyn

## Overview

This implementation provides a comprehensive authentication system for the Karbyn carbon credit platform using NFID (NFinity ID), which enables seamless Google authentication while maintaining Web3 security and privacy. The system supports multiple authentication methods, user role management, and persistent login state.

## 🌟 Key Features

### Authentication Methods
- **🔍 Google Sign-In**: Easy onboarding with familiar Google authentication
- **🔐 NFID Internet Identity**: Secure anonymous authentication through NFID
- **🆔 Internet Identity**: Traditional IC authentication as fallback
- **🔌 Plug Wallet**: Integration for advanced Web3 users

### User Role Management
- **👤 Individual**: Personal carbon tracking and trading
- **🌱 NGO**: Large-scale environmental projects
- **🏢 Corporate**: Purchasing carbon credits for sustainability
- **⚙️ Admin**: Platform administration (reserved for future use)

### Advanced Features
- **Persistent Login**: Remember user preferences and auto-login
- **Error Handling**: Comprehensive error states and recovery
- **Loading States**: Smooth UX during authentication flows
- **Protected Routes**: Role-based access control
- **Profile Management**: Update user information and preferences

## 📁 Project Structure

```
src/
├── contexts/
│   └── NFIDAuthContext.jsx          # Main authentication context
├── components/
│   └── auth/
│       ├── EnhancedAuthModal.jsx    # Authentication modal with all options
│       ├── AuthButton.jsx           # Smart authentication button
│       ├── ProtectedRoute.jsx       # Route protection component
│       └── RoleSelectionModal.jsx   # User role selection interface
├── pages/
│   └── LandingPage.jsx              # Updated landing page with auth
└── Routes.jsx                       # Protected routing configuration
```

## 🚀 Quick Setup

### 1. Install Dependencies

The NFID IdentityKit package is already installed in the project:

```bash
npm install @nfid/identitykit
```

### 2. Update App.jsx

The app is already configured to use the NFID authentication context:

```jsx
import { NFIDAuthProvider } from "./contexts/NFIDAuthContext";

function App() {
  return (
    <NFIDAuthProvider>
      <Routes />
    </NFIDAuthProvider>
  );
}
```

### 3. Environment Configuration

Add these environment variables to your `.env` file:

```bash
# Backend canister ID
VITE_CANISTER_ID_KARBYN_BACKEND=your_backend_canister_id

# Development mode (automatically detected)
VITE_NODE_ENV=development
```

## 🔧 Usage Examples

### Basic Authentication Hook

```jsx
import { useNFIDAuth } from '../contexts/NFIDAuthContext';

function MyComponent() {
  const { 
    isAuthenticated, 
    user, 
    loginWithNFIDGoogle,
    logout 
  } = useNFIDAuth();

  if (!isAuthenticated) {
    return <button onClick={loginWithNFIDGoogle}>Sign in with Google</button>;
  }

  return (
    <div>
      <p>Welcome, {user.name}!</p>
      <button onClick={logout}>Sign Out</button>
    </div>
  );
}
```

### Using the Auth Button Component

```jsx
import AuthButton from '../components/auth/AuthButton';

function Navigation() {
  return (
    <nav>
      <div>Karbyn</div>
      <AuthButton 
        variant="primary" 
        showDropdown={true} 
        fullWidth={false}
      />
    </nav>
  );
}
```

### Protected Routes

```jsx
import ProtectedRoute, { NGORoute, CorporateRoute } from '../components/auth/ProtectedRoute';

// Basic protection (any authenticated user)
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>

// NGO-only route
<Route 
  path="/submit-project" 
  element={
    <NGORoute>
      <SubmitProject />
    </NGORoute>
  } 
/>

// Multiple roles allowed
<Route 
  path="/projects" 
  element={
    <ProtectedRoute requiredRoles={['NGO', 'Corporate']}>
      <ProjectsListing />
    </ProtectedRoute>
  } 
/>
```

### Manual Authentication Modal

```jsx
import { useState } from 'react';
import EnhancedAuthModal from '../components/auth/EnhancedAuthModal';

function LoginPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <button onClick={() => setShowModal(true)}>
        Sign In
      </button>
      
      <EnhancedAuthModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        defaultMethod="nfid-google"
      />
    </div>
  );
}
```

## 🎯 Authentication Flow

### 1. User Visits Landing Page
- Sees sign-in options with Google as recommended method
- Can choose from multiple authentication providers

### 2. Authentication Process
- **Google**: Redirects to Google OAuth via NFID
- **Internet Identity**: Traditional IC authentication
- **Plug Wallet**: Browser extension connection

### 3. Role Selection (if needed)
- New users select their role (Individual, NGO, Corporate)
- Additional information collected based on role

### 4. Dashboard Access
- Authenticated users access role-appropriate features
- Persistent login remembers user preferences

## 🔐 Security Features

### Privacy Protection
- NFID ensures user privacy while enabling Google auth
- No personal data stored on blockchain without consent
- Secure identity derivation for IC integration

### Authentication State Management
- Secure token handling
- Automatic session renewal
- Protected local storage usage

### Error Handling
- Graceful fallbacks for failed authentication
- User-friendly error messages
- Automatic recovery mechanisms

## 🎨 UI/UX Features

### Responsive Design
- Mobile-first approach
- Touch-friendly interactions
- Accessible color schemes

### Animation & Feedback
- Smooth transitions with Framer Motion
- Loading states for all operations
- Success/error visual feedback

### User Experience
- One-click Google sign-in
- Remember login preferences
- Quick account switching

## 🧪 Testing

### Manual Testing Steps

1. **Test Google Authentication**:
   ```bash
   npm run dev
   # Visit http://localhost:3000
   # Click "Sign in with Google"
   # Complete Google OAuth flow
   # Verify successful login
   ```

2. **Test Role Selection**:
   ```bash
   # Sign in as new user
   # Verify role selection modal appears
   # Test each role option
   # Verify appropriate features are shown
   ```

3. **Test Persistent Login**:
   ```bash
   # Sign in with "Remember me" checked
   # Close browser
   # Reopen and verify auto-login
   ```

4. **Test Protected Routes**:
   ```bash
   # Try accessing /dashboard without auth
   # Verify redirect to authentication
   # Sign in and verify access granted
   ```

## 🚨 Error Handling

### Common Issues & Solutions

**NFID Not Loading**:
```javascript
// Check console for NFID initialization errors
// Verify internet connection
// Check if ad blockers are interfering
```

**Google Auth Failing**:
```javascript
// Verify Google account permissions
// Check for popup blockers
// Clear browser cache if needed
```

**Plug Wallet Issues**:
```javascript
// Install Plug wallet extension
// Enable in browser extensions
// Grant necessary permissions
```

## 📊 Performance Optimizations

### Lazy Loading
- Authentication components loaded on demand
- Reduced initial bundle size
- Faster page load times

### Caching Strategy
- User preferences cached locally
- Identity information cached securely
- Network requests minimized

### Bundle Optimization
- NFID components tree-shaken
- Unused authentication methods excluded
- Dynamic imports for better performance

## 🔄 Migration Guide

### From SimpleAuthContext

If you're migrating from the old authentication system:

1. Replace `useAuth()` with `useNFIDAuth()`
2. Update route protection to use `ProtectedRoute`
3. Replace login components with `AuthButton`
4. Update environment variables

### API Changes

```jsx
// Old
const { isAuthenticated, loginWithInternetIdentity } = useAuth();

// New
const { isAuthenticated, loginWithNFIDGoogle } = useNFIDAuth();
```

## 🤝 Contributing

When contributing to the authentication system:

1. Ensure all auth methods are tested
2. Update TypeScript definitions if needed
3. Test on both local and IC networks
4. Verify mobile responsiveness
5. Check accessibility compliance

## 📝 Environment Variables

```bash
# Required
VITE_CANISTER_ID_KARBYN_BACKEND=your_backend_canister_id

# Optional
VITE_NODE_ENV=development
VITE_NFID_ORIGIN=https://nfid.one
```

## 🔮 Future Enhancements

- **Two-Factor Authentication**: Additional security layer
- **Social Login Expansion**: Twitter, Discord, LinkedIn
- **Enterprise SSO**: SAML/OAuth2 for corporate users
- **Biometric Authentication**: Face ID, fingerprint support
- **Multi-Device Sync**: Cross-device authentication state

---

## 📞 Support

For authentication-related issues:
1. Check the browser console for errors
2. Verify network connectivity
3. Ensure browser compatibility
4. Check for ad/popup blockers
5. Contact the development team

**Built with ❤️ for the Karbyn community**
