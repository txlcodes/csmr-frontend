/**
 * API Service for Journal Publication Website
 * Connects frontend to backend API endpoints
 */
const API_URL = 'http://localhost:5000/api';

// Helper for making API requests
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

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Authentication Services
const AuthService = {
  // Register a new user
  async register(userData) {
    return fetchAPI('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Login user
  async login(email, password) {
    const data = await fetchAPI('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
    }
    
    return data;
  },

  // Logout user
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  },

  // Check if user is logged in
  isLoggedIn() {
    return !!localStorage.getItem('token');
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
    return fetchAPI(`/articles/${id}`);
  },

  // Submit a new article
  async submitArticle(articleData) {
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
};

// Contact Service
const ContactService = {
  // Submit contact form
  async submitContactForm(formData) {
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