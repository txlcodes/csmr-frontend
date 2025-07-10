/**
 * Centre for Sustainability and Management Research (CSMR)
 * JavaScript Functionality - Taylor & Francis Inspired
 */

// Main script for CSMR website

// Check if user is logged in on page load
document.addEventListener('DOMContentLoaded', function() {
    // Update navigation based on screen size
    updateNavigation();
    
    // Handle responsive navigation
    setupResponsiveNav();
    
    // Setup tab navigation where needed
    setupTabs();
    
    // Setup scrolling effects
    setupScrollEffects();
    
    // Setup accordion functionality
    setupAccordions();
    
    // Initialize newsletter subscription
    initNewsletterForm();
    
    // Check authentication status
    checkAuthStatus();
    
    // Add custom event listeners
    addEventListeners();
    
    console.log('CSMR Website Loaded!');
    
    // Check if login/register buttons exist
    const loginBtn = document.querySelector('.login-btn');
    const registerBtn = document.querySelector('.register-btn');
    
    if (loginBtn) {
        console.log('Login button found in DOM');
    } else {
        console.error('Login button NOT found in DOM');
    }
    
    if (registerBtn) {
        console.log('Register button found in DOM');
    } else {
        console.error('Register button NOT found in DOM');
    }
    
    // Intersection Observer for reveal animations
    const revealElements = document.querySelectorAll('.benefit-item, .journal-card, .article-card, .stat-item, .panel-wrapper > *');
    
    // Create observer for fade-in animations
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    
    // Observe all elements that should animate on scroll
    revealElements.forEach(el => {
        el.classList.add('reveal-animation');
        revealObserver.observe(el);
    });
    
    // Mobile Menu Toggle with improved animation
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const body = document.body;
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('mobile-active');
            body.classList.toggle('menu-open');
            
            const icon = mobileMenuToggle.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        });
    }
    
    // Dropdown menus - touch-friendly toggle
    const dropdownItems = document.querySelectorAll('.has-dropdown');
    
    dropdownItems.forEach(item => {
        // For mobile/touch devices
        const link = item.querySelector('a');
        
        if (window.matchMedia('(max-width: 992px)').matches) {
            link.addEventListener('click', function(e) {
                if (!item.classList.contains('dropdown-active')) {
                    e.preventDefault();
                    
                    // Close any open dropdowns
                    dropdownItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('dropdown-active');
                        }
                    });
                    
                    item.classList.toggle('dropdown-active');
                }
            });
        }
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.has-dropdown')) {
            dropdownItems.forEach(item => {
                item.classList.remove('dropdown-active');
            });
        }
    });
    
    // Tab functionality for article section with smooth transitions
    const tabLinks = document.querySelectorAll('.tabs-nav li');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (tabLinks.length > 0) {
        tabLinks.forEach(function(tab) {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs
                tabLinks.forEach(function(t) {
                    t.classList.remove('active');
                });
                
                // Add active class to current tab
                this.classList.add('active');
                
                // Hide all tab contents
                tabContents.forEach(function(content) {
                    content.classList.remove('active');
                });
                
                // Show current tab content with fade effect
                const tabId = this.getAttribute('data-tab');
                const activeContent = document.getElementById(tabId);
                
                setTimeout(() => {
                    activeContent.classList.add('active');
                }, 50);
            });
        });
    }
    
    // Animation for counter stats with easing
    const statNumbers = document.querySelectorAll('.stat-number');
    
    function easeOutQuad(t) {
        return t * (2 - t);
    }
    
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2500; // Animation duration in milliseconds
        let startTime = null;
        
        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const easedProgress = easeOutQuad(progress);
            const current = Math.floor(easedProgress * target);
            
            element.textContent = current;
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                element.textContent = target;
            }
        }
        
        window.requestAnimationFrame(step);
    }
    
    // Improved Intersection Observer for counter animation
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    animateCounter(entry.target);
                }, 300); // Small delay for better visual effect
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3, rootMargin: '0px 0px -100px 0px' });
    
    statNumbers.forEach(number => {
        counterObserver.observe(number);
    });
    
    // Enhanced header behavior on scroll
    const header = document.querySelector('.sticky-header');
    const topBar = document.querySelector('.top-utility-bar');
    let lastScrollTop = 0;
    
    function handleHeaderScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add shadow and condensed class when scrolled
        if (scrollTop > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll direction for better UX on mobile
        if (window.innerWidth < 992) {
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                // Scrolling down
                header.classList.add('header-hidden');
            } else {
                // Scrolling up
                header.classList.remove('header-hidden');
            }
        }
        
        lastScrollTop = scrollTop;
    }
    
    window.addEventListener('scroll', handleHeaderScroll);
    
    // Floating CTA with improved behavior
    const floatingCta = document.querySelector('.floating-cta');
    const heroSection = document.querySelector('.hero-section');
    const footerSection = document.querySelector('.main-footer');
    
    if (floatingCta && heroSection) {
        window.addEventListener('scroll', function() {
            const heroHeight = heroSection.offsetHeight;
            const scrollPosition = window.scrollY + window.innerHeight;
            const footerPosition = footerSection ? footerSection.offsetTop : document.body.scrollHeight;
            
            if (window.scrollY > heroHeight) {
                floatingCta.classList.add('visible');
                
                // Hide when footer is visible
                if (scrollPosition > footerPosition - 100) {
                    floatingCta.classList.add('hidden');
                } else {
                    floatingCta.classList.remove('hidden');
                }
            } else {
                floatingCta.classList.remove('visible');
            }
        });
    }
    
    // Content page functionality for sidebar navigation
    const contentSidebar = document.querySelector('.content-navigation');
    const contentSections = document.querySelectorAll('.content-section');
    
    if (contentSidebar && contentSections.length > 0) {
        // Highlight active section on scroll
        window.addEventListener('scroll', function() {
            // Get current scroll position with a slight offset for better UX
            const scrollY = window.scrollY + 100;
            
            // Find the current section in view
            contentSections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    // Remove active class from all links
                    document.querySelectorAll('.nav-links a').forEach(link => {
                        link.classList.remove('active');
                    });
                    
                    // Add active class to corresponding sidebar link
                    const activeLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        });
        
        // Make sidebar sticky on scroll
        const contentGrid = document.querySelector('.content-grid');
        
        if (contentGrid) {
            const stickyObserver = new IntersectionObserver(
                ([e]) => {
                    contentSidebar.classList.toggle('sticky-sidebar', e.intersectionRatio < 1);
                }, 
                { threshold: [1] }
            );
            
            stickyObserver.observe(contentGrid);
            
            // Adjust sidebar height for longer content
            function adjustSidebarHeight() {
                const mainContent = document.querySelector('.content-main');
                if (mainContent && window.innerWidth > 992) {
                    const mainHeight = mainContent.offsetHeight;
                    contentSidebar.style.maxHeight = `${mainHeight}px`;
                } else {
                    contentSidebar.style.maxHeight = 'auto';
                }
            }
            
            window.addEventListener('load', adjustSidebarHeight);
            window.addEventListener('resize', adjustSidebarHeight);
        }
    }
    
    // Add content box hover effects
    const contentBoxes = document.querySelectorAll('.content-box');
    if (contentBoxes.length > 0) {
        contentBoxes.forEach(box => {
            box.addEventListener('mouseenter', function() {
                this.classList.add('hover');
            });
            
            box.addEventListener('mouseleave', function() {
                this.classList.remove('hover');
            });
        });
    }
    
    // Enhanced smooth scrolling for anchor links with offset for header
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL but don't jump
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // Load more button with enhanced loading simulation
    const loadMoreBtn = document.querySelector('.load-more');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            const articlesGrid = document.querySelector('.articles-grid');
            
            if (articlesGrid) {
                // Change button state to loading
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                this.disabled = true;
                this.classList.add('loading');
                
                setTimeout(() => {
                    // In a real implementation, you would append new articles here
                    // This is just a simulation
                    this.innerHTML = 'No more articles available';
                    this.disabled = true;
                    this.classList.remove('loading');
                    this.classList.add('inactive');
                    
                    // Show message
                    const messageEl = document.createElement('p');
                    messageEl.className = 'load-more-message';
                    messageEl.textContent = 'You have reached the end of the article list';
                    messageEl.style.textAlign = 'center';
                    messageEl.style.color = 'var(--gray-medium)';
                    messageEl.style.fontSize = '0.9rem';
                    messageEl.style.marginTop = '1rem';
                    
                    this.parentNode.appendChild(messageEl);
                }, 1800);
            }
        });
    }
    
    // Enhanced search bar with suggestions
    const searchBar = document.querySelector('.search-bar');
    
    if (searchBar) {
        const searchForm = searchBar.querySelector('form');
        const searchInput = searchBar.querySelector('input');
        
        // Focus effect
        searchInput.addEventListener('focus', function() {
            searchBar.classList.add('focused');
        });
        
        searchInput.addEventListener('blur', function() {
            searchBar.classList.remove('focused');
        });
        
        // Form submission
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const query = searchInput.value.trim();
            
            if (query) {
                // Simulate search - in real implementation this would redirect
                searchInput.value = '';
                alert('Searching for: ' + query);
            }
        });
    }
    
    // Add scroll reveal class to body after initial load
    setTimeout(() => {
        document.body.classList.add('reveal-ready');
    }, 500);
});

