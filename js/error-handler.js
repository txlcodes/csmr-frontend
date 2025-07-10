/**
 * CSMR Journal System - Error Handler
 * Provides utility functions for handling errors in the frontend
 */

// Global error handler for fetch requests
window.handleFetchError = async (response) => {
  if (!response.ok) {
    // Try to get JSON error response
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      // If parsing JSON fails, use the status text
      throw new Error(response.statusText || 'An error occurred');
    }
    
    // Throw error with message from API
    throw new Error(errorData.message || 'An error occurred');
  }
  return response;
};

// Create error boundary for components
class ErrorBoundary {
  constructor(containerElement, fallbackUI) {
    this.containerElement = containerElement;
    this.fallbackUI = fallbackUI || this.defaultFallbackUI;
    this.originalContent = containerElement.innerHTML;
    this.hasError = false;
  }
  
  // Default fallback UI to display when error occurs
  defaultFallbackUI() {
    return `
      <div class="error-boundary">
        <div class="error-content">
          <h3>Something went wrong</h3>
          <p>We're having trouble loading this content.</p>
          <button class="btn primary-btn retry-button">Try Again</button>
        </div>
      </div>
    `;
  }
  
  // Handle caught errors
  catch(error) {
    console.error('Error caught by ErrorBoundary:', error);
    
    // Save original content if this is first error
    if (!this.hasError) {
      this.originalContent = this.containerElement.innerHTML;
    }
    
    // Set error state
    this.hasError = true;
    
    // Replace content with fallback UI
    this.containerElement.innerHTML = typeof this.fallbackUI === 'function' 
      ? this.fallbackUI(error) 
      : this.fallbackUI;
    
    // Add retry button event listener
    const retryButton = this.containerElement.querySelector('.retry-button');
    if (retryButton) {
      retryButton.addEventListener('click', () => this.retry());
    }
    
    return this;
  }
  
  // Retry loading the original content
  retry() {
    if (this.hasError && this.originalContent) {
      this.containerElement.innerHTML = this.originalContent;
      this.hasError = false;
      
      // Dispatch custom event to notify components to reinitialize
      const retryEvent = new CustomEvent('errorBoundaryRetry', {
        bubbles: true,
        detail: { container: this.containerElement }
      });
      this.containerElement.dispatchEvent(retryEvent);
    }
    return this;
  }
}

// Global error handling
window.addEventListener('error', function(event) {
  console.error('Global error caught:', event.error);
  
  // Show toast notification for uncaught errors
  if (window.showToast) {
    window.showToast('An error occurred. Please try again.', 'error');
  }
});

// Create toast notification if not available
if (!window.showToast) {
  window.showToast = function(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toast-container');
    
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      document.body.appendChild(toastContainer);
      
      // Add toast styles
      const style = document.createElement('style');
      style.textContent = `
        #toast-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
        }
        
        .toast {
          padding: 12px 20px;
          margin-bottom: 10px;
          border-radius: 4px;
          box-shadow: 0 3px 10px rgba(0,0,0,0.15);
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-width: 250px;
          max-width: 350px;
          animation: slide-in 0.3s ease-out;
        }
        
        .toast.info {
          background-color: #e3f2fd;
          color: #0d47a1;
          border-left: 4px solid #2196f3;
        }
        
        .toast.success {
          background-color: #e8f5e9;
          color: #2e7d32;
          border-left: 4px solid #4caf50;
        }
        
        .toast.warning {
          background-color: #fffde7;
          color: #ff6f00;
          border-left: 4px solid #ffc107;
        }
        
        .toast.error {
          background-color: #ffebee;
          color: #c62828;
          border-left: 4px solid #f44336;
        }
        
        .toast .close-toast {
          cursor: pointer;
          margin-left: 10px;
          font-weight: bold;
        }
        
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes fade-out {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `;
      
      document.head.appendChild(style);
    }
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span>${message}</span>
      <span class="close-toast">&times;</span>
    `;
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Add close functionality
    toast.querySelector('.close-toast').addEventListener('click', function() {
      toast.style.animation = 'fade-out 0.3s forwards';
      setTimeout(() => {
        toast.remove();
      }, 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.animation = 'fade-out 0.3s forwards';
        setTimeout(() => {
          if (toast.parentNode) {
            toast.remove();
          }
        }, 300);
      }
    }, 5000);
  };
}

// Create helper for API fetch with error handling
window.fetchWithErrorHandling = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    await window.handleFetchError(response);
    return await response.json();
  } catch (error) {
    // Show toast with error message
    window.showToast(error.message || 'Failed to fetch data', 'error');
    throw error;
  }
};

// Export error boundary for use in other scripts
window.ErrorBoundary = ErrorBoundary; 