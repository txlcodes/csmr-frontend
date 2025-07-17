// Registration functionality for Submission Portal
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const registerError = document.getElementById('registerError');
    
    // API base URL - update this to your actual backend URL
    const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? 'http://localhost:5000/api' 
        : 'https://your-azure-app-service-url.azurewebsites.net/api';
    
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Hide any previous error messages
        registerError.classList.add('d-none');
        
        // Basic validation
        if (password !== confirmPassword) {
            showMessage('Passwords do not match.', 'error');
            return;
        }
        
        if (password.length < 6) {
            showMessage('Password must be at least 6 characters long.', 'error');
            return;
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    institution: 'Not specified',
                    academicDegree: 'Not specified',
                    researchInterests: []
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Store user data and token
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data));
                
                // Show success message
                showMessage('Registration successful! Redirecting to login...', 'success');
                
                // Redirect to login page
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
                
            } else {
                // Show error message
                showMessage(data.message || 'Registration failed. Please try again.', 'error');
            }
            
        } catch (error) {
            console.error('Registration error:', error);
            showMessage('Network error. Please try again.', 'error');
        }
    });
    
    function showMessage(message, type) {
        registerError.textContent = message;
        registerError.className = `alert alert-${type === 'error' ? 'danger' : 'success'} mt-3`;
        registerError.classList.remove('d-none');
    }
    
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
        // User is already logged in, redirect to dashboard
        window.location.href = 'index.html';
    }
}); 