// Add CSS class on page load complete
window.addEventListener('load', function() {
    document.body.classList.add('page-loaded');
});

// Initialize database in production environment
if (window.location.hostname.includes('netlify.app') || window.location.hostname.includes('csmr.org.in')) {
    fetch('/.netlify/functions/init-db')
        .then(response => response.json())
        .then(data => {
            console.log('Database initialization:', data);
        })
        .catch(error => {
            console.error('Database initialization error:', error);
        });
}

// Check if user is authenticated and update UI accordingly
function checkAuthStatus() {
    const token = localStorage.getItem('token');
    let user = null;
    try {
        const userStr = localStorage.getItem('user');
        user = userStr ? JSON.parse(userStr) : null;
    } catch (e) {
        user = null;
    }
    
    if (token && user) {
        // User is logged in
        console.log('User is authenticated:', user);
        
        // Update UI elements that depend on authentication
        document.querySelectorAll('.auth-dependent').forEach(el => {
            el.style.display = 'block';
        });
        
        document.querySelectorAll('.guest-only').forEach(el => {
            el.style.display = 'none';
        });
        
        // Show admin links if user is admin
        if (user.isAdmin) {
            document.querySelectorAll('.admin-only').forEach(el => {
                el.style.display = 'block';
            });
        }
    } else {
        // User is not logged in
        console.log('No authenticated user');
        
        document.querySelectorAll('.auth-dependent').forEach(el => {
            el.style.display = 'none';
        });
        
        document.querySelectorAll('.guest-only').forEach(el => {
            el.style.display = 'block';
        });
        
        document.querySelectorAll('.admin-only').forEach(el => {
            el.style.display = 'none';
        });
    }
}

