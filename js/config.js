// Configuration file for API endpoints
// This allows easy switching between development and production environments

const config = {
  // API Base URL - Always use deployed backend
  API_BASE_URL: 'https://csmr-backend.onrender.com/api',
  
  // Frontend URL for CORS
  FRONTEND_URL: window.location.origin,
  
  // Environment detection
  isDevelopment: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
  isProduction: window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1',
  
  // API endpoints
  endpoints: {
    // Auth
    LOGIN: '/users/login',
    REGISTER: '/users',
    
    // Admin Panel
    ADMIN_DASHBOARD: '/admin/dashboard',
    ADMIN_USERS: '/admin/users',
    ADMIN_ARTICLES: '/admin/articles',
    ADMIN_PUBLICATIONS: '/admin/publications',
    ADMIN_REVIEWS: '/admin/reviews',
    ADMIN_NOTIFICATIONS: '/admin/notifications',
    
    // Public
    ARTICLES: '/articles',
    JOURNALS: '/journals',
    SUBMISSIONS: '/submissions'
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