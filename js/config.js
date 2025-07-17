// Configuration file for API endpoints
// This allows easy switching between development and production environments

const config = {
<<<<<<< HEAD:js/config.js
  // API Base URL - your actual Render backend URL
  API_BASE_URL: 'https://csmr-backend.onrender.com/api',
  
  // Alternative: Use environment detection
  // API_BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
  //   ? 'http://localhost:5000/api' 
  //   : 'https://your-render-backend-url.onrender.com/api',
=======
  // API Base URL - Use environment detection for deployment
  API_BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:5000/api' 
    : 'https://your-azure-app-service-url.azurewebsites.net/api',
>>>>>>> 1c050d7 (Frontend deployment readiness, login fixes, new documentation, and missing pages/scripts added):frontend/js/config.js
  
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