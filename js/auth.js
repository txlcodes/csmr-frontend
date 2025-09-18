/**
 * Centre for Sustainability and Management Research (CSMR)
 * Authentication UI Components using JWT
 */

document.addEventListener('DOMContentLoaded', function() {
    // Remove any existing user dropdowns (cleanup)
    document.querySelectorAll('#user-dropdown').forEach(el => el.remove());
    
    // Run normal auth logic
    // Direct event listeners for login/register buttons
    const loginButtons = document.querySelectorAll('.login-btn');
    const registerButtons = document.querySelectorAll('.register-btn');
    
    if (loginButtons.length > 0) {
        loginButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const loginModal = document.getElementById('login-modal');
                if (loginModal) {
                    loginModal.style.display = 'block';
                } else {
                    if (config.isDevelopment) {
                        console.error('Login modal not found in DOM');
                    }
                }
            });
        });
    }
    
    if (registerButtons.length > 0) {
        registerButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const registerModal = document.getElementById('register-modal');
                if (registerModal) {
                    registerModal.style.display = 'block';
                } else {
                    if (config.isDevelopment) {
                        console.error('Register modal not found in DOM');
                    }
                }
            });
        });
    }
    
    // Create auth modal elements
    createAuthModals();
    
    // Set up event listeners for auth buttons
    setupAuthListeners();
    
    // Check authentication status on page load
    updateAuthUI();
    
    // Force user dropdown injection if logged in
    if (AuthService.isLoggedIn()) {
        const user = AuthService.getCurrentUser();
        // Remove again in case updateAuthUI added it in the wrong place
        document.querySelectorAll('#user-dropdown').forEach(el => el.remove());
        const userDropdown = createUserDropdown(user.name || user.email, user.role || 'user');
        const utilityRight = document.querySelector('.utility-right');
        if (utilityRight) {
            utilityRight.appendChild(userDropdown);
            userDropdown.style.display = 'block';
            userDropdown.style.visibility = 'visible';
            userDropdown.style.opacity = '1';
            userDropdown.style.position = 'relative';
        } else if (document.querySelector('.header-main')) {
            document.querySelector('.header-main').appendChild(userDropdown);
            userDropdown.style.display = 'block';
            userDropdown.style.visibility = 'visible';
            userDropdown.style.opacity = '1';
            userDropdown.style.position = 'relative';
        } else {
            document.body.appendChild(userDropdown);
            userDropdown.style.display = 'block';
            userDropdown.style.visibility = 'visible';
            userDropdown.style.opacity = '1';
            userDropdown.style.position = 'relative';
        }
        addUserDropdownToggle();
        // Bulletproof: direct logout event
        const logoutLink = userDropdown.querySelector('#logout-link');
        if (logoutLink) {
            logoutLink.addEventListener('click', function(e) {
                e.preventDefault();
                AuthService.logout();
                updateAuthUI();
                const currentPath = window.location.pathname;
                if (currentPath.includes('admin') || currentPath.includes('dashboard')) {
                    window.location.href = '/';
                } else {
                    location.reload();
                }
            });
        }
    }
});

