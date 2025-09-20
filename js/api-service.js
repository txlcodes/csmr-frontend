/**
 * API Service for Journal Publication Website
 * Connects frontend to backend API endpoints
 */
const API_URL = config.API_BASE_URL;
const API_ENDPOINTS = config.endpoints;

// Helper for making API requests with improved error handling
async function fetchAPI(endpoint, options = {}) {
  // Set default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add auth token if available
  const token = localStorage.getItem('token');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle different response types
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMessage = data.message || data.error || `HTTP error! status: ${response.status}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    // Log error in development only
    if (config.isDevelopment) {
      console.error('API Error:', error);
    }
    
    // Re-throw with user-friendly message
    throw new Error(error.message || 'Network error occurred. Please try again.');
  }
}

// Authentication Services
const AuthService = {
  // Register a new user
  async register(userData) {
    if (!userData || typeof userData !== 'object') {
      throw new Error('User data is required');
    }
    
    if (!userData.email || !userData.password) {
      throw new Error('Email and password are required');
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error('Please enter a valid email address');
    }
    
    // Password strength validation
    if (userData.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
    
    return fetchAPI('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Login user
  async login(email, password) {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Please enter a valid email address');
    }
    
    const data = await fetchAPI('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user || data));
    }
    
    return data;
  },

  // Logout user
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect to home page
    window.location.href = '/';
  },

  // Get current user
  getCurrentUser() {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      // If parsing fails, clear invalid data
      localStorage.removeItem('user');
      return null;
    }
  },

  // Check if user is logged in
  isLoggedIn() {
    const token = localStorage.getItem('token');
    const user = this.getCurrentUser();
    return !!(token && user);
  },

  // Check if user has admin privileges
  isAdmin() {
    const user = this.getCurrentUser();
    return user && user.role === 'admin';
  },

  // Check if user has author privileges
  isAuthor() {
    const user = this.getCurrentUser();
    return user && (user.role === 'author' || user.role === 'admin');
  },
};

// Journal Services
const JournalService = {
  // Get all journals
  async getJournals(params = '') {
    return fetchAPI(`/journals${params}`);
  },

  // Get a specific journal
  async getJournal(id) {
    return fetchAPI(`/journals/${id}`);
  },

  // Create a new journal (admin only)
  async createJournal(journalData) {
    return fetchAPI('/journals', {
      method: 'POST',
      body: JSON.stringify(journalData),
    });
  },
};

// Article Services
const ArticleService = {
  // Get all articles
  async getArticles(params = '') {
    return fetchAPI(`/articles${params}`);
  },

  // Get a specific article
  async getArticle(id) {
    if (!id) {
      throw new Error('Article ID is required');
    }
    return fetchAPI(`/articles/${id}`);
  },

  // Submit a new article
  async submitArticle(articleData) {
    if (!articleData || typeof articleData !== 'object') {
      throw new Error('Article data is required');
    }
    
    // Validate required fields
    const requiredFields = ['title', 'abstract', 'authors'];
    for (const field of requiredFields) {
      if (!articleData[field]) {
        throw new Error(`${field} is required`);
      }
    }
    
    // Validate authors array
    if (!Array.isArray(articleData.authors) || articleData.authors.length === 0) {
      throw new Error('At least one author is required');
    }
    
    // Validate PDF file
    if (!articleData.pdf || !(articleData.pdf instanceof File)) {
      throw new Error('PDF file is required');
    }
    
    // Check file size (max 10MB)
    if (articleData.pdf.size > 10 * 1024 * 1024) {
      throw new Error('PDF file size must be less than 10MB');
    }
    
    // Check file type
    if (articleData.pdf.type !== 'application/pdf') {
      throw new Error('Only PDF files are allowed');
    }
    
    // For file uploads, we need FormData
    const formData = new FormData();
    
    // Add article data
    for (const key in articleData) {
      if (key === 'authors') {
        formData.append(key, JSON.stringify(articleData[key]));
      } else if (key === 'pdf' && articleData[key] instanceof File) {
        formData.append('pdf', articleData[key]);
      } else {
        formData.append(key, articleData[key]);
      }
    }

    return fetchAPI('/articles', {
      method: 'POST',
      headers: {}, // Let browser set content type with boundary
      body: formData,
    });
  },

  // Update an article
  async updateArticle(id, articleData) {
    if (!id) {
      throw new Error('Article ID is required');
    }
    
    if (!articleData || typeof articleData !== 'object') {
      throw new Error('Article data is required');
    }
    
    return fetchAPI(`/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(articleData),
    });
  },

  // Delete an article
  async deleteArticle(id) {
    if (!id) {
      throw new Error('Article ID is required');
    }
    
    return fetchAPI(`/articles/${id}`, {
      method: 'DELETE',
    });
  },
};

// Contact Service
const ContactService = {
  // Submit contact form
  async submitContactForm(formData) {
    if (!formData || typeof formData !== 'object') {
      throw new Error('Form data is required');
    }
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'message'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        throw new Error(`${field} is required`);
      }
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      throw new Error('Please enter a valid email address');
    }
    
    // Validate message length
    if (formData.message.length < 10) {
      throw new Error('Message must be at least 10 characters long');
    }
    
    return fetchAPI('/contact', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  },
};

// Newsletter Service
const NewsletterService = {
  // Subscribe to newsletter
  async subscribe(email) {
    if (!email) {
      throw new Error('Email is required');
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Please enter a valid email address');
    }
    
    return fetchAPI('/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
};

// Call for Papers Service
const CFPService = {
  // Get call for papers
  async getCFPs() {
    return fetchAPI('/cfp');
  },
};

// Admin Panel Services
const AdminService = {
  // Get dashboard statistics
  async getDashboardStats() {
    return await fetchAPI(API_ENDPOINTS.ADMIN_DASHBOARD);
  },

  // Get all users
  async getUsers() {
    return await fetchAPI(API_ENDPOINTS.ADMIN_USERS);
  },

  // Get all articles
  async getArticles() {
    return await fetchAPI(API_ENDPOINTS.ADMIN_ARTICLES);
  },

  // Get all reviews
  async getReviews() {
    return await fetchAPI(API_ENDPOINTS.ADMIN_REVIEWS);
  },

  // Get notifications
  async getNotifications() {
    return await fetchAPI(API_ENDPOINTS.ADMIN_NOTIFICATIONS);
  },

  // Update user status
  async updateUserStatus(userId, status) {
    return await fetchAPI(`${API_ENDPOINTS.ADMIN_USERS}/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  },

  // Update article status
  async updateArticleStatus(articleId, status) {
    return await fetchAPI(`${API_ENDPOINTS.ADMIN_ARTICLES}/${articleId}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }
}; 