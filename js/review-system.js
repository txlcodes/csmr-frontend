/**
 * Review System JavaScript
 * Handles all peer review functionality for research papers
 */

// API endpoints
const API_BASE_URL = 'http://localhost:5000/api';

// Review System Manager
class ReviewSystem {
    constructor() {
        this.currentUser = null;
        this.currentSection = 'author';
        this.init();
    }

    init() {
        this.checkAuthentication();
        this.setupEventListeners();
        this.loadDashboardData();
    }

    checkAuthentication() {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'index.html';
            return;
        }
        
        // Decode token to get user info
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            this.currentUser = payload;
        } catch (error) {
            console.error('Invalid token');
            window.location.href = 'index.html';
        }
    }

    setupEventListeners() {
        // Dashboard navigation
        document.querySelectorAll('.dashboard-nav a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.switchSection(section);
            });
        });

        // Review form submission
        const reviewForm = document.getElementById('peerReviewForm');
        if (reviewForm) {
            reviewForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitReview(e);
            });
        }
    }

    switchSection(section) {
        // Update navigation
        document.querySelectorAll('.dashboard-nav a').forEach(a => a.classList.remove('active'));
        document.querySelector(`[data-section="${section}"]`).classList.add('active');
        
        // Show/hide sections
        document.querySelectorAll('.dashboard-section').forEach(sec => sec.style.display = 'none');
        document.getElementById(section + '-dashboard').style.display = 'block';
        
        this.currentSection = section;
        this.loadDashboardData();
    }

    async loadDashboardData() {
        switch(this.currentSection) {
            case 'author':
                await this.loadAuthorSubmissions();
                break;
            case 'reviewer':
                await this.loadReviewerAssignments();
                break;
            case 'editor':
                await this.loadEditorialQueue();
                break;
            case 'stats':
                await this.loadStatistics();
                break;
        }
    }

    async loadAuthorSubmissions() {
        try {
            const response = await fetch(`${API_BASE_URL}/articles`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) throw new Error('Failed to load submissions');
            
            const data = await response.json();
            this.displayAuthorSubmissions(data.articles);
        } catch (error) {
            console.error('Error loading submissions:', error);
            this.showError('Failed to load submissions');
        }
    }

    displayAuthorSubmissions(articles) {
        const tbody = document.querySelector('#author-dashboard tbody');
        if (!tbody) return;
        
        tbody.innerHTML = articles.map(article => `
            <tr>
                <td>${article.manuscriptId || 'CSMR-2025-XXX'}</td>
                <td>${article.title}</td>
                <td>${article.journal?.title || 'Not assigned'}</td>
                <td>${new Date(article.submissionDate).toLocaleDateString()}</td>
                <td>${this.getStatusBadge(article.status)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn view-btn" onclick="reviewSystem.viewSubmission('${article._id}')">View</button>
                        ${article.status === 'revision-required' ? `
                            <button class="action-btn review-btn" onclick="reviewSystem.submitRevision('${article._id}')">Submit Revision</button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `).join('');
    }

    getStatusBadge(status) {
        const statusMap = {
            'submitted': 'submitted',
            'initial-review': 'submitted',
            'under-review': 'under-review',
            'revision-required': 'revision-required',
            'revised': 'under-review',
            'accepted': 'accepted',
            'rejected': 'rejected',
            'published': 'published',
            'withdrawn': 'rejected'
        };
        
        const displayStatus = {
            'submitted': 'Submitted',
            'initial-review': 'Initial Review',
            'under-review': 'Under Review',
            'revision-required': 'Revision Required',
            'revised': 'Revised - Under Review',
            'accepted': 'Accepted',
            'rejected': 'Rejected',
            'published': 'Published',
            'withdrawn': 'Withdrawn'
        };
        
        return `<span class="status-badge ${statusMap[status] || 'submitted'}">${displayStatus[status] || status}</span>`;
    }

    async loadReviewerAssignments() {
        // In a real implementation, this would fetch assigned papers for review
        const mockData = [
            {
                _id: '1',
                manuscriptId: 'CSMR-2025-003',
                title: 'Blockchain Technology in Sustainable Supply Chain: A Systematic Review',
                journal: { title: 'Innovation & Sustainability Review' },
                assignedDate: new Date('2025-01-18'),
                dueDate: new Date('2025-02-18'),
                reviewStatus: 'pending'
            },
            {
                _id: '2',
                manuscriptId: 'CSMR-2025-002',
                title: 'Climate Change Mitigation Strategies in Indian Agriculture Sector',
                journal: { title: 'Journal of Sustainable Management' },
                assignedDate: new Date('2025-01-16'),
                dueDate: new Date('2025-02-16'),
                reviewStatus: 'in-progress'
            }
        ];
        
        this.displayReviewerAssignments(mockData);
    }

    displayReviewerAssignments(assignments) {
        const tbody = document.querySelector('#reviewer-dashboard tbody');
        if (!tbody) return;
        
        tbody.innerHTML = assignments.map(assignment => `
            <tr>
                <td>${assignment.manuscriptId}</td>
                <td>${assignment.title}</td>
                <td>${assignment.journal.title}</td>
                <td>${assignment.assignedDate.toLocaleDateString()}</td>
                <td>${assignment.dueDate.toLocaleDateString()}</td>
                <td>${this.getReviewStatusBadge(assignment.reviewStatus)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn view-btn" onclick="reviewSystem.viewPaper('${assignment._id}')">View Paper</button>
                        ${assignment.reviewStatus === 'pending' ? `
                            <button class="action-btn review-btn" onclick="reviewSystem.startReview('${assignment._id}')">Submit Review</button>
                        ` : assignment.reviewStatus === 'in-progress' ? `
                            <button class="action-btn review-btn" onclick="reviewSystem.continueReview('${assignment._id}')">Continue Review</button>
                        ` : `
                            <button class="action-btn view-btn" onclick="reviewSystem.viewReview('${assignment._id}')">View My Review</button>
                        `}
                    </div>
                </td>
            </tr>
        `).join('');
    }

    getReviewStatusBadge(status) {
        const statusMap = {
            'pending': 'submitted',
            'in-progress': 'under-review',
            'submitted': 'accepted',
            'declined': 'rejected'
        };
        
        const displayStatus = {
            'pending': 'Pending Review',
            'in-progress': 'Review In Progress',
            'submitted': 'Review Submitted',
            'declined': 'Declined'
        };
        
        return `<span class="status-badge ${statusMap[status]}">${displayStatus[status]}</span>`;
    }

    async submitReview(event) {
        const formData = new FormData(event.target);
        const manuscriptId = formData.get('manuscriptId');
        
        const reviewData = {
            criteria: {
                originality: parseInt(formData.get('originality')),
                methodology: parseInt(formData.get('methodology')),
                results: parseInt(formData.get('results')),
                writingQuality: parseInt(formData.get('writing')),
                significance: 5 // Add significance field in form if needed
            },
            summary: formData.get('summary'),
            strengths: formData.get('strengths'),
            weaknesses: formData.get('weaknesses'),
            detailedComments: formData.get('comments'),
            confidentialComments: formData.get('confidential'),
            recommendation: formData.get('recommendation')
        };
        
        try {
            const response = await fetch(`${API_BASE_URL}/articles/${manuscriptId}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(reviewData)
            });
            
            if (!response.ok) throw new Error('Failed to submit review');
            
            const result = await response.json();
            this.showSuccess('Review submitted successfully!');
            this.closeReviewForm();
            this.loadDashboardData();
        } catch (error) {
            console.error('Error submitting review:', error);
            this.showError('Failed to submit review. Please try again.');
        }
    }

    // Reviewer Assignment Functions
    async assignReviewers(manuscriptId) {
        const selectedReviewers = document.querySelectorAll('.reviewer-card.selected');
        const reviewerIds = Array.from(selectedReviewers).map(card => card.dataset.reviewerId);
        
        if (reviewerIds.length === 0) {
            this.showError('Please select at least one reviewer');
            return;
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/articles/${manuscriptId}/assign-reviewers`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ reviewerIds })
            });
            
            if (!response.ok) throw new Error('Failed to assign reviewers');
            
            this.showSuccess(`${reviewerIds.length} reviewer(s) assigned successfully!`);
            this.closeAssignModal();
            this.loadDashboardData();
        } catch (error) {
            console.error('Error assigning reviewers:', error);
            this.showError('Failed to assign reviewers. Please try again.');
        }
    }

    // UI Helper Functions
    showReviewForm(manuscriptId) {
        document.getElementById('reviewFormModal').style.display = 'block';
        document.getElementById('reviewFormModal').dataset.manuscriptId = manuscriptId;
    }

    closeReviewForm() {
        document.getElementById('reviewFormModal').style.display = 'none';
    }

    showAssignModal(manuscriptId) {
        document.getElementById('assignReviewersModal').style.display = 'block';
        document.getElementById('assignReviewersModal').dataset.manuscriptId = manuscriptId;
        this.loadAvailableReviewers();
    }

    closeAssignModal() {
        document.getElementById('assignReviewersModal').style.display = 'none';
    }

    toggleReviewer(card) {
        card.classList.toggle('selected');
    }

    async loadAvailableReviewers() {
        // In a real implementation, this would fetch available reviewers from the backend
        const reviewers = [
            { _id: '1', name: 'Dr. Amit Verma', expertise: 'AI, Smart Cities, Sustainability', institution: 'IIT Delhi', reviewsCompleted: 23, avgReviewTime: 12 },
            { _id: '2', name: 'Dr. Sarah Johnson', expertise: 'Urban Planning, Smart Technologies', institution: 'MIT', reviewsCompleted: 45, avgReviewTime: 15 },
            { _id: '3', name: 'Dr. Ravi Shankar', expertise: 'IoT, Sustainable Development', institution: 'IISc Bangalore', reviewsCompleted: 31, avgReviewTime: 10 },
            { _id: '4', name: 'Dr. Maria Rodriguez', expertise: 'Environmental Engineering, AI', institution: 'Stanford University', reviewsCompleted: 38, avgReviewTime: 14 }
        ];
        
        const reviewerList = document.querySelector('.reviewer-list');
        reviewerList.innerHTML = reviewers.map(reviewer => `
            <div class="reviewer-card" data-reviewer-id="${reviewer._id}" onclick="reviewSystem.toggleReviewer(this)">
                <h4>${reviewer.name}</h4>
                <p><strong>Expertise:</strong> ${reviewer.expertise}</p>
                <p><strong>Institution:</strong> ${reviewer.institution}</p>
                <p><strong>Reviews Completed:</strong> ${reviewer.reviewsCompleted}</p>
                <p><strong>Avg. Review Time:</strong> ${reviewer.avgReviewTime} days</p>
            </div>
        `).join('');
    }

    // Navigation Functions
    viewSubmission(id) {
        window.location.href = `paper-details.html?id=${id}`;
    }

    viewPaper(id) {
        window.open(`paper-view.html?id=${id}`, '_blank');
    }

    viewArticle(doi) {
        window.open(`https://doi.org/${doi}`, '_blank');
    }

    submitRevision(id) {
        window.location.href = `submit-revision.html?id=${id}`;
    }

    startReview(id) {
        this.showReviewForm(id);
    }

    continueReview(id) {
        this.showReviewForm(id);
        // Load saved draft if available
    }

    viewReview(id) {
        window.location.href = `view-review.html?id=${id}`;
    }

    viewReviews(id) {
        window.location.href = `view-reviews.html?id=${id}`;
    }

    makeDecision(id) {
        window.location.href = `editorial-decision.html?id=${id}`;
    }

    // Utility Functions
    showSuccess(message) {
        // Implement toast notification
        alert(message); // Simple implementation
    }

    showError(message) {
        // Implement toast notification
        alert('Error: ' + message); // Simple implementation
    }

    saveReviewDraft() {
        // Save review draft to local storage or backend
        const formData = new FormData(document.getElementById('peerReviewForm'));
        const draft = {};
        for (let [key, value] of formData.entries()) {
            draft[key] = value;
        }
        localStorage.setItem('reviewDraft', JSON.stringify(draft));
        this.showSuccess('Review draft saved successfully!');
    }
}

// Initialize review system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.reviewSystem = new ReviewSystem();
}); 