/**
 * Loading State Manager for CSMR Frontend
 * Provides consistent loading states and user feedback
 */

class LoadingManager {
    constructor() {
        this.loadingStates = new Map();
        this.setupGlobalStyles();
    }

    // Set up global loading styles
    setupGlobalStyles() {
        if (document.getElementById('loading-styles')) return;

        const style = document.createElement('style');
        style.id = 'loading-styles';
        style.textContent = `
            .loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255, 255, 255, 0.9);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                backdrop-filter: blur(2px);
            }

            .loading-spinner {
                width: 40px;
                height: 40px;
                border: 4px solid #f3f3f3;
                border-top: 4px solid #3498db;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }

            .loading-text {
                margin-top: 20px;
                font-size: 16px;
                color: #666;
                text-align: center;
            }

            .loading-button {
                position: relative;
                pointer-events: none;
                opacity: 0.7;
            }

            .loading-button::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 20px;
                height: 20px;
                margin: -10px 0 0 -10px;
                border: 2px solid #f3f3f3;
                border-top: 2px solid #3498db;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            .loading-card {
                background: white;
                padding: 30px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                text-align: center;
                max-width: 300px;
            }
        `;
        document.head.appendChild(style);
    }

    // Show full page loading
    showFullPageLoading(message = 'Loading...') {
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.id = 'full-page-loading';
        
        overlay.innerHTML = `
            <div class="loading-card">
                <div class="loading-spinner"></div>
                <div class="loading-text">${message}</div>
            </div>
        `;
        
        document.body.appendChild(overlay);
    }

    // Hide full page loading
    hideFullPageLoading() {
        const overlay = document.getElementById('full-page-loading');
        if (overlay) {
            overlay.remove();
        }
    }

    // Show loading state for a specific element
    showElementLoading(element, message = 'Loading...') {
        if (!element) return;

        const loadingId = `loading-${Date.now()}`;
        this.loadingStates.set(loadingId, element);

        // Store original content
        element.setAttribute('data-original-content', element.innerHTML);
        element.setAttribute('data-loading-id', loadingId);

        // Add loading class
        element.classList.add('loading-button');

        // Create loading content
        const loadingContent = `
            <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
                <div class="loading-spinner" style="width: 20px; height: 20px; border-width: 2px;"></div>
                <span>${message}</span>
            </div>
        `;

        element.innerHTML = loadingContent;
        element.disabled = true;

        return loadingId;
    }

    // Hide loading state for a specific element
    hideElementLoading(loadingId) {
        const element = this.loadingStates.get(loadingId);
        if (!element) return;

        // Restore original content
        const originalContent = element.getAttribute('data-original-content');
        if (originalContent) {
            element.innerHTML = originalContent;
        }

        // Remove loading class and attributes
        element.classList.remove('loading-button');
        element.removeAttribute('data-original-content');
        element.removeAttribute('data-loading-id');
        element.disabled = false;

        this.loadingStates.delete(loadingId);
    }

    // Show loading state for a form
    showFormLoading(form, message = 'Processing...') {
        if (!form) return;

        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            return this.showElementLoading(submitButton, message);
        }

        // If no submit button, show full page loading
        this.showFullPageLoading(message);
        return 'full-page';
    }

    // Hide form loading
    hideFormLoading(loadingId) {
        if (loadingId === 'full-page') {
            this.hideFullPageLoading();
        } else {
            this.hideElementLoading(loadingId);
        }
    }

    // Show loading state for a table or list
    showTableLoading(table, message = 'Loading data...') {
        if (!table) return;

        const tbody = table.querySelector('tbody');
        if (!tbody) return;

        // Store original content
        tbody.setAttribute('data-original-content', tbody.innerHTML);

        // Show loading row
        const rowCount = table.querySelectorAll('thead th').length;
        tbody.innerHTML = `
            <tr>
                <td colspan="${rowCount}" style="text-align: center; padding: 40px;">
                    <div class="loading-spinner" style="margin: 0 auto 20px;"></div>
                    <div class="loading-text">${message}</div>
                </td>
            </tr>
        `;
    }

    // Hide table loading
    hideTableLoading(table) {
        if (!table) return;

        const tbody = table.querySelector('tbody');
        if (!tbody) return;

        const originalContent = tbody.getAttribute('data-original-content');
        if (originalContent) {
            tbody.innerHTML = originalContent;
            tbody.removeAttribute('data-original-content');
        }
    }

    // Show loading state for a card or content area
    showContentLoading(container, message = 'Loading...') {
        if (!container) return;

        // Store original content
        container.setAttribute('data-original-content', container.innerHTML);

        // Show loading content
        container.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <div class="loading-spinner" style="margin: 0 auto 20px;"></div>
                <div class="loading-text">${message}</div>
            </div>
        `;
    }

    // Hide content loading
    hideContentLoading(container) {
        if (!container) return;

        const originalContent = container.getAttribute('data-original-content');
        if (originalContent) {
            container.innerHTML = originalContent;
            container.removeAttribute('data-original-content');
        }
    }

    // Show loading state for a button
    showButtonLoading(button, message = 'Loading...') {
        if (!button) return;

        return this.showElementLoading(button, message);
    }

    // Hide button loading
    hideButtonLoading(loadingId) {
        this.hideElementLoading(loadingId);
    }

    // Show loading state for a modal
    showModalLoading(modal, message = 'Processing...') {
        if (!modal) return;

        const content = modal.querySelector('.modal-content');
        if (!content) return;

        // Store original content
        content.setAttribute('data-original-content', content.innerHTML);

        // Show loading content
        content.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <div class="loading-spinner" style="margin: 0 auto 20px;"></div>
                <div class="loading-text">${message}</div>
            </div>
        `;
    }

    // Hide modal loading
    hideModalLoading(modal) {
        if (!modal) return;

        const content = modal.querySelector('.modal-content');
        if (!content) return;

        const originalContent = content.getAttribute('data-original-content');
        if (originalContent) {
            content.innerHTML = originalContent;
            content.removeAttribute('data-original-content');
        }
    }

    // Show loading state for a specific section
    showSectionLoading(section, message = 'Loading...') {
        if (!section) return;

        // Store original content
        section.setAttribute('data-original-content', section.innerHTML);

        // Show loading content
        section.innerHTML = `
            <div style="text-align: center; padding: 60px 20px;">
                <div class="loading-spinner" style="margin: 0 auto 20px;"></div>
                <div class="loading-text">${message}</div>
            </div>
        `;
    }

    // Hide section loading
    hideSectionLoading(section) {
        if (!section) return;

        const originalContent = section.getAttribute('data-original-content');
        if (originalContent) {
            section.innerHTML = originalContent;
            section.removeAttribute('data-original-content');
        }
    }

    // Clear all loading states
    clearAllLoading() {
        // Clear all element loading states
        this.loadingStates.forEach((element, loadingId) => {
            this.hideElementLoading(loadingId);
        });

        // Clear full page loading
        this.hideFullPageLoading();
    }

    // Check if any loading state is active
    isLoading() {
        return this.loadingStates.size > 0 || document.getElementById('full-page-loading') !== null;
    }
}

// Create and export global loading manager instance
const loadingManager = new LoadingManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = loadingManager;
}
