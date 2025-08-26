// Network error handler to prevent CORS issues
export const handleNetworkError = (error) => {
  console.warn('Network error handled:', error.message);
  
  // Check if it's a CORS or localhost:5000 related error
  if (error.message.includes('localhost:5000') || 
      error.message.includes('CORS') || 
      error.message.includes('Cross-Origin')) {
    
    // Clear any cached requests or service workers
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          registration.unregister();
        });
      });
    }
    
    // Clear localStorage and sessionStorage related to problematic requests
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('5000') || key.includes('api/v2'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    console.log('Cleared problematic cached data');
    return null;
  }
  
  throw error;
};

// Wrapper for fetch requests with error handling
export const safeFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    return response;
  } catch (error) {
    return handleNetworkError(error);
  }
};

// Initialize error handlers when the app loads
export const initializeErrorHandlers = () => {
  // Add global error handler for unhandled promises
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && event.reason.message) {
      const message = event.reason.message;
      if (message.includes('localhost:5000') || 
          message.includes('CORS') || 
          message.includes('Cross-Origin')) {
        event.preventDefault();
        console.warn('Prevented CORS error from propagating:', message);
      }
    }
  });
  
  // Add global fetch wrapper to catch problematic requests
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    const [url] = args;
    
    // Block requests to localhost:5000
    if (typeof url === 'string' && url.includes('localhost:5000')) {
      console.warn('Blocked problematic request to:', url);
      return Promise.reject(new Error('Blocked localhost:5000 request'));
    }
    
    try {
      return await originalFetch.apply(window, args);
    } catch (error) {
      return handleNetworkError(error);
    }
  };
  
  console.log('Initialized network error handlers');
};
