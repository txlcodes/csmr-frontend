// Simplified Admin Panel functionality (no Firebase dependencies)
console.log("admin-simple.js is loading...");

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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded in admin-simple.js");
    
    // Add admin role class to body
    document.body.classList.add('role-master');
    
    // Update admin info
    updateAdminInfo({
        name: 'Test Admin',
        email: 'admin@test.com',
        role: 'master'
    });
    
    // Set up event listeners
    setupEventListeners();
    
    // Load demo data
    loadDashboardData();
});

// Setup all event listeners
function setupEventListeners() {
    console.log("Setting up event listeners");
    
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
            if (confirm('Are you sure you want to logout?')) {
                window.location.href = 'index.html';
            }
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
    
    // Journal form submission
    if (journalForm) {
        journalForm.addEventListener('submit', handleJournalSubmit);
    }
    
    // Admin form submission
    if (adminForm) {
        adminForm.addEventListener('submit', handleAdminSubmit);
    }
    
    // Edit and delete buttons
    document.addEventListener('click', (e) => {
        // Journal edit buttons
        if (e.target.classList.contains('btn-edit') && e.target.closest('#journals')) {
            const row = e.target.closest('tr');
            const journalTitle = row.cells[0].textContent;
            editJournal(journalTitle);
        }
        
        // Journal delete buttons
        if (e.target.classList.contains('btn-delete') && e.target.closest('#journals')) {
            const row = e.target.closest('tr');
            const journalTitle = row.cells[0].textContent;
            if (confirm(`Are you sure you want to delete "${journalTitle}"?`)) {
                deleteJournal(journalTitle);
            }
        }
        
        // Admin edit buttons
        if (e.target.classList.contains('btn-edit') && e.target.closest('#admins')) {
            const row = e.target.closest('tr');
            const adminEmail = row.cells[1].textContent;
            editAdmin(adminEmail);
        }
        
        // Admin delete buttons
        if (e.target.classList.contains('btn-delete') && e.target.closest('#admins')) {
            const row = e.target.closest('tr');
            const adminEmail = row.cells[1].textContent;
            if (confirm(`Are you sure you want to remove "${adminEmail}" as admin?`)) {
                removeAdmin(adminEmail);
            }
        }
    });
    
    console.log("Event listeners set up successfully");
}

// Switch between admin panel sections
function switchSection(sectionId) {
    console.log("Switching to section:", sectionId);
    
    // Hide all sections
    adminSections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Remove active class from all links
    sidebarLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
    }
    
    // Add active class to clicked link
    const activeLink = document.querySelector(`.admin-sidebar a[data-section="${sectionId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Update admin info in the header
function updateAdminInfo(userData) {
    console.log("Updating admin info with:", userData);
    
    const adminNameElements = document.querySelectorAll('.admin-user .user-name');
    const adminRoleElements = document.querySelectorAll('.admin-user .user-role');
    const adminAvatarElements = document.querySelectorAll('.admin-user .user-avatar');
    
    adminNameElements.forEach(el => {
        el.textContent = userData.name || userData.email;
    });
    
    adminRoleElements.forEach(el => {
        el.textContent = userData.role === 'master' ? 'Master Admin' : 'Admin';
    });
    
    adminAvatarElements.forEach(el => {
        el.textContent = (userData.name || userData.email).charAt(0).toUpperCase();
    });
}

// Load dashboard data
function loadDashboardData() {
    console.log("Loading dashboard data");
    
    // Placeholder data
    const stats = {
        journals: 4,
        articles: 156,
        submissions: 12,
        users: 245
    };
    
    // Update stat cards
    const statCards = document.querySelectorAll('.stat-card .stat-value');
    if (statCards.length >= 4) {
        statCards[0].textContent = stats.journals;
        statCards[1].textContent = stats.articles;
        statCards[2].textContent = stats.submissions;
        statCards[3].textContent = stats.users;
    }
}

// Handle journal form submission
function handleJournalSubmit(e) {
    e.preventDefault();
    console.log("Journal form submitted");
    
    const title = document.getElementById('journal-title').value;
    const issn = document.getElementById('journal-issn').value;
    const subject = document.getElementById('journal-subject').value;
    const description = document.getElementById('journal-description').value;
    
    // Add new row to the table
    const journalsTable = document.querySelector('#journals .data-table tbody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${title}</td>
        <td>${issn}</td>
        <td>${subject.charAt(0).toUpperCase() + subject.slice(1)}</td>
        <td>0</td>
        <td>
            <div class="action-buttons">
                <button class="btn-view">View</button>
                <button class="btn-edit">Edit</button>
                <button class="btn-delete">Delete</button>
            </div>
        </td>
    `;
    journalsTable.appendChild(newRow);
    
    // Close modal and reset form
    journalModal.style.display = 'none';
    journalForm.reset();
    
    showToast('Journal added successfully', 'success');
}

