// Login functionality for Submission Portal
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    
    // API base URL - update this to your actual backend URL
    const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? 'http://localhost:5000/api' 
        : 'https://your-azure-app-service-url.azurewebsites.net/api';
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Hide any previous error messages
        loginError.classList.add('d-none');
        
        try {
            const response = await fetch(`${API_BASE_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Store user data and token
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data));
                
                // Show success message
                showMessage('Login successful! Redirecting...', 'success');
                
                // Redirect to dashboard or main page
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
                
            } else {
                // Show error message
                showMessage(data.message || 'Login failed. Please check your credentials.', 'error');
            }
            
        } catch (error) {
            console.error('Login error:', error);
            showMessage('Network error. Please try again.', 'error');
        }
    });
    
    function showMessage(message, type) {
        loginError.textContent = message;
        loginError.className = `alert alert-${type === 'error' ? 'danger' : 'success'} mt-3`;
        loginError.classList.remove('d-none');
    }
    
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
        // User is already logged in, redirect to dashboard
        window.location.href = 'index.html';
    }
}); 