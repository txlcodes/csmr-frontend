// Configuration file for API endpoints
// This allows easy switching between development and production environments

const config = {
  // API Base URL - Use environment detection for deployment
  API_BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:5000/api' 
    : 'https://csmr-backend.onrender.com/api',
  
  // Frontend URL for CORS
  FRONTEND_URL: window.location.origin,
  
  // Environment detection
  isDevelopment: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
  isProduction: window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1',
  
  // API endpoints
  endpoints: {
    articles: '/articles',
    auth: '/auth',
    users: '/users',
    submissions: '/submissions'
  },
  
  // Request timeout (in milliseconds)
  REQUEST_TIMEOUT: 10000,
  
  // Retry configuration
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = config;
} 