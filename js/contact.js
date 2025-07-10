/**
 * Centre for Sustainability and Management Research (CSMR)
 * Contact Form Handler using Firebase
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the contact page
    if (window.location.pathname.includes('contact')) {
        createContactForm();
        setupContactForm();
    }
});

// Create contact form if it doesn't exist
function createContactForm() {
    const contactContainer = document.querySelector('.contact-container');
    
    if (!contactContainer) {
        return;
    }
    
    // Check if form already exists
    if (contactContainer.querySelector('#contact-form')) {
        return;
    }
    
    const contactForm = document.createElement('div');
    contactForm.className = 'contact-form-wrapper';
    contactForm.innerHTML = `
        <h2>Get in Touch</h2>
        <p>Have questions about our journals, submission process, or anything else? Fill out the form below and we'll get back to you as soon as possible.</p>
        
        <form id="contact-form">
            <div class="form-group">
                <label for="contact-name">Full Name*</label>
                <input type="text" id="contact-name" name="name" required>
            </div>
            
            <div class="form-group">
                <label for="contact-email">Email Address*</label>
                <input type="email" id="contact-email" name="email" required>
            </div>
            
            <div class="form-group">
                <label for="contact-subject">Subject*</label>
                <input type="text" id="contact-subject" name="subject" required>
            </div>
            
            <div class="form-group">
                <label for="contact-message">Message*</label>
                <textarea id="contact-message" name="message" rows="5" required></textarea>
            </div>
            
            <div class="form-message"></div>
            
            <button type="submit" class="btn primary-btn">Send Message</button>
        </form>
    `;
    
    contactContainer.appendChild(contactForm);
    
    // Add contact information
    const contactInfo = document.createElement('div');
    contactInfo.className = 'contact-info';
    contactInfo.innerHTML = `
        <h2>Contact Information</h2>
        
        <div class="info-item">
            <i class="fas fa-map-marker-alt"></i>
            <div>
                <h3>Address</h3>
                <p>Academic Block 4, Research Park<br>New Delhi - 110001, India</p>
            </div>
        </div>
        
        <div class="info-item">
            <i class="fas fa-phone"></i>
            <div>
                <h3>Phone</h3>
                <p>+91 11 2345 6789</p>
            </div>
        </div>
        
        <div class="info-item">
            <i class="fas fa-envelope"></i>
            <div>
                <h3>Email</h3>
                <p>contact@csmr.org.in</p>
            </div>
        </div>
        
        <div class="info-item">
            <i class="fas fa-clock"></i>
            <div>
                <h3>Office Hours</h3>
                <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
            </div>
        </div>
    `;
    
    contactContainer.appendChild(contactInfo);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .contact-container {
            display: grid;
            grid-template-columns: 1fr;
            gap: 30px;
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        
        @media (min-width: 768px) {
            .contact-container {
                grid-template-columns: 3fr 2fr;
            }
        }
        
        .contact-form-wrapper {
            background-color: #fff;
            padding: 30px;
            border-radius: 5px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .contact-info {
            background-color: #f8f8f8;
            padding: 30px;
            border-radius: 5px;
        }
        
        .info-item {
            display: flex;
            margin-bottom: 25px;
        }
        
        .info-item i {
            font-size: 24px;
            color: #00277a;
            margin-right: 15px;
            margin-top: 5px;
        }
        
        .info-item h3 {
            margin: 0 0 5px 0;
            font-size: 18px;
        }
        
        .info-item p {
            margin: 0;
            color: #666;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: 600;
        }
        
        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-family: inherit;
        }
        
        .form-message {
            margin: 10px 0;
            padding: 10px;
            border-radius: 4px;
            display: none;
        }
        
        .form-message.error {
            background-color: #ffe6e6;
            color: #d32f2f;
            display: block;
        }
        
        .form-message.success {
            background-color: #e6ffe6;
            color: #388e3c;
            display: block;
        }
    `;
    
    document.head.appendChild(style);
}

async function submitContactForm(contactData) {
    try {
        const response = await fetch(`${config.API_BASE_URL}/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contactData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to send message');
        return data;
    } catch (error) {
        throw error;
    }
}

function setupContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const nameInput = this.querySelector('input[name="name"]');
            const emailInput = this.querySelector('input[name="email"]');
            const subjectInput = this.querySelector('input[name="subject"]');
            const messageInput = this.querySelector('textarea[name="message"]');
            const submitButton = this.querySelector('button[type="submit"]');
            if (!nameInput.value || !emailInput.value || !subjectInput.value || !messageInput.value) {
                showToast('Please fill in all fields', 'error');
                return;
            }
            nameInput.disabled = true;
            emailInput.disabled = true;
            subjectInput.disabled = true;
            messageInput.disabled = true;
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            try {
                await submitContactForm({
                    name: nameInput.value,
                    email: emailInput.value,
                    subject: subjectInput.value,
                    message: messageInput.value
                });
                showToast('Thank you for your message! We will get back to you soon.', 'success');
                contactForm.reset();
            } catch (error) {
                console.error('Contact form submission error:', error);
                showToast(error.message || 'Failed to send message. Please try again later.', 'error');
            } finally {
                nameInput.disabled = false;
                emailInput.disabled = false;
                subjectInput.disabled = false;
                messageInput.disabled = false;
                submitButton.disabled = false;
                submitButton.textContent = 'Send Message';
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