// Add various event listeners
function addEventListeners() {
    // Search form
    const searchForm = document.querySelector('.search-bar form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchTerm = this.querySelector('input').value;
            if (searchTerm) {
                window.location.href = `search-results.html?q=${encodeURIComponent(searchTerm)}`;
            }
        });
    }
    
    // Submit paper buttons
    document.querySelectorAll('.submit-paper-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const token = localStorage.getItem('token');
            if (!token) {
                e.preventDefault();
                // Trigger login modal
                const loginModal = document.getElementById('login-modal');
                if (loginModal) {
                    loginModal.style.display = 'block';
                    showToast('Please login to submit a paper', 'info');
                }
            }
            // If authenticated, the default link behavior takes over
        });
    });
    
    // Language dropdown
    const langDropdown = document.querySelector('.language-dropdown select');
    if (langDropdown) {
        langDropdown.addEventListener('change', function() {
            // Just a demo - real implementation would change the page language
            showToast(`Language changed to ${this.options[this.selectedIndex].text}`, 'info');
        });
    }
}

// Handle responsive navigation
function setupResponsiveNav() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('show');
            this.classList.toggle('active');
        });
    }
    
    // Dropdown toggle on mobile
    document.querySelectorAll('.has-dropdown > a').forEach(item => {
        item.addEventListener('click', function(e) {
            if (window.innerWidth < 1024) {
                e.preventDefault();
                const dropdown = this.nextElementSibling;
                dropdown.classList.toggle('show');
            }
        });
    });
}

