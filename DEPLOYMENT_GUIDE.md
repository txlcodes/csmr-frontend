# CSMR Website Deployment Guide

## Overview
This guide provides step-by-step instructions for deploying the CSMR (Centre for Sustainability and Management Research) website to Azure App Service.

## Prerequisites
- Azure account with active subscription
- Node.js installed locally (for testing)
- Git installed
- Azure CLI (optional but recommended)

## Project Structure
```
ServiceSetu_w21 (2)/
├── backend/                 # Node.js/Express API
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   ├── config/             # Database configuration
│   ├── controllers/        # API controllers
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   └── middleware/         # Express middleware
├── frontend/               # Static HTML/CSS/JS files
│   ├── index.html          # Homepage
│   ├── css/                # Stylesheets
│   ├── js/                 # JavaScript files
│   ├── *.html              # Other pages
│   └── assets/             # Images and other assets
└── DEPLOYMENT_GUIDE.md     # This file
```

## Deployment Steps

### 1. Backend Deployment (Azure App Service)

#### Step 1: Prepare Backend for Deployment
1. Navigate to the backend directory:
   ```bash
   cd "ServiceSetu_w21 (2)/backend"
   ```

2. Ensure all dependencies are in package.json:
   ```bash
   npm install
   ```

3. Create a production environment file (`.env`):
   ```env
   NODE_ENV=production
   PORT=process.env.PORT
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

#### Step 2: Deploy to Azure App Service
1. **Create Azure App Service:**
   - Go to Azure Portal
   - Create a new App Service
   - Choose Node.js runtime
   - Select Basic or Standard plan (recommended: B1 or S1)
   - Choose your region

2. **Configure Environment Variables:**
   - In Azure Portal, go to your App Service
   - Navigate to Configuration > Application settings
   - Add the following environment variables:
     - `NODE_ENV`: `production`
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: Your JWT secret key

3. **Deploy Backend Code:**
   ```bash
   # Using Azure CLI
   az webapp up --name your-app-name --resource-group your-resource-group --runtime "NODE|18-lts"
   
   # Or using Git deployment
   az webapp deployment source config-local-git --name your-app-name --resource-group your-resource-group
   git remote add azure <git-url-from-azure>
   git push azure main
   ```

### 2. Frontend Deployment (Azure Static Web Apps)

#### Step 1: Prepare Frontend for Deployment
1. Update the API URL in `frontend/js/config.js`:
   ```javascript
   API_BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
     ? 'http://localhost:5000/api' 
     : 'https://your-azure-app-service-url.azurewebsites.net/api',
   ```

2. Replace `your-azure-app-service-url` with your actual Azure App Service URL.

#### Step 2: Deploy Frontend
1. **Create Azure Static Web App:**
   - Go to Azure Portal
   - Create a new Static Web App
   - Choose "Other" for build preset
   - Set build details:
     - Build Preset: Custom
     - App location: `/frontend`
     - API location: `/backend` (if using same repo)
     - Output location: `/`

2. **Deploy via GitHub Actions (Recommended):**
   - Connect your GitHub repository
   - Azure will create a GitHub Action workflow
   - Push your code to trigger deployment

3. **Manual Deployment:**
   ```bash
   # Using Azure CLI
   az staticwebapp create --name your-static-app-name --resource-group your-resource-group --source .
   ```

### 3. Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas Cluster:**
   - Go to MongoDB Atlas
   - Create a new cluster (M0 free tier is sufficient for testing)
   - Create a database user
   - Get your connection string

2. **Configure Network Access:**
   - Add your Azure App Service IP to MongoDB Atlas whitelist
   - Or allow access from anywhere (0.0.0.0/0) for development

3. **Update Connection String:**
   - Replace the placeholder in your Azure App Service environment variables

### 4. Custom Domain Setup

1. **Purchase Domain (if needed):**
   - Buy domain from Azure Domains or any registrar

2. **Configure DNS:**
   - Point your domain to Azure Static Web App
   - Add CNAME record pointing to your Static Web App URL

3. **SSL Certificate:**
   - Azure Static Web Apps provide free SSL certificates
   - Certificates are automatically provisioned

## Configuration Files

### Backend Configuration
- **server.js**: Main server file
- **config/db.js**: Database connection
- **package.json**: Dependencies and scripts

### Frontend Configuration
- **js/config.js**: API endpoints and environment detection
- **js/api-service.js**: API service functions
- **js/auth.js**: Authentication logic

## Environment Variables

### Backend (Azure App Service)
```env
NODE_ENV=production
PORT=process.env.PORT
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/csmr
JWT_SECRET=your_secure_jwt_secret
CORS_ORIGIN=https://your-static-web-app-url.azurestaticapps.net
```

### Frontend (Static Web App)
- No environment variables needed
- Configuration is handled in `js/config.js`

## Testing Deployment

### 1. Backend Testing
```bash
# Test API endpoints
curl https://your-app-service-url.azurewebsites.net/api/health
curl https://your-app-service-url.azurewebsites.net/api/journals
```

### 2. Frontend Testing
1. Visit your Static Web App URL
2. Test user registration and login
3. Test journal browsing and article submission
4. Test admin dashboard functionality

## Monitoring and Maintenance

### 1. Azure Monitor
- Set up Application Insights for backend monitoring
- Monitor Static Web App usage and performance

### 2. Logs
- Backend logs: Azure App Service > Log stream
- Frontend logs: Browser developer tools

### 3. Scaling
- Backend: Scale App Service plan as needed
- Frontend: Static Web Apps auto-scale

## Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Ensure CORS_ORIGIN is set correctly in backend
   - Check that frontend URL is allowed

2. **Database Connection:**
   - Verify MongoDB connection string
   - Check network access in MongoDB Atlas

3. **Authentication Issues:**
   - Verify JWT_SECRET is set
   - Check token storage in browser

4. **Static Assets Not Loading:**
   - Verify file paths are correct
   - Check Static Web App configuration

### Support Resources
- Azure Documentation: https://docs.microsoft.com/azure/
- MongoDB Atlas Documentation: https://docs.atlas.mongodb.com/
- Static Web Apps Documentation: https://docs.microsoft.com/azure/static-web-apps/

## Cost Estimation

### Monthly Costs (Estimated)
- **Azure App Service (Basic B1)**: ~$13/month
- **Azure Static Web App (Standard)**: ~$9/month
- **MongoDB Atlas (M0)**: Free tier available
- **Custom Domain**: ~$12/year
- **Total**: ~$22-25/month

### Cost Optimization
- Use free tiers where possible
- Consider reserved instances for long-term commitments
- Monitor usage and scale down when not needed

## Security Considerations

1. **Environment Variables:**
   - Never commit secrets to version control
   - Use Azure Key Vault for sensitive data

2. **CORS Configuration:**
   - Restrict CORS to specific domains
   - Avoid wildcard origins in production

3. **Authentication:**
   - Use strong JWT secrets
   - Implement proper session management

4. **Database Security:**
   - Use MongoDB Atlas security features
   - Enable network access restrictions

## Backup and Recovery

1. **Database Backup:**
   - MongoDB Atlas provides automatic backups
   - Configure backup retention policies

2. **Code Backup:**
   - Use Git for version control
   - Regular commits and pushes

3. **Configuration Backup:**
   - Document all environment variables
   - Keep deployment scripts in version control

---

## Quick Deployment Checklist

- [ ] Backend deployed to Azure App Service
- [ ] Frontend deployed to Azure Static Web Apps
- [ ] MongoDB Atlas cluster configured
- [ ] Environment variables set
- [ ] Custom domain configured (optional)
- [ ] SSL certificates active
- [ ] CORS configured correctly
- [ ] Authentication working
- [ ] All pages loading correctly
- [ ] Forms and API calls working
- [ ] Admin dashboard accessible
- [ ] Monitoring configured
- [ ] Documentation updated

---

**Last Updated**: January 2025
**Version**: 1.0 