/**
 * Centre for Sustainability and Management Research (CSMR)
 * Newsletter Subscription Component using Firebase
 */

document.addEventListener('DOMContentLoaded', function() {
    setupNewsletterForm();
});

async function subscribeNewsletter(email) {
    try {
        const response = await fetch('http://localhost:5000/api/newsletter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Subscription failed');
        return data;
    } catch (error) {
        throw error;
    }
}

function setupNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const submitButton = this.querySelector('button[type="submit"]');
            
            if (!emailInput.value) {
                showToast('Please enter your email address', 'error');
                return;
            }
            
            // Disable form controls during submission
            emailInput.disabled = true;
            submitButton.disabled = true;
            submitButton.textContent = 'Subscribing...';
            
            try {
                await subscribeNewsletter(emailInput.value);
                
                // Show success message
                showToast('Thank you for subscribing to our newsletter!', 'success');
                
                // Reset form
                emailInput.value = '';
            } catch (error) {
                console.error('Newsletter subscription error:', error);
                showToast(error.message || 'Subscription failed. Please try again later.', 'error');
            } finally {
                // Re-enable form controls
                emailInput.disabled = false;
                submitButton.disabled = false;
                submitButton.textContent = 'Subscribe';
            }
        });
    }
}

// Show toast notification
function showToast(message, type = 'info') {
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
                z-index: 9999;
            }
            
            .toast {
                padding: 12px 20px;
                margin-bottom: 10px;
                border-radius: 4px;
                color: white;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                display: flex;
                align-items: center;
                animation: slideIn 0.3s ease-out forwards;
            }
            
            .toast.success {
                background-color: #4caf50;
            }
            
            .toast.error {
                background-color: #f44336;
            }
            
            .toast.info {
                background-color: #2196f3;
            }
            
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    // Add toast to container
    toastContainer.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease-in forwards';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
} 