// Update navigation based on scroll and screen size
function updateNavigation() {
    const header = document.querySelector('.sticky-header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        const dropdowns = document.querySelectorAll('.dropdown-menu');
        
        dropdowns.forEach(dropdown => {
            if (!dropdown.parentNode.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        const mainNav = document.querySelector('.main-nav');
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        
        if (window.innerWidth > 1024) {
            if (mainNav) mainNav.classList.remove('show');
            if (menuToggle) menuToggle.classList.remove('active');
        }
    });
}

// Setup tab navigation
function setupTabs() {
    document.querySelectorAll('.tabs-nav li').forEach(tab => {
        tab.addEventListener('click', function() {
            // Handle tab navigation
            const tabId = this.getAttribute('data-tab');
            if (!tabId) return;
            
            // Remove active class from all tabs
            const tabsContainer = this.closest('.tabs-nav');
            tabsContainer.querySelectorAll('li').forEach(t => {
                t.classList.remove('active');
            });
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all tab content
            const tabsContent = tabsContainer.nextElementSibling;
            tabsContent.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Show selected tab content
            const selectedTab = document.getElementById(tabId);
            if (selectedTab) {
                selectedTab.classList.add('active');
            }
        });
    });
    
    // Alternative tab navigation with anchors
    document.querySelectorAll('.tabs-nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const tabId = this.getAttribute('href').replace('#', '');
            if (!tabId) return;
            
            // Remove active class from all tab links
            const tabsContainer = this.closest('.tabs-nav');
            tabsContainer.querySelectorAll('li').forEach(t => {
                t.classList.remove('active');
            });
            
            // Add active class to parent li
            this.parentNode.classList.add('active');
            
            // Hide all tab content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Show selected tab content
            const selectedTab = document.getElementById(tabId);
            if (selectedTab) {
                selectedTab.classList.add('active');
            }
        });
    });
}

// Setup scroll effects
function setupScrollEffects() {
    // Reveal elements on scroll
    const revealElements = document.querySelectorAll('.reveal-text, .reveal-item');
    
    if (revealElements.length > 0) {
        const revealOnScroll = () => {
            revealElements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                if (elementTop < windowHeight - 100) {
                    element.classList.add('revealed');
                }
            });
        };
        
        // Initial check
        revealOnScroll();
        
        // Check on scroll
        window.addEventListener('scroll', revealOnScroll);
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip for tabs or special links
            if (href === '#' || this.closest('.tabs-nav')) return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Setup accordion functionality
function setupAccordions() {
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', function() {
            const accordionItem = this.parentNode;
            const accordionContent = this.nextElementSibling;
            
            // Toggle current accordion
            accordionItem.classList.toggle('active');
            
            // Close other accordions if in a single-open accordion group
            if (accordionItem.closest('.accordion-single')) {
                const siblings = accordionItem.parentNode.querySelectorAll('.accordion-item');
                siblings.forEach(sibling => {
                    if (sibling !== accordionItem && sibling.classList.contains('active')) {
                        sibling.classList.remove('active');
                    }
                });
            }
        });
    });
}

// Initialize newsletter form
function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput?.value;
            
            if (!email || !isValidEmail(email)) {
                showToast('Please enter a valid email address', 'error');
                return;
            }
            
            try {
                const response = await fetch('http://localhost:5000/api/newsletter', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    showToast('Thank you for subscribing to our newsletter!', 'success');
                    emailInput.value = '';
                } else {
                    throw new Error(data.message || 'Failed to subscribe. Please try again.');
                }
            } catch (error) {
                console.error('Newsletter subscription error:', error);
                showToast(error.message || 'Failed to subscribe. Please try again.', 'error');
            }
        });
    }
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
