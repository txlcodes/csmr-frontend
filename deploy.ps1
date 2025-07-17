# CSMR Website Deployment Script
# This script helps prepare and deploy the CSMR website to Azure

param(
    [string]$AzureAppServiceName = "",
    [string]$AzureResourceGroup = "",
    [string]$MongoDBUri = "",
    [string]$JwtSecret = "",
    [string]$FrontendUrl = ""
)

Write-Host "=== CSMR Website Deployment Script ===" -ForegroundColor Green
Write-Host ""

# Check if required parameters are provided
if (-not $AzureAppServiceName) {
    $AzureAppServiceName = Read-Host "Enter your Azure App Service name"
}

if (-not $AzureResourceGroup) {
    $AzureResourceGroup = Read-Host "Enter your Azure Resource Group name"
}

if (-not $MongoDBUri) {
    $MongoDBUri = Read-Host "Enter your MongoDB Atlas connection string"
}

if (-not $JwtSecret) {
    $JwtSecret = Read-Host "Enter your JWT secret key"
}

if (-not $FrontendUrl) {
    $FrontendUrl = Read-Host "Enter your Azure Static Web App URL (optional)"
}

Write-Host ""
Write-Host "=== Deployment Configuration ===" -ForegroundColor Yellow
Write-Host "Azure App Service: $AzureAppServiceName"
Write-Host "Resource Group: $AzureResourceGroup"
Write-Host "MongoDB URI: $($MongoDBUri.Substring(0, [Math]::Min(50, $MongoDBUri.Length)))..."
Write-Host "Frontend URL: $FrontendUrl"
Write-Host ""

# Step 1: Prepare Backend
Write-Host "=== Step 1: Preparing Backend ===" -ForegroundColor Cyan

# Check if backend directory exists
if (-not (Test-Path "backend")) {
    Write-Host "Error: Backend directory not found!" -ForegroundColor Red
    exit 1
}

# Navigate to backend directory
Set-Location backend

# Install dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
try {
    npm install
    Write-Host "✓ Backend dependencies installed successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to install backend dependencies" -ForegroundColor Red
    exit 1
}

# Create .env file for production
Write-Host "Creating production environment file..." -ForegroundColor Yellow
$envContent = @"
NODE_ENV=production
PORT=process.env.PORT
MONGODB_URI=$MongoDBUri
JWT_SECRET=$JwtSecret
CORS_ORIGIN=$FrontendUrl
"@

$envContent | Out-File -FilePath ".env" -Encoding UTF8
Write-Host "✓ Production environment file created" -ForegroundColor Green

# Step 2: Deploy Backend to Azure
Write-Host ""
Write-Host "=== Step 2: Deploying Backend to Azure ===" -ForegroundColor Cyan

# Check if Azure CLI is installed
try {
    $azVersion = az version --output json | ConvertFrom-Json
    Write-Host "✓ Azure CLI found (version: $($azVersion.'azure-cli'))" -ForegroundColor Green
} catch {
    Write-Host "✗ Azure CLI not found. Please install Azure CLI first." -ForegroundColor Red
    Write-Host "Download from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli" -ForegroundColor Yellow
    exit 1
}

# Deploy to Azure App Service
Write-Host "Deploying backend to Azure App Service..." -ForegroundColor Yellow
try {
    az webapp up --name $AzureAppServiceName --resource-group $AzureResourceGroup --runtime "NODE|18-lts" --sku B1
    Write-Host "✓ Backend deployed successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to deploy backend" -ForegroundColor Red
    Write-Host "Please check your Azure credentials and try again" -ForegroundColor Yellow
    exit 1
}

# Step 3: Configure Environment Variables
Write-Host ""
Write-Host "=== Step 3: Configuring Environment Variables ===" -ForegroundColor Cyan

Write-Host "Setting environment variables in Azure..." -ForegroundColor Yellow
try {
    az webapp config appsettings set --name $AzureAppServiceName --resource-group $AzureResourceGroup --settings NODE_ENV=production
    az webapp config appsettings set --name $AzureAppServiceName --resource-group $AzureResourceGroup --settings MONGODB_URI="$MongoDBUri"
    az webapp config appsettings set --name $AzureAppServiceName --resource-group $AzureResourceGroup --settings JWT_SECRET="$JwtSecret"
    
    if ($FrontendUrl) {
        az webapp config appsettings set --name $AzureAppServiceName --resource-group $AzureResourceGroup --settings CORS_ORIGIN="$FrontendUrl"
    }
    
    Write-Host "✓ Environment variables configured successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to configure environment variables" -ForegroundColor Red
    Write-Host "Please configure them manually in Azure Portal" -ForegroundColor Yellow
}

# Step 4: Prepare Frontend
Write-Host ""
Write-Host "=== Step 4: Preparing Frontend ===" -ForegroundColor Cyan

# Navigate back to root directory
Set-Location ..

# Check if frontend directory exists
if (-not (Test-Path "frontend")) {
    Write-Host "Error: Frontend directory not found!" -ForegroundColor Red
    exit 1
}

# Update config.js with the correct API URL
Write-Host "Updating frontend configuration..." -ForegroundColor Yellow
$configPath = "frontend/js/config.js"
$configContent = Get-Content $configPath -Raw

# Replace the placeholder URL with the actual Azure App Service URL
$azureApiUrl = "https://$AzureAppServiceName.azurewebsites.net/api"
$updatedConfig = $configContent -replace 'https://your-azure-app-service-url\.azurewebsites\.net/api', $azureApiUrl

$updatedConfig | Out-File -FilePath $configPath -Encoding UTF8
Write-Host "✓ Frontend configuration updated" -ForegroundColor Green

# Step 5: Deployment Summary
Write-Host ""
Write-Host "=== Deployment Summary ===" -ForegroundColor Green
Write-Host "✓ Backend deployed to: https://$AzureAppServiceName.azurewebsites.net" -ForegroundColor Green
Write-Host "✓ Frontend configuration updated" -ForegroundColor Green
Write-Host "✓ Environment variables configured" -ForegroundColor Green
Write-Host ""

Write-Host "=== Next Steps ===" -ForegroundColor Yellow
Write-Host "1. Deploy frontend to Azure Static Web Apps" -ForegroundColor White
Write-Host "2. Test the API endpoints" -ForegroundColor White
Write-Host "3. Configure custom domain (optional)" -ForegroundColor White
Write-Host "4. Set up monitoring and alerts" -ForegroundColor White
Write-Host ""

Write-Host "=== Testing Commands ===" -ForegroundColor Yellow
Write-Host "Test API health: curl https://$AzureAppServiceName.azurewebsites.net/api/health" -ForegroundColor White
Write-Host "Test journals endpoint: curl https://$AzureAppServiceName.azurewebsites.net/api/journals" -ForegroundColor White
Write-Host ""

Write-Host "=== Important Notes ===" -ForegroundColor Yellow
Write-Host "- Keep your JWT secret secure and never commit it to version control" -ForegroundColor White
Write-Host "- Monitor your Azure App Service usage to avoid unexpected charges" -ForegroundColor White
Write-Host "- Set up proper CORS configuration for your frontend domain" -ForegroundColor White
Write-Host "- Consider setting up Application Insights for monitoring" -ForegroundColor White
Write-Host ""

Write-Host "Deployment script completed successfully!" -ForegroundColor Green 