// Create auth modals in the DOM
function createAuthModals() {
    // Create login modal
    const loginModal = document.createElement('div');
    loginModal.id = 'login-modal';
    loginModal.className = 'auth-modal';
    loginModal.style.display = 'none'; // Ensure modal starts hidden
    loginModal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Login to CSMR</h2>
            <form id="login-form">
                <div class="form-group">
                    <label for="login-email">Email</label>
                    <input type="email" id="login-email" required>
                </div>
                <div class="form-group">
                    <label for="login-password">Password</label>
                    <input type="password" id="login-password" required>
                </div>
                <div class="form-message"></div>
                <button type="submit" class="btn primary-btn">Login</button>
            </form>
            <p class="auth-switch">Don't have an account? <a href="#" id="show-register">Register</a></p>
        </div>
    `;
    
    // Create register modal
    const registerModal = document.createElement('div');
    registerModal.id = 'register-modal';
    registerModal.className = 'auth-modal';
    registerModal.style.display = 'none'; // Ensure modal starts hidden
    registerModal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Register for CSMR</h2>
            <form id="register-form">
                <div class="form-group">
                    <label for="register-name">Full Name</label>
                    <input type="text" id="register-name" required>
                </div>
                <div class="form-group">
                    <label for="register-email">Email</label>
                    <input type="email" id="register-email" required>
                </div>
                <div class="form-group">
                    <label for="register-password">Password</label>
                    <input type="password" id="register-password" required minlength="6">
                    <small>Password must be at least 6 characters</small>
                </div>
                <div class="form-group">
                    <label for="register-institution">Institution</label>
                    <input type="text" id="register-institution" required>
                </div>
                <div class="form-group">
                    <label for="register-degree">Academic Degree</label>
                    <select id="register-degree">
                        <option value="">Select your highest degree</option>
                        <option value="Bachelor's">Bachelor's</option>
                        <option value="Master's">Master's</option>
                        <option value="PhD">PhD</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="register-interests">Research Interests</label>
                    <input type="text" id="register-interests" placeholder="Separate with commas">
                </div>
                <div class="form-message"></div>
                <button type="submit" class="btn primary-btn">Register</button>
            </form>
            <p class="auth-switch">Already have an account? <a href="#" id="show-login">Login</a></p>
        </div>
    `;
    
    // Create user profile dropdown
    const userDropdown = document.createElement('div');
    userDropdown.id = 'user-dropdown';
    userDropdown.className = 'user-dropdown auth-dependent';
    userDropdown.innerHTML = `
        <div class="user-info">
            <span class="user-name">User Name</span>
            <i class="fas fa-chevron-down"></i>
        </div>
        <div class="dropdown-menu">
            <a href="#" id="profile-link">My Profile</a>
            <a href="#" id="papers-link">My Papers</a>
            <a href="#" id="logout-link">Logout</a>
        </div>
    `;
    
    // Add modals to the body
    document.body.appendChild(loginModal);
    document.body.appendChild(registerModal);
    
    // Add styles for auth modals
    const style = document.createElement('style');
    style.textContent = `
        .auth-modal {
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            overflow: auto;
        }
        
        .modal-content {
            background-color: #fff;
            margin: 10% auto;
            padding: 30px;
            border-radius: 5px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            width: 90%;
            max-width: 500px;
            position: relative;
        }
        
        .close-modal {
            position: absolute;
            right: 20px;
            top: 15px;
            font-size: 24px;
            cursor: pointer;
        }
        
        .close-modal:hover {
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
        .form-group select {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 3px;
            font-size: 16px;
        }
        
        .form-group small {
            display: block;
            margin-top: 5px;
            color: #666;
            font-size: 12px;
        }
        
        .form-message {
            margin: 15px 0;
            padding: 10px;
            display: none;
        }
        
        .form-message.error {
            display: block;
            background-color: #ffebee;
            color: #d32f2f;
            border-left: 3px solid #d32f2f;
        }
        
        .form-message.success {
            display: block;
            background-color: #e8f5e9;
            color: #2e7d32;
            border-left: 3px solid #2e7d32;
        }
        
        .auth-switch {
            margin-top: 20px;
            text-align: center;
            font-size: 14px;
        }
    `;
    
    document.head.appendChild(style);
}

