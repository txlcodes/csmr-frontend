/**
 * Centre for Sustainability and Management Research (CSMR)
 * Paper Submission and Management using Firebase
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the submission page
    if (window.location.pathname.includes('submission-guidelines')) {
        // Add submission form at the bottom of the page
        createSubmissionForm();
        setupSubmissionForm();
    }
    
    // Check if we're on the author dashboard
    if (window.location.pathname.includes('author-dashboard')) {
        loadAuthorDashboard();
    }
    
    setupPaperForms();
    setupPaperInterface();
});

// Create paper submission form
function createSubmissionForm() {
    const submissionSection = document.createElement('section');
    submissionSection.className = 'submission-form-section';
    
    submissionSection.innerHTML = `
        <div class="container">
            <h2 class="section-title">Submit Your Manuscript</h2>
            <div class="auth-required-message">
                <p>Please <a href="#" class="login-link">login</a> or <a href="#" class="register-link">register</a> to submit your manuscript.</p>
            </div>
            
            <div class="submission-form-container" style="display: none;">
                <form id="paper-submission-form">
                    <div class="form-group">
                        <label for="paper-title">Paper Title*</label>
                        <input type="text" id="paper-title" name="title" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="paper-abstract">Abstract*</label>
                        <textarea id="paper-abstract" name="abstract" rows="5" required></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="paper-journal">Select Journal*</label>
                        <select id="paper-journal" name="journal" required>
                            <option value="">Select a journal</option>
                            <!-- Journals will be loaded dynamically -->
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="paper-keywords">Keywords*</label>
                        <input type="text" id="paper-keywords" name="keywords" placeholder="Separate with commas" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="paper-file">Manuscript File* (PDF or Word document)</label>
                        <input type="file" id="paper-file" name="manuscript" accept=".pdf,.doc,.docx" required>
                    </div>
                    
                    <div class="form-message"></div>
                    
                    <button type="submit" class="btn primary-btn">Submit Manuscript</button>
                </form>
            </div>
        </div>
    `;
    
    // Add the submission section to the page
    document.body.appendChild(submissionSection);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .submission-form-section {
            padding: 60px 0;
            background-color: #f8f8f8;
        }
        
        .submission-form-container {
            max-width: 800px;
            margin: 0 auto;
            background-color: #fff;
            padding: 30px;
            border-radius: 5px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .auth-required-message {
            max-width: 800px;
            margin: 0 auto 20px;
            padding: 20px;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            text-align: center;
        }
        
        .auth-required-message p {
            font-size: 18px;
            margin: 0;
        }
        
        .auth-required-message a {
            color: #00277a;
            font-weight: bold;
            text-decoration: underline;
        }
    `;
    
    document.head.appendChild(style);
}

// Set up submission form
function setupSubmissionForm() {
    // Check if user is authenticated
    updateSubmissionFormVisibility();
    
    // Set up login/register links
    const loginLink = document.querySelector('.login-link');
    const registerLink = document.querySelector('.register-link');
    
    if (loginLink) {
        loginLink.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('login-modal').style.display = 'block';
        });
    }
    
    if (registerLink) {
        registerLink.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('register-modal').style.display = 'block';
        });
    }
    
    // Load journals for dropdown
    loadJournals();
    
    // Set up form submission
    const submissionForm = document.getElementById('paper-submission-form');
    if (submissionForm) {
        submissionForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const title = document.getElementById('paper-title').value.trim();
            const abstract = document.getElementById('paper-abstract').value.trim();
            const journal = document.getElementById('paper-journal').value;
            const keywordsString = document.getElementById('paper-keywords').value.trim();
            const manuscriptFile = document.getElementById('paper-file').files[0];
            const messageDiv = this.querySelector('.form-message');
            
            // Basic validation
            if (!title || !abstract || !journal || !keywordsString || !manuscriptFile) {
                messageDiv.textContent = 'All fields are required.';
                messageDiv.className = 'form-message error';
                return;
            }
            
            // Prepare form data
            const keywords = keywordsString.split(',').map(keyword => keyword.trim());
            
            const paperData = {
                title,
                abstract,
                journal,
                keywords,
                manuscript: manuscriptFile
            };
            
            // Disable submit button and show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            
            try {
                // Submit paper
                await submitPaper(paperData);
                
                // Show success message
                messageDiv.textContent = 'Your manuscript has been submitted successfully!';
                messageDiv.className = 'form-message success';
                
                // Reset form
                this.reset();
            } catch (error) {
                console.error('Paper submission error:', error);
                messageDiv.textContent = error.message || 'An error occurred. Please try again later.';
                messageDiv.className = 'form-message error';
            } finally {
                // Reset button
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Submit Manuscript';
            }
        });
    }
}

// Load journals for dropdown
async function loadJournals() {
    const journalSelect = document.getElementById('paper-journal');
    
    if (!journalSelect) {
        return;
    }
    
    try {
        const journals = await getJournals();
        
        // Clear existing options except the first one
        while (journalSelect.options.length > 1) {
            journalSelect.remove(1);
        }
        
        // Add journal options
        journals.forEach(journal => {
            const option = document.createElement('option');
            option.value = journal._id;
            option.textContent = journal.name;
            journalSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading journals:', error);
    }
}

// Update submission form visibility based on authentication
function updateSubmissionFormVisibility() {
    const authRequiredMessage = document.querySelector('.auth-required-message');
    const submissionFormContainer = document.querySelector('.submission-form-container');
    
    if (isAuthenticated()) {
        if (authRequiredMessage) authRequiredMessage.style.display = 'none';
        if (submissionFormContainer) submissionFormContainer.style.display = 'block';
    } else {
        if (authRequiredMessage) authRequiredMessage.style.display = 'block';
        if (submissionFormContainer) submissionFormContainer.style.display = 'none';
    }
}

// Load author dashboard
async function loadAuthorDashboard() {
    // Check if user is authenticated
    if (!isAuthenticated()) {
        window.location.href = '/';
        return;
    }
    
    try {
        // Get user's papers
        const papers = await getMyPapers();
        
        // Create dashboard container if it doesn't exist
        let dashboardContainer = document.querySelector('.author-dashboard');
        
        if (!dashboardContainer) {
            dashboardContainer = document.createElement('section');
            dashboardContainer.className = 'author-dashboard';
            dashboardContainer.innerHTML = `
                <div class="container">
                    <h1 class="page-title">Author Dashboard</h1>
                    <div class="dashboard-content">
                        <div class="papers-list">
                            <h2>My Submissions</h2>
                            <div class="papers-container"></div>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(dashboardContainer);
        }
        
        // Populate papers list
        const papersContainer = dashboardContainer.querySelector('.papers-container');
        
        if (papers.length === 0) {
            papersContainer.innerHTML = '<p class="no-papers">You have not submitted any papers yet.</p>';
        } else {
            papersContainer.innerHTML = '';
            
            papers.forEach(paper => {
                const paperCard = document.createElement('div');
                paperCard.className = 'paper-card';
                
                const statusClass = getStatusClass(paper.status);
                
                paperCard.innerHTML = `
                    <h3 class="paper-title">${paper.title}</h3>
                    <div class="paper-meta">
                        <span class="paper-journal">${paper.journal.name}</span>
                        <span class="paper-date">Submitted: ${new Date(paper.submissionDate).toLocaleDateString()}</span>
                    </div>
                    <div class="paper-status ${statusClass}">
                        <span>${formatStatus(paper.status)}</span>
                    </div>
                    <div class="paper-actions">
                        <button class="btn view-paper" data-id="${paper._id}">View Details</button>
                    </div>
                `;
                
                papersContainer.appendChild(paperCard);
            });
            
            // Add event listeners for paper actions
            setupPaperActions();
        }
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .author-dashboard {
                padding: 60px 0;
            }
            
            .dashboard-content {
                margin-top: 30px;
            }
            
            .papers-list {
                background-color: #fff;
                border-radius: 5px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                padding: 30px;
            }
            
            .papers-list h2 {
                margin-top: 0;
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 1px solid #eee;
            }
            
            .no-papers {
                text-align: center;
                padding: 20px;
                color: #666;
                font-style: italic;
            }
            
            .paper-card {
                padding: 20px;
                border: 1px solid #eee;
                border-radius: 5px;
                margin-bottom: 15px;
            }
            
            .paper-title {
                margin-top: 0;
                margin-bottom: 10px;
            }
            
            .paper-meta {
                display: flex;
                justify-content: space-between;
                margin-bottom: 15px;
                color: #666;
                font-size: 14px;
            }
            
            .paper-status {
                display: inline-block;
                padding: 5px 10px;
                border-radius: 3px;
                font-size: 14px;
                font-weight: 600;
                margin-bottom: 15px;
            }
            
            .paper-status.draft {
                background-color: #e3f2fd;
                color: #1565c0;
            }
            
            .paper-status.submitted {
                background-color: #e8f5e9;
                color: #2e7d32;
            }
            
            .paper-status.under-review {
                background-color: #fff8e1;
                color: #f57f17;
            }
            
            .paper-status.revision {
                background-color: #fff3e0;
                color: #e65100;
            }
            
            .paper-status.accepted {
                background-color: #e8f5e9;
                color: #2e7d32;
            }
            
            .paper-status.rejected {
                background-color: #ffebee;
                color: #c62828;
            }
            
            .paper-actions {
                display: flex;
                justify-content: flex-end;
            }
            
            .paper-actions button {
                margin-left: 10px;
            }
        `;
        
        document.head.appendChild(style);
        
    } catch (error) {
        console.error('Error loading author dashboard:', error);
    }
}

// Setup paper action buttons
function setupPaperActions() {
    const viewButtons = document.querySelectorAll('.view-paper');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const paperId = this.getAttribute('data-id');
            window.location.href = `/paper-details.html?id=${paperId}`;
        });
    });
}

// Helper function to format paper status
function formatStatus(status) {
    switch (status) {
        case 'draft':
            return 'Draft';
        case 'submitted':
            return 'Submitted';
        case 'under_review':
            return 'Under Review';
        case 'revision_required':
            return 'Revision Required';
        case 'accepted':
            return 'Accepted';
        case 'rejected':
            return 'Rejected';
        default:
            return status;
    }
}

// Helper function to get status class
function getStatusClass(status) {
    switch (status) {
        case 'draft':
            return 'draft';
        case 'submitted':
            return 'submitted';
        case 'under_review':
            return 'under-review';
        case 'revision_required':
            return 'revision';
        case 'accepted':
            return 'accepted';
        case 'rejected':
            return 'rejected';
        default:
            return '';
    }
}

// Setup paper submission forms and interfaces
function setupPaperForms() {
    const paperForm = document.getElementById('paper-submission-form');
    
    if (paperForm) {
        // Initialize journal dropdown
        initializeJournalDropdown();
        
        // Handle file selection UI
        const fileInput = document.getElementById('manuscript-file');
        const fileLabel = document.querySelector('.file-label');
        
        if (fileInput && fileLabel) {
            fileInput.addEventListener('change', function() {
                if (this.files.length > 0) {
                    const fileName = this.files[0].name;
                    fileLabel.textContent = fileName;
                    fileLabel.classList.add('has-file');
                } else {
                    fileLabel.textContent = 'Choose manuscript file (.docx, .pdf)';
                    fileLabel.classList.remove('has-file');
                }
            });
        }
        
        // Handle form submission
        paperForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!isAuthenticated()) {
                showToast('Please log in to submit a paper', 'error');
                return;
            }
            
            // Get form data
            const titleInput = document.getElementById('paper-title');
            const abstractInput = document.getElementById('paper-abstract');
            const keywordsInput = document.getElementById('paper-keywords');
            const journalSelect = document.getElementById('paper-journal');
            const manuscriptFile = fileInput.files[0];
            const submitButton = paperForm.querySelector('button[type="submit"]');
            
            // Validate form data
            if (!validatePaperForm(titleInput, abstractInput, keywordsInput, journalSelect, manuscriptFile)) {
                return;
            }
            
            // Disable form while submitting
            Array.from(paperForm.elements).forEach(element => {
                element.disabled = true;
            });
            submitButton.textContent = 'Submitting...';
            
            try {
                // Create paper submission object
                const paperData = {
                    title: titleInput.value,
                    abstract: abstractInput.value,
                    keywords: keywordsInput.value.split(',').map(keyword => keyword.trim()),
                    journal: journalSelect.value,
                    manuscript: manuscriptFile
                };
                
                // Submit paper
                await submitPaper(paperData);
                
                // Show success message
                showToast('Your paper has been submitted successfully!', 'success');
                
                // Reset form
                paperForm.reset();
                fileLabel.textContent = 'Choose manuscript file (.docx, .pdf)';
                fileLabel.classList.remove('has-file');
                
                // Redirect to papers list page after short delay
                setTimeout(() => {
                    window.location.href = 'my-papers.html';
                }, 3000);
            } catch (error) {
                console.error('Paper submission error:', error);
                showToast('Paper submission failed. Please try again later.', 'error');
            } finally {
                // Re-enable form
                Array.from(paperForm.elements).forEach(element => {
                    element.disabled = false;
                });
                submitButton.textContent = 'Submit Paper';
            }
        });
    }
}

// Setup paper listing and management interface
function setupPaperInterface() {
    const papersList = document.getElementById('my-papers-list');
    
    if (papersList) {
        loadUserPapers();
    }
}

// Initialize journal dropdown with available journals
async function initializeJournalDropdown() {
    const journalSelect = document.getElementById('paper-journal');
    
    if (!journalSelect) return;
    
    try {
        // Fetch journals from backend
        const journals = await getJournals();
        
        // Clear existing options except the default one
        const defaultOption = journalSelect.querySelector('option[value=""]');
        journalSelect.innerHTML = '';
        
        if (defaultOption) {
            journalSelect.appendChild(defaultOption);
        }
        
        // Add journal options
        journals.forEach(journal => {
            const option = document.createElement('option');
            option.value = journal.id;
            option.textContent = journal.title;
            journalSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading journals:', error);
        showToast('Failed to load journal list', 'error');
    }
}

// Load and display user's papers
async function loadUserPapers() {
    const papersList = document.getElementById('my-papers-list');
    
    if (!papersList) return;
    
    // Check authentication
    if (!isAuthenticated()) {
        showAuthPrompt(papersList);
        return;
    }
    
    const loadingElem = document.createElement('div');
    loadingElem.className = 'loading-indicator';
    loadingElem.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading your papers...';
    papersList.appendChild(loadingElem);
    
    try {
        // Fetch user's papers from backend
        const papers = await getMyPapers();
        
        // Remove loading indicator
        papersList.removeChild(loadingElem);
        
        if (papers.length === 0) {
            showNoPapersMessage(papersList);
            return;
        }
        
        // Display papers
        displayPapers(papers, papersList);
    } catch (error) {
        console.error('Error loading papers:', error);
        papersList.removeChild(loadingElem);
        
        const errorElem = document.createElement('div');
        errorElem.className = 'error-message';
        errorElem.textContent = 'Failed to load your papers. Please try again later.';
        papersList.appendChild(errorElem);
    }
}

// Display papers in the list
function displayPapers(papers, container) {
    papers.forEach(paper => {
        const paperCard = document.createElement('div');
        paperCard.className = 'paper-card';
        
        // Format date
        let submittedDate = 'Date not available';
        if (paper.submittedAt) {
            const date = new Date(paper.submittedAt.seconds * 1000);
            submittedDate = date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        }
        
        // Determine status badge class
        let statusClass = '';
        switch (paper.status) {
            case 'submitted':
                statusClass = 'status-submitted';
                break;
            case 'under-review':
                statusClass = 'status-reviewing';
                break;
            case 'reviewed':
                statusClass = 'status-reviewed';
                break;
            case 'accepted':
                statusClass = 'status-accepted';
                break;
            case 'rejected':
                statusClass = 'status-rejected';
                break;
            default:
                statusClass = 'status-submitted';
        }
        
        paperCard.innerHTML = `
            <div class="paper-header">
                <h3 class="paper-title">${paper.title}</h3>
                <span class="paper-status ${statusClass}">${formatStatus(paper.status)}</span>
            </div>
            <p class="paper-abstract">${truncateText(paper.abstract, 200)}</p>
            <div class="paper-meta">
                <span class="paper-date">Submitted: ${submittedDate}</span>
                <span class="paper-journal">${paper.journalName || 'Journal information not available'}</span>
            </div>
            <div class="paper-actions">
                <a href="paper-details.html?id=${paper.id}" class="btn secondary-btn">View Details</a>
                ${paper.manuscriptURL ? `<a href="${paper.manuscriptURL}" target="_blank" class="btn outline-btn">Download Manuscript</a>` : ''}
            </div>
        `;
        
        container.appendChild(paperCard);
    });
}

// Show message when user has no papers
function showNoPapersMessage(container) {
    const noPapersElem = document.createElement('div');
    noPapersElem.className = 'no-papers-message';
    noPapersElem.innerHTML = `
        <p>You haven't submitted any papers yet.</p>
        <a href="submission-guidelines.html" class="btn primary-btn">Submit a Paper</a>
    `;
    container.appendChild(noPapersElem);
}

// Show authentication prompt for non-logged in users
function showAuthPrompt(container) {
    const authPrompt = document.createElement('div');
    authPrompt.className = 'auth-prompt';
    authPrompt.innerHTML = `
        <p>Please log in to view your paper submissions.</p>
        <button class="btn primary-btn login-prompt-btn">Login</button>
    `;
    container.appendChild(authPrompt);
    
    // Add event listener to login button
    const loginBtn = authPrompt.querySelector('.login-prompt-btn');
    loginBtn.addEventListener('click', () => {
        document.querySelector('.login-btn').click();
    });
}

// Validate paper submission form
function validatePaperForm(titleInput, abstractInput, keywordsInput, journalSelect, manuscriptFile) {
    // Validate title
    if (!titleInput.value.trim()) {
        showToast('Please enter a title for your paper', 'error');
        titleInput.focus();
        return false;
    }
    
    // Validate abstract
    if (!abstractInput.value.trim()) {
        showToast('Please enter an abstract for your paper', 'error');
        abstractInput.focus();
        return false;
    }
    
    if (abstractInput.value.trim().length < 100) {
        showToast('Abstract should be at least 100 characters', 'error');
        abstractInput.focus();
        return false;
    }
    
    // Validate keywords
    if (!keywordsInput.value.trim()) {
        showToast('Please enter keywords for your paper', 'error');
        keywordsInput.focus();
        return false;
    }
    
    // Validate journal selection
    if (!journalSelect.value) {
        showToast('Please select a journal for your submission', 'error');
        journalSelect.focus();
        return false;
    }
    
    // Validate file
    if (!manuscriptFile) {
        showToast('Please upload your manuscript file', 'error');
        return false;
    }
    
    // Check file type
    const allowedTypes = [
        'application/pdf', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword'
    ];
    
    if (!allowedTypes.includes(manuscriptFile.type)) {
        showToast('Please upload a PDF or Word document (.pdf, .docx, .doc)', 'error');
        return false;
    }
    
    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (manuscriptFile.size > maxSize) {
        showToast('File size exceeds 10MB limit', 'error');
        return false;
    }
    
    return true;
}

// Helper function to truncate text with ellipsis
function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
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

// Backend API helpers for papers
async function submitPaper(paperData) {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    for (const key in paperData) {
        if (paperData[key] !== undefined && paperData[key] !== null) {
            formData.append(key, paperData[key]);
        }
    }
    const response = await fetch('http://localhost:5000/api/articles', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to submit paper');
    return data;
}

async function getJournals() {
    const response = await fetch('http://localhost:5000/api/journals');
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch journals');
    return data;
}

async function getMyPapers() {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/articles', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch papers');
    // Optionally filter by user if backend does not
    return data;
}

function isAuthenticated() {
    return !!localStorage.getItem('token');
} 