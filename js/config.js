// Configuration file for API endpoints
// This allows easy switching between development and production environments

const config = {
  // API Base URL - your actual Render backend URL
  API_BASE_URL: 'https://csmr-backend.onrender.com/api',
  
  // Alternative: Use environment detection
  // API_BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
  //   ? 'http://localhost:5000/api' 
  //   : 'https://your-render-backend-url.onrender.com/api',
  
  // Frontend URL for CORS
  FRONTEND_URL: window.location.origin,
  
  // Environment detection
  isDevelopment: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
  isProduction: window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = config;
} 