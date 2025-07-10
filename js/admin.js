// Admin Panel functionality
console.log("Admin.js is loading...");

// --- Remove all Firebase imports and logic ---
// --- Implement backend JWT login and admin check ---

// DOM Elements
const sidebarLinks = document.querySelectorAll('.admin-sidebar a[data-section]');
const adminSections = document.querySelectorAll('.admin-section');
const adminLogoutBtn = document.getElementById('admin-logout');
const addJournalBtn = document.getElementById('add-journal-btn');
const journalModal = document.getElementById('journal-modal');
const journalForm = document.getElementById('journal-form');
const addAdminBtn = document.getElementById('add-admin-btn');
const adminModal = document.getElementById('admin-modal');
const adminForm = document.getElementById('admin-form');
const closeModalBtns = document.querySelectorAll('.close-modal');

// --- JWT Auth Check ---
function getCurrentUser() {
    const token = localStorage.getItem('token');
    let user = null;
    try {
        const userStr = localStorage.getItem('user');
        user = userStr ? JSON.parse(userStr) : null;
    } catch (e) {
        user = null;
    }
    return { token, user };
}

function requireAdmin() {
    const { token, user } = getCurrentUser();
    if (!token || !user || !user.isAdmin) {
        alert('You must be logged in as an admin to access this page.');
        window.location.href = 'index.html';
        return false;
    }
    // Optionally update UI with admin info
    updateAdminInfo(user);
    return true;
}

// Call requireAdmin on page load
if (!requireAdmin()) {
    // Stop further JS if not admin
    throw new Error('Not authorized');
}

// --- Setup event listeners (sidebar, logout, modals, etc.) ---
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
});

function setupEventListeners() {
    // Sidebar navigation
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = link.getAttribute('data-section');
            switchSection(targetSection);
        });
    });

    // Logout button
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            alert('Logged out successfully');
            window.location.href = 'index.html';
        });
    }

    // Add Journal button
    if (addJournalBtn) {
        addJournalBtn.addEventListener('click', () => {
            journalModal.style.display = 'block';
        });
    }

    // Add Admin button (master admin only)
    if (addAdminBtn) {
        addAdminBtn.addEventListener('click', () => {
            adminModal.style.display = 'block';
        });
    }

    // Close modal buttons
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.admin-modal').forEach(modal => {
                modal.style.display = 'none';
            });
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        document.querySelectorAll('.admin-modal').forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Journal form submission (to be implemented)
    if (journalForm) {
        journalForm.addEventListener('submit', handleJournalSubmit);
    }

    // Admin form submission (to be implemented)
    if (adminForm) {
        adminForm.addEventListener('submit', handleAdminSubmit);
    }
}

function updateAdminInfo(user) {
    // Update admin info in header (implement as needed)
    const adminName = document.querySelector('.admin-user .user-name');
    if (adminName) {
        adminName.textContent = user.name || user.email;
    }
    const adminRole = document.querySelector('.admin-user .user-role');
    if (adminRole) {
        adminRole.textContent = user.isAdmin ? 'Admin' : 'User';
    }
}

function switchSection(sectionId) {
    adminSections.forEach(section => {
        section.style.display = section.id === sectionId ? 'block' : 'none';
    });
}

// --- Placeholder handlers for journal/admin forms ---
function handleJournalSubmit(e) {
    e.preventDefault();
    alert('Journal form submission will be implemented with backend API.');
}
function handleAdminSubmit(e) {
    e.preventDefault();
    alert('Admin form submission will be implemented with backend API.');
} 