# Deployment Setup Guide

## Admin Panel Configuration

To fix the admin panel issues, you need to update the following configuration files:

### 1. Update Frontend Configuration

**File: `frontend/js/config.js`**

Replace the placeholder URL with your actual Render backend URL:

```javascript
const config = {
  // Your actual Render backend URL
  API_BASE_URL: 'https://csmr-backend.onrender.com/api',
  
  // The rest will be auto-detected
  FRONTEND_URL: window.location.origin,
  isDevelopment: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
  isProduction: window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
};
```

### 2. Update Backend CORS Configuration

**File: `backend/server.js`**

Replace the placeholder with your actual Vercel frontend URL:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:8080',
    'http://127.0.0.1:8080',
    'http://localhost:8000',
    'http://127.0.0.1:8000',
    // Your actual Vercel frontend URL
    'https://csmr-frontend.vercel.app',
    // Allow all Vercel domains (for development)
    /\.vercel\.app$/
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));
```

### 3. Steps to Complete Setup

1. **Get your Render backend URL**:
   - Go to your Render dashboard
   - Find your backend service
   - Copy the URL (e.g., `https://your-app-name.onrender.com`)

2. **Get your Vercel frontend URL**:
   - Go to your Vercel dashboard
   - Find your frontend project
   - Copy the URL (e.g., `https://your-app-name.vercel.app`)

3. **Update the configuration files**:
   - Replace `your-actual-render-backend-url.onrender.com` with your actual Render URL
   - Replace `your-actual-vercel-frontend-url.vercel.app` with your actual Vercel URL

4. **Redeploy both frontend and backend**:
   - Push the changes to your Git repositories
   - Both Vercel and Render will automatically redeploy

### 4. Test the Admin Panel

1. Go to your Vercel frontend URL
2. Navigate to `/admin-dashboard.html`
3. Try to login with the default admin credentials:
   - Email: `admin@csmr.org.in`
   - Password: `Admin@123`

### 5. Common Issues and Solutions

**Issue: CORS errors in browser console**
- Solution: Make sure your Vercel URL is correctly added to the CORS configuration in `backend/server.js`

**Issue: API calls failing**
- Solution: Verify that the `API_BASE_URL` in `frontend/js/config.js` points to your correct Render backend URL

**Issue: Admin panel not loading**
- Solution: Check that `config.js` is loaded before `admin-dashboard.js` in the HTML file

### 6. Environment Variables (Optional)

For better security, you can use environment variables:

**Frontend (Vercel)**:
- Add environment variable: `REACT_APP_API_URL` or `VITE_API_URL` (depending on your build tool)

**Backend (Render)**:
- Add environment variable: `FRONTEND_URL` with your Vercel URL

Then update the config files to use these environment variables instead of hardcoded URLs.

### 7. Security Notes

- Change the default admin password after first login
- Consider implementing rate limiting for admin endpoints
- Use HTTPS for all production communications
- Regularly update dependencies

## Default Admin Credentials

- **Email**: `admin@csmr.org.in`
- **Password**: `Admin@123`

**Important**: Change these credentials after your first login! 