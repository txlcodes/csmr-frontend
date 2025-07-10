// Admin Dashboard JavaScript
// REMOVE ALL FIREBASE IMPORTS AND LOGIC
// Add backend API helpers for admin CRUD

const API_BASE = 'http://localhost:5000/api';

function getToken() {
    return localStorage.getItem('token');
}

function getAuthHeaders() {
    const token = getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// Journals CRUD
async function fetchJournals() {
    const res = await fetch(`${API_BASE}/journals`, { headers: getAuthHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch journals');
    return data;
}
async function createJournal(journalData) {
    const res = await fetch(`${API_BASE}/journals`, {
        method: 'POST',
        headers: { ...getAuthHeaders() },
        body: journalData // should be FormData for file upload
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create journal');
    return data;
}
async function updateJournal(id, journalData) {
    const res = await fetch(`${API_BASE}/journals/${id}`, {
        method: 'PUT',
        headers: { ...getAuthHeaders() },
        body: journalData // should be FormData for file upload
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update journal');
    return data;
}
async function deleteJournal(id) {
    const res = await fetch(`${API_BASE}/journals/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete journal');
    return data;
}

// Articles CRUD
async function fetchArticles() {
    const res = await fetch(`${API_BASE}/articles`, { headers: getAuthHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch articles');
    return data;
}
async function createArticle(articleData) {
    const res = await fetch(`${API_BASE}/articles`, {
        method: 'POST',
        headers: { ...getAuthHeaders() },
        body: articleData // should be FormData for file upload
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create article');
    return data;
}
async function updateArticle(id, articleData) {
    const res = await fetch(`${API_BASE}/articles/${id}`, {
        method: 'PUT',
        headers: { ...getAuthHeaders() },
        body: articleData // should be FormData for file upload
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update article');
    return data;
}
async function deleteArticle(id) {
    const res = await fetch(`${API_BASE}/articles/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete article');
    return data;
}

// CFP CRUD
async function fetchCFPs() {
    const res = await fetch(`${API_BASE}/cfp`, { headers: getAuthHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch CFPs');
    return data;
}
async function createCFP(cfpData) {
    const res = await fetch(`${API_BASE}/cfp`, {
        method: 'POST',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(cfpData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create CFP');
    return data;
}
async function updateCFP(id, cfpData) {
    const res = await fetch(`${API_BASE}/cfp/${id}`, {
        method: 'PUT',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(cfpData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update CFP');
    return data;
}
async function deleteCFP(id) {
    const res = await fetch(`${API_BASE}/cfp/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete CFP');
    return data;
}

// Newsletter CRUD (fetch subscribers)
async function fetchNewsletter() {
    const res = await fetch(`${API_BASE}/newsletter`, { headers: getAuthHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch newsletter subscribers');
    return data;
}

// Contact CRUD (fetch messages)
async function fetchContacts() {
    const res = await fetch(`${API_BASE}/contact`, { headers: getAuthHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch contact messages');
    return data;
}

// DOM Elements
const adminSections = document.querySelectorAll('.admin-section');
const menuItems = document.querySelectorAll('.menu-item a[data-section]');
const logoutBtns = document.querySelectorAll('#admin-logout, #header-logout');
const sidebarToggleBtn = document.querySelector('.sidebar-toggle');
const mobileToggleBtn = document.querySelector('.mobile-toggle');
const adminSidebar = document.querySelector('.admin-sidebar');
const loginRequiredModal = document.getElementById('login-required-modal');
const adminLoginForm = document.getElementById('admin-login-form');
const refreshBtn = document.querySelector('.btn-refresh');
const toastContainer = document.querySelector('.toast-container');

// State variables
let currentUser = null;
let userRole = null;
let chartsInitialized = false;
let submissionsChart = null;
let usersChart = null;
let editingJournalId = null;
let editingArticleId = null;

// Initialize the admin dashboard
document.addEventListener('DOMContentLoaded', () => {
    console.log('Admin Dashboard Initialized');
    
    // Check authentication state
    checkAuth();
    
    // Setup event listeners
    setupEventListeners();
});

// Authentication check
function checkAuth() {
    // This function is removed as per the instructions
}

// Setup all event listeners
function setupEventListeners() {
    // Menu navigation
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.getAttribute('data-section');
            navigateToSection(section);
        });
    });
    
    // Logout buttons
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await signOut(auth);
                showToast('Logged out successfully', 'success');
                window.location.href = 'index.html';
            } catch (error) {
                console.error('Logout error:', error);
                showToast('Logout failed', 'error');
            }
        });
    });
    
    // Sidebar toggle for mobile
    if (sidebarToggleBtn) {
        sidebarToggleBtn.addEventListener('click', () => {
            adminSidebar.classList.toggle('expanded');
        });
    }
    
    // Mobile toggle button
    if (mobileToggleBtn) {
        mobileToggleBtn.addEventListener('click', () => {
            adminSidebar.classList.toggle('expanded');
        });
    }
    
    // Admin login form
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('admin-email').value;
            const password = document.getElementById('admin-password').value;
            
            try {
                await signInWithEmailAndPassword(auth, email, password);
                // Auth state listener will handle the rest
            } catch (error) {
                console.error('Login error:', error);
                showToast('Login failed: ' + error.message, 'error');
            }
        });
    }
    
    // Refresh button
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            loadDashboardData();
            showToast('Dashboard refreshed', 'info');
        });
    }
    
    // Close login modal
    const closeModalBtns = document.querySelectorAll('.close-modal');
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            if (modal) {
                modal.classList.remove('show');
            }
        });
    });
    
    // Table action buttons
    document.addEventListener('click', (e) => {
        // View button
        if (e.target.closest('.btn-table-action') && e.target.classList.contains('fa-eye')) {
            const row = e.target.closest('tr');
            const itemId = row.dataset.id;
            const section = getActiveSection();
            viewItem(itemId, section);
        }
        
        // Edit button
        if (e.target.closest('.btn-table-action') && e.target.classList.contains('fa-edit')) {
            const row = e.target.closest('tr');
            const itemId = row.dataset.id;
            const section = getActiveSection();
            editItem(itemId, section);
        }
        
        // Delete button
        if (e.target.closest('.btn-table-action') && e.target.classList.contains('fa-trash')) {
            const row = e.target.closest('tr');
            const itemId = row.dataset.id;
            const itemName = row.cells[0].textContent;
            const section = getActiveSection();
            
            if (confirm(`Are you sure you want to delete "${itemName}"?`)) {
                deleteItem(itemId, section);
            }
        }
    });
}

// Navigate to a section
function navigateToSection(sectionId) {
    // Update active section
    adminSections.forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update active menu item
    menuItems.forEach(item => {
        item.parentElement.classList.remove('active');
    });
    
    const targetMenuItem = document.querySelector(`.menu-item a[data-section="${sectionId}"]`);
    if (targetMenuItem) {
        targetMenuItem.parentElement.classList.add('active');
    }
    
    // Update breadcrumbs
    const breadcrumbsCurrentPage = document.querySelector('.breadcrumbs .current-page');
    if (breadcrumbsCurrentPage) {
        breadcrumbsCurrentPage.textContent = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
    }
    
    // Load section data if needed
    loadSectionData(sectionId);
    
    // Initialize charts if dashboard section
    if (sectionId === 'dashboard' && !chartsInitialized) {
        initializeCharts();
    }
    
    // Close mobile sidebar
    if (window.innerWidth < 768) {
        adminSidebar.classList.remove('expanded');
    }
}

// Update user info in the dashboard
function updateUserInfo(userData) {
    const userNameElements = document.querySelectorAll('#user-name, .user-dropdown-btn .user-name');
    const userRoleElement = document.getElementById('user-role');
    const userAvatarLetterElements = document.querySelectorAll('#user-avatar-letter, .user-avatar.small span');
    
    // Set user name
    userNameElements.forEach(element => {
        if (element) {
            element.textContent = userData.name || userData.email.split('@')[0];
        }
    });
    
    // Set user role
    if (userRoleElement) {
        userRoleElement.textContent = userData.role === 'master' ? 'Master Admin' : 'Administrator';
    }
    
    // Set avatar letter
    userAvatarLetterElements.forEach(element => {
        if (element) {
            element.textContent = (userData.name || userData.email).charAt(0).toUpperCase();
        }
    });
}

// Show login required modal
function showLoginRequired(message) {
    if (loginRequiredModal) {
        const messageElement = loginRequiredModal.querySelector('.modal-body p');
        if (messageElement) {
            messageElement.textContent = message;
        }
        
        loginRequiredModal.classList.add('show');
    } else {
        // Fallback if modal not found
        alert('Authentication required: ' + message);
        window.location.href = 'index.html';
    }
}

// Get the currently active section
function getActiveSection() {
    const activeSection = document.querySelector('.admin-section.active');
    return activeSection ? activeSection.id : 'dashboard';
}

// Load data for the dashboard
async function loadDashboardData() {
    try {
        // Fetch statistics
        const stats = await fetchDashboardStats();
        updateDashboardStats(stats);
        
        // Fetch recent submissions
        const recentSubmissions = await fetchRecentSubmissions();
        updateRecentSubmissionsTable(recentSubmissions);
        
        // Fetch recent users
        const recentUsers = await fetchRecentUsers();
        updateRecentUsersTable(recentUsers);
        
        // Initialize or update charts
        if (!chartsInitialized) {
            initializeCharts();
        } else {
            updateCharts();
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showToast('Error loading dashboard data', 'error');
    }
}

// Fetch dashboard statistics
async function fetchDashboardStats() {
    // In a real app, this would fetch from Firebase
    // For demo purposes, using placeholder data
    return {
        journals: 4,
        articles: 156,
        submissions: 12,
        users: 245,
        journalsGrowth: 25,
        articlesGrowth: 12,
        submissionsGrowth: 8,
        usersGrowth: 15
    };
}

// Update dashboard statistics display
function updateDashboardStats(stats) {
    const statCards = document.querySelectorAll('.stat-card');
    
    if (statCards.length >= 4) {
        // Update journals stat
        statCards[0].querySelector('.stat-value').textContent = stats.journals;
        statCards[0].querySelector('.stat-change span').textContent = `${stats.journalsGrowth}%`;
        
        // Update articles stat
        statCards[1].querySelector('.stat-value').textContent = stats.articles;
        statCards[1].querySelector('.stat-change span').textContent = `${stats.articlesGrowth}%`;
        
        // Update submissions stat
        statCards[2].querySelector('.stat-value').textContent = stats.submissions;
        statCards[2].querySelector('.stat-change span').textContent = `${stats.submissionsGrowth}%`;
        
        // Update users stat
        statCards[3].querySelector('.stat-value').textContent = stats.users;
        statCards[3].querySelector('.stat-change span').textContent = `${stats.usersGrowth}%`;
    }
}

// Fetch recent submissions
async function fetchRecentSubmissions() {
    // In a real app, this would fetch from Firebase
    // For demo purposes, using placeholder data
    return [
        {
            id: 'sub1',
            title: 'Sustainable Supply Chain Management in Indian Manufacturing',
            author: 'Dr. Rajesh Kumar',
            journal: 'Journal of Sustainable Management',
            date: 'May 10, 2025',
            status: 'pending'
        },
        {
            id: 'sub2',
            title: 'The Impact of ESG Reporting on Financial Performance',
            author: 'Dr. Vikram Singh',
            journal: 'Innovation & Sustainability Review',
            date: 'May 8, 2025',
            status: 'pending'
        },
        {
            id: 'sub3',
            title: 'Sustainable Innovation in Small-Medium Enterprises',
            author: 'Dr. Meena Patel',
            journal: 'Management Studies Quarterly',
            date: 'May 5, 2025',
            status: 'approved'
        }
    ];
}

// Update the recent submissions table
function updateRecentSubmissionsTable(submissions) {
    const tableBody = document.querySelector('#dashboard .table-card:first-child .data-table tbody');
    
    if (tableBody) {
        tableBody.innerHTML = '';
        
        submissions.forEach(submission => {
            const row = document.createElement('tr');
            row.dataset.id = submission.id;
            
            row.innerHTML = `
                <td>${submission.title}</td>
                <td>${submission.author}</td>
                <td>${submission.journal}</td>
                <td>${submission.date}</td>
                <td><span class="status ${submission.status}">${submission.status.charAt(0).toUpperCase() + submission.status.slice(1)} Review</span></td>
                <td>
                    <div class="table-actions">
                        <button type="button" class="btn-table-action" title="View">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button type="button" class="btn-table-action" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button type="button" class="btn-table-action" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
    }
}

// Fetch recent users
async function fetchRecentUsers() {
    // In a real app, this would fetch from Firebase
    // For demo purposes, using placeholder data
    return [
        {
            id: 'user1',
            name: 'Dr. Rajesh Kumar',
            email: 'rajesh.kumar@example.com',
            date: 'May 9, 2025',
            role: 'Author'
        },
        {
            id: 'user2',
            name: 'Dr. Priya Sharma',
            email: 'priya.sharma@example.com',
            date: 'May 8, 2025',
            role: 'Author'
        },
        {
            id: 'user3',
            name: 'Dr. Anita Desai',
            email: 'anita.desai@example.com',
            date: 'May 7, 2025',
            role: 'Reviewer'
        }
    ];
}

// Update the recent users table
function updateRecentUsersTable(users) {
    const tableBody = document.querySelector('#dashboard .table-card:last-child .data-table tbody');
    
    if (tableBody) {
        tableBody.innerHTML = '';
        
        users.forEach(user => {
            const row = document.createElement('tr');
            row.dataset.id = user.id;
            
            row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.date}</td>
                <td>${user.role}</td>
                <td>
                    <div class="table-actions">
                        <button type="button" class="btn-table-action" title="View">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button type="button" class="btn-table-action" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button type="button" class="btn-table-action" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
    }
}

// Initialize charts
function initializeCharts() {
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded');
        return;
    }
    
    // Initialize submissions chart
    const submissionsChartElement = document.getElementById('submissions-chart');
    if (submissionsChartElement) {
        submissionsChart = new Chart(submissionsChartElement, {
            type: 'pie',
            data: {
                labels: [
                    'Journal of Sustainable Management',
                    'Innovation & Sustainability Review',
                    'Management Studies Quarterly',
                    'Sustainability Science & Policy'
                ],
                datasets: [{
                    data: [38, 25, 22, 15],
                    backgroundColor: [
                        '#3b82f6',
                        '#10b981',
                        '#f59e0b',
                        '#ef4444'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    // Initialize users chart
    const usersChartElement = document.getElementById('users-chart');
    if (usersChartElement) {
        usersChart = new Chart(usersChartElement, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'New Users',
                    data: [32, 45, 67, 89, 112, 125],
                    fill: false,
                    borderColor: '#3b82f6',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    chartsInitialized = true;
}

// Update charts with new data
function updateCharts() {
    if (!chartsInitialized) {
        initializeCharts();
        return;
    }
    
    // Update submissions chart
    if (submissionsChart) {
        submissionsChart.data.datasets[0].data = [38, 25, 22, 15];
        submissionsChart.update();
    }
    
    // Update users chart
    if (usersChart) {
        usersChart.data.datasets[0].data = [32, 45, 67, 89, 112, 125];
        usersChart.update();
    }
}

// Load section specific data
function loadSectionData(sectionId) {
    switch (sectionId) {
        case 'journals':
            loadJournalsData();
            break;
        case 'articles':
            loadArticlesData();
            break;
        case 'users':
            loadUsersData();
            break;
        case 'submissions':
            loadSubmissionsData();
            break;
        case 'admins':
            loadAdminsData();
            break;
        case 'newsletters':
            loadNewslettersData();
            break;
        case 'contacts':
            loadContactsData();
            break;
        case 'settings':
            loadSettingsData();
            break;
        case 'logs':
            loadLogsData();
            break;
    }
}

// Placeholder functions for loading section data
function loadJournalsData() {
    console.log('Loading journals data...');
}

function loadArticlesData() {
    console.log('Loading articles data...');
}

function loadUsersData() {
    console.log('Loading users data...');
}

function loadSubmissionsData() {
    console.log('Loading submissions data...');
}

function loadAdminsData() {
    console.log('Loading admins data...');
}

function loadNewslettersData() {
    console.log('Loading newsletters data...');
}

function loadContactsData() {
    console.log('Loading contacts data...');
}

function loadSettingsData() {
    console.log('Loading settings data...');
}

function loadLogsData() {
    console.log('Loading logs data...');
}

// View item details
function viewItem(itemId, section) {
    console.log(`Viewing ${section} item with ID: ${itemId}`);
    // This would typically open a modal with item details
    showToast(`Viewing item ${itemId} from ${section}`, 'info');
}

// Edit item
function editItem(itemId, section) {
    console.log(`Editing ${section} item with ID: ${itemId}`);
    // This would typically open a modal with edit form
    showToast(`Editing item ${itemId} from ${section}`, 'info');
}

// Delete item
async function deleteItem(itemId, section) {
    console.log(`Deleting ${section} item with ID: ${itemId}`);
    
    try {
        // In a real app, this would delete from Firebase
        // For demo purposes, just showing a toast
        showToast(`Item ${itemId} deleted from ${section}`, 'success');
        
        // Remove from UI
        const row = document.querySelector(`tr[data-id="${itemId}"]`);
        if (row) {
            row.remove();
        }
    } catch (error) {
        console.error(`Error deleting ${section} item:`, error);
        showToast(`Error deleting item: ${error.message}`, 'error');
    }
}

// Show toast notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    // Icon based on type
    let iconClass = 'info';
    if (type === 'success') iconClass = 'check-circle';
    if (type === 'error') iconClass = 'exclamation-circle';
    if (type === 'warning') iconClass = 'exclamation-triangle';
    
    toast.innerHTML = `
        <div class="toast-icon ${type}">
            <i class="fas fa-${iconClass}"></i>
        </div>
        <div class="toast-content">
            <p>${message}</p>
        </div>
        <button type="button" class="toast-close">&times;</button>
    `;
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Add close event
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 5000);
}

// --- Journals Section Logic ---

function showJournalsSection() {
    loadJournalsTable();
}

async function loadJournalsTable() {
    const tableBody = document.querySelector('#journals .data-table tbody');
    if (!tableBody) return;
    tableBody.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';
    try {
        const journals = await fetchJournals();
        tableBody.innerHTML = '';
        if (journals.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5">No journals found.</td></tr>';
        } else {
            journals.forEach(journal => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${journal.title}</td>
                    <td>${journal.issn || ''}</td>
                    <td>${journal.subject || ''}</td>
                    <td>${journal.articlesCount || 0}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-view" data-id="${journal._id}">View</button>
                            <button class="btn-edit" data-id="${journal._id}">Edit</button>
                            <button class="btn-delete" data-id="${journal._id}">Delete</button>
                        </div>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        }
    } catch (err) {
        tableBody.innerHTML = `<tr><td colspan="5">Error loading journals</td></tr>`;
        showToast('Failed to load journals', 'error');
    }
}

// Open Add Journal Modal
const addJournalBtn = document.getElementById('add-journal-btn');
const journalModal = document.getElementById('journal-modal');
const journalForm = document.getElementById('journal-form');
const closeModalBtns = document.querySelectorAll('.close-modal');

if (addJournalBtn && journalModal && journalForm) {
    addJournalBtn.onclick = () => {
        editingJournalId = null;
        journalForm.reset();
        journalModal.style.display = 'block';
    };
    closeModalBtns.forEach(btn => {
        btn.onclick = () => { journalModal.style.display = 'none'; };
    });
    window.onclick = (e) => {
        if (e.target === journalModal) journalModal.style.display = 'none';
    };
    journalForm.onsubmit = async (e) => {
        e.preventDefault();
        const title = document.getElementById('journal-title').value.trim();
        const issn = document.getElementById('journal-issn').value.trim();
        const subject = document.getElementById('journal-subject').value;
        const description = document.getElementById('journal-description').value.trim();
        const data = { title, issn, subject, description };
        try {
            if (editingJournalId) {
                await updateJournal(editingJournalId, JSON.stringify(data));
                showToast('Journal updated', 'success');
            } else {
                await createJournal(JSON.stringify(data));
                showToast('Journal created', 'success');
            }
            journalModal.style.display = 'none';
            journalForm.reset();
            editingJournalId = null;
            loadJournalsTable();
        } catch (err) {
            showToast('Failed to save journal', 'error');
        }
    };
}

// Handle Edit/Delete buttons
const journalsSection = document.getElementById('journals');
if (journalsSection) {
    journalsSection.addEventListener('click', async (e) => {
        if (e.target.classList.contains('btn-edit')) {
            const id = e.target.dataset.id;
            try {
                const journals = await fetchJournals();
                const journal = journals.find(j => j._id === id);
                if (journal) {
                    document.getElementById('journal-title').value = journal.title;
                    document.getElementById('journal-issn').value = journal.issn || '';
                    document.getElementById('journal-subject').value = journal.subject || '';
                    document.getElementById('journal-description').value = journal.description || '';
                    editingJournalId = id;
                    journalModal.style.display = 'block';
                }
            } catch (err) {
                showToast('Failed to load journal', 'error');
            }
        }
        if (e.target.classList.contains('btn-delete')) {
            const id = e.target.dataset.id;
            if (confirm('Are you sure you want to delete this journal?')) {
                try {
                    await deleteJournal(id);
                    showToast('Journal deleted', 'success');
                    loadJournalsTable();
                } catch (err) {
                    showToast('Failed to delete journal', 'error');
                }
            }
        }
    });
}

// Show journals section when navigated
const menuItems = document.querySelectorAll('.menu-item a[data-section]');
menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
        if (item.getAttribute('data-section') === 'journals') {
            showJournalsSection();
        }
    });
});

// --- Articles Section Logic ---

function showArticlesSection() {
    loadArticlesTable();
}

async function loadArticlesTable() {
    const tableBody = document.querySelector('#articles .data-table tbody');
    if (!tableBody) return;
    tableBody.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';
    try {
        const articles = await fetchArticles();
        tableBody.innerHTML = '';
        if (articles.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5">No articles found.</td></tr>';
        } else {
            articles.forEach(article => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${article.title}</td>
                    <td>${article.journal?.title || article.journal || ''}</td>
                    <td>${Array.isArray(article.authors) ? article.authors.join(', ') : article.authors || ''}</td>
                    <td>${article.status || ''}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-view" data-id="${article._id}">View</button>
                            <button class="btn-edit" data-id="${article._id}">Edit</button>
                            <button class="btn-delete" data-id="${article._id}">Delete</button>
                        </div>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        }
    } catch (err) {
        tableBody.innerHTML = `<tr><td colspan="5">Error loading articles</td></tr>`;
        showToast('Failed to load articles', 'error');
    }
}

const addArticleBtn = document.getElementById('add-article-btn');
const articleModal = document.getElementById('article-modal');
const articleForm = document.getElementById('article-form');

if (addArticleBtn && articleModal && articleForm) {
    addArticleBtn.onclick = () => {
        editingArticleId = null;
        articleForm.reset();
        articleModal.style.display = 'block';
    };
    articleForm.onsubmit = async (e) => {
        e.preventDefault();
        const title = document.getElementById('article-title').value.trim();
        const journal = document.getElementById('article-journal').value.trim();
        const authors = document.getElementById('article-authors').value.trim().split(',').map(a => a.trim());
        const status = document.getElementById('article-status').value;
        const abstract = document.getElementById('article-abstract').value.trim();
        const data = { title, journal, authors, status, abstract };
        try {
            if (editingArticleId) {
                await updateArticle(editingArticleId, JSON.stringify(data));
                showToast('Article updated', 'success');
            } else {
                await createArticle(JSON.stringify(data));
                showToast('Article created', 'success');
            }
            articleModal.style.display = 'none';
            articleForm.reset();
            editingArticleId = null;
            loadArticlesTable();
        } catch (err) {
            showToast('Failed to save article', 'error');
        }
    };
    document.querySelectorAll('#article-modal .close-modal').forEach(btn => {
        btn.onclick = () => { articleModal.style.display = 'none'; };
    });
    window.onclick = (e) => {
        if (e.target === articleModal) articleModal.style.display = 'none';
    };
}

const articlesSection = document.getElementById('articles');
if (articlesSection) {
    articlesSection.addEventListener('click', async (e) => {
        if (e.target.classList.contains('btn-edit')) {
            const id = e.target.dataset.id;
            try {
                const articles = await fetchArticles();
                const article = articles.find(a => a._id === id);
                if (article) {
                    document.getElementById('article-title').value = article.title;
                    document.getElementById('article-journal').value = article.journal?.title || article.journal || '';
                    document.getElementById('article-authors').value = Array.isArray(article.authors) ? article.authors.join(', ') : article.authors || '';
                    document.getElementById('article-status').value = article.status || 'submitted';
                    document.getElementById('article-abstract').value = article.abstract || '';
                    editingArticleId = id;
                    articleModal.style.display = 'block';
                }
            } catch (err) {
                showToast('Failed to load article', 'error');
            }
        }
        if (e.target.classList.contains('btn-delete')) {
            const id = e.target.dataset.id;
            if (confirm('Are you sure you want to delete this article?')) {
                try {
                    await deleteArticle(id);
                    showToast('Article deleted', 'success');
                    loadArticlesTable();
                } catch (err) {
                    showToast('Failed to delete article', 'error');
                }
            }
        }
    });
}

// --- CFP Section Logic ---
let editingCFPId = null;

function showCFPSection() {
    loadCFPTable();
}

async function loadCFPTable() {
    const tableBody = document.querySelector('#cfp .data-table tbody');
    if (!tableBody) return;
    tableBody.innerHTML = '<tr><td colspan="4">Loading...</td></tr>';
    try {
        const cfps = await fetchCFPs();
        tableBody.innerHTML = '';
        if (cfps.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4">No CFPs found.</td></tr>';
        } else {
            cfps.forEach(cfp => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${cfp.title}</td>
                    <td>${cfp.deadline ? new Date(cfp.deadline).toLocaleDateString() : ''}</td>
                    <td>${cfp.status || ''}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-edit" data-id="${cfp._id}">Edit</button>
                            <button class="btn-delete" data-id="${cfp._id}">Delete</button>
                        </div>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        }
    } catch (err) {
        tableBody.innerHTML = `<tr><td colspan="4">Error loading CFPs</td></tr>`;
        showToast('Failed to load CFPs', 'error');
    }
}

const addCFPBtn = document.getElementById('add-cfp-btn');
const cfpModal = document.getElementById('cfp-modal');
const cfpForm = document.getElementById('cfp-form');

if (addCFPBtn && cfpModal && cfpForm) {
    addCFPBtn.onclick = () => {
        editingCFPId = null;
        cfpForm.reset();
        cfpModal.style.display = 'block';
    };
    cfpForm.onsubmit = async (e) => {
        e.preventDefault();
        const title = document.getElementById('cfp-title').value.trim();
        const deadline = document.getElementById('cfp-deadline').value;
        const status = document.getElementById('cfp-status').value;
        const description = document.getElementById('cfp-description').value.trim();
        const data = { title, deadline, status, description };
        try {
            if (editingCFPId) {
                await updateCFP(editingCFPId, data);
                showToast('CFP updated', 'success');
            } else {
                await createCFP(data);
                showToast('CFP created', 'success');
            }
            cfpModal.style.display = 'none';
            cfpForm.reset();
            editingCFPId = null;
            loadCFPTable();
        } catch (err) {
            showToast('Failed to save CFP', 'error');
        }
    };
    document.querySelectorAll('#cfp-modal .close-modal').forEach(btn => {
        btn.onclick = () => { cfpModal.style.display = 'none'; };
    });
    window.onclick = (e) => {
        if (e.target === cfpModal) cfpModal.style.display = 'none';
    };
}

const cfpSection = document.getElementById('cfp');
if (cfpSection) {
    cfpSection.addEventListener('click', async (e) => {
        if (e.target.classList.contains('btn-edit')) {
            const id = e.target.dataset.id;
            try {
                const cfps = await fetchCFPs();
                const cfp = cfps.find(c => c._id === id);
                if (cfp) {
                    document.getElementById('cfp-title').value = cfp.title;
                    document.getElementById('cfp-deadline').value = cfp.deadline ? cfp.deadline.split('T')[0] : '';
                    document.getElementById('cfp-status').value = cfp.status || 'open';
                    document.getElementById('cfp-description').value = cfp.description || '';
                    editingCFPId = id;
                    cfpModal.style.display = 'block';
                }
            } catch (err) {
                showToast('Failed to load CFP', 'error');
            }
        }
        if (e.target.classList.contains('btn-delete')) {
            const id = e.target.dataset.id;
            if (confirm('Are you sure you want to delete this CFP?')) {
                try {
                    await deleteCFP(id);
                    showToast('CFP deleted', 'success');
                    loadCFPTable();
                } catch (err) {
                    showToast('Failed to delete CFP', 'error');
                }
            }
        }
    });
}

// --- Newsletter Section Logic ---
function showNewsletterSection() {
    loadNewsletterTable();
}

async function loadNewsletterTable() {
    const tableBody = document.querySelector('#newsletters .data-table tbody');
    if (!tableBody) return;
    tableBody.innerHTML = '<tr><td colspan="3">Loading...</td></tr>';
    try {
        const subscribers = await fetchNewsletter();
        tableBody.innerHTML = '';
        if (!subscribers.length) {
            tableBody.innerHTML = '<tr><td colspan="3">No subscribers found.</td></tr>';
        } else {
            subscribers.forEach(sub => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${sub.email}</td>
                    <td>${sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : ''}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-delete" data-id="${sub._id}">Delete</button>
                        </div>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        }
    } catch (err) {
        tableBody.innerHTML = `<tr><td colspan="3">Error loading subscribers</td></tr>`;
        showToast('Failed to load subscribers', 'error');
    }
}

const newslettersSection = document.getElementById('newsletters');
if (newslettersSection) {
    newslettersSection.addEventListener('click', async (e) => {
        if (e.target.classList.contains('btn-delete')) {
            const id = e.target.dataset.id;
            if (confirm('Are you sure you want to delete this subscriber?')) {
                try {
                    await deleteNewsletter(id);
                    showToast('Subscriber deleted', 'success');
                    loadNewsletterTable();
                } catch (err) {
                    showToast('Failed to delete subscriber', 'error');
                }
            }
        }
    });
}

// --- Contact Section Logic ---
function showContactsSection() {
    loadContactsTable();
}

async function loadContactsTable() {
    const tableBody = document.querySelector('#contacts .data-table tbody');
    if (!tableBody) return;
    tableBody.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';
    try {
        const contacts = await fetchContacts();
        tableBody.innerHTML = '';
        if (!contacts.length) {
            tableBody.innerHTML = '<tr><td colspan="5">No contact requests found.</td></tr>';
        } else {
            contacts.forEach(contact => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${contact.name || ''}</td>
                    <td>${contact.email || ''}</td>
                    <td>${contact.message || ''}</td>
                    <td>${contact.createdAt ? new Date(contact.createdAt).toLocaleDateString() : ''}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-delete" data-id="${contact._id}">Delete</button>
                        </div>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        }
    } catch (err) {
        tableBody.innerHTML = `<tr><td colspan="5">Error loading contact requests</td></tr>`;
        showToast('Failed to load contact requests', 'error');
    }
}

const contactsSection = document.getElementById('contacts');
if (contactsSection) {
    contactsSection.addEventListener('click', async (e) => {
        if (e.target.classList.contains('btn-delete')) {
            const id = e.target.dataset.id;
            if (confirm('Are you sure you want to delete this contact request?')) {
                try {
                    await deleteContact(id);
                    showToast('Contact request deleted', 'success');
                    loadContactsTable();
                } catch (err) {
                    showToast('Failed to delete contact request', 'error');
                }
            }
        }
    });
}

// --- Section Navigation ---
menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
        const section = item.getAttribute('data-section');
        if (section === 'journals') showJournalsSection();
        if (section === 'articles') showArticlesSection();
        if (section === 'cfp') showCFPSection();
        if (section === 'newsletters') showNewsletterSection();
        if (section === 'contacts') showContactsSection();
    });
}); 