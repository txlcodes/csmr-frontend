/**
 * Centralized Error Handler for CSMR Frontend
 * Provides consistent error handling, logging, and user feedback
 */

class ErrorHandler {
    constructor() {
        this.errorTypes = {
            NETWORK: 'NETWORK_ERROR',
            VALIDATION: 'VALIDATION_ERROR',
            AUTH: 'AUTH_ERROR',
            API: 'API_ERROR',
            UNKNOWN: 'UNKNOWN_ERROR'
        };
        
        this.setupGlobalErrorHandlers();
    }

    // Set up global error handlers
    setupGlobalErrorHandlers() {
        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError(event.reason, this.errorTypes.UNKNOWN);
        });

        // Handle global JavaScript errors
        window.addEventListener('error', (event) => {
            this.handleError(event.error, this.errorTypes.UNKNOWN);
        });
    }

    // Main error handling method
    handleError(error, type = this.errorTypes.UNKNOWN, context = {}) {
        // Log error in development
        if (config.isDevelopment) {
            console.error('Error occurred:', {
                error,
                type,
                context,
                timestamp: new Date().toISOString()
            });
        }

        // Determine error type if not provided
        if (type === this.errorTypes.UNKNOWN) {
            type = this.determineErrorType(error);
        }

        // Get user-friendly message
        const userMessage = this.getUserFriendlyMessage(error, type);
        
        // Show error to user
        this.showErrorToUser(userMessage, type);
        
        // Report error if in production
        if (config.isProduction) {
            this.reportError(error, type, context);
        }
    }

    // Determine error type based on error characteristics
    determineErrorType(error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            return this.errorTypes.NETWORK;
        }
        
        if (error.message && error.message.includes('validation')) {
            return this.errorTypes.VALIDATION;
        }
        
        if (error.message && (error.message.includes('auth') || error.message.includes('login'))) {
            return this.errorTypes.AUTH;
        }
        
        if (error.status || error.response) {
            return this.errorTypes.API;
        }
        
        return this.errorTypes.UNKNOWN;
    }

    // Get user-friendly error message
    getUserFriendlyMessage(error, type) {
        switch (type) {
            case this.errorTypes.NETWORK:
                return 'Network connection error. Please check your internet connection and try again.';
            
            case this.errorTypes.VALIDATION:
                return error.message || 'Please check your input and try again.';
            
            case this.errorTypes.AUTH:
                return error.message || 'Authentication error. Please log in again.';
            
            case this.errorTypes.API:
                return error.message || 'Server error. Please try again later.';
            
            default:
                return 'An unexpected error occurred. Please try again.';
        }
    }

    // Show error to user
    showErrorToUser(message, type) {
        // Create error notification
        this.showNotification(message, 'error');
        
        // For auth errors, redirect to login
        if (type === this.errorTypes.AUTH) {
            setTimeout(() => {
                if (AuthService.isLoggedIn()) {
                    AuthService.logout();
                }
                window.location.href = '/';
            }, 3000);
        }
    }

    // Show notification to user
    showNotification(message, type = 'error') {
        // Create notification container if it doesn't exist
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 400px;
            `;
            document.body.appendChild(container);
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            background: ${type === 'error' ? '#ffebee' : '#e8f5e9'};
            color: ${type === 'error' ? '#c62828' : '#2e7d32'};
            border-left: 4px solid ${type === 'error' ? '#f44336' : '#4caf50'};
            padding: 16px;
            margin-bottom: 10px;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease-out;
            position: relative;
        `;

        notification.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: none; border: none; font-size: 18px; cursor: pointer; margin-left: 10px;">
                    ×
                </button>
            </div>
        `;

        // Add animation styles
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
      document.head.appendChild(style);
    }
    
        container.appendChild(notification);

        // Auto-remove after 5 seconds
      setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease-out forwards';
    setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
          }
        }, 300);
      }
    }, 5000);
    }

    // Report error to monitoring service (placeholder)
    reportError(error, type, context) {
        // In a real application, you would send this to an error monitoring service
        // like Sentry, LogRocket, or Bugsnag
        console.log('Error reported to monitoring service:', {
            error: error.message,
            type,
            context,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        });
    }

    // Handle API errors specifically
    handleAPIError(error, endpoint) {
        let message = 'An error occurred while processing your request.';
        
        if (error.status) {
            switch (error.status) {
                case 400:
                    message = 'Invalid request. Please check your input.';
                    break;
                case 401:
                    message = 'Please log in to continue.';
                    break;
                case 403:
                    message = 'You do not have permission to perform this action.';
                    break;
                case 404:
                    message = 'The requested resource was not found.';
                    break;
                case 500:
                    message = 'Server error. Please try again later.';
                    break;
                default:
                    message = error.message || message;
            }
        }
        
        this.handleError(error, this.errorTypes.API, { endpoint });
    }

    // Handle validation errors
    handleValidationError(errors) {
        if (Array.isArray(errors)) {
            errors.forEach(error => {
                this.showNotification(error, 'error');
            });
        } else if (typeof errors === 'object') {
            Object.values(errors).forEach(error => {
                this.showNotification(error, 'error');
            });
        } else {
            this.showNotification(errors, 'error');
        }
    }

    // Handle network errors
    handleNetworkError(error) {
        this.handleError(error, this.errorTypes.NETWORK);
    }

    // Handle authentication errors
    handleAuthError(error) {
        this.handleError(error, this.errorTypes.AUTH);
    }
}

// Create and export global error handler instance
const errorHandler = new ErrorHandler();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = errorHandler;
}