// Set up event listeners for auth buttons and forms
function setupAuthListeners() {
    // Close modal buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            const modals = document.querySelectorAll('.auth-modal');
            modals.forEach(modal => modal.style.display = 'none');
        });
    });
    
    // Switch between login and register forms
    const showLoginLink = document.getElementById('show-login');
    const showRegisterLink = document.getElementById('show-register');
    
    if (showLoginLink) {
        showLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('register-modal').style.display = 'none';
            document.getElementById('login-modal').style.display = 'block';
        });
    }
    
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('login-modal').style.display = 'none';
            document.getElementById('register-modal').style.display = 'block';
        });
    }
    
    // Outside click to close modals
    window.addEventListener('click', function(e) {
        const modals = document.querySelectorAll('.auth-modal');
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const messageDiv = loginForm.querySelector('.form-message');
            messageDiv.className = 'form-message';
            messageDiv.style.display = 'none';
            
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            
            // Basic validation
            if (!email || !password) {
                messageDiv.textContent = 'Please fill in all fields';
                messageDiv.classList.add('error');
                messageDiv.style.display = 'block';
                return;
            }
            
            try {
                const data = await AuthService.login(email, password);
                
                // Show success message
                messageDiv.textContent = 'Login successful! Redirecting...';
                messageDiv.classList.add('success');
                messageDiv.style.display = 'block';
                
                // Close modal and update UI
                setTimeout(() => {
                    document.getElementById('login-modal').style.display = 'none';
                    updateAuthUI();
                    location.reload();
                }, 1500);
                
            } catch (error) {
                if (config.isDevelopment) {
                    console.error('Login error:', error);
                }
                messageDiv.textContent = error.message || 'Login failed. Please check your credentials.';
                messageDiv.classList.add('error');
                messageDiv.style.display = 'block';
            }
        });
    }
    
    // Register form submission
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const messageDiv = registerForm.querySelector('.form-message');
            messageDiv.className = 'form-message';
            messageDiv.style.display = 'none';
            
            const name = document.getElementById('register-name').value.trim();
            const email = document.getElementById('register-email').value.trim();
            const password = document.getElementById('register-password').value;
            const institution = document.getElementById('register-institution').value.trim();
            const degree = document.getElementById('register-degree').value;
            const interests = document.getElementById('register-interests').value.split(',').map(i => i.trim()).filter(i => i);
            
            // Basic validation
            if (!name || !email || !password || !institution) {
                messageDiv.textContent = 'Please fill in all required fields';
                messageDiv.classList.add('error');
                messageDiv.style.display = 'block';
                return;
            }
            
            try {
                const userData = { 
                    name,
                    email,
                    password,
                    institution,
                    academicDegree: degree,
                    researchInterests: interests
                };
                
                const data = await AuthService.register(userData);
                
                // Show success message
                messageDiv.textContent = 'Registration successful! Redirecting...';
                messageDiv.classList.add('success');
                messageDiv.style.display = 'block';
                
                // Close modal and update UI
                setTimeout(() => {
                    document.getElementById('register-modal').style.display = 'none';
                    updateAuthUI();
                    location.reload();
                }, 1500);
                
            } catch (error) {
                if (config.isDevelopment) {
                    console.error('Registration error:', error);
                }
                messageDiv.textContent = error.message || 'Registration failed. Please try again.';
                messageDiv.classList.add('error');
                messageDiv.style.display = 'block';
            }
        });
    }
    
    // Logout handler
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'logout-link') {
            e.preventDefault();
            // Use AuthService logout method
            AuthService.logout();
            // Update UI
            updateAuthUI();
            // Redirect to home if on protected page
            const currentPath = window.location.pathname;
            if (currentPath.includes('admin') || currentPath.includes('dashboard')) {
                window.location.href = '/';
            } else {
                location.reload();
            }
        }
    });
}

// Update UI based on authentication status
function updateAuthUI() {
    if (AuthService.isLoggedIn()) {
        const user = AuthService.getCurrentUser();
        updateUserUI(user);
    } else {
        updateGuestUI();
    }
}

