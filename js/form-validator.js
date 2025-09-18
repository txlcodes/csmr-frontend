/**
 * Form Validation Utility for CSMR Frontend
 * Provides comprehensive form validation with user feedback
 */

class FormValidator {
    constructor() {
        this.rules = {
            required: (value) => value && value.trim().length > 0,
            email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            minLength: (min) => (value) => value && value.length >= min,
            maxLength: (max) => (value) => value && value.length <= max,
            password: (value) => value && value.length >= 6,
            phone: (value) => /^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/\s/g, '')),
            url: (value) => /^https?:\/\/.+/.test(value),
            number: (value) => !isNaN(value) && !isNaN(parseFloat(value)),
            positiveNumber: (value) => !isNaN(value) && parseFloat(value) > 0,
            date: (value) => !isNaN(Date.parse(value)),
            futureDate: (value) => new Date(value) > new Date(),
            pastDate: (value) => new Date(value) < new Date(),
            fileSize: (maxSize) => (file) => file && file.size <= maxSize,
            fileType: (allowedTypes) => (file) => file && allowedTypes.includes(file.type),
            custom: (validator) => validator
        };

        this.messages = {
            required: 'This field is required',
            email: 'Please enter a valid email address',
            minLength: (min) => `Must be at least ${min} characters long`,
            maxLength: (max) => `Must be no more than ${max} characters long`,
            password: 'Password must be at least 6 characters long',
            phone: 'Please enter a valid phone number',
            url: 'Please enter a valid URL',
            number: 'Please enter a valid number',
            positiveNumber: 'Please enter a positive number',
            date: 'Please enter a valid date',
            futureDate: 'Please enter a future date',
            pastDate: 'Please enter a past date',
            fileSize: (maxSize) => `File size must be less than ${this.formatFileSize(maxSize)}`,
            fileType: (allowedTypes) => `File type must be one of: ${allowedTypes.join(', ')}`,
            custom: 'Invalid input'
        };
    }

    // Format file size for display
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Validate a single field
    validateField(field, rules = {}) {
        const errors = [];
        const value = field.value || field.files?.[0];

        for (const [ruleName, ruleValue] of Object.entries(rules)) {
            if (ruleName === 'custom') continue;

            const rule = this.rules[ruleName];
            if (!rule) continue;

            const validator = typeof rule === 'function' ? rule : rule(ruleValue);
            const isValid = validator(value);

            if (!isValid) {
                let message = this.messages[ruleName];
                if (typeof message === 'function') {
                    message = message(ruleValue);
                }
                errors.push(message);
            }
        }

        // Handle custom validation
        if (rules.custom) {
            const customResult = rules.custom(value);
            if (customResult !== true) {
                errors.push(typeof customResult === 'string' ? customResult : this.messages.custom);
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Validate an entire form
    validateForm(form, validationRules = {}) {
        const errors = {};
        let isValid = true;

        for (const [fieldName, rules] of Object.entries(validationRules)) {
            const field = form.querySelector(`[name="${fieldName}"]`);
            if (!field) continue;

            const fieldValidation = this.validateField(field, rules);
            if (!fieldValidation.isValid) {
                errors[fieldName] = fieldValidation.errors;
                isValid = false;
            }
        }

        return {
            isValid,
            errors
        };
    }

    // Show validation errors in the UI
    showFieldErrors(field, errors) {
        this.clearFieldErrors(field);

        if (errors.length === 0) return;

        // Add error class to field
        field.classList.add('error');

        // Create error container
        const errorContainer = document.createElement('div');
        errorContainer.className = 'field-errors';
        errorContainer.style.cssText = `
            color: #d32f2f;
            font-size: 12px;
            margin-top: 4px;
            line-height: 1.4;
        `;

        // Add error messages
        errors.forEach(error => {
            const errorElement = document.createElement('div');
            errorElement.textContent = error;
            errorContainer.appendChild(errorElement);
        });

        // Insert after field
        field.parentNode.insertBefore(errorContainer, field.nextSibling);
    }

    // Clear validation errors from a field
    clearFieldErrors(field) {
        field.classList.remove('error');
        const errorContainer = field.parentNode.querySelector('.field-errors');
        if (errorContainer) {
            errorContainer.remove();
        }
    }

    // Show form errors
    showFormErrors(form, errors) {
        for (const [fieldName, fieldErrors] of Object.entries(errors)) {
            const field = form.querySelector(`[name="${fieldName}"]`);
            if (field) {
                this.showFieldErrors(field, fieldErrors);
            }
        }
    }

    // Clear all form errors
    clearFormErrors(form) {
        const fields = form.querySelectorAll('input, textarea, select');
        fields.forEach(field => {
            this.clearFieldErrors(field);
        });
    }

    // Set up real-time validation for a form
    setupRealTimeValidation(form, validationRules = {}) {
        for (const [fieldName, rules] of Object.entries(validationRules)) {
            const field = form.querySelector(`[name="${fieldName}"]`);
            if (!field) continue;

            // Validate on blur
            field.addEventListener('blur', () => {
                const validation = this.validateField(field, rules);
                this.showFieldErrors(field, validation.errors);
            });

            // Clear errors on focus
            field.addEventListener('focus', () => {
                this.clearFieldErrors(field);
            });

            // Validate on input for certain fields
            if (field.type === 'email' || field.type === 'password') {
                field.addEventListener('input', () => {
                    const validation = this.validateField(field, rules);
                    this.showFieldErrors(field, validation.errors);
                });
            }
        }
    }

    // Validate file upload
    validateFileUpload(file, options = {}) {
        const errors = [];
        const {
            maxSize = 10 * 1024 * 1024, // 10MB
            allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
            required = true
        } = options;

        if (required && !file) {
            errors.push('File is required');
            return { isValid: false, errors };
        }

        if (!file) {
            return { isValid: true, errors: [] };
        }

        // Check file size
        if (file.size > maxSize) {
            errors.push(this.messages.fileSize(maxSize));
        }

        // Check file type
        if (!allowedTypes.includes(file.type)) {
            errors.push(this.messages.fileType(allowedTypes));
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Validate email format
    validateEmail(email) {
        return this.rules.email(email);
    }

    // Validate password strength
    validatePasswordStrength(password) {
        const errors = [];
        const checks = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        if (!checks.length) errors.push('Password must be at least 8 characters long');
        if (!checks.lowercase) errors.push('Password must contain at least one lowercase letter');
        if (!checks.uppercase) errors.push('Password must contain at least one uppercase letter');
        if (!checks.number) errors.push('Password must contain at least one number');
        if (!checks.special) errors.push('Password must contain at least one special character');

        return {
            isValid: errors.length === 0,
            errors,
            strength: Object.values(checks).filter(Boolean).length
        };
    }

    // Validate form submission
    validateFormSubmission(form, validationRules = {}) {
        this.clearFormErrors(form);
        const validation = this.validateForm(form, validationRules);
        
        if (!validation.isValid) {
            this.showFormErrors(form, validation.errors);
            return false;
        }

        return true;
    }

    // Get validation rules for common field types
    getCommonRules() {
        return {
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
                password: true
            },
            name: {
                required: true,
                minLength: 2,
                maxLength: 50
            },
            phone: {
                required: true,
                phone: true
            },
            url: {
                required: true,
                url: true
            },
            date: {
                required: true,
                date: true
            },
            number: {
                required: true,
                number: true
            },
            positiveNumber: {
                required: true,
                positiveNumber: true
            }
        };
    }
}

// Create and export global form validator instance
const formValidator = new FormValidator();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = formValidator;
}