// Handle admin form submission
function handleAdminSubmit(e) {
    e.preventDefault();
    console.log("Admin form submitted");
    
    const name = document.getElementById('admin-name').value;
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;
    const role = document.getElementById('admin-role').value;
    
    // Add new row to the table
    const adminsTable = document.querySelector('#admins .data-table tbody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${name}</td>
        <td>${email}</td>
        <td>${role === 'master' ? 'Master Admin' : 'Admin'}</td>
        <td>Active</td>
        <td>
            <div class="action-buttons">
                <button class="btn-edit">Edit</button>
                <button class="btn-delete">Remove</button>
            </div>
        </td>
    `;
    adminsTable.appendChild(newRow);
    
    // Close modal and reset form
    adminModal.style.display = 'none';
    adminForm.reset();
    
    showToast('Administrator added successfully', 'success');
}

// Edit journal
function editJournal(journalTitle) {
    console.log("Editing journal:", journalTitle);
    
    // Populate journal form with dummy data
    document.getElementById('journal-title').value = journalTitle;
    document.getElementById('journal-issn').value = '1234-5678';
    document.getElementById('journal-subject').value = 'sustainability';
    document.getElementById('journal-description').value = 'Sample journal description';
    
    // Show modal
    journalModal.style.display = 'block';
    
    showToast(`Editing journal: ${journalTitle}`, 'info');
}

// Delete journal
function deleteJournal(journalTitle) {
    console.log("Deleting journal:", journalTitle);
    
    // Remove the row from the table
    const journalsTable = document.querySelector('#journals .data-table tbody');
    const rows = journalsTable.querySelectorAll('tr');
    
    rows.forEach(row => {
        if (row.cells[0].textContent === journalTitle) {
            row.remove();
        }
    });
    
    showToast(`Journal "${journalTitle}" deleted successfully`, 'success');
}

// Edit admin
function editAdmin(adminEmail) {
    console.log("Editing admin:", adminEmail);
    
    // Populate admin form with dummy data
    document.getElementById('admin-name').value = 'Admin User';
    document.getElementById('admin-email').value = adminEmail;
    document.getElementById('admin-password').value = '';
    document.getElementById('admin-role').value = 'admin';
    
    // Show modal
    adminModal.style.display = 'block';
    
    showToast(`Editing admin: ${adminEmail}`, 'info');
}

// Remove admin
function removeAdmin(adminEmail) {
    console.log("Removing admin:", adminEmail);
    
    // Remove the row from the table
    const adminsTable = document.querySelector('#admins .data-table tbody');
    const rows = adminsTable.querySelectorAll('tr');
    
    rows.forEach(row => {
        if (row.cells[1].textContent === adminEmail) {
            row.remove();
        }
    });
    
    showToast(`Admin "${adminEmail}" removed successfully`, 'success');
}

// Show toast notification
function showToast(message, type = 'info') {
    console.log(`Toast: ${type} - ${message}`);
    
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toast-container');
    
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        document.body.appendChild(toastContainer);
        
        // Add toast styles if not already in the CSS
        if (!document.getElementById('toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
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
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    // Add toast to container
    toastContainer.appendChild(toast);
    
    // Auto-remove toast after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease-out forwards';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
} 