// Update UI for logged in user
function updateUserUI(user) {
    // Hide login/register buttons
    document.querySelectorAll('.login-btn, .register-btn').forEach(btn => {
        btn.style.display = 'none';
    });
    
    // Hide auth buttons container
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons) {
        authButtons.style.display = 'none';
    }
    
    // Get or create user dropdown
    let userDropdown = document.getElementById('user-dropdown');
    if (!userDropdown) {
        userDropdown = createUserDropdown(user.name || user.email, user.isAdmin ? 'admin' : 'user');
        // Always append to .utility-right if it exists (top bar is always present)
        const utilityRight = document.querySelector('.utility-right');
        if (utilityRight) {
            utilityRight.appendChild(userDropdown);
        } else if (document.querySelector('.header-main')) {
            document.querySelector('.header-main').appendChild(userDropdown);
        } else {
            document.body.appendChild(userDropdown);
        }
    } else {
        // Update existing dropdown
        const userName = userDropdown.querySelector('.user-name');
        if (userName) {
            userName.textContent = user.name || user.email;
        }
    }
    
    // Make sure the dropdown is visible
    userDropdown.style.display = 'block';
    
    // Show admin link if user is admin
    if (AuthService.isAdmin() && userDropdown) {
        const adminLink = document.createElement('a');
        adminLink.href = 'admin.html';
        adminLink.textContent = 'Admin Dashboard';
        
        const dropdownMenu = userDropdown.querySelector('.dropdown-menu');
        if (dropdownMenu) {
            // Check if admin link already exists
            const existingAdminLink = dropdownMenu.querySelector('a[href="admin.html"]');
            if (!existingAdminLink) {
                // Add admin link before logout
                const logoutLink = dropdownMenu.querySelector('#logout-link');
                if (logoutLink) {
                    dropdownMenu.insertBefore(adminLink, logoutLink);
                } else {
                    dropdownMenu.appendChild(adminLink);
                }
            }
        }
    }
    
    // After creating the user dropdown, add toggle functionality
    addUserDropdownToggle();
}

// Update UI for guest user
function updateGuestUI() {
    // Show login/register buttons
    document.querySelectorAll('.login-btn, .register-btn').forEach(btn => {
        btn.style.display = 'inline-block';
    });
    
    // Show auth buttons container
    const authButtons = document.querySelector('.auth-buttons');
            if (authButtons) {
                authButtons.style.display = 'flex';
            }
            
    // Hide user dropdown
    const userDropdown = document.getElementById('user-dropdown');
            if (userDropdown) {
                userDropdown.style.display = 'none';
            }
}

// Create user dropdown element
function createUserDropdown(userName, role) {
    const dropdown = document.createElement('div');
    dropdown.id = 'user-dropdown';
    dropdown.className = 'user-dropdown auth-dependent';
    
    const adminLink = AuthService.isAdmin() ? '<a href="admin.html">Admin Dashboard</a>' : '';
    
    dropdown.innerHTML = `
        <div class="user-info">
            <span class="user-name">${userName}</span>
            <i class="fas fa-chevron-down"></i>
        </div>
        <div class="dropdown-menu">
            <a href="#" id="profile-link">My Profile</a>
            <a href="#" id="papers-link">My Papers</a>
            ${adminLink}
            <a href="#" id="logout-link">Logout</a>
        </div>
    `;
    
    return dropdown;
}

// Show toast message
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
}

// Get proper error message from API error
function getAuthErrorMessage(error) {
    if (!error) return 'An unknown error occurred';
    
    if (error.code) {
        switch (error.code) {
        case 'auth/user-not-found':
                return 'No user found with this email address';
        case 'auth/wrong-password':
                return 'Incorrect password';
            case 'auth/invalid-email':
                return 'Invalid email format';
            case 'auth/email-already-in-use':
                return 'This email is already registered';
        case 'auth/weak-password':
                return 'Password is too weak. Use at least 6 characters';
            case 'auth/network-request-failed':
                return 'Network error. Please check your connection';
        default:
                return `Error: ${error.message}`;
        }
    }
    
    return error.message || 'An error occurred during authentication';
}

// After creating the user dropdown, add toggle functionality
function addUserDropdownToggle() {
    const userDropdown = document.getElementById('user-dropdown');
    if (!userDropdown) return;
    const userInfo = userDropdown.querySelector('.user-info');
    if (userInfo) {
        userInfo.addEventListener('click', function(e) {
            e.stopPropagation();
            userDropdown.classList.toggle('active');
        });
        // Hide dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!userDropdown.contains(e.target)) {
                userDropdown.classList.remove('active');
            }
        });
    }
    // Direct logout event (bulletproof)
    const logoutLink = userDropdown.querySelector('#logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            AuthService.logout();
            updateAuthUI();
            const currentPath = window.location.pathname;
            if (currentPath.includes('admin') || currentPath.includes('dashboard')) {
                window.location.href = '/';
            } else {
                location.reload();
            }
        });